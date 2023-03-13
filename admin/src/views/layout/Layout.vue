<script setup lang="ts">
import Header from './children/Header.vue'
import Menu from './children/Menu.vue'
</script>

<template>
  <el-container class="h-screen">
    <el-header class="p-0">
      <Header />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-main class="p-4">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>