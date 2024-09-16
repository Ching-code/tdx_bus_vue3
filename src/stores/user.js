import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref('')

  const setToken = (newToken) => {
    accessToken.value = newToken
  }

  return { accessToken, setToken }
})
