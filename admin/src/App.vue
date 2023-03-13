<script setup lang="ts">
import { useRouter } from 'vue-router'
import useMainStore from './store/useMainStore'

const router = useRouter()
const mainStore = useMainStore()

const token = localStorage.getItem('token')
if (token) {
  mainStore.token = token
  router.push('/home')
}
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
