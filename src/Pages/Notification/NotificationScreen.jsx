import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Card,
  ScrollView,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
  Heading,
  VStack,
  Divider,
  AvatarImage,
  Badge,
  BadgeText,
  View,
  Text,
  RefreshControl
} from '@gluestack-ui/themed'
import { formatDistanceToNowStrict } from 'date-fns'
import { useSelector } from 'react-redux'
import api from '@/src/Services/axiosConfig'
import Spinner from 'react-native-loading-spinner-overlay'
import { Center } from '@gluestack-ui/themed'
import { Skeleton } from 'moti/skeleton'

const NotificationScreen = ({messages: initialMessages, nav,onClose,setMessagesCount}) => {
  const [refreshing, setRefreshing] = useState(false)
  const [loader, setLoader] = useState(true) // Show loader initially
  const [listAllUserMessage, setListAllUserMessage] = useState([])

  const userData = useSelector(state => state.user.userData.user)

  const onpressNotification = (id, username, profile, lastOnline, isOnline) => {
    onClose()
    nav.navigate('ChatScreen', {
      userid: id,
      close: onClose,
      userDataprops: {
        username,
        profile
      },
      lastOnline,
      isOnline,
      
    })
  }

  const fetchAllempoloyee = async (page, limit) => {
    setLoader(true) // Show loader while fetching data
    try {
      const response = await api.get(`conversation?userid=${userData.userid}&page=${page}&limit=${limit}&viewerType=${userData.role}`)

      if (response.status === 200) {
        setListAllUserMessage(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false) // Hide loader after data is fetched
    }
  }

  useEffect(() => {
    fetchAllempoloyee(1, 10)
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchAllempoloyee(1, 10)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const colorMode = 'light'

  return (
    <ScrollView
      flex={1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 16 }}>
        {loader
          ? Array.from({ length: 5 }).map((_, index) => (
              <View key={index}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Skeleton
                    colorMode={colorMode}
                    height={55}
                    width={55}
                    radius='round'
                  />

                  <View my='$1' mx='$2'>
                    <Skeleton colorMode={colorMode} width='70%' height={25} />

                    <Spacer height={5} />

                    <Skeleton colorMode={colorMode} width='90%' height={25} />
                  </View>
                </View>

                <Spacer height={8} />
              </View>
            ))
          : // Notification List
            listAllUserMessage.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  onpressNotification(
                    item.userId,
                    item.username,
                    item.profile,
                    item.lastOnline,
                    item.isOnline
                  )
                }
                key={index}
              >
                <VStack space='2xl' my='$5'>
                  <HStack
                    space='md'
                    alignItems='flex-start'
                    justifyContent='space-between'
                  >
                    {/* User Avatar */}
                    <Avatar className='bg-indigo-600'>
                      <AvatarFallbackText>{item.username}</AvatarFallbackText>

                      <AvatarImage
                        source={{
                          uri: `data:image/png;base64,${item.profile}`
                        }}
                        alt={'User Avatar'} // Optional alt text to suppress the warning
                      />
                      {item.isactive ? (
                        <AvatarBadge bg='$green400' />
                      ) : (
                        <AvatarBadge bg='$red400' />
                      )}
                    </Avatar>

                    {/* Username and Last Message */}
                    <VStack style={{ flex: 1 }}>
                      <Heading
                        size='sm'
                        style={{
                          flexShrink: 1,
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.username}
                      </Heading>
                      <Text
                        size='sm'
                        style={{
                          flexShrink: 1,
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.lastMessage}
                      </Text>
                    </VStack>

                    {/* Time and Notification Count */}
                    <VStack alignSelf='flex-start'>
                      {/* Time */}
                      <Text
                        size='xs'
                        style={{
                          color: '#7D8592',
                          alignSelf: 'flex-start',
                          marginBottom: 5
                        }}
                      >
                        {item.createdAt &&
                          formatDistanceToNowStrict(new Date(item.createdAt), {
                            addSuffix: false
                          })}
                      </Text>

                      {item.unreadCount > 0 && (
                        <View
                          style={{
                            backgroundColor: '#FF0000',
                            zIndex: 10,
                            marginBottom: -14,
                            marginRight: 10,
                            borderRadius: 50,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontWeight: 'bold',
                              fontSize: 12
                            }}
                          >
                            {item.unreadCount}
                          </Text>
                        </View>
                      )}
                    </VStack>
                  </HStack>
                </VStack>
              </TouchableOpacity>
            ))}
      </View>
    </ScrollView>
  )
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />

const styles = StyleSheet.create({
  deleteAction: {
    backgroundColor: '#FFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginVertical: 5,
    borderRadius: 5
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
})

export default NotificationScreen
