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

const EmployeeList = () => {
  return (
    <>
      <ScrollView style={{ backgroundColor: '#F4F9FD' }}>
        <View style={styles.cardWrapper}>
          <Card variant='elevated' style={styles.card}>
            <View>
              <VStack space='4xl'>
                <HStack
                  space='md'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <HStack space='md'>
                    <Avatar className='bg-indigo-600'>
                      <AvatarFallbackText className='text-white'>
                        Ronald Richards
                      </AvatarFallbackText>
                      {/* <AvatarBadge /> */}
                    </Avatar>
                    <VStack>
                      <Heading size='sm' fontFamily='MonaSans_400Regular'>
                        Ronald Richards
                      </Heading>
                      <Text
                        size='sm'
                        style={{ color: '#91929E', fontSize: 14 }}
                        fontFamily='MonaSans_400Regular'
                      >
                        Nursing Assistant
                      </Text>
                    </VStack>
                  </HStack>

                  <View>
                    <TouchableOpacity>
                      <Entypo
                        name='dots-three-vertical'
                        size={24}
                        color='black'
                      />
                    </TouchableOpacity>
                  </View>
                </HStack>
              </VStack>
            </View>
            <Divider my={'$5'} />

            <View
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              my={'$5'}
            >
              <View>
                <Text
                  style={{ color: '#91929E', fontSize: 14 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Gender
                </Text>

                <Text
                  style={{ color: '#0A1629', fontSize: 16 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Male
                </Text>
              </View>

              <View>
                <Text
                  style={{ color: '#91929E', fontSize: 14 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Birthday
                </Text>

                <Text
                  style={{ color: '#0A1629', fontSize: 16 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Apr 12, 1995
                </Text>
              </View>

              <View>
                <Text
                  style={{ color: '#91929E', fontSize: 14 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Full age
                </Text>

                <Text
                  style={{ color: '#0A1629', fontSize: 16 }}
                  fontFamily='MonaSans_400Regular'
                >
                  25
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{ color: '#91929E', fontSize: 14 }}
                fontFamily='MonaSans_400Regular'
              >
                Position
              </Text>

              <Text
                style={{ color: '#0A1629', fontSize: 16 }}
                fontFamily='MonaSans_400Regular'
              >
                UI/UX Designer
              </Text>
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

export default EmployeeList
