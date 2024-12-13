import React, { useEffect, useState } from 'react'
import { AvatarImage, Button, Card, HStack, InputIcon, ScrollView, Text } from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { ColorCodes } from '../Components/ColorCodes'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native'
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
import { DatePickerSvg, EditSvg, LocationSvg } from '@/assets/Icons/SvgIcons'
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@gluestack-ui/themed'
import { CloseSvg, Notification } from '@/assets/Icons/SvgIcons'
import { FormControl } from '@gluestack-ui/themed'
import { Input } from '@gluestack-ui/themed'
import { InputField } from '@gluestack-ui/themed'
import { InputSlot } from '@gluestack-ui/themed'
import { ButtonText } from '@gluestack-ui/themed'
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
} from "@gluestack-ui/themed"
import { ChevronDownIcon } from '@gluestack-ui/themed'
import DatePicker from '../Components/DatePicker'
const ProfileScreen = () => {

    console.log(Application.nativeApplicationVersion, 'version');

    const state = store.getState()

    const userid = state.user.userData.user.userid

    const [uploadedOpen, setUploadedOpen] = useState(false)

    const [isModelEdit, setisModelEdit] = useState(false)

    const [DatePickerOpen, setDatePickerOpen] = useState(false)


    const [userData, setUserData] = useState({
        user_id: null,
        name: '',
        email: '',
        gender: '',
        DOB: '',
        dateofbirth: '',
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
                const { user_id, name, email, gender, DOB, dateofbirth, profile,
                    age, mobile, designationName, companyName } = response.data[0]
                setUserData(current => ({
                    ...current, user_id: user_id,
                    name: name, email: email, gender: gender, DOB: DOB, dateofbirth: dateofbirth, profile: profile,
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

    const handleDatepicker = (date) => {

        console.log(date);


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
                                                    onPress={() => setisModelEdit(!isModelEdit)}
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



            <Modal
                isOpen={isModelEdit}
                onClose={() => {
                    setisModelEdit(false)
                }}
                size='full'
                p="$2"
                style={{ borderRadius: 50 }}
            >
                <ModalBackdrop />
                <ModalContent
                    style={{
                        borderRadius: 24,
                        overflow: 'hidden',
                        backgroundColor: 'white' // Ensure background color is consistent
                    }}
                >
                    <ModalHeader>
                        <Heading size='md' className='text-typography-950'>
                            Edit Profile
                        </Heading>
                        <ModalCloseButton>
                            <CloseSvg />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody my={'$1'}>
                        <ScrollView>

                            <View>
                                <Text fontFamily='MonaSans_SemiBold' color='#0A1629'>
                                    Main info
                                </Text>
                            </View>
                            <FormControl p={'$2'} rounded={'$lg'}>
                                <VStack space='xl'>
                                    <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Name
                                        </Text>
                                        <Input rounded={'$xl'}>
                                            <InputField
                                                type='text'
                                                placeholder='Position'
                                                fontFamily='MonaSans_400Regular'
                                                style={{ fontSize: 15 }}
                                                value={userData.name}
                                            />
                                        </Input>
                                    </VStack>

                                    <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Gender
                                        </Text>
                                        <Select
                                            //onValueChange={e => handleChangeInput('gender', e)}
                                            //key={refreshing}
                                            defaultValue={userData.gender}
                                        >
                                            <SelectTrigger
                                                variant='outline'
                                                size='md'
                                                rounded={'$xl'}
                                            >
                                                <SelectInput
                                                    placeholder='Select Position'
                                                    fontFamily='MonaSans_400Regular'
                                                />
                                                <SelectIcon mr='$3' as={ChevronDownIcon} />
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>
                                                    <SelectItem label={'Male'} value={"male"} />
                                                    <SelectItem label={'Female'} value={"female"} />
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>

                                    </VStack>

                                    {/* <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Location
                                        </Text>
                                        <Input rounded={'$xl'}>
                                            <InputField
                                                type='text'
                                                placeholder='Location'
                                                fontFamily='MonaSans_400Regular'
                                                style={{ fontSize: 15 }}
                                                value={userData.}
                                            />

                                            <InputSlot>
                                                <InputIcon
                                                    style={{ width: 20, height: 20, marginRight: 10 }}
                                                >
                                                    <LocationSvg />
                                                </InputIcon>
                                            </InputSlot>
                                        </Input>
                                    </VStack> */}

                                    <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Birthday Date
                                        </Text>
                                        <Input rounded={'$xl'}>
                                            <InputField
                                                type='text'
                                                placeholder='Birthday Date'
                                                onPressIn={() => setDatePickerOpen(true)}
                                                defaultValue={userData.DOB}
                                                //value={NewEmployeeData.dob}
                                                onFocus={() => {
                                                    Keyboard.dismiss()
                                                    setDatePickerOpen(true)
                                                }}
                                            />

                                            <InputSlot>
                                                <InputIcon
                                                    style={{ width: 20, height: 20, marginRight: 10 }}
                                                >
                                                    <DatePickerSvg />
                                                </InputIcon>
                                            </InputSlot>
                                        </Input>
                                    </VStack>

                                    <View>
                                        <Text fontFamily='MonaSans_SemiBold' color='#0A1629'>
                                            Contact Info
                                        </Text>
                                    </View>

                                    <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Email
                                        </Text>
                                        <Input rounded={'$xl'}>
                                            <InputField type='text' defaultValue={userData.email} />
                                        </Input>
                                    </VStack>

                                    <VStack space='xs'>
                                        <Text
                                            fontFamily='MonaSans_Bold'
                                            color='#7D8592'
                                            style={{ fontSize: 14 }}
                                        >
                                            Mobile
                                        </Text>
                                        <Input rounded={'$xl'}>
                                            <InputField type='text' defaultValue={userData.mobile} />
                                        </Input>
                                    </VStack>

                                    <Button rounded={'$xl'}>
                                        <ButtonText fontFamily='MonaSans_SemiBold'>
                                            Save
                                        </ButtonText>
                                    </Button>
                                </VStack>
                            </FormControl>
                        </ScrollView>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <DatePicker
                isOpen={DatePickerOpen}
                onClose={() => setDatePickerOpen(false)}
                SelectedDate={handleDatepicker}
                value={userData.dateofbirth}
                mode={'date'}
            />
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