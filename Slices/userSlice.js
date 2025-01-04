import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export const loadUserData = createAsyncThunk('user/loadUserData', async () => {
  const userData = await AsyncStorage.getItem('User')
  return userData ? JSON.parse(userData) : null
})

const initialState = {
  isAuthenticated: false,
  userData: {},
  tokenExpiry: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login reducer
    login: (state, action) => {
      const { token, ...userData } = action.payload
      const decodedToken = jwtDecode(token)
      const expiryTime = decodedToken.exp * 1000 // Convert to milliseconds

      state.isAuthenticated = true
      state.userData = userData
      state.tokenExpiry = expiryTime

      AsyncStorage.setItem('User', JSON.stringify({ token, ...userData }))
      // Check token expiration time
      startTokenExpiryTimer(expiryTime)
    },
    // Logout reducer
    logout: state => {
      state.isAuthenticated = false
      state.userData = {}
      state.tokenExpiry = null
      AsyncStorage.removeItem('User')
    },

    // Update user data reducer
    updateUserData: (state, action) => {
      const updatedData = { ...action.payload }
      state.userData = updatedData
      AsyncStorage.setItem('User', JSON.stringify(state.userData))
    }
  },
  extraReducers: builder => {
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true
        state.userData = action.payload
        // If user data is loaded, check token expiration
        const decodedToken = jwtDecode(action.payload.token) // Correct usage
        const expiryTime = decodedToken.exp * 1000
        state.tokenExpiry = expiryTime
        startTokenExpiryTimer(expiryTime)
      }
    })
  }
})

// Function to handle token expiration and show the alert
const startTokenExpiryTimer = expiryTime => {
  const timeBeforeExpiry = expiryTime - Date.now()
  const alertTime = 10 * 60 * 1000 // 10 minutes before expiry

  if (timeBeforeExpiry <= alertTime) {
    setTimeout(() => {
      alert('Your session is about to expire. Please log in again.')
    }, timeBeforeExpiry - alertTime)
  } else {
    setTimeout(() => {
      alert('Your session is about to expire. Please log in again.')
    }, timeBeforeExpiry - alertTime)
  }
}

// Export actions
export const { login, logout, updateUserData } = userSlice.actions

// Export reducer
export default userSlice.reducer
