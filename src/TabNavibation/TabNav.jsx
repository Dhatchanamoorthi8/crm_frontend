import React, { useEffect, useState, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Animated, Keyboard, Dimensions, ScrollView } from 'react-native'
import DashBoardPage from '../Pages/DashBoardPage'
import NewEnquiry from '../Forms/NewEnquiry'
import MyTabBar from './TabBar'
import CustomHeader from '../Components/CustomHeader'
import { ErrorBoundaryWrapper } from '../Pages/ErrorBoundary'
import ErrorBoundary from 'react-native-error-boundary'
import { Text, View } from '@gluestack-ui/themed'
import { Button } from 'react-native'
import AttendanceTab from '../Pages/Attendance/Attendance.tab'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const scrollY = useRef(new Animated.Value(0)).current

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const tabBarTranslateY = useRef(new Animated.Value(0)).current

  const scrollOffset = useRef(0)

  const screenHeight = Dimensions.get('window').height

  useEffect(() => {
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(tabBarTranslateY, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true
      }).start()
      setIsKeyboardVisible(true)
    })

    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(tabBarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()
      setIsKeyboardVisible(false)
    })

    return () => {
      showKeyboard.remove()
      hideKeyboard.remove()
    }
  }, [])

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y
    const scrollingDown = currentOffset > scrollOffset.current

    scrollY.setValue(currentOffset) // Update scrollY value

    if (scrollingDown && currentOffset > 50) {
      Animated.timing(tabBarTranslateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true
      }).start()
    } else {
      Animated.timing(tabBarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()
    }

    scrollOffset.current = currentOffset
  }

  const resetTabBarVisibility = () => {
    Animated.timing(tabBarTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()
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
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Hide default header
          lazy: false // Keep screens mounted
        }}
        tabBar={props => (
          <Animated.View
            style={{
              transform: [{ translateY: tabBarTranslateY }],
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight > 600 ? 70 : 60 // Dynamic tab bar height
            }}
          >
            <MyTabBar {...props} />
          </Animated.View>
        )}
      >
        <Tab.Screen name='Dashboard'>
          {({ navigation }) => {
            useEffect(() => {
              const unsubscribe = navigation.addListener(
                'focus',
                resetTabBarVisibility
              )
              return unsubscribe
            }, [navigation])

            return (
              <ErrorBoundaryWrapper>
                <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                  <DashBoardPage />
                </ScrollView>
              </ErrorBoundaryWrapper>
            )
          }}
        </Tab.Screen>

        <Tab.Screen name='AddEnquiry'>
          {({ navigation }) => {
            useEffect(() => {
              const unsubscribe = navigation.addListener(
                'focus',
                resetTabBarVisibility
              )
              return unsubscribe
            }, [navigation])

            return (
              <>
                <ErrorBoundaryWrapper>
                  <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                    <NewEnquiry />
                  </ScrollView>
                </ErrorBoundaryWrapper>
              </>
            )
          }}
        </Tab.Screen>

        <Tab.Screen name='Attendance'>
          {({ navigation }) => {
            useEffect(() => {
              const unsubscribe = navigation.addListener(
                'focus',
                resetTabBarVisibility
              )
              return unsubscribe
            }, [navigation])

            return (
              <>
                <ErrorBoundaryWrapper>
                  <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                    <AttendanceTab />
                  </ScrollView>
                </ErrorBoundaryWrapper>
              </>
            )
          }}
        </Tab.Screen>
      </Tab.Navigator>
    </ErrorBoundary>
  )
}

export default TabNavigator
