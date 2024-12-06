import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector } from 'react-redux'
import DrawerContent from './DrawerContent'
import CustomHeader from '../Components/CustomHeader'
import { Animated } from 'react-native'
import EmployeeTab from '../Admin/Employee.Tab.'
import { ErrorBoundaryWrapper } from '../Pages/ErrorBoundary'
import ErrorBoundary from 'react-native-error-boundary'
import { View } from '@gluestack-ui/themed'
import { Button } from 'react-native'
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

  const screenOptions = ({ route }) => {
    const scrollY = useRef(new Animated.Value(0)).current

    return {
      header: () => <CustomHeader title={route.name} scrollY={scrollY} />,
      drawerStyle: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#F4F9FD',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        backgroundColor: '#FFFF',
        width: '63%'
      },
      drawerPosition: 'left' // Position the drawer on the left side
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

  return (
    <ErrorBoundary
      FallbackComponent={fallbackErrorScreen}
      onError={error => console.log('Error captured:', error)}
    >
      <Drawer.Navigator
        screenOptions={screenOptions}
        drawerContent={() => <DrawerContent userrole={userRole} />}
      >
        {isAuthenticated && userRole === 'admin' ? (
          <>
            <Drawer.Screen name='DashBoard'>
              {() => (
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
                    <TabNavigator />
                  </Suspense>
                </ErrorBoundaryWrapper>
              )}
            </Drawer.Screen>
            <Drawer.Screen name='Attendance'>
              {() => (
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
                    <Attendance />
                  </Suspense>
                </ErrorBoundaryWrapper>
              )}
            </Drawer.Screen>
            <Drawer.Screen name='EmployeeTab'>
              {() => (
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
                    <EmployeeTab />
                  </Suspense>
                </ErrorBoundaryWrapper>
              )}
            </Drawer.Screen>
            <Drawer.Screen name='CompanyMaster'>
              {() => (
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
                    <Attendance />
                  </Suspense>
                </ErrorBoundaryWrapper>
              )}
            </Drawer.Screen>
          </>
        ) : (
          <Drawer.Screen name='Login'>
            {() => (
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
                  <LoginPage />
                </Suspense>
              </ErrorBoundaryWrapper>
            )}
          </Drawer.Screen>
        )}
      </Drawer.Navigator>
    </ErrorBoundary>
  )
}

export default DrawerNavigator
