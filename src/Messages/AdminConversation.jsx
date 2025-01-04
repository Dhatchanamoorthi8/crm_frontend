import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useSelector } from 'react-redux'
import api from '../Services/axiosConfig'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Center
} from '@gluestack-ui/themed'

import Spinner from 'react-native-loading-spinner-overlay'
import { Dimensions, PanResponder } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated'

const AdminConversation = ({ isopen, onClose, userid }) => {
  const snapPoint = useSharedValue(80)

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      let newSnapPoint = Math.max(
        80,
        Math.min(100, snapPoint.value - gestureState.dy / 10)
      )
      snapPoint.value = newSnapPoint
    },
    onPanResponderRelease: () => {
      snapPoint.value = withTiming(Math.round(snapPoint.value / 10) * 10, {
        duration: 200
      })
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    return { height: `${snapPoint.value}%` }
  })
  const userRole = useSelector(state => state.user.userData.user.role)
  const userData = useSelector(state => state.user.userData.user)

  const [loader, setLoader] = useState(false)

  const [messages, setMessages] = useState([])
  const [pagination, setPagination] = useState({ page: 1, hasMore: true })
  const [loadingOlder, setLoadingOlder] = useState(false)

  // Fetch messages from the server
  const fetchMessages = async (page = 1, append = false) => {
    try {
      const response = await api.get(
        `conversation/${userid}?page=${page}&limit=10`
      )
      if (response.data) {
        const fetchedMessages = response.data.map(msg => ({
          _id: msg.id,
          text: msg.message,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.isUser ? msg.userid : 'admin',
            name: msg.isUser ? msg.username : 'Admin',
            avatar: msg.isUser
              ? 'https://via.placeholder.com/150/0078FF/FFFFFF?text=U'
              : 'https://via.placeholder.com/150'
          }
        }))

        setMessages(previousMessages =>
          append
            ? GiftedChat.append(fetchedMessages.reverse(), previousMessages)
            : GiftedChat.append(previousMessages, fetchedMessages.reverse())
        )

        setPagination(prev => ({
          page,
          hasMore: fetchedMessages.length === 10 // If less than 10 messages, no more pages
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingOlder(false)
    }
  }

  // Send message
  const sendMessage = async (newMessages = []) => {
    const message = newMessages[0]
    try {
      const payload = {
        message: message.text,
        isUser: false,
        isRead: false,
        userid,
        sender_type: 'admin'
      }
      const response = await api.post('conversation', payload)
      if (response.status === 201) {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages)
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Load older messages when user scrolls up
  const onLoadEarlier = () => {
    if (pagination.hasMore) {
      setLoadingOlder(true)
      fetchMessages(pagination.page + 1, true)
    }
  }

  // Fetch initial messages
  useEffect(() => {
    if (isopen) {
      fetchMessages(1, false)
    }
  }, [isopen])

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessages => sendMessage(newMessages)}
      user={{
        _id: 'admin',
        name: 'Admin'
      }}
      loadEarlier={pagination.hasMore}
      onLoadEarlier={onLoadEarlier}
      isLoadingEarlier={loadingOlder}
    />
  )
}

export default AdminConversation
