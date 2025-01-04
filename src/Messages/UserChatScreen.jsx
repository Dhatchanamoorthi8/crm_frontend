import React, { useEffect, useRef, useState } from 'react'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  View,
  Text,
  Input,
  InputField,
  Center,
  EyeIcon
} from '@gluestack-ui/themed'
import { Dimensions, PanResponder } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSpring
} from 'react-native-reanimated'
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { VStack, HStack, ScrollView, Avatar } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { SendSvg } from '@/assets/Icons/SvgIcons'
import { TouchableOpacity } from 'react-native'
import { RefreshControl } from '@gluestack-ui/themed'
import Spinner from 'react-native-loading-spinner-overlay'
import groupMessagesByDate from '../Components/groupMessagesByDate'
import { format, parseISO } from 'date-fns'

import { useSelector } from 'react-redux'

const UserChatScreen = ({ isopen, onClose }) => {

  const scrollViewRef = useRef(null)

  const userRole = useSelector(state => state.user.userData.user.role)

  const userData = useSelector(state => state.user.userData.user)

  const snapPoint = useSharedValue(80)

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Adjust snapPoint based on vertical drag
      let newSnapPoint = Math.max(
        80,
        Math.min(100, snapPoint.value - gestureState.dy / 10)
      ) // Clamp between 80% and 100%
      snapPoint.value = newSnapPoint // Directly update shared value
    },
    onPanResponderRelease: () => {
      // Smooth transition to the nearest snap point
      snapPoint.value = withTiming(Math.round(snapPoint.value / 10) * 10, {
        duration: 200
      })
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: `${snapPoint.value}%`
    }
  })

  const [loader, setloader] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  const [messages, setMessages] = useState([])

  const [inputMessage, setInputMessage] = useState('')

  const [pagination, setPagination] = useState({ page: 1, hasMore: true })

  const [isUserScrolling, setIsUserScrolling] = useState(false) 

  const sendMessage = async () => {
    if (inputMessage.text.trim() !== '') {
      try {
        setloader(true)
        const payload = {
          message: inputMessage.text,
          isUser: true,
          isRead: false,
          userid: userData.userid,
          sender_type: 'string'
        }

        const response = await api.post('conversation', payload)
        if (response.status === 201) {
          setInputMessage('')
          fetchMessages()
          setloader(false)
        }
      } catch (error) {
        console.log(error)
        setloader(false)
      }
    }
  }

  const fetchMessages = async (page = 1, append = false) => {
    setloader(true)
    try {
      const response = await api.get(
        `conversation/${userData.userid}?page=${page}&limit=10`
      )
      if (response.data) {
        const data = response.data

        // Ensure messages are ordered with the latest at the bottom
        const sortedMessages = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )

        const uniqueMessages = append
          ? [
              ...sortedMessages.filter(
                newMsg => !messages.some(msg => msg.id === newMsg.id)
              ),
              ...messages
            ]
          : sortedMessages

        setMessages(uniqueMessages)

        console.log(uniqueMessages,' ==================== uniqueMessages================')

        setPagination(prev => ({
          ...prev,
          page,
          hasMore: response.data.length === 10
        }))

        setloader(false)
      }
    } catch (error) {
      console.log(error)
      setloader(false)
    }
  }

  async function markMessagesAsRead () {
    await api.post(`conversation/mark-as-read/${userData.userid}/${userRole}`)
  }


  useEffect(() => {
    if (scrollViewRef.current && !isUserScrolling) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    fetchMessages(1, true) // Fetch fresh data
    markMessagesAsRead()
  }, [isopen])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchMessages()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const handleChangeText = React.useCallback(event => {
    const { text } = event.nativeEvent
    setInputMessage(prevData => ({ ...prevData, text: text }))
  }, [])

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <Actionsheet isOpen={isopen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <Animated.View
          style={[
            {
              backgroundColor: '#FFFFFF',
              overflow: 'scroll',
              width: '100%',
              position: 'relative'
            },
            animatedStyle
          ]}
          {...panResponder.panHandlers}
        >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <View flex={1} style={{ position: 'relative' }}>
            {/* Chat Messages */}

            <VStack flex={9}>
              <ScrollView
                contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {Object.keys(groupedMessages).map(dateKey => (
                  <View key={dateKey}>
                    {/* Date Header */}
                    <Center mb={2}>
                      <Text
                        style={{
                          color: '#606060',
                          fontSize: 15,
                          fontWeight: 'bold'
                        }}
                      >
                        {dateKey}
                      </Text>
                    </Center>

                    {/* Messages */}
                    {groupedMessages[dateKey].map(message => (
                      <HStack
                        key={message.id}
                        alignItems='flex-start'
                        space={3}
                        justifyContent={
                          message.isUser ? 'flex-end' : 'flex-start'
                        }
                        mb={'$5'}
                      >
                        {!message.isUser && (
                          <Avatar
                            size='sm'
                            source={{ uri: 'https://via.placeholder.com/150' }}
                          />
                        )}

                        <View
                          style={{
                            backgroundColor: message.isUser
                              ? '#FFFFFF'
                              : '#FFFFFF',
                            borderRadius: 20,
                            padding: 5,
                            maxWidth: '90%'
                          }}
                        >
                          <Text
                            style={{
                              color: '#0A1629',
                              marginBottom: 5,
                              textAlign: message.isUser ? 'right' : 'left',
                              fontFamily: 'NunitoSans_Bold'
                            }}
                          >
                            {message.isUser ? 'You' : message.username}{' '}
                            <Text
                              style={{
                                color: '#7D8592',
                                fontSize: 12,
                                marginTop: 5
                              }}
                            >
                              {format(parseISO(message.createdAt), 'hh:mm a')}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              color: '#7D8592',
                              textAlign: 'justify',
                              fontFamily: 'NunitoSans_Regular'
                            }}
                          >
                            {message.message}
                          </Text>

                          {/* Message Timestamp */}
                          {/* <Text
                            style={{
                              color: '#000',
                              fontSize: 12,
                              marginTop: 5
                            }}
                          >
                            {format(parseISO(message.createdAt), 'hh:mm a')}
                          </Text> */}
                        </View>

                        {message.isUser && (
                          <Avatar
                            size='sm'
                            source={{
                              uri: 'https://via.placeholder.com/150/0078FF/FFFFFF?text=U'
                            }}
                          />
                        )}
                      </HStack>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </VStack>

            {/* Chat Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <HStack
                  space={2}
                  alignItems='center'
                  style={{
                    position: 'absolute',
                    bottom: '0%',
                    width: '100%'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <View alignItems='flex-start' style={{ width: '80%' }}>
                      <Input
                        mt={1}
                        style={{ height: 50, borderRadius: 14 }}
                        key={refreshing}
                      >
                        <InputField
                          value={inputMessage}
                          onChange={handleChangeText}
                          placeholder='Type your message here…'
                        />
                      </Input>
                    </View>

                    <View alignItems='flex-start'>
                      <TouchableOpacity
                        onPress={sendMessage}
                        style={{
                          height: 50,
                          width: 66,
                          borderRadius: 14,
                          backgroundColor: '#3F8CFF',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <SendSvg />
                      </TouchableOpacity>
                    </View>
                  </View>
                </HStack>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>

          <Center>
            <Spinner size='large' visible={loader} />
          </Center>
        </Animated.View>
      </ActionsheetContent>
    </Actionsheet>
  )
}

export default UserChatScreen
