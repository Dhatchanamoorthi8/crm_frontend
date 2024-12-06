import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadUserData = createAsyncThunk('user/loadUserData', async () => {
  const userData = await AsyncStorage.getItem('User')
  return userData ? JSON.parse(userData) : null
})

const initialState = {
  isAuthenticated: false,
  userData: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.userData = action.payload
      AsyncStorage.setItem('User', JSON.stringify(action.payload))
    },
    logout: state => {
      state.isAuthenticated = false
      state.userData = null

      AsyncStorage.removeItem('User')
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

export const { login, logout } = userSlice.actions
export default userSlice.reducer
