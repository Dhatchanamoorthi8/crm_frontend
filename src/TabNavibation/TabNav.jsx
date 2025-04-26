import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Keyboard, Dimensions } from 'react-native';
import DashBoardPage from '../Pages/DashBoardPage';
import AttendanceTab from '../Pages/Attendance/Attendance.tab';
import MyTabBar from './TabBar';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation();

  useEffect(() => {
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(tabBarTranslateY, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(tabBarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);

  const handleAddEnquiryPress = () => {
    navigation.navigate('NewEnquiry'); // Navigate to the full-screen "NewEnquiry" screen
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: false,
      }}
      tabBar={(props) => (
        <Animated.View
          style={{
            transform: [{ translateY: tabBarTranslateY }],
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: screenHeight > 600 ? 70 : 60,
          }}
        >
          <MyTabBar {...props} />
        </Animated.View>
      )}
    >
      {/* Dashboard tab */}
      <Tab.Screen name="Dashboard" component={DashBoardPage} />

      {/* AddEnquiry tab - Navigate to full-screen */}
      <Tab.Screen
        name="AddEnquiry"
        component={() => null} 
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab behavior
            handleAddEnquiryPress(); // Navigate to the full-screen screen
          },
        }}
      />

      {/* Attendance tab */}
      <Tab.Screen name="Attendance" component={AttendanceTab} />
    </Tab.Navigator>
  );
};

export default TabNavigator;