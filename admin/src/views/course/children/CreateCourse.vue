<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessage, FormInstance, FormRules, UploadProps } from "element-plus"
import { useRouter } from "vue-router"
import useMainStore from "@/store/useMainStore";
import { UPLOAD_URL } from "@/config/constant";

const router = useRouter()
const mainStroe = useMainStore()

const headrs = {
	Authorization: mainStroe.token
}

/**
 * 步骤条
 */
const active = ref(0)

const next = () => {
	active.value = 1
}

/**
 * 基本信息
 */
const baseInfoRef = ref<FormInstance | undefined>()
const baseInfoData = reactive({
	avatar: "",
	categoryId: "",
	description: "",
	name: ""
})
const baseInfoRules = reactive<FormRules>({
	name: [{ required: true, message: "请填写用户名", trigger: "blur" }],
	description: [{ required: true, message: "请填写描述", trigger: "blur" }],
	categoryId: [{ required: true, message: "请选择分类", trigger: "blur" }],
	avatar: [{ required: true, message: "请上传封面", trigger: "blur" }]
})

// 封面上传成功回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
	baseInfoData.avatar = URL.createObjectURL(uploadFile.raw!)

	console.log(response, uploadFile)
}
</script>

<template>
	<el-steps :active="active" finish-status="process" simple>
		<el-step title="基本信息" />
		<el-step title="课程目录" />
	</el-steps>

	<div class="mt-3">
		<el-button @click="router.back()">关闭</el-button>
		<el-button>提交</el-button>
		<el-button @click="active = 0" v-if="active === 1">上一步</el-button>
		<el-button @click="next" v-else>下一步</el-button>
	</div>

	<!-- 基本信息 -->
	<div v-show="active === 0">
		<el-form :model="baseInfoData" class="mt-8 ml-5" ref="baseInfoRef" :rules="baseInfoRules">
			<el-form-item label="课程名称：" prop="name">
				<el-input v-model="baseInfoData.name" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="课程分类：" prop="categoryId">
				<el-input v-model="baseInfoData.categoryId" placeholder="请选择分类" />
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
					<img v-if="baseInfoData.avatar" :src="baseInfoData.avatar" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="课程简介：" prop="description">
				<el-input v-model="baseInfoData.description" type="textarea" placeholder="请输入" />
			</el-form-item>
		</el-form>
	</div>

	<!-- 目录 -->
	<div v-show="active === 1">目录</div>
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
