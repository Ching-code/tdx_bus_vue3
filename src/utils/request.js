import axios from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = 'https://tdx.transportdata.tw/api/basic/v2/Bus/'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  headers: {
    // 'X-Custom-Header': 'foobar',
    // 'Accept-Encoding': 'gzip, br',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

instance.interceptors.request.use(
  function (config) {
    // before request

    // 如果有 token 就帶上 token
    const useStore = useUserStore()
    if (useStore.accessToken) {
      config.headers.Authorization = 'Bearer ' + useStore.accessToken
    }
    return config
  },
  function (error) {
    // error handler
    return Promise.reject(error)
  }
)

// response interceptors
instance.interceptors.response.use(
  function (response) {
    // 2xx status code
    const res = response.data

    return res
  },
  function (error) {
    // 401 權限不足或 token 過期

    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
