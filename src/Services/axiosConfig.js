import axios from 'axios'
import { logout } from '../../Slices/userSlice'
import config from '../config'
import { store } from '../../Store/store'
import getDeviceInfo from './deviceInfo' 

const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000
})

const getAuthData = async () => {
  const state = store.getState()
  const isAuthenticated = state.user.isAuthenticated
  const token = isAuthenticated ? state.user.userData.token : null
  const user_id = isAuthenticated ? state.user.userData.user.userid : null

  // Retrieve device info
  const { deviceId, deviceInfo } = await getDeviceInfo()

  return { token, user_id, deviceId, deviceInfo }
}

// Add request interceptor
api.interceptors.request.use(
  async config => {
    const { token, user_id, deviceId, deviceInfo } = await getAuthData()

    // Attach headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    if (deviceId) {
      config.headers['device-id'] = deviceId
    }
    if (deviceInfo) {
      config.headers['device-info'] = JSON.stringify(deviceInfo)
    }

    // Attach user_id to request body
    if (
      user_id &&
      (config.method === 'post' ||
        config.method === 'put' ||
        config.method === 'patch')
    ) {
      if (!config.data) {
        config.data = {}
      }
      config.data.user_id = user_id
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const dispatch = store.dispatch
      dispatch(logout())
    }
    return Promise.reject(error)
  }
)

export default api
