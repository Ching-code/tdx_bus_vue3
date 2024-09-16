<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAccessToken } from '@/api/token'

const store = useUserStore()

// 網頁開始時取得 token
onMounted(() => {
  console.log('頁面加載')
  const getToken = async () => {
    try {
      const res = await getAccessToken()
      store.setToken(res.access_token)
    } catch (err) {
      console.error(err)
    }
  }
  getToken()
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
