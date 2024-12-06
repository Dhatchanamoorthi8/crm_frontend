import axios from 'axios'
import { logout } from '../Slices/userSlice' // Import the logout action
import config from '../config'
import { store } from '../../Store/store' // Adjust the relative path as necessary

const api = axios.create({
  baseURL: config.API_URL, // Your API base URL
  timeout: 10000
})

const getAuthData = () => {
  const state = store.getState() // Get the Redux state
  const isAuthenticated = state.user.isAuthenticated // Check if user is authenticated
  const token = isAuthenticated ? state.user.userData.token : null // Get token from state
  const user_id = isAuthenticated ? state.user.userData.user.userid : null // Get userId from state
  return { token, user_id }
}

// Add request interceptor
api.interceptors.request.use(
  config => {
    const { token, user_id } = getAuthData() // Get token and userId

    console.log(user_id,'user_id');
    

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Log the current config data and user_id to debug
    console.log('Before adding user_id:', config.data)
    console.log('user_id:', user_id)

    // Attach userId to the request body if userId exists and it's a POST, PUT, or PATCH request
    if (
      user_id &&
      (config.method === 'post' ||
        config.method === 'put' ||
        config.method === 'patch')
    ) {
      if (!config.data) {
        config.data = {} // Ensure the data object exists
      }
      config.data.user_id = user_id // Attach userId to the request body
    }

    // Log the updated config data
    console.log('After adding user_id:', config.data)

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  response => {
    // Handle the response (if needed, you can log or manipulate the response here)
    return response
  },
  error => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      // If the error is 401 Unauthorized, log the user out
      const dispatch = store.dispatch // Access dispatch from the store
      dispatch(logout()) // Dispatch the logout action
    }

    // Handle other response errors
    return Promise.reject(error)
  }
)

export default api
