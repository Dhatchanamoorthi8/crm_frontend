import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadUserData = createAsyncThunk('user/loadUserData', async () => {
  const userData = await AsyncStorage.getItem('User')
  return userData ? JSON.parse(userData) : null
})

const initialState = {
  isAuthenticated: false,
  userData: {} // Make sure it's always an object
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login reducer
    login: (state, action) => {
      state.isAuthenticated = true
      state.userData = action.payload

 

      AsyncStorage.setItem('User', JSON.stringify(action.payload))
    },
    // Logout reducer
    logout: state => {
      state.isAuthenticated = false
      state.userData = {} // Reset to an empty object instead of null
      AsyncStorage.removeItem('User')
    },

    // Update user data reducer
    updateUserData: (state, action) => {
      const updatedData = { ...action.payload }


      // Save the updated state
      state.userData = updatedData

      AsyncStorage.setItem('User', JSON.stringify(state.userData))

    }
  },
  extraReducers: builder => {
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true
        state.userData = action.payload
      }
    })
  }
})

// Export actions
export const { login, logout, updateUserData } = userSlice.actions

// Export reducer
export default userSlice.reducer
