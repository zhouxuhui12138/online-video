<script lang="ts" setup>
import { getUserList, delUserApi, getUserApi, editUserApi } from "@/api/user"
import { ElMessageBox, ElMessage, FormInstance, FormRules } from "element-plus"
import { ref, reactive } from "vue"

// table数据
let tablePage = ref(1)
let tableSize = ref(10)
const total = ref(0)
const userList = ref([])
const formData = reactive({
	username: ""
})

async function getData(page: number, size: number) {
	const res: any = await getUserList({ page, size, data: formData })
	const data = res.data
	userList.value = data.records
	total.value = data.total
	tablePage.value = data.current
	tableSize.value = data.size
}

// 初始化表格
function getTable() {
	getData(tablePage.value, tableSize.value)
}
getTable()

// 分页
function pageChange(page: number) {
	tablePage.value = page
	getTable()
}
function sizeChange(size: number) {
	tableSize.value = size
	getTable()
}

// 删除用户
async function delUser(id: string) {
	try {
		await ElMessageBox.confirm("是否要删除吗?", "提醒", { type: "error" })
		await delUserApi(id)
		ElMessage.success('删除成功')
		getTable()
	} catch (error) {}
}

// 编辑用户弹出层
const editIsShow = ref(false)
const editUserId = ref("")

async function getUserById(id: string) {
	const res = await getUserApi(id)
	editFormData.value = res.data
	res.data.sex === 1 ? (editFormData.value.sex = "男") : (editFormData.value.sex = "女")
	res.data.status === 0 ? (editFormData.value.status = "启用") : (editFormData.value.status = "禁用")
}

function openEditUser(id: string) {
	editIsShow.value = true
	editUserId.value = id
	getUserById(editUserId.value)
}

function closeEditUser() {
	editIsShow.value = false
	editUserId.value = ""
}

const editFormRef = ref()
const editFormData = ref<any>({
	username: "",
	email: "",
	sex: "",
	status: "",
	password: ""
})
const rules = reactive<FormRules>({
	username: [{ required: true, message: "请填写用户名", trigger: "blur" }],
	email: [
		{ required: true, message: "请填写邮箱", trigger: "blur" },
		{ type: "email", message: "邮箱格式不正确", trigger: "blur" }
	]
})

async function submit(formEl: FormInstance | undefined) {
	if (!formEl) return
	try {
		await formEl.validate(async valid => {
			if (valid) {
				editFormData.value.sex === "男" ? (editFormData.value.sex = 1) : (editFormData.value.sex = 0)
				editFormData.value.status === "启用" ? (editFormData.value.status = 0) : (editFormData.value.status = 1)
				await editUserApi(editFormData.value)
				ElMessage.success("修改成功")
				getTable()
				closeEditUser()
			}
		})
	} catch (error) {}
}
</script>

<template>
	<div>
		<!-- 头部form -->
		<el-form :inline="true" :model="formData" class="demo-form-inline">
			<el-form-item label="用户名称">
				<el-input v-model="formData.username" placeholder="请输入用户名称" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getTable">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- table -->
		<el-table :data="userList" border>
			<el-table-column type="index" width="50" align="center" />
			<el-table-column prop="username" label="姓名" />
			<el-table-column prop="email" label="邮箱" />
			<el-table-column prop="createTime" label="注册时间" />
			<el-table-column label="性别">
				<template #default="{ row }">
					{{ row.sex === 1 ? "男" : "女" }}
				</template>
			</el-table-column>
			<el-table-column label="状态">
				<template #default="{ row }">
					{{ row.status === 0 ? "启用" : "禁用" }}
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template #default="{ row }">
					<el-button size="small" type="primary" @click="openEditUser(row.id)">编辑</el-button>
					<el-button size="small" type="danger" @click="delUser(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			layout="prev, pager, next, sizes"
			:page-sizes="[5, 10, 15, 20]"
			:default-page-size="tableSize"
			:total="total"
			@size-change="sizeChange"
			@current-change="pageChange"
		/>
	</div>

	<!-- 编辑用户 -->
	<el-dialog v-if="editIsShow" v-model="editIsShow" title="编辑用户" @close="closeEditUser">
		<el-form :model="editFormData" ref="editFormRef" :rules="rules">
			<el-form-item label="姓名:" prop="username">
				<el-input v-model="editFormData.username" autocomplete="off" />
			</el-form-item>
			<el-form-item label="邮箱:" prop="email">
				<el-input v-model="editFormData.email" autocomplete="off" />
			</el-form-item>
			<el-form-item label="性别:">
				<el-radio-group v-model="editFormData.sex">
					<el-radio label="男" />
					<el-radio label="女" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="状态:">
				<el-radio-group v-model="editFormData.status">
					<el-radio label="启用" />
					<el-radio label="禁用" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="重置密码:">
				<el-input v-model="editFormData.password" autocomplete="off" placeholder="不填写默认使用原密码" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeEditUser">关闭</el-button>
				<el-button type="primary" @click="submit(editFormRef)">提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>
