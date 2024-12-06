import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  MenuIcon,
  View,
  Text
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { Notification } from '@/assets/Icons/SvgIcons'
const CustomHeader = ({ title, scrollY }) => {
  const navigation = useNavigation()

  console.log(title, scrollY)

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [70, 80],
    extrapolate: 'clamp'
  })

  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [20, 18],
    extrapolate: 'clamp'
  })

  const adjustedPadding = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [20, 10],
    extrapolate: 'clamp'
  })

  // Function to open the drawer when the menu icon is clicked
  const openDrawer = () => {
    navigation.openDrawer()
  }

  return (
    <View style={{ backgroundColor: '#F4F9FD' }}>
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => openDrawer()}
            style={[styles.leftContainer]}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20
              }}
            >
              <Icon as={MenuIcon} className='text-typography-500 m-2 w-4 h-4' />
              <Text fontFamily='MonaSans_Bold'>{title}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <TouchableOpacity>
              <Notification />
            </TouchableOpacity>

            <TouchableOpacity>
              <Avatar size='sm' style={styles.avatar}>
                <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                  }}
                />
                <AvatarBadge />
              </Avatar>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 7,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', // Black shadow color
    borderRadius: 20,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 5.1,
    shadowRadius: 10,
    elevation: 3 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30
  },
  screenName: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold'
  }
})

export default CustomHeader
