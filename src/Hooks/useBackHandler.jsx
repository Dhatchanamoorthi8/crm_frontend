import { useState, useEffect } from 'react'
import { BackHandler } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../Slices/userSlice'

export const useBackHandler = () => {
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const [showAlertDialog, setShowAlertDialog] = useState(false)

  const handleLogout = async () => {
    dispatch(logout())
    setTimeout(() => {
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }]
      // })
    }, 0) // Ensure navigation reset happens after logout state change
  }

  useEffect(() => {
    const backAction = () => {
      // Get the current route
      const currentRoute =
        navigation.getState().routes[navigation.getState().index].name

      if (isAuthenticated && currentRoute === 'Dashboard') {
        // If user is on the Dashboard, show logout confirmation
        setShowAlertDialog(true)
        return true // Prevent default back behavior
      }
      return false // Allow default back behavior on other screens
    }

    // Add the back button event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    // Clean up the event listener when the component unmounts
    return () => backHandler.remove()
  }, [isAuthenticated, navigation])

  return {
    showAlertDialog, // Pass state to control the AlertDialog visibility
    setShowAlertDialog, // Pass setter to close dialog
    handleLogout // Pass the logout function to use in both manual logout and back press
  }
}
