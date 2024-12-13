import React, { useCallback, useEffect, useState } from 'react'
import { AvatarImage, Card, HStack, ScrollView, Text } from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { store } from '../../../Store/store'
import Feather from '@expo/vector-icons/Feather';
import { AvatarBadge } from '@gluestack-ui/themed'
import { Entypo } from '@expo/vector-icons'
import { Heading } from '@gluestack-ui/themed'
import { Divider } from '@gluestack-ui/themed'
import { Icon, HelpCircleIcon, ChevronRightIcon, SettingsIcon, AlertCircleIcon } from '@gluestack-ui/themed'

import api from '@/src/Services/axiosConfig'
import { ColorCodes } from '@/src/Components/ColorCodes'
import { useNavigation } from '@react-navigation/native'
import { RefreshControl } from 'react-native-gesture-handler'

const CommonSettings = () => {

    const navigation = useNavigation()

    const state = store.getState()

    const userid = state.user.userData.user.userid

    const userData = state.user.userData.user

    const [refreshing, setRefreshing] = useState(false)



    const [errorMsg, seterrorMsg] = useState(false)



    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [])




    return (
        <ScrollView style={{ backgroundColor: '#F4F9FD' }}>


            <View style={styles.cardWrapper} mx={"$6"} >
                <TouchableOpacity onPress={() => navigation.navigate('Profilescreen')}>
                    <VStack space="2xl">
                        <HStack space="md">

                            <Avatar
                                className='bg-indigo-600'
                                bg={ColorCodes(userData.username)}
                            >
                                <AvatarFallbackText className='text-white'>
                                    {userData.username}
                                </AvatarFallbackText>

                                {userData.profile && (
                                    <AvatarImage
                                        source={{
                                            uri: `data:image/png;base64,${userData.profile}`
                                        }}
                                    />
                                )}
                            </Avatar>

                            <VStack marginStart={"$5"}>
                                <Heading size="sm" >{userData.username}</Heading>
                                <Text size="sm" >{userData.designation}</Text>
                            </VStack>
                        </HStack>

                    </VStack>
                </TouchableOpacity>
            </View>
            <Divider />

            <ScrollView style={{ backgroundColor: '#F4F9FD' }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>


                <View mx="$6" mt="$10" mb="$7">
                    <TouchableOpacity >
                        <VStack space="2xl">
                            <HStack space="md" alignItems="center">

                                <Icon as={SettingsIcon} h="$6" w="$6" />


                                <HStack
                                    flex={1}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Heading size="sm" fontFamily='MonaSans_400Regular'>Settings</Heading>


                                    <Icon as={ChevronRightIcon} className="text-typography-500 m-2 w-4 h-4" />
                                </HStack>
                            </HStack>
                        </VStack>
                    </TouchableOpacity>
                </View>

                <View mx="$6" mb="$7" >
                    <TouchableOpacity >
                        <VStack space="2xl">
                            <HStack space="md" alignItems="center">

                                <Icon as={HelpCircleIcon} h="$6" w="$6" />


                                <HStack
                                    flex={1}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Heading size="sm" fontFamily='MonaSans_400Regular'>Help & Support</Heading>


                                    <Icon as={ChevronRightIcon} className="text-typography-500 m-2 w-4 h-4" />
                                </HStack>
                            </HStack>
                        </VStack>
                    </TouchableOpacity>
                </View>



                <View mx="$6">
                    <TouchableOpacity onPress={() => navigation.navigate('Aboutscreen')} >
                        <VStack space="2xl">
                            <HStack space="md" alignItems="center">

                                <Icon as={AlertCircleIcon} h="$6" w="$6" />


                                <HStack
                                    flex={1}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Heading size="sm" fontFamily='MonaSans_400Regular'>About</Heading>


                                    <Icon as={ChevronRightIcon} className="text-typography-500 m-2 w-4 h-4" />
                                </HStack>
                            </HStack>
                        </VStack>
                    </TouchableOpacity>
                </View>
            </ScrollView >



        </ScrollView >
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

export default CommonSettings