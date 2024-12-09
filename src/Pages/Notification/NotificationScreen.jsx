import { View, Text } from 'react-native'
import React from 'react'
import {
  Card,
  ScrollView,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
  Heading,
  VStack
} from '@gluestack-ui/themed'

const NotificationScreen = () => {
  return (
    <ScrollView>
      <View>
        <Card>
          <VStack space='2xl'>
            <HStack space='md'>
              <Avatar className='bg-indigo-600'>
                <AvatarFallbackText className='text-white'>
                  Ronald Richards
                </AvatarFallbackText>
                <AvatarBadge />
              </Avatar>
              <VStack>
                <Heading size='sm'>Ronald Richards</Heading>
                <Text size='sm'>Nursing Assistant</Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>
      </View>
    </ScrollView>
  )
}

export default NotificationScreen
