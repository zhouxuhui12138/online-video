<script lang="ts" setup>
import { ref, reactive } from "vue"
import { addCatApi, getAllCatApi, delCatApi, getCatApi, editCatApi } from "@/api/category/index"
import { ElMessage, ElMessageBox } from "element-plus"

/**
 * 页面渲染相关逻辑
 */
const catName = ref()
const catList = ref()
const total = ref(0)
const catPage = ref(1)
const catSize = ref(8)

const getPage = async (page: number, size: number) => {
	const { data } = await getAllCatApi({ page, size, data: { name: catName.value } })
	total.value = data.total
	catList.value = data.records
	catPage.value = data.current
	catSize.value = data.size
}

const getData = () => {
	getPage(catPage.value, catSize.value)
}

const pageChange = (page: number) => {
	catPage.value = page
	getData()
}

const sizeChange = (size: number) => {
	catSize.value = size
	getData()
}

getData()

/**
 * 添加/编辑/删除分类相关逻辑
 */
let catId = ""
const dialogTitle = ref("")
const operatorCatIsShow = ref(false)
const operatorCatData = reactive({
	name: ""
})

const closeDialog = () => {
	operatorCatIsShow.value = false
	operatorCatData.name = ""
	catId = ""
}

const operatorCat = async () => {
	// 有id编辑 没有则新增
	let res = null
	if (catId) {
		res = await editCatApi({ id: catId, ...operatorCatData })
	} else {
		res = await addCatApi(operatorCatData)
	}

	ElMessage.success(res?.msg)
	getData()
	closeDialog()
}

const delCat = async (id: string) => {
	try {
		await ElMessageBox.confirm("是否要删除吗?", "提醒", { type: "error" })
		const res = await delCatApi(id)
		ElMessage.success(res?.msg)
		getData()
	} catch (error) {}
}

const editCat = async (id: string) => {
	dialogTitle.value = "编辑分类"
	const res = await getCatApi(id)
	catId = id
	operatorCatData.name = res.data.name
	operatorCatIsShow.value = true
}

const addCart = () => {
	dialogTitle.value = "添加分类"
	operatorCatIsShow.value = true
}
</script>

<template>
	<div>
		<div class="mb-4 flex">
			<el-input class="w-1/3 mr-4" v-model="catName" placeholder="请输入分类名称" />
			<el-button type="primary" @click="getData">搜索</el-button>
		</div>
		<el-button type="primary" class="mb-4" @click="addCart">添加分类</el-button>

		<el-row :gutter="12">
			<el-col :span="6" v-for="item in catList" :key="item.id">
				<el-card shadow="always" class="mb-4">
					<div class="flex justify-between mb-8">
						<span>{{ item.name }}</span>
						<el-dropdown>
							<span class="el-dropdown-link">
								<el-icon class="cursor-pointer"><More /></el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu class="">
									<el-dropdown-item @click="editCat(item.id)">编辑</el-dropdown-item>
									<el-dropdown-item @click="delCat(item.id)">删除</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
					<div class="flex justify-between">
						<div>
							<span class="color mr-2">{{ item.courseSize }}</span>
							<span class="text-xs text-gray-600">个课程</span>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 分页 -->
		<el-pagination
			layout="prev, pager, next, sizes"
			:page-sizes="[4, 8, 12, 16]"
			:default-page-size="catSize"
			:total="total"
			@size-change="sizeChange"
			@current-change="pageChange"
		/>
	</div>

	<!-- 添加分类 -->
	<el-dialog v-if="operatorCatIsShow" v-model="operatorCatIsShow" :title="dialogTitle" @close="closeDialog">
		<el-form :model="operatorCatData" ref="editFormRef">
			<el-form-item label="分类名称:" :rules="{ required: true, message: '请填写名称', trigger: 'blur' }">
				<el-input v-model="operatorCatData.name" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">关闭</el-button>
				<el-button type="primary" @click="operatorCat">提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>
