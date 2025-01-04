import { useState, useEffect } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../Slices/userSlice'

export const useBackHandler = () => {
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)

  const [showAlertDialog, setShowAlertDialog] = useState(false)

  const routes = useNavigationState(state => state.routes)

  const handleLogout = async () => {
    dispatch(logout())
    // setTimeout(() => {
    //   // navigation.reset({
    //   //   index: 0,
    //   //   routes: [{ name: 'Login' }]
    //   // })
    // }, 0) // Ensure navigation reset happens after logout state change
  }

  useEffect(() => {
    const backAction = () => {
      console.log(routes, 'routesroutes')


      const getFocusedRouteNameFromNestedNavigator = route => {
        if (route?.state) {
          const nestedRoute = route.state.routes[route.state.index]
          return (
            getFocusedRouteNameFromNestedNavigator(nestedRoute) ||
            nestedRoute.name
          )
        }
        return route?.name
      }

      const focusedRouteName = getFocusedRouteNameFromNestedNavigator(
        routes[routes.length - 1]
      )

      console.log(focusedRouteName, 'focusedRouteName')

      // // Get the current route
      // const currentRoute =
      //   navigation.getState().routes[navigation.getState().index].name

      // if (isAuthenticated && currentRoute === 'DrawerNavigator') {
      //   setShowAlertDialog(true)
      //   return true // Prevent default back behavior
      // }
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
