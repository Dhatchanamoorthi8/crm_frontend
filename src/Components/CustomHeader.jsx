import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  MenuIcon,
  View,
  Text,
  VStack,
  BadgeText,
  Modal,
  ModalHeader,
  Heading,
  ModalCloseButton,
  CloseIcon,
  Divider
} from '@gluestack-ui/themed'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { CloseSvg, Notification } from '@/assets/Icons/SvgIcons'
import { Badge } from '@gluestack-ui/themed'
import { Box } from '@gluestack-ui/themed'
import { ModalBackdrop } from '@gluestack-ui/themed'
import { ModalContent } from '@gluestack-ui/themed'
import { ModalBody } from '@gluestack-ui/themed'
import NotificationScreen from '../Pages/Notification/NotificationScreen'
import { ColorCodes } from './ColorCodes'
import api from '../Services/axiosConfig'

const CustomHeader = ({ title, scrollY, userData }) => {
  const focus = useIsFocused()

  const navigation = useNavigation()

  const [NotificationModel, setNotificationModel] = useState(false)

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

  const [messages, setMessages] = useState([])

  const [messagesCount, setMessagesCount] = useState(null)

  // Function to open the drawer when the menu icon is clicked
  const openDrawer = () => {
    navigation.openDrawer()
  }

  async function fetchMessages () {
    try {
      // const { data, status } = await api.get(
      //   `conversation/unread-messages/${userData.userid}/${userRole}`
      // )

      const response = await api.get(
        `conversation/unread-messages/${userData.userid}/${userData.role}`
      )

      if (response.status === 200) {
        setMessagesCount(response.data.unreadCount)
        setMessages(response.data.conversations)
      }

      // if (status === 200) {
      //   setMessagesCount(data)
      // }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let isMounted = true // To prevent state updates if the component unmounts

    const pollMessages = async () => {
      if (!isMounted) return // Prevent further execution if unmounted
      await fetchMessages() // Fetch messages
      if (focus) {
        setTimeout(pollMessages, 5000)
      }
    }

    pollMessages()

    return () => {
      isMounted = false // Cleanup
    }
  }, [focus])

  return (
    <View className='bg-lightBackground dark:bg-black'>
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
            {messagesCount && messagesCount ? (
              <TouchableOpacity onPress={() => setNotificationModel(true)}>
                <Box alignItems='center' className=' mt-1'>
                  <VStack>
                    <Badge
                      bg='$red600'
                      style={{
                        zIndex: 10
                      }}
                      mb={'-$3.5'}
                      mr={'-$1.5'}
                      rounded={'$full'}
                      zIndex={10}
                      alignSelf='flex-end'
                      variant='solid'
                    >
                      <BadgeText color='white'>{messagesCount}</BadgeText>
                    </Badge>

                    <Notification />
                  </VStack>
                </Box>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setNotificationModel(true)}>
                <Notification />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('CommonSettings')}
            >
              <Avatar
                size='sm'
                style={styles.avatar}
                bg={ColorCodes(userData.username)}
              >
                {userData.profile ? (
                  <AvatarImage
                    source={{
                      uri: `data:image/png;base64,${userData.profile}`
                    }}
                    alt={'User Avatar'} // Optional alt text to suppress the warning
                  />
                ) : (
                  <AvatarFallbackText className='text-white'>
                    {userData.username}
                  </AvatarFallbackText>
                )}
              </Avatar>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Modal
        isOpen={NotificationModel}
        onClose={() => {
          setNotificationModel(false)
        }}
        size='full'
        style={{ borderRadius: 50 }}
        p='$2'
      >
        <ModalBackdrop />
        <ModalContent
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'white' // Ensure background color is consistent
          }}
          my={'$7'}
        >
          <ModalHeader>
            <Heading
              size='md'
              className='text-typography-950'
              color='#0A1629'
              fontFamily='MonaSans_Bold'
            >
              Notifications
            </Heading>
            <ModalCloseButton>
              <CloseSvg />
            </ModalCloseButton>
          </ModalHeader>
          <Divider />
          <ModalBody my={'$1'} w='$full'>
            <NotificationScreen
              messages={messages}
              nav={navigation}
              onClose={() => {
                setNotificationModel(false)
              }}
              setMessagesCount={setMessagesCount}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
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
