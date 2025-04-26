import React, { useRef, lazy, Suspense } from 'react'
import { ActivityIndicator } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector } from 'react-redux'
import DrawerContent from './DrawerContent'
import CustomHeader from '../Components/CustomHeader'
import { Animated } from 'react-native'
import EmployeeTab from '../Admin/Employee.Tab.'
import { ErrorBoundaryWrapper } from '../Pages/ErrorBoundary'
import ErrorBoundary from 'react-native-error-boundary'
import { View, Text } from '@gluestack-ui/themed'
import { Button } from 'react-native'
import AttendanceTab from '../Pages/Attendance/Attendance.tab'
import AdminDashboard from '../Admin/Dashboard/AdminDashboard'
const Drawer = createDrawerNavigator()

const DrawerNavigator = () => {
  const LoginPage = lazy(() => import('../Pages/LoginPage'))

  const DashBoardPage = lazy(() => import('../Pages/DashBoardPage'))

  const TabNavigator = lazy(() => import('../TabNavibation/TabNav'))

  const Attendance = lazy(() => import('../Pages/Attendance'))

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
 
  const userRole = useSelector(state =>
    isAuthenticated ? state.user.userData.user.role : null
  )

  const userData = useSelector(state =>
    isAuthenticated ? state.user.userData.user : null
  )

  const screenOptions = ({ route }) => {
    const scrollY = useRef(new Animated.Value(0)).current

    return {
      header: () => (
        <CustomHeader
          title={route.name}
          scrollY={scrollY}
          userData={userData}
        />
      ),
      drawerStyle: {
        // borderTopLeftRadius: 5,
        borderTopRightRadius: 35,
        //borderBottomLeftRadius: 25,
        borderBottomRightRadius: 35,
        shadowColor: '#F4F9FD',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        backgroundColor: '#FFFF',
        width: '80%'
      },
      drawerPosition: 'left'
    }
  }

  const fallbackErrorScreen = ({ resetError }) => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
        Oops! Something went wrong.
      </Text>
      <Button title='Go to Login' onPress={resetError} />
    </View>
  )

  const renderDrawerScreens = role => {
    switch (role) {
      case 'admin':
        return (
          <>
            <Drawer.Screen name='AdminDashBoard'>
              {renderScreen(AdminDashboard)}
            </Drawer.Screen>

            <Drawer.Screen name='EmployeeTab'>
              {renderScreen(EmployeeTab)}
            </Drawer.Screen>
          </>
        )
      case 'user':
        return (
          <>
            <Drawer.Screen name='DashBoard'>
              {renderScreen(TabNavigator)}
            </Drawer.Screen>
            <Drawer.Screen name='AttendanceTab'>
              {renderScreen(AttendanceTab)}
            </Drawer.Screen>
          </>
        )
      default:
        return (
          <Drawer.Screen name='NotAuthorized'>
            {/* {renderScreen(NotAuthorizedPage)} */}
          </Drawer.Screen>
        )
    }
  }

  const renderLoginScreen = () => (
    <Drawer.Screen name='Login'>{renderScreen(LoginPage)}</Drawer.Screen>
  )

  const renderScreen = Component => () =>
    (
      <ErrorBoundaryWrapper>
        <Suspense
          fallback={
            <ActivityIndicator
              size='large'
              color='#0000ff'
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}
            />
          }
        >
          <Component />
        </Suspense>
      </ErrorBoundaryWrapper>
    )
  return (
    <ErrorBoundary
      FallbackComponent={fallbackErrorScreen}
      zonError={error => console.log('Error captured:', error)}
    >
      <Drawer.Navigator
        screenOptions={screenOptions}
        drawerContent={() => (
          <DrawerContent userrole={userRole} userData={userData} />
        )}
      >
        {isAuthenticated ? renderDrawerScreens(userRole) : renderLoginScreen()}
      </Drawer.Navigator>
    </ErrorBoundary>
  )
}

export default DrawerNavigator
