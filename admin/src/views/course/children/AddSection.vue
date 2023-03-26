<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import { DOWNLOAD_URL, UPLOAD_URL } from "@/config/constant"
import { UploadProps, ElMessage, ElMessageBox, UploadProgressEvent } from "element-plus"
import { getCourseApi, addSectionApi, delSectionApi, editSectionApi, getSectionDetailApi } from "@/api/course"
import { ref, watch } from "vue"
import useMainStore from "@/store/useMainStore"

const mainStroe = useMainStore()
const router = useRouter()
const route = useRoute()
const headrs = {
	Authorization: mainStroe.token
}

const courseId = route.query.id as string // 课程id
const menus = ref<any>([]) // 章节数组
const currentMenu = ref("") // 当前选中的章节
const isProgress = ref(false) // 是否显示上传进度
const progress = ref(0) // 上传进度
const isPreview = ref(false) // 是否预览视频
const videoUrl = ref("") // 视频链接
const menuDetail = ref() // 章节详情数据
const fileList = ref()

// 获取章节数据
const getData = async () => {
	const res = await getCourseApi(courseId)
	menus.value = res.data.episodes
	if (!currentMenu.value) {
		currentMenu.value = menus.value[0]?.id || ""
	}
	menus.value.forEach((item: any) => {
		item.newName = ""
	})
}
getData()

// 添加章节
const addSection = async () => {
	await addSectionApi({ courseId, name: `第${menus.value.length + 1}章` })
	getData()
}

// 删除章节
const delSection = async (id: string) => {
	await ElMessageBox.confirm("确定要删除吗? 此章节下关联的视频也会被移除。", "提醒", { type: "error" })
	await delSectionApi(id)
	ElMessage.success("删除成功")
	if (id === currentMenu.value) {
		currentMenu.value = ""
	}
	getData()
}

// 编辑章节名称
const editMenuName = async (id: string, name: string) => {
	if (!name.trim()) return ElMessage.error("章节名字不能为空")
	await editSectionApi({ id: currentMenu.value, name, courseId })
	getData()
	ElMessage.success("更新成功")
	name = ""
}

// 切换章节
watch(
	() => currentMenu.value,
	async () => {
		const { data } = await getSectionDetailApi(currentMenu.value)
		menuDetail.value = data
		data.video ? (isPreview.value = true) : (isPreview.value = false)
		videoUrl.value = DOWNLOAD_URL + data.video
	}
)

// 上传前的回调
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
	const types = ["video/mp4", "video/webm", "video/ogg"]
	if (!types.includes(rawFile.type)) {
		ElMessage.error("文件格式不正确！")
		return false
	}

	return true
}

// 上传时的回调
const uploadProgress = (event: UploadProgressEvent) => {
	const fileProgress = Math.floor(event.percent)
	isProgress.value = true
	progress.value = fileProgress
}

// 上传成功的回调
const uploadSuccess: UploadProps["onSuccess"] = async response => {
	await editSectionApi({ id: currentMenu.value, video: response.data, courseId })
	currentMenu.value = currentMenu.value
	ElMessage.success("上传成功")
}
</script>

<template>
	<div class="overflow-hidden h-full w-full">
		<div class="mb-4">
			<el-button @click="router.back()">关闭</el-button>
		</div>
		<div class="flex w-full h-full">
			<div class="w-60">
				<div class="bg-gray-100 py-2 px-4 rounded flex justify-between items-center">
					<span class="text-sm font-bold">章节设置</span>
					<el-icon class="cursor-pointer color" @click="addSection"><Plus /></el-icon>
				</div>
				<ul class="mt-2">
					<li
						v-for="item in menus"
						:key="item.id"
						:class="{ active: item.id === currentMenu }"
						class="h-10 px-4 mb-2 text-sm flex justify-between items-center"
					>
						<span class="flex-1 cursor-pointer" @click="currentMenu = item.id">{{ item.name }}</span>
						<div class="mt-1">
							<el-popover placement="right" @hide="editMenuName(item.id, item.newName)" :width="200" trigger="click">
								<template #reference>
									<el-icon class="mr-1 cursor-pointer text-gray-600"><Edit /></el-icon>
								</template>
								<el-input placeholder="请输入新的章节名" v-model="item.newName" />
							</el-popover>
							<el-icon class="text-gray-600 cursor-pointer" @click="delSection(item.id)"><Delete /></el-icon>
						</div>
					</li>
				</ul>
			</div>
			<div class="flex-1 ml-4 pl-4 border-l border-cyan-600">
				<div v-if="menus.length !== 0">
					<!-- 上传 -->
					<div v-show="!isPreview">
						<el-upload
							drag
							:action="UPLOAD_URL"
							:headers="headrs"
							accept=".mp4, .ogg, .webm"
							:before-upload="beforeAvatarUpload"
							:on-success="uploadSuccess"
							:on-progress="uploadProgress"
							:limit="1"
							:show-file-list="false"
						>
							<el-icon class="el-icon--upload"><upload-filled /></el-icon>
							<div class="el-upload__text">请上传视频 (mp4/ogg/webm)</div>
						</el-upload>
						<el-progress class="mt-4" :text-inside="true" :stroke-width="26" :percentage="progress" v-if="isProgress" />
						<div v-if="menuDetail?.video" class="text-blue-700 mt-3 cursor-pointer" @click="isPreview = true">
							{{ menuDetail.video }}
						</div>
					</div>
					<!-- 展示 -->
					<div class="w-full h-full" v-show="isPreview">
						<el-button @click="isPreview = false">重新上传</el-button>
						<video class="mt-4" style="height: 500px" controls :src="videoUrl"></video>
					</div>
				</div>
				<div v-else>
					<el-empty description="请创建章节" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.active {
	background-color: #e4eff7;
}
</style>
