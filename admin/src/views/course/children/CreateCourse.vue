<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessage, FormInstance, FormRules, UploadProps } from "element-plus"
import { useRouter } from "vue-router"
import useMainStore from "@/store/useMainStore"
import { UPLOAD_URL } from "@/config/constant"
import { createCourseApi } from "@/api/course"
import SelectCategory from "@/components/select-category/SelectCategory.vue"

const router = useRouter()
const mainStroe = useMainStore()

/**
 * 表单
 */
const baseInfoRef = ref<FormInstance | undefined>()
const avatarUrl = ref("")
const categoryName = ref("")

const headrs = {
	Authorization: mainStroe.token
}
const baseInfoData = reactive({
	avatar: "",
	categoryId: "",
	description: "",
	name: ""
})
const baseInfoRules = reactive<FormRules>({
	name: [{ required: true, message: "请填写用户名", trigger: "blur" }],
	description: [{ required: true, message: "请填写描述", trigger: "blur" }],
	categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
	avatar: [{ required: true, message: "请上传封面", trigger: "blur" }]
})

// 封面上传成功回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
	avatarUrl.value = URL.createObjectURL(uploadFile.raw!)
	if (response.code === 200) {
		baseInfoData.avatar = response.msg
		ElMessage.success("上传成功")
	}
}

// 创建课程
const submit = async () => {
	if (!baseInfoRef.value) return
	await baseInfoRef.value.validate(async (valid, fields) => {
		if (valid) {
			const res = await createCourseApi(baseInfoData)
			ElMessage.success(res.msg)
			setTimeout(() => {
				router.back()
			}, 500)
		}
	})
}

/**
 * 挑选分类
 */
const selectCatIsShow = ref(false)

const selectCatClose = () => {
	selectCatIsShow.value = false
}

const selectSubmit = (category: any) => {
	baseInfoData.categoryId = category.id
	categoryName.value = category.name
	selectCatIsShow.value = false
}
</script>

<template>
	<div>
		<div>
			<el-button @click="router.back()">关闭</el-button>
			<el-button @click="submit">提交</el-button>
		</div>

		<el-form :model="baseInfoData" class="mt-6 ml-4" ref="baseInfoRef" :rules="baseInfoRules">
			<el-form-item label="课程名称：" prop="name">
				<el-input v-model="baseInfoData.name" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="课程分类：" prop="categoryId">
				<el-input v-model="categoryName" placeholder="请选择分类" readonly @click="selectCatIsShow = true" />
			</el-form-item>
			<el-form-item label="课程封面：" prop="avatar">
				<el-upload
					class="avatar-uploader"
					:action="UPLOAD_URL"
					:headers="headrs"
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
				>
					<img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="课程简介：" prop="description">
				<el-input v-model="baseInfoData.description" type="textarea" placeholder="请输入" />
			</el-form-item>
		</el-form>
	</div>

	<!-- 选择分类 -->
	<SelectCategory :is-show="selectCatIsShow" @close="selectCatClose" @save="selectSubmit" />
</template>

<style scoped>
:deep(.el-textarea__inner) {
	height: 140px;
}

.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
