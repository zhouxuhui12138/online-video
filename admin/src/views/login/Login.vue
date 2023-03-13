<script setup lang="ts">
import useMainStore from "@/store/useMainStore"
import { reactive, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { login } from "@/api/user/index"
import { useRouter } from "vue-router"

const mainStore = useMainStore()
const router = useRouter()

const formRef = ref<FormInstance>()
const formData = reactive({
	username: "ADMIN",
	password: "ADMIN"
})

const rules = reactive<FormRules>({
	username: [{ required: true, message: "请输入名称", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async valid => {
		if (valid) {
			const res = await login(formData)
			mainStore.addToken(res.data!.token)
			ElMessage.success("登录成功")
			setTimeout(() => {
				router.push("/home")
			}, 1000)
		}
	})
}
</script>

<template>
	<div class="w-screen h-screen flex justify-center items-center bg-blue-200">
		<div class="h-1/2 w-1/2 max-w-md max-h-96 bg-white rounded-2xl overflow-hidden">
			<h1 class="color text-2xl m-6 mb-12">Login</h1>
			<el-form
				label-position="top"
				class="max-w-xs m-auto"
				label-width="120px"
				:rules="rules"
				ref="formRef"
				:model="formData"
			>
				<el-form-item label="账号" prop="username">
					<el-input v-model="formData.username" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input show-password v-model="formData.password" />
				</el-form-item>
				<el-form-item class="mt-6">
					<el-button type="primary" @click="submitForm(formRef)">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<style scoped>
:deep(.el-form-item__content) {
	justify-content: flex-end;
}
</style>
