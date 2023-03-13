<script lang="ts" setup>
import router from '@/router'
import useMainStore from '@/store/useMainStore'

const mainStore = useMainStore()

const logout = () => {
  mainStore.romoveToken()
  router.replace('/login')
}
</script>

<template>
  <div class="flex justify-between p-4 items-center w-full bg-color h-full">
    <h1 class="text-white font-bold text-xl">后台管理</h1>
    <div class="flex items-center">
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link text-white outline-none">
          sysadmin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-image class="w-12 h-12 rounded-full ml-4" src="/src/assets/image/avatar.png" />
    </div>
  </div>
</template>