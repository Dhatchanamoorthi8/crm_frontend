import React, { useEffect, useState } from 'react'
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
import api from '../Services/axiosConfig'
import { ColorCodes } from '../Components/ColorCodes'

const EmployeeList = () => {
  const [CardDatas, SetCardDatas] = useState([])
  const fetchCardData = async () => {
    try {
      const response = await api.get('users')

      if (response.status === 200) {
        SetCardDatas(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCardData()
  }, [])
  return (
    <>
      <ScrollView style={{ backgroundColor: '#F4F9FD' }}>
        <View style={styles.cardWrapper}>
          {CardDatas && CardDatas.length > 0 ? (
            CardDatas.map((item, index) => (
              <Card variant='elevated' style={styles.card}>
                <View>
                  <VStack space='4xl'>
                    <HStack
                      space='md'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <HStack space='md'>
                        <Avatar
                          className='bg-indigo-600'
                          bg={ColorCodes(item.name)}
                        >
                          <AvatarFallbackText className='text-white'>
                            {item.name}
                          </AvatarFallbackText>

                          <AvatarImage source={{ uri: item.profile }} />
                          {/* <AvatarBadge /> */}
                        </Avatar>
                        <VStack>
                          <Heading size='sm' fontFamily='MonaSans_400Regular'>
                            {item.name}
                          </Heading>
                          <Text
                            size='sm'
                            style={{ color: '#91929E', fontSize: 14 }}
                            fontFamily='MonaSans_400Regular'
                          >
                            {item.designationName}
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
                      {item.DOB}
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
                      {item.age}
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
                    {item.designationName}
                  </Text>
                </View>
              </Card>
            ))
          ) : (
            <>
              <Text textAlign='center' mt='$4'>
                No results found.
              </Text>
            </>
          )}
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
