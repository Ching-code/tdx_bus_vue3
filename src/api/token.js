import request from '@/utils/request'

const AUTH_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token'
const AppID = 'chinghaowde-865b070e-c1e3-4c73'
const AppKey = '5dd36e54-4a76-4a10-a196-17a19d6f0642'

export const getAccessToken = () => {
  return request.post(
    AUTH_URL,
    {
      grant_type: 'client_credentials',
      client_id: AppID,
      client_secret: AppKey
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
}
