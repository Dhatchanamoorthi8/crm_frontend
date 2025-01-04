import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import { useFocusEffect } from '@react-navigation/native'
import { Animated } from 'react-native'
import { StyleSheet } from 'react-native'
import { View } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { Text } from '@gluestack-ui/themed'
import config from '../config'
const ChatScreen = ({ route }) => {
  
  const { userid } = route.params

  const userData = useSelector(state => state.user.userData.user)

  const userRole = useSelector(state => state.user.userData.user.role)

  const [messages, setMessages] = useState([])

  const [socket, setSocket] = useState(null)

  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const [animation] = useState(new Animated.Value(0))

  const storeMessages = newMessages => {
    setMessages(previousMessages => {
      const updatedMessages = GiftedChat.append(previousMessages, newMessages)
      //return updatedMessages.slice(-5) // Keep the last 5 messages
      return updatedMessages // Keep the last 5 messages
    })
  }

  const formatIncomingMessage = message => ({
    _id: message.id || message._id,
    text: message.message,
    createdAt: new Date(message.createdAt),
    user: {
      _id: message.userid,
      name: message.user ? message.user.name : 'Unknown'
    }
  })

  const sendMessage = async (newMessages = []) => {
    const message = newMessages[0]
    try {
      const payload = {
        message: message.text,
        isUser: userRole !== 'admin',
        isRead: false,
        userid,
        createdby: userData.userid,
        _id: message._id,
        createdAt: message.createdAt
      }
      socket.emit('sendMessage', payload)
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages)
      )
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const onSend = useCallback(
    (messages = []) => {
      sendMessage(messages)
    },
    [userid, userData, socket]
  )

  useFocusEffect(
    useCallback(() => {
      const newSocket = io(config.API_URL, {
        query: {
          userid: userData.userid
        }
      })
      setSocket(newSocket)

      const handleSocketConnection = () => {
        console.log('Socket connected: ' + newSocket.id)
        newSocket.emit('joinRoom', {
          userid: userData.userid,
          createdby: userid
        })
      }

      const handleSocketReconnection = () => {
        console.log('Socket reconnected: ' + newSocket.id)
        newSocket.emit('joinRoom', {
          userid: userData.userid,
          createdby: userid
        })
      }

      const handleReceiveMessage = newMessage => {
        console.log(newMessage, 'receiveMessage')
        storeMessages([formatIncomingMessage(newMessage)])
      }

      const handleChatHistory = oldMessages => {
        console.log('Received messages:', oldMessages)
        const formattedMessages = oldMessages.map(formatIncomingMessage)
        storeMessages(formattedMessages)
      }

      // Attach socket listeners
      newSocket.on('connect', handleSocketConnection)
      newSocket.on('reconnect', handleSocketReconnection)
      newSocket.on('receiveMessage', handleReceiveMessage)
      newSocket.on('chatHistory', handleChatHistory)

      // Trigger joinRoom immediately if socket is already connected
      if (newSocket.connected) {
        handleSocketConnection()
      }

      return () => {
        console.log('Cleaning up socket connection')
        newSocket.off('connect', handleSocketConnection)
        newSocket.off('reconnect', handleSocketReconnection)
        newSocket.off('receiveMessage', handleReceiveMessage)
        newSocket.off('chatHistory', handleChatHistory)
        newSocket.disconnect() // Properly disconnect socket on screen blur
        setSocket(null) // Reset socket instance in state
      }
    }, [userid, userData.userid])
  )

  const deleteNotification = async () => {
    try {
      const response = await api.post(
        `conversation/mark-as-read-One/${userData.userid}`
      )
      if (response.status === 201) {
        setShowSuccessNotification(true)
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start()

        setTimeout(() => {
          setShowSuccessNotification(false)
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          }).start()
        }, 3000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    deleteNotification()
  }, [userid])

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userid,
          name: userData.name
        }}
        placeholder='Type a message...'
        //alwaysShowSend
        renderUsernameOnMessage
        scrollToBottom
      />

      {showSuccessNotification && (
        <Animated.View
          style={[
            styles.successNotification,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.successText}>
            All messages are marked as read!
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  loadold: {
    color: '#fff',
    textAlign: 'center'
  },
  successNotification: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  successText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
})
export default ChatScreen
