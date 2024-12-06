import React from 'react'
import { StyleSheet } from 'react-native'
import {
  AvatarBadge,
  Avatar,
  AvatarImage,
  Card,
  Divider,
  ScrollView,
  VStack,
  HStack,
  Heading,
  View
} from '@gluestack-ui/themed'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { Text } from '@gluestack-ui/themed'

const EmployeeActivity = () => {
  return (
    <>
      <ScrollView style={{ backgroundColor: '#F4F9FD' }}>
        <View style={styles.cardWrapper}>
          <Card variant='elevated' style={styles.card}>
            <Card style={{ backgroundColor: '#F4F9FD', borderRadius: 20 }}>
              <View>
                <HStack space='md' justifyContent='center'>
                  <Avatar className='bg-indigo-600' size='xl'>
                    <AvatarFallbackText className='text-white'>
                      Ronald Richards
                    </AvatarFallbackText>
                  </Avatar>
                </HStack>

                <View marginStart={'auto'} marginEnd={'auto'} my={'$3'}>
                  <Text
                    tyle={{ color: '#0A1629', fontSize: 16 }}
                    fontFamily='MonaSans_SemiBold'
                    textAlign='center'
                    my={'$2'}
                  >
                    Shawn Stone
                  </Text>

                  <Text
                    style={{ color: '#0A1629', fontSize: 12 }}
                    fontFamily='MonaSans_400Regular'
                    textAlign='center'
                  >
                    UI/UX Designer
                  </Text>
                </View>
              </View>
            </Card>

            <View
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              my={'$4'}
            >
              <View>
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_SemiBold'
                  style={{ color: '#0A1629', fontSize: 26 }}
                >
                  0
                </Text>
                <Text
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                >
                  Backlog
                </Text>
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                >
                  tasks
                </Text>
              </View>

              <View>
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_SemiBold'
                  style={{ color: '#0A1629', fontSize: 26 }}
                >
                  0
                </Text>
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                >
                  Tasks
                </Text>
                <Text
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                >
                  In Progress
                </Text>
              </View>

              <View>
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_SemiBold'
                  style={{ color: '#0A1629', fontSize: 26 }}
                >
                  0
                </Text>
                <Text
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                  textAlign='center'
                >
                  Tasks
                </Text>
                <Text
                  fontFamily='MonaSans_400Regular'
                  style={{ color: '#91929E', fontSize: 14 }}
                >
                  In Review
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  card: {
    backgroundColor: '#FFFFFF', // White background for card
    borderRadius: 13, // Rounded corners
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow blur radius
    elevation: 5, // Elevation for Android (shadow on Android)
    marginBottom: 20 // Space between cards
  }
})

export default EmployeeActivity
