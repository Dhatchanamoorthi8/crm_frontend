// timerSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  elapsedTime: 0,
  isTimerRunning: false
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setElapsedTime: (state, action) => {
      state.elapsedTime = action.payload
    },
    startTimer: state => {
      state.isTimerRunning = true
    },
    stopTimer: state => {
      state.isTimerRunning = false
    },
    resetTimer: state => {
      state.elapsedTime = 0
      state.isTimerRunning = false
    }
  }
})

export const { setElapsedTime, startTimer, stopTimer, resetTimer } = timerSlice.actions
export default timerSlice.reducer
