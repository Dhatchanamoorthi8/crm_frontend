import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { AppState } from 'react-native'
import api from '../Services/axiosConfig'

const useOnlineStatus = userId => {
  const dispatch = useDispatch()

  const isFocused = useIsFocused()

  useEffect(() => {
    const markOnline = async () => {
      try {
        await api.post('users/update-online-status', {
          userId,
          isOnline: true
        })
      } catch (error) {
        console.error('Error marking online:', error)
      }
    }

    const markOffline = async () => {
      try {
        await api.post('users/update-online-status', {
          userId,
          isOnline: false
        })
      } catch (error) {
        console.error('Error marking offline:', error)
      }
    }

    // Mark user online if screen is focused
    if (isFocused) {
      markOnline()
    }

    // Set up app state listener to mark offline when app goes to background
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'background') {
          markOffline()
        }
      }
    )

    // Set idle timeout to mark offline after 5 minutes of inactivity
    const idleTimeout = setTimeout(() => {
      markOffline()
    }, 5 * 60 * 1000)

    // Clean up on unmount
    return () => {
      clearTimeout(idleTimeout)
      appStateListener.remove()
      markOffline() // Mark as offline when leaving screen
    }
  }, [isFocused, userId])

  return null
}

export default useOnlineStatus
