import React, { useEffect, useState } from 'react'
import { Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import {
  Card,
  Text,
  Button,
  Avatar,
  AvatarImage,
  View,
  Input,
  Actionsheet,
  Center,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  InputSlot,
  InputIcon,
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  InputField,
  ButtonText,
  CheckIcon
} from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { KeyboardAvoidingView } from '@gluestack-ui/themed'
// import emptyprofile from '../assets/emptyprofile.png'
import axios from 'axios'
import config from '../config'
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  Pressable,
  Icon,
  CloseIcon
} from '@gluestack-ui/themed'

const EmployeeProfile = ({ userData, updateUserData }) => {
  const toast = useToast()
  const [imageBase64, setImageBase64] = useState(null)
  const [employeeName, setEmployeeName] = useState(null)
  const [inputName, setInputName] = useState(null)
  const [showActionsheet, setShowActionsheet] = useState(false)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    })

    if (!result.cancelled) {
      try {
        const image = result.assets.map(data => data.base64)
        setImageBase64(image[0])
        const status = 'p'
        updateEmployeeProfileInDB(image[0], status)
      } catch (err) {
        Alert.alert('User Cancel Profile Photo Update')
      }
    } else {
      setImageBase64(null)
    }
  }

  const handleClose = () => setShowActionsheet(!showActionsheet)

  const handleSave = async () => {
    setEmployeeName(inputName)
    setShowActionsheet(false)
    try {
      const status = 'n'
      await updateEmployeeProfileInDB(inputName, status)
    } catch (error) {
      setEmployeeName(employeeName)
      Alert.alert('Failed to update name. Please try again.')
    }
  }

  const updateEmployeeProfileInDB = async (data, status) => {
    if (status === 'p' || status === 'n') {
      try {
        const sendata = { data, usercode: userData.usercode, status }
        const response = await axios.put(
          `${config.API_URL}/update-profiledata`,
          sendata
        )
        if (response.status === 200) {
          toast.show({
            placement: 'top',
            render: ({ id }) => {
              const toastId = 'toast-' + id
              return (
                <Toast bg='$success700' nativeID={toastId}>
                  <Icon as={CheckIcon} color='$white' mt='$1' mr='$3' />
                  <VStack space='xs'>
                    <ToastTitle>Update SuccessFully</ToastTitle>
                    <ToastDescription color='$black'>
                      {response.data.message}
                    </ToastDescription>
                  </VStack>
                  <Pressable mt='$1' onPress={() => toast.close(id)}>
                    <Icon as={CloseIcon} />
                  </Pressable>
                </Toast>
              )
            }
          })
          updateUserData(
            status === 'p' ? { userimage: data } : { username: data }
          )
        }
      } catch (err) {
        Alert.alert('Failed to update Profile Image. Please try again.')
      }
    }
  }

  const employeeProfileData = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/employeeProfileData?usercode=${userData.usercode}`
      )
      const { userimage, username } = response.data[0]
      setImageBase64(userimage)
      setInputName(username)
      setEmployeeName(username)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    employeeProfileData()
  }, [])

  return (
    <>
      <Card style={styles.card} my={'$10'} m={'$2'}>
        <View style={styles.avatarContainer}>
          <Avatar bgColor='$indigo600' size='2xl' position='relative'>
            {/* <AvatarImage
              source={
                imageBase64
                  ? `data:image/jpeg;base64,${imageBase64}`
                  : emptyprofile
              }
              alt='EmployeeProfile'
            /> */}
            <View style={styles.iconContainer}>
              <TouchableOpacity style={[styles.button]} onPress={pickImage}>
                <FontAwesome5 name='user-edit' size={15} color='black' />
              </TouchableOpacity>
            </View>
          </Avatar>
        </View>

        <View
          my={'$10'}
          display='flex'
          flexDirection='row'
          mx={'$10'}
          w={'$80'}
          $web-justifyContent='space-between'
        >
          <View position='absolute' top={'$3'} left={'$0'}>
            <FontAwesome5 name='user' size={24} color='black' />
          </View>

          <View marginLeft={'$10'}>
            <Text fontFamily='Inter_500Medium'>Name</Text>
            <Text fontFamily='Inter_500Medium'>{employeeName}</Text>
          </View>

          <View marginStart={'auto'} mt={'$3'}>
            <MaterialIcons
              name='mode-edit'
              size={24}
              color='black'
              onPress={handleClose}
            />
          </View>
        </View>
      </Card>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={{ flex: 1, zIndex: 999 }}
      >
        <Center h='100%' zIndex={999}>
          <Actionsheet
            isOpen={showActionsheet}
            onClose={handleClose}
            zIndex={999}
          >
            <ActionsheetBackdrop />
            <ActionsheetContent maxHeight='75%' zIndex={999}>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <VStack w='$full' p={20}>
                <FormControl mt={36}>
                  <FormControlLabel>
                    <FormControlLabelText>Enter Your Name</FormControlLabelText>
                  </FormControlLabel>
                  <Input w='$full' variant='underlined'>
                    <InputSlot>
                      <InputIcon as={InputIcon} ml='$2' />
                    </InputSlot>
                    <InputField
                      value={inputName}
                      defaultValue={inputName}
                      onChangeText={setInputName}
                    />
                  </Input>
                  <View
                    display='flex'
                    flexDirection='row'
                    alignItems='flex-end'
                    justifyContent='flex-end'
                    gap={'$5'}
                  >
                    <Button
                      mt={20}
                      variant='outline'
                      action='secondary'
                      onPress={() => setShowActionsheet(false)}
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                      mt={20}
                      bg='$green600'
                      action='positive'
                      onPress={() => handleSave()}
                    >
                      <ButtonText>Save</ButtonText>
                    </Button>
                  </View>
                </FormControl>
              </VStack>
            </ActionsheetContent>
          </Actionsheet>
        </Center>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16
  },
  avatarContainer: {
    alignItems: 'center'
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    right: -3,
    borderRadius: 120,
    backgroundColor: 'green'
  },
  button: {
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#259c70',
    transition: 'background-color 0.3s ease',
    height: 35,
    width: 35
  }
})

export default EmployeeProfile
