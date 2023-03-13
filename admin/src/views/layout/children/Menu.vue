<script lang="ts" setup></script>

<template>
  <el-menu default-active="/home" router class="h-full">
    <el-menu-item index="/home">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/user">
      <el-icon><UserFilled /></el-icon>
      <template #title>用户管理</template>
    </el-menu-item>
    <el-menu-item index="/resource">
      <el-icon><VideoCameraFilled /></el-icon>
      <template #title>资源库</template>
    </el-menu-item>
    <el-menu-item index="/category">
      <el-icon><List /></el-icon>
      <template #title>分类管理</template>
    </el-menu-item>
  </el-menu>
</template>