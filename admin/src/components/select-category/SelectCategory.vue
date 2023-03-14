<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue"
const dialogVisible = ref(true)

onBeforeUnmount(() => {
	dialogVisible.value = false
})
</script>

<template>
	<el-dialog v-model="dialogVisible" title="Tips" width="30%">
		<span>This is a message</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
			</span>
		</template>
	</el-dialog>
</template>
