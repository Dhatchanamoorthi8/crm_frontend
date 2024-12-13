import {
  View,
  Text,
  Heading,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  ButtonGroup,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  Divider,
  Icon,
  ChevronRightIcon
} from '@gluestack-ui/themed'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import {
  CommonActions,
  useNavigation,
  useNavigationState
} from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { Image } from '@gluestack-ui/themed'
const image = require('../../assets/logo 2.png')

import { DashBorad, Calendar, Logout, Employee } from '@/assets/Icons/SvgIcons'
import { useBackHandler } from '../Hooks/useBackHandler'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AlertDialogBackdrop } from '@gluestack-ui/themed'
import { AlertDialogFooter } from '@gluestack-ui/themed'
import { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
  useSharedValue
} from 'react-native-reanimated'
import { VStack } from '@gluestack-ui/themed'
import { HStack } from '@gluestack-ui/themed'
import { AvatarImage } from '@gluestack-ui/themed'
import { ColorCodes } from '../Components/ColorCodes'

const DrawerList = [
  {
    icon: DashBorad,
    label: 'DashBoard',
    navigateTo: 'DashBoard',
    role: 'user'
  },
  {
    icon: Calendar,
    label: 'Attendance',
    navigateTo: 'AttendanceTab',
    role: 'user'
  },
  // {
  //   icon: Employee,
  //   label: 'Employees',
  //   navigateTo: 'Addemployee',
  //   role: 'admin',
  //   children: [
  //     {
  //       icon: 'account-circle',
  //       label: 'Add User',
  //       navigateTo: 'SeatMaster'
  //     },
  //     {
  //       icon: 'account-circle',
  //       label: 'Seat Summary',
  //       navigateTo: 'SeatSummary'
  //     }
  //   ]
  // },

  {
    icon: DashBorad,
    label: 'DashBoard',
    navigateTo: 'AdminDashBoard',
    role: 'admin'
  },

  {
    icon: Employee,
    label: 'Employees',
    navigateTo: 'EmployeeTab',
    role: 'admin'
  }
]

const DrawerLayout = ({
  icon: IconComponent,
  label,
  navigateTo,
  hasChildren,
  onToggle,
  isExpanded
}) => {
  const navigation = useNavigation()
  const routes = useNavigationState(state => state.routes)

  const getFocusedRouteNameFromNestedNavigator = route => {
    if (route?.state) {
      const nestedRoute = route.state.routes[route.state.index]
      return (
        getFocusedRouteNameFromNestedNavigator(nestedRoute) || nestedRoute.name
      )
    }
    return route?.name
  }

  const focusedRouteName = getFocusedRouteNameFromNestedNavigator(
    routes[routes.length - 1]
  )

  console.log(focusedRouteName, navigateTo, 'focusedRouteName')

  const isFocused = focusedRouteName === navigateTo
  const iconColor = isFocused ? '#3F8CFF' : '#7D8592'
  const labelColor = isFocused ? '#3F8CFF' : '#7D8592'

  return (
    <DrawerItem
      icon={({ focused }) => (
        <View style={{ width: 24, height: 24 }}>
          <IconComponent color={iconColor} screenname={navigateTo} />
        </View>
      )}
      label={label}
      onPress={() => {
        if (hasChildren) {
          onToggle(label)
        } else {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'DrawerNavigator',
              params: { screen: navigateTo }
            })
          )
        }
      }}
      labelStyle={[styles.links, { color: labelColor }]} // Update label color dynamically
    />
  )
}

const ChildDrawerLayout = ({ icon, label, navigateTo }) => {
  const navigation = useNavigation()
  return (
    <DrawerItem
      icon={({ color, size }) => (
        <MaterialIcons
          name='subdirectory-arrow-right'
          color={'#e8edf0'}
          size={size}
        />
      )}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo)
      }}
      labelStyle={styles.childLinks}
    />
  )
}

const UserProfile = ({ userdata }) => {
  const nav = useNavigation()
  console.log(userdata)

  return (
    <VStack space='2xl'>
      <HStack space='md'>
        <View>
          <VStack space='4xl'>
            <HStack
              space='md'
              justifyContent='space-between'
              alignItems='center'
              display='flex'
              flexDirection='row'
            >
              <TouchableOpacity onPress={() => nav.navigate('Profilescreen')}>
                <HStack space='md'>
                  <Avatar
                    className='bg-indigo-600'
                    bg={ColorCodes(userdata.username)}
                  >
                    {userdata.profile ? (
                      <AvatarImage
                        source={{
                          uri: `data:image/png;base64,${userdata.profile}`
                        }}
                      />
                    ) : (
                      <AvatarFallbackText className='text-white'>
                        {userdata.username}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <VStack>
                    <Heading size='sm' fontFamily='MonaSans_400Regular'>
                      {userdata.username}
                    </Heading>
                    <Text
                      size='sm'
                      style={{ color: '#91929E', fontSize: 14 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      {userdata.role}
                    </Text>
                  </VStack>
                </HStack>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </View>
      </HStack>
    </VStack>
  )
}

const DrawerContent = ({ userrole, userData }) => {
  const filteredDrawerList = DrawerList.filter(item => item.role === userrole)

  const { showAlertDialog, setShowAlertDialog, handleLogout } = useBackHandler()

  const [expandedMenu, setExpandedMenu] = useState(null)

  const toggleSubmenu = label => {
    setExpandedMenu(prev => (prev === label ? null : label))
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView>
          <View paddingLeft={'$5'} marginTop={'$5'}>
            <UserProfile userdata={userData} />
          </View>

          <Divider my={'$5'} />

          <View p={'$1'} marginTop={'$1'}>
            {filteredDrawerList.map((item, index) => (
              <View key={index}>
                <DrawerLayout
                  icon={item.icon}
                  label={item.label}
                  navigateTo={item.navigateTo}
                  hasChildren={!!item.children}
                  onToggle={toggleSubmenu}
                  isExpanded={expandedMenu === item.label}
                />

                {item.children && expandedMenu === item.label && (
                  <View style={{ paddingLeft: 20 }}>
                    {item.children.map((child, idx) => (
                      <ChildDrawerLayout
                        key={idx}
                        label={child.label}
                        navigateTo={child.navigateTo}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </DrawerContentScrollView>

        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setShowAlertDialog(true)}
            style={styles.row}
          >
            <Logout />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.logoContainer}>
         <Image source={image} style={styles.logo} resizeMode='contain' /> 
        </View> */}
      </View>

      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size='lg'>Logout Account</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>Do you want to logout?</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space='lg'>
              <Button
                variant='outline'
                onPress={() => setShowAlertDialog(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button bg='$error600' onPress={() => handleLogout()}>
                <ButtonText>Logout</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const styles = StyleSheet.create({
  links: {
    fontSize: 16,
    color: '#7D8592',
    fontFamily: 'MonaSans_SemiBold'
  },
  childLinks: {
    fontSize: 13.2,
    color: '#7D8592',
    fontFamily: 'MonaSans_SemiBold'
  },

  logo: {
    width: 150,
    height: 110
  },
  container: {
    padding: 20
  },
  row: {
    flexDirection: 'row', // This ensures the icon and text are aligned horizontally
    alignItems: 'center' // Align items vertically in the center
  },
  text: {
    fontFamily: 'MonaSans_SemiBold',
    marginLeft: 10 // Space between icon and text
  }
})

export default DrawerContent
