<script lang="ts" setup>
import { ref, watch } from "vue"
import { getAllCatApi } from "@/api/category/index"
import { ElMessage } from "element-plus"

/**
 * 父子通信相关逻辑
 */
const props = defineProps<{
	isShow: boolean
}>()
const dialogIsShow = ref(props.isShow)
const emits = defineEmits(["close", "save"])

watch(
	() => props.isShow,
	value => {
		dialogIsShow.value = value
	}
)

/**
 * 分页相关逻辑
 */
const catName = ref()
const catList = ref()
const total = ref(0)
const catPage = ref(1)
const catSize = ref(6)

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

getData()

/**
 * 表格相关逻辑
 */
let category = { id: "", name: "" }
const handleCurrentChange = (val: any) => {
	category.id = val.id
	category.name = val.name
}

const submit = () => {
	if (!category.id) {
		return ElMessage.error("未选择分类！")
	} else {
		emits('save', category)
	}
}
</script>

<template>
	<el-dialog v-model="dialogIsShow" v-if="dialogIsShow" @close="emits('close')" title="挑选分类" width="50%">
		<div class="mb-4 flex">
			<el-input class="w-1/3 mr-4" v-model="catName" placeholder="请输入分类名称" />
			<el-button type="primary" @click="getData">搜索</el-button>
		</div>
		<!-- 表格 -->
		<el-table :data="catList" highlight-current-row @current-change="handleCurrentChange">
			<el-table-column type="index" width="50" align="center" />
			<el-table-column prop="name" label="分类名称" />
			<el-table-column prop="courseSize" label="分类下课程" />
			<el-table-column prop="createDate" label="创建时间" />
		</el-table>
		<!-- 分页 -->
		<el-pagination
			layout="prev, pager, next"
			:default-page-size="catSize"
			:total="total"
			@current-change="pageChange"
		/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="emits('close')">关闭</el-button>
				<el-button type="primary" @click="submit">保存</el-button>
			</span>
		</template>
	</el-dialog>
</template>
