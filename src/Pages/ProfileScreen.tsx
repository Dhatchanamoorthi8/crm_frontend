import React, { useEffect, useState } from 'react'
import { AvatarImage, Button, Card, HStack, InputIcon, ScrollView, Text } from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { ColorCodes } from '../Components/ColorCodes'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { Alert, Keyboard, StyleSheet, TouchableOpacity } from 'react-native'
import api from '../Services/axiosConfig'
import Feather from '@expo/vector-icons/Feather';
import { AvatarBadge } from '@gluestack-ui/themed'
import { Heading } from '@gluestack-ui/themed'
import { Divider } from '@gluestack-ui/themed'
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
import { ButtonText, } from '@gluestack-ui/themed'
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
import { updateUserData } from '../../Slices/userSlice';
import { useDispatch, useSelector } from 'react-redux'

import { useIsFocused } from '@react-navigation/native'
import debounce from 'lodash.debounce';


import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetIcon,
} from '@gluestack-ui/themed';
import { Image } from '@gluestack-ui/themed'
import Avatar3D from '../Components/Avatar3D'
import { Center } from '@gluestack-ui/themed'
import Spinner from 'react-native-loading-spinner-overlay'



const uploadImg = require("@/assets/Icons/TaskIcons/12.png")
const avatarImg = require("@/assets/Icons/41.png")

const ProfileScreen = () => {

    const dispatch = useDispatch();

    const focus = useIsFocused();

    const globalData = useSelector((state) => state?.user.userData);

    const userid = useSelector((state) => state.user.userData?.user.userid);


    const [uploadedOpen, setUploadedOpen] = useState(false)

    const [isModelEdit, setisModelEdit] = useState(false)

    const [DatePickerOpen, setDatePickerOpen] = useState(false)

    const [isprofileDrawer, setisprofileDrawer] = useState(false)

    const [isloader, setisloader] = useState(false)


    const [isAvatar3D, setisAvatar3D] = useState(false)

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
        setisloader(true)
        try {
            const response = await api.get(`users/${userid}`)

            if (response.status === 200) {
                const { user_id, name, email, gender, DOB, dateofbirth, profile,
                    age, mobile, designationName, companyName } = response.data[0]
                setUserData(current => ({
                    ...current,
                    user_id,
                    name, email, gender, DOB, dateofbirth, profile,
                    age, mobile, designationName, companyName
                }))

                setisloader(false)
                seterrorMsg(false)
                return
            }

            seterrorMsg(true)

        } catch (error) {
            console.log(error);
            setisloader(false)
        }
    }


    const handleCloseUpload = () => {
        setUploadedOpen(false)
    }

    const handleImageUpload = async (image: string) => {
        setisloader(true);
        try {
            const response = await api.post(`users/UpdateUserprofile/${userData.user_id}?mood=profileimg`, { image });

            if (response.status === 201) {
                const updatedProfileData = {
                    ...globalData,
                    user: {
                        ...globalData.user,
                        profile: image || globalData.user.profile,
                    },
                };

                setUserData(prevData => ({
                    ...prevData,
                    profile: image,
                }));

                dispatch(updateUserData(updatedProfileData));
                await fetchUserData();
                Alert.alert('Success', 'Your profile image has been updated successfully.');
            } else {
                console.error('Unexpected response:', response);
                Alert.alert('Error', 'Failed to update profile image.');
            }
        } catch (error) {
            console.error('Error updating profile image:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update profile image. Please try again.');
        } finally {
            setisloader(false); // Ensure loader is always turned off
        }
    };



    const handleUploadRest = async image => {
        //console.log(image)
    }

    const handleDatepicker = (date) => {
        setUserData(prevData => ({
            ...prevData,
            DOB: date
        }))
    }


    const handleChangeInput = debounce((name, value) => {
        const processedValue = typeof value === 'string' ? value.trim() : value;
        setUserData(prevData => ({
            ...prevData,
            [name]: processedValue,
        }));
    }, 300);


    const handleSave = async () => {
        setisloader(true)
        try {
            const response = await api.post(`users/UpdateUserprofile/${userData.user_id}?mood=profileDetails`, userData)
            if (response.status === 201) {
                const updatedProfileData = {
                    ...globalData,
                    user: {
                        ...globalData.user,
                        username: userData.name || globalData.user.username,
                        email: userData.email || globalData.user.email
                    }
                }
                dispatch(updateUserData(updatedProfileData));
                fetchUserData();
                setisModelEdit(false)
                setisloader(false)
                Alert.alert('Success', 'Your profile Details has been updated successfully.');
            }
        } catch (error) {
            setisloader(false)
            console.log(error);

        }
    }

    useEffect(() => {
        if (focus) {
            fetchUserData()
        }

    }, [focus])


    const [uploadfileDatas, setuploadfileDatas] = useState({
        filename: '',
        size: ''
    })
    const uploadFileData = (filename, size) => {
        setuploadfileDatas(current => ({
            ...current,
            filename: filename,
            size: size
        }))
    }


    return (
        <>
            <ScrollView style={{ backgroundColor: '#F4F9FD' }} >

                <>
                    <View style={styles.cardWrapper}>
                        <Card variant='elevated' style={styles.card}>
                            <Card style={{ backgroundColor: '#F4F9FD', borderRadius: 20 }}>
                                <View>
                                    <HStack space='md' justifyContent='center'>

                                        <TouchableOpacity onPress={() => setisprofileDrawer(true)}>
                                            <Avatar
                                                className='bg-indigo-600'
                                                bg={ColorCodes(userData.name)}
                                                size='2xl'
                                            >
                                                <AvatarFallbackText className='text-white'>
                                                    {userData.name}
                                                </AvatarFallbackText>

                                                {userData.profile && (
                                                    <AvatarImage source={{ uri: `data:image/png;base64,${userData.profile}` }} alt={'User Avatar'} />
                                                )
                                                }




                                                <AvatarBadge h="$10" w="$10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                    <TouchableOpacity onPress={() => setisprofileDrawer(true)}>
                                                        <Feather name="camera" size={20} color="white" />
                                                    </TouchableOpacity>
                                                </AvatarBadge >


                                            </Avatar>
                                        </TouchableOpacity >

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
                                                    bg={ColorCodes(userData.companyName)}
                                                >
                                                    <AvatarFallbackText >
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

                                    <View w='$40'>
                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='MonaSans_400Regular'
                                        >
                                            Email
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='MonaSans_400Regular'
                                            isTruncated={true}

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
                    fileData={(filename, size) => uploadFileData(filename, size)}
                />
                <Avatar3D
                    isOpen={isAvatar3D}
                    onClose={() => setisAvatar3D(false)}
                    images={handleImageUpload}
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
                                                defaultValue={userData.name}
                                                onChangeText={value => handleChangeInput('name', value)}
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
                                            onValueChange={value => handleChangeInput('gender', value)}
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
                                            <InputField type='text' defaultValue={userData.email} onChangeText={value => handleChangeInput('email', value)} />
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
                                            <InputField type='text' keyboardType='phone-pad' defaultValue={userData.mobile} onChangeText={value => handleChangeInput('mobile', value)} />
                                        </Input>
                                    </VStack>

                                    <Button rounded={'$xl'} onPress={handleSave}>
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



            <Actionsheet isOpen={isprofileDrawer} onClose={() => setisprofileDrawer(false)} snapPoints={[20]}>
                <ActionsheetBackdrop />
                <ActionsheetContent >
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <View flex={1} flexDirection='row' mt="$5" mb="$10" alignItems="flex-start" gap="$10">
                        <View>
                            <TouchableOpacity onPress={() => setUploadedOpen(true)}>
                                <Image source={uploadImg} style={{ height: 70, width: 70 }} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setisAvatar3D(true)}>
                                <Image source={avatarImg} style={{ height: 70, width: 70 }} />
                            </TouchableOpacity>
                        </View>
                    </View>


                </ActionsheetContent>
            </Actionsheet>

            <Center>
                <Spinner visible={isloader} spinnerKey='Loading...' size="large" />
            </Center>
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