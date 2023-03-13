<script lang="ts" setup>
import { ref, reactive } from "vue"
import { addCatApi, getAllCatApi, delCatApi, getCatApi, editCatApi } from "@/api/category/index"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"

const router = useRouter()
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
 * 创建课程
 */
const creatCourse = () => {
  router.push('/createCourse')
}
</script>

<template>
	<div>
		<div class="mb-4 flex">
			<el-input class="w-1/3 mr-4" v-model="catName" placeholder="请输入课程名称" />
			<el-button type="primary" @click="getData">搜索</el-button>
		</div>
		<el-button type="primary" class="mb-4" @click="creatCourse">创建课程</el-button>

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
</template>
