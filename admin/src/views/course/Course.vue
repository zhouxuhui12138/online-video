<script lang="ts" setup>
import { ref } from "vue"
import { getAllCourseApi, delCourseApi, editCourseApi } from "@/api/course/index"
import { ElMessageBox, ElMessage } from "element-plus"
import { useRouter } from "vue-router"

const router = useRouter()

/**
 * 页面渲染相关逻辑
 */
const catName = ref()
const courseList = ref()
const total = ref(0)
const coursePage = ref(1)
const courseSize = ref(8)

const getPage = async (page: number, size: number) => {
	const { data } = await getAllCourseApi({ page, size, data: { name: catName.value } })
	total.value = data.total
	courseList.value = data.records
	coursePage.value = data.current
	courseSize.value = data.size
}

const getData = () => {
	getPage(coursePage.value, courseSize.value)
}

const pageChange = (page: number) => {
	coursePage.value = page
	getData()
}

const sizeChange = (size: number) => {
	courseSize.value = size
	getData()
}

getData()

// 创建课程
const creatCourse = () => {
	router.push("/createCourse")
}

// 删除课程
const delCourse = async (id: string) => {
	try {
		await ElMessageBox.confirm("是否要删除吗?", "提醒", { type: "error" })
		await delCourseApi(id)
		ElMessage.success("删除成功")
		getData()
	} catch (error) {}
}

// 编辑课程
const editCourse = (id: string) => {
	router.push({ path: "/createCourse", query: { id } })
}

// 关联章节
const addSection = (id: string) => {
	router.push({ path: "/addSection", query: { id } })
}

// 启用课程
const useCourse = async (row: any) => {
	const data = JSON.parse(JSON.stringify(row))
	data.status = data.status === 1 ? 0 : 1
	await editCourseApi(data)
	await getData()
	ElMessage.success("操作成功")
}
</script>

<template>
	<div>
		<div class="mb-4 flex">
			<el-input class="w-1/3 mr-4" v-model="catName" placeholder="请输入课程名称" />
			<el-button type="primary" @click="getData">搜索</el-button>
		</div>
		<el-button type="primary" class="mb-4" @click="creatCourse">创建课程</el-button>

		<!-- table -->
		<el-table :data="courseList" border>
			<el-table-column type="index" width="50" align="center" />
			<el-table-column prop="name" label="姓名" />
			<el-table-column prop="categoryName" label="分类" />
			<el-table-column prop="description" label="描述" />
			<el-table-column prop="episodeSize" label="章节" />
			<el-table-column label="操作" align="center" width="300">
				<template #default="{ row }">
					<el-button size="small" type="primary" @click="addSection(row.id)">关联章节</el-button>
					<el-button size="small" type="primary" @click="editCourse(row.id)">编辑</el-button>
					<el-button size="small" type="primary" @click="useCourse(row)">
						{{ row.status == 0 ? "禁用" : "启用" }}
					</el-button>
					<el-button size="small" type="danger" @click="delCourse(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination
			layout="prev, pager, next, sizes"
			:page-sizes="[4, 8, 12, 16]"
			:default-page-size="courseSize"
			:total="total"
			@size-change="sizeChange"
			@current-change="pageChange"
		/>
	</div>
</template>
