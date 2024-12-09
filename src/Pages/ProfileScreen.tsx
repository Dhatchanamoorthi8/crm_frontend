import React, { useEffect, useState } from 'react'
import { AvatarImage, Button, Card, HStack, ScrollView, Text } from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { ColorCodes } from '../Components/ColorCodes'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { StyleSheet, TouchableOpacity } from 'react-native'
import api from '../Services/axiosConfig'
import { store } from '../../Store/store'
import Feather from '@expo/vector-icons/Feather';
import { AvatarBadge } from '@gluestack-ui/themed'
import { Entypo } from '@expo/vector-icons'
import { Heading } from '@gluestack-ui/themed'
import { Divider } from '@gluestack-ui/themed'
import { Icon, HelpCircleIcon, ChevronRightIcon, SettingsIcon, AlertCircleIcon } from '@gluestack-ui/themed'

import * as Application from 'expo-application';
import FileUpload from '../Components/FileUpload'
import { EditSvg } from '@/assets/Icons/SvgIcons'

const ProfileScreen = () => {

    console.log(Application.nativeApplicationVersion, 'version');

    const state = store.getState()

    const userid = state.user.userData.user.userid

    const [uploadedOpen, setUploadedOpen] = useState(false)


    const [userData, setUserData] = useState({
        user_id: null,
        name: '',
        email: '',
        gender: '',
        DOB: '',
        profile: '',
        age: null,
        mobile: '',
        designationName: '',
        companyName: ''
    })

    const [errorMsg, seterrorMsg] = useState(false)

    const fetchUserData = async () => {
        try {
            const response = await api.get(`users/${userid}`)



            if (response.status === 200) {
                const { user_id, name, email, gender, DOB, profile,
                    age, mobile, designationName, companyName } = response.data[0]
                setUserData(current => ({
                    ...current, user_id: user_id,
                    name: name, email: email, gender: gender, DOB: DOB, profile: profile,
                    age: age, mobile: mobile, designationName: designationName, companyName: companyName
                }))

                seterrorMsg(false)
                return
            }

            seterrorMsg(true)

        } catch (error) {
            console.log(error);
        }
    }



    const handleCloseUpload = () => {
        setUploadedOpen(false)
    }

    const handleImageUpload = async image => {

        console.log(image);

    }


    const handleUploadRest = async image => {
        console.log(image)
    }

    useEffect(() => {
        fetchUserData()
    }, [])




    return (
        <>
            <ScrollView style={{ backgroundColor: '#F4F9FD' }} >

                <>
                    <View style={styles.cardWrapper}>
                        <Card variant='elevated' style={styles.card}>
                            <Card style={{ backgroundColor: '#F4F9FD', borderRadius: 20 }}>
                                <View>
                                    <HStack space='md' justifyContent='center'>
                                        <Avatar
                                            className='bg-indigo-600'
                                            bg={ColorCodes(userData.name)}
                                            size='2xl'
                                        >
                                            <AvatarFallbackText className='text-white'>
                                                {userData.name}
                                            </AvatarFallbackText>

                                            {userData.profile && (
                                                <AvatarImage source={{ uri: userData.profile }} />
                                            )}


                                            <AvatarBadge h="$10" w="$10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity onPress={() => setUploadedOpen(true)}>
                                                    <Feather name="camera" size={20} color="white" />
                                                </TouchableOpacity>
                                            </AvatarBadge >


                                        </Avatar>
                                    </HStack>

                                    <View marginStart={'auto'} marginEnd={'auto'} my={'$3'}>
                                        <Text
                                            style={{ color: '#0A1629', fontSize: 23 }}
                                            fontFamily='MonaSans_SemiBold'
                                            textAlign='center'
                                            my={'$2'}
                                        >
                                            {userData.name}
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='MonaSans_400Regular'
                                            textAlign='center'
                                        >
                                            +91 {userData.mobile}
                                        </Text>
                                    </View>
                                </View>
                            </Card>


                        </Card>
                    </View>


                    <View style={styles.cardWrapper}>
                        <Card variant='elevated' style={styles.card}>
                            <Card style={{ backgroundColor: '#F4F9FD', borderRadius: 20 }}>
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
                                                    bg={ColorCodes(userData.companyName)}
                                                >
                                                    <AvatarFallbackText className='text-white'>
                                                        {userData.companyName}
                                                    </AvatarFallbackText>

                                                    {/* {userData.profile && (
                                                        <AvatarImage source={{ uri: userData.profile }} />
                                                    )} */}
                                                </Avatar>
                                                <VStack>
                                                    <Heading size='sm' fontFamily='MonaSans_400Regular'>
                                                        {userData.companyName}
                                                    </Heading>
                                                    <Text
                                                        size='sm'
                                                        style={{ color: '#91929E', fontSize: 14 }}
                                                        fontFamily='MonaSans_400Regular'
                                                    >
                                                        {userData.designationName}
                                                    </Text>
                                                </VStack>
                                            </HStack>

                                            <View>
                                                <TouchableOpacity
                                                    style={{
                                                        height: 35,
                                                        width: 35,
                                                        borderRadius: 20,
                                                        backgroundColor: '#F4F9FD',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                // onPress={() =>
                                                //     handlepressEdit(item.cm_id, item.CompanyName)
                                                // }
                                                >
                                                    <EditSvg />
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
                                            {userData.gender}
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
                                            {userData.DOB}
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
                                            {userData.age}
                                        </Text>
                                    </View>
                                </View>


                                <View
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='space-between'
                                    my={'$5'}
                                >
                                    <View style={{ width: '50%' }}>

                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='MonaSans_400Regular'
                                        >
                                            Position
                                        </Text>
                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='MonaSans_400Regular'
                                            isTruncated={true}
                                        >
                                            {userData.designationName}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='MonaSans_400Regular'
                                        >
                                            Email
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='MonaSans_400Regular'
                                        >
                                            {userData.email}
                                        </Text>
                                    </View>

                                    {/* <View>
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
                                            {userData.age}
                                        </Text>
                                    </View> */}
                                </View>



                            </Card>


                        </Card>
                    </View>

                </>


                <FileUpload
                    isOpen={uploadedOpen}
                    onClose={handleCloseUpload}
                    images={handleImageUpload}
                    ClearImage={handleUploadRest}
                />


            </ScrollView >
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

export default ProfileScreen