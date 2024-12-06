import React, { Suspense, useEffect, useRef } from 'react'
import { config } from '@gluestack-ui/config'
import {
  ChevronLeftIcon,
  GluestackUIProvider,
  Icon,
  StatusBar
} from '@gluestack-ui/themed'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import 'react-native-reanimated'
import DrawerNavigator from './src/Navigation/DrawerNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import { useFonts } from 'expo-font'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './Store/store'
import { loadUserData } from './Slices/userSlice'
import LoginPage from './src/Pages/LoginPage'
import * as SplashScreen from 'expo-splash-screen'
import FolloupEnquiry from './src/Forms/FolloupEnquiry'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { useNavigationContainerRef } from '@react-navigation/native'
import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import './global.css'
import {
  ActivityIndicator,
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native'
import EnquiryReports from './src/Pages/EnquiryReports'
import ErrorBoundary from 'react-native-error-boundary'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import Settings from './src/Admin/Settings'
import EmployeeTab from './src/Admin/Employee.Tab.'

SplashScreen.preventAutoHideAsync()

const Stack = createStackNavigator()

export default function App () {
  const navigationRef = useNavigationContainerRef()


  console.log("hiii");
  

  useReduxDevToolsExtension(navigationRef)

  const [loaded, error] = useFonts({
    MonaSans_400Regular: require('./assets/Fonts/MonaSans-Regular.ttf'),
    MonaSans_Bold: require('./assets/Fonts/MonaSans-Bold.ttf'),
    MonaSans_Black: require('./assets/Fonts/MonaSans-Regular.ttf'),
    MonaSans_SemiBold: require('./assets/Fonts/MonaSans-SemiBold.ttf')
  })

  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error)
    }

    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
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
      <Provider store={store}>
        <GluestackUIProvider config={config}>
          <NavigationContainer ref={navigationRef} independent={true}>
            <StatusBar backgroundColor='#F4F9FD' barStyle='dark-content' />
            <AlertNotificationRoot>
              <MainNavigator />
            </AlertNotificationRoot>
          </NavigationContainer>
        </GluestackUIProvider>
      </Provider>
    </ErrorBoundary>
  )
}

function MainNavigator () {
  const dispatch = useDispatch()

  const navigation = useNavigation()

  useEffect(() => {
    dispatch(loadUserData())
  }, [dispatch])

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)

  const config = {
    animation: 'timing',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
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
      <Stack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: '#F4F9FD'
          }
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Group>
              <Stack.Screen
                name='DrawerNavigator'
                options={{ headerShown: false }}
                initialParams={{ role: isAuthenticated }}
              >
                {() => (
                  <Suspense
                    fallback={
                      <ActivityIndicator size='large' color='#0000ff' />
                    }
                  >
                    <DrawerNavigator />
                  </Suspense>
                )}
              </Stack.Screen>

    

              <Stack.Screen
                name='Followup'
                options={{
                  headerShown: true,
                  title: 'Followup',
                  transitionSpec: {
                    open: config,
                    close: config
                  },
                  headerStyle: {
                    backgroundColor: '#F4F9FD',
                    shadowColor: '#fff'
                  },
                  headerTitleStyle: {
                    fontFamily: 'MonaSans_Bold',
                    marginLeft: 10,
                    fontSize: 16
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 15 }}
                    >
                      <Icon as={ChevronLeftIcon} h={'$8'} w={'$8'} />
                    </TouchableOpacity>
                  )
                }}
              >
                {({ route, navigation }) => (
                  <Suspense
                    fallback={
                      <ActivityIndicator size='large' color='#0000ff' />
                    }
                  >
                    <FolloupEnquiry route={route} navigation={navigation} />
                  </Suspense>
                )}
              </Stack.Screen>

              <Stack.Screen
                name='adminSettings'
                options={{
                  headerShown: true,
                  title: 'Settings',
                  transitionSpec: {
                    open: config,
                    close: config
                  },
                  headerStyle: {
                    backgroundColor: '#F4F9FD',
                    shadowColor: '#fff'
                  },
                  headerTitleStyle: {
                    fontFamily: 'MonaSans_Bold',
                    marginLeft: 10,
                    fontSize: 16
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 15 }}
                    >
                      <Icon as={ChevronLeftIcon} h={'$8'} w={'$8'} />
                    </TouchableOpacity>
                  )
                }}
              >
                {({ route, navigation }) => (
                  <Suspense
                    fallback={
                      <ActivityIndicator size='large' color='#0000ff' />
                    }
                  >
                    <Settings route={route} navigation={navigation} />
                  </Suspense>
                )}
              </Stack.Screen>

              <Stack.Screen
                name='EnquiryReports'
                options={({ route }) => ({
                  headerShown: true,
                  title: route.params?.headerTitle || 'Default Title',
                  transitionSpec: {
                    open: config,
                    close: config
                  }
                })}
              >
                {({ route, navigation }) => (
                  <Suspense
                    fallback={
                      <ActivityIndicator size='large' color='#0000ff' />
                    }
                  >
                    <EnquiryReports route={route} navigation={navigation} />
                  </Suspense>
                )}
              </Stack.Screen>
            </Stack.Group>
          </>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name='Login'
              component={LoginPage}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </ErrorBoundary>
  )
}
