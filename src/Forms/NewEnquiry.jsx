import {
  AlertCircleIcon,
  Badge,
  Button,
  ButtonText,
  Card,
  Center,
  FormControlErrorIcon,
  HStack,
  Input,
  InputField,
  KeyboardAvoidingView,
  Text,
  Textarea,
  TrashIcon
} from '@gluestack-ui/themed'
import { ScrollView, View, FormControl, VStack } from '@gluestack-ui/themed'
import React, { useCallback, useEffect, useState } from 'react'
import FileUpload from '../Components/FileUpload'
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Selects from '../Components/Select'
import { TextareaInput } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { FormControlErrorText } from '@gluestack-ui/themed'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Locations from '../Components/Location'
import { RefreshControl } from '@gluestack-ui/themed'
import DatePicker from '../Components/DatePicker'
import Alerts from '../Components/Alert'
import CalendarEventCreator from '../Components/CalendarEventCreator'
import { Box } from '@gluestack-ui/themed'
import { BadgeText } from '@gluestack-ui/themed'
import Ionicons from '@expo/vector-icons/Ionicons'
import { onBackPress } from '../Hooks/useBackHandler'
import { Image } from 'react-native'
import { Icon } from '@gluestack-ui/themed'
import { AttachPinSvg } from '@/assets/Icons/SvgIcons'
import ImagePreview from '../Components/ImagePreview'

const NewEnquiry = () => {
  const focus = useIsFocused()

  const [EnquiryData, SetEnquiryData] = useState({
    company_name: '',
    client_name: '',
    contact: '',
    email: '',
    services: '',
    visit_type: '',
    images: '',
    Followup_type: '',
    followup_Date: '',
    client_address: '',
    latitude: '',
    longitude: '',
    CallStatus: '',
    Remarks: ''
  })

  const [uploadedOpen, setUploadedOpen] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  const [DatePickerOpen, setDatePickerOpen] = useState(false)

  const [isActionsheetOpen, setIsActionsheetOpen] = useState(false)

  const [refreshData, setRefreshData] = useState(false)

  const [isImageViewer, setisImageViewer] = useState(false)

  // const calendar = CalendarEventCreator({
  //   title,
  //   startDate: EnquiryData.followup_Date,
  //   notes
  // })
  // const handleCreateEvent = () => {
  //   if (!followUpDate || !title) {
  //     alert('Please fill in all fields.')
  //     return
  //   }
  //   calendar.createEvent()
  // }

  const handleCloseActionsheet = () => {
    setIsActionsheetOpen(false) // Properly closing the Actionsheet
  }

  const handleOpenUpload = () => {
    setUploadedOpen(true) // Open the upload sheet when button is clicked
  }

  const handleCloseUpload = () => {
    setUploadedOpen(false)
  }

  const handleChangeInput = (name, value) => {
    const processedValue = typeof value === 'string' ? value.trim() : value

    SetEnquiryData(prevData => ({
      ...prevData,
      [name]: processedValue
    }))

    if (name === 'visit_type' && value === 'LiveVisit') {
      setIsActionsheetOpen(true)
    }

    if (name === 'Followup_type' && value === 'Followup') {
      setDatePickerOpen(true)
    }
  }

  const handleImageUpload = async image => {
    SetEnquiryData(prevData => ({
      ...prevData,
      images: image
    }))
  }

  const handleUploadRest = async image => {
    SetEnquiryData(prevData => ({
      ...prevData,
      images: ''
    }))
  }

  const handleDatepicker = async Date => {
    SetEnquiryData(prevData => ({
      ...prevData,
      followup_Date: Date
    }))
  }

  const handleLocation = async location => {
    SetEnquiryData(prevData => ({
      ...prevData,
      latitude: location.latitude,
      longitude: location.longitude
    }))
  }

  const [errors, setErrors] = useState({
    company_name: '',
    client_name: '',
    contact: '',
    email: '',
    services: '',
    visit_type: '',
    Followup_type: '',
    followup_Date: '',
    client_address: '',
    images: '',
    location: '',
    CallStatus: '',
    Remarks: ''
  })

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const validate = () => {
    let isValid = true
    const newErrors = {}

    if (!EnquiryData.company_name.trim()) {
      newErrors.company_name = 'Company Name is required'
      isValid = false
    }

    if (!EnquiryData.client_name.trim()) {
      newErrors.client_name = 'Client Name is required'
      isValid = false
    }

    if (
      !EnquiryData.contact ||
      !EnquiryData.contact.trim() ||
      !/^\d{10}$/.test(EnquiryData.contact.trim())
    ) {
      newErrors.contact = 'Valid Contact Number is required (10 digits)'
      isValid = false
    }

    if (
      !EnquiryData.email ||
      typeof EnquiryData.email !== 'string' ||
      !EnquiryData.email.trim() ||
      !/\S+@\S+\.\S+/.test(EnquiryData.email.trim())
    ) {
      newErrors.email = 'Valid Email is required'
      isValid = false
    }

    // Check if 'services' is provided and not empty
    if (EnquiryData.services === '') {
      newErrors.services = 'Service Need is required'
      isValid = false
    }

    // Check if 'visit_type' is provided and not empty
    if (EnquiryData.visit_type === '') {
      newErrors.visit_type = 'Visit Type is required'
      isValid = false
    }

    if (EnquiryData.visit_type === 'TeleCall' && newErrors.CallStatus === '') {
      newErrors.CallStatus = 'Please Select TeleCall Status'

      isValid = false
    }

    // Check if 'Followup_type' is provided and not empty
    if (EnquiryData.Followup_type === '') {
      newErrors.Followup_type = 'Follow Up Type is required'
      isValid = false
    }

    // Check if 'Followup_type' is 'Followup' and 'followup_Date' is provided
    if (
      EnquiryData.Followup_type === 'Followup' &&
      (!EnquiryData.followup_Date || !EnquiryData.followup_Date.trim())
    ) {
      newErrors.followup_Date = 'Followup Date is required'
      isValid = false
    }

    // Check if 'client_address' is provided and not empty
    if (!EnquiryData.client_address || !EnquiryData.client_address.trim()) {
      newErrors.client_address = 'Client Address is required'
      isValid = false
    }

    if (
      EnquiryData.visit_type === 'LiveVisit' &&
      (!EnquiryData.images || !EnquiryData.images.trim())
    ) {
      newErrors.images = 'Visited Images is required'
      isValid = false
    }

    if (
      EnquiryData.visit_type === 'LiveVisit' &&
      (!EnquiryData.latitude || !EnquiryData.longitude)
    ) {
      newErrors.images = 'Visited Images is required'
      isValid = false
    }

    if (EnquiryData.visit_type === 'LiveVisit') {
      const isLocationDataMissing =
        !EnquiryData.latitude || !EnquiryData.longitude

      if (isLocationDataMissing) {
        // Prompt the user with a validation message for missing location data
        newErrors.location =
          'Location capture is required to proceed with the visit'
        isValid = false

        setIsActionsheetOpen(true)
      }
    }

    if (EnquiryData.Remarks === '') {
      newErrors.Remarks = 'Remarks is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const restInputs = () => {
    setErrors(prevData => ({
      ...prevData,
      company_name: '',
      client_name: '',
      contact: '',
      email: '',
      services: '',
      visit_type: '',
      Followup_type: '',
      followup_Date: '',
      client_address: '',
      images: '',
      location: '',
      CallStatus: '',
      Remarks: ''
    }))
    SetEnquiryData(preData => ({
      ...preData,
      company_name: '',
      client_name: '',
      contact: '',
      email: '',
      services: '',
      visit_type: '',
      images: '',
      Followup_type: '',
      followup_Date: '',
      client_address: '',
      latitude: '',
      longitude: '',
      CallStatus: '',
      Remarks: ''
    }))

    setAlertProps(preData => ({
      ...preData,
      alertType: '',
      content: '',
      renderType: '',
      visible: false
    }))
  }

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await api.post('/client-vist/newenquiry', EnquiryData)
        setAlertProps({
          alertType: 'Success',
          content: 'Your enquiry has been submitted successfully!',
          renderType: 'toast',
          visible: true
        })
        restInputs()
        setRefreshData(prevState => !prevState)
      } catch (error) {
        console.error(
          'API Error:',
          error.response?.data?.error || error.message
        )
        setAlertProps({
          alertType: 'Error',
          content:
            error.response?.data?.error ||
            'Something went wrong, please try again.',
          renderType: 'toast',
          visible: true
        })
      }
    } else {
      setAlertProps({
        alertType: 'Warning',
        content: 'Please ensure all required fields are filled correctly.',
        renderType: 'toast',
        visible: true
      })
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setRefreshData(true)
    restInputs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ backgroundColor: '#F4F9FD' }}
      >
        <Card
          variant='elevated'
          mx={'$1'}
          my={'$1'}
          rounded={'$2xl'}
          style={styles.card}
          bg='#F4F9FD'
        >
          <FormControl
            //p={'$1'}
            rounded={'$sm'}
            $web-w={'$full'}
            $web-marginStart={'auto'}
            $web-marginEnd={'auto'}
          >
            <HStack
              my={'$2'}
              flexDirection='row'
              justifyContent='space-evenly'
              gap={'$2'}
              style={{ width: '100%', padding: '0%' }}
            >
              <View style={{ width: '50%' }}>
                <Text fontFamily='MonaSans_400Regular'>
                  Company Name <Text color='$red700'>*</Text>
                </Text>
                <Input mt={'$1'} style={{ height: 45, borderRadius: 14 }}>
                  <InputField
                    type='text'
                    value={EnquiryData.company_name}
                    onChangeText={text =>
                      handleChangeInput('company_name', text)
                    }
                  />
                </Input>

                {errors.company_name && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.company_name}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>

              <View style={{ width: '50%' }}>
                <Text fontFamily='MonaSans_400Regular'>
                  Client Name <Text color='$red700'>*</Text>
                </Text>
                <Input mt={'$1'} style={{ height: 45, borderRadius: 14 }}>
                  <InputField
                    type='text'
                    value={EnquiryData.client_name}
                    onChangeText={text =>
                      handleChangeInput('client_name', text)
                    }
                  />
                </Input>

                {errors.client_name && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>
                      {errors.client_name}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>
            </HStack>

            <HStack
              my={'$2'}
              flexDirection='row'
              justifyContent='space-evenly'
              gap={'$2'}
              style={{ width: '100%', padding: '0%' }}
            >
              <View style={{ width: '50%' }}>
                <Text fontFamily='MonaSans_400Regular'>
                  Contact No <Text color='$red700'>*</Text>
                </Text>
                <Input mt={'$1'} style={{ height: 45, borderRadius: 14 }}>
                  <InputField
                    type='text'
                    keyboardType='phone-pad'
                    value={EnquiryData.contact}
                    onChangeText={text => handleChangeInput('contact', text)}
                  />
                </Input>

                {errors.contact && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>
                      {errors.contact}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>
              <View style={{ width: '50%' }}>
                <Text fontFamily='MonaSans_400Regular'>
                  Email <Text color='$red700'>*</Text>
                </Text>
                <Input mt={'$1'} style={{ height: 45, borderRadius: 14 }}>
                  <InputField
                    type='text'
                    value={EnquiryData.email}
                    onChangeText={text => handleChangeInput('email', text)}
                  />
                </Input>

                {errors.email && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                  </HStack>
                )}
              </View>
            </HStack>

            <HStack
              my={'$5'}
              flexDirection='row'
              justifyContent='space-evenly'
              gap={'$2'}
              style={{ width: '100%', padding: '0%' }}
            >
              <View style={{ width: '50%' }}>
                <Text mb={'$1'} fontFamily='MonaSans_400Regular'>
                  Service Need <Text color='$red700'>*</Text>
                </Text>
                <Selects
                  selectype={'Services'}
                  refreshData={refreshData}
                  onChangeText={value => handleChangeInput('services', value)}
                  color='$coolGray300'
                />

                {errors.services && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>
                      {errors.services}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>
              <View style={{ width: '50%' }}>
                <Text mb={'$1'} fontFamily='MonaSans_400Regular'>
                  Mode <Text color='$red700'>*</Text>
                </Text>
                <Selects
                  selectype={'Visittype'}
                  refreshData={refreshData}
                  onChangeText={value => handleChangeInput('visit_type', value)}
                  color='$coolGray300'
                />

                {errors.visit_type && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>
                      {errors.visit_type}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>
            </HStack>

            <HStack
              my={'$2'}
              flexDirection='row'
              justifyContent='space-evenly'
              gap={'$2'}
              style={{ width: '100%', padding: '0%' }}
              display={EnquiryData.visit_type === 'TeleCall' ? 'flex' : 'none'}
            >
              <View style={{ width: '100%' }}>
                <Text fontFamily='MonaSans_400Regular'>
                  Call Status <Text color='$red700'>*</Text>
                </Text>
                <Selects
                  selectype={'CallStatus'}
                  refreshData={refreshData}
                  onChangeText={value => handleChangeInput('CallStatus', value)}
                />

                {errors.CallStatus && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      mt={'$1'}
                      size='xs'
                    />
                    <FormControlErrorText
                      fontSize={'$sm'}
                      fontFamily='MonaSans_400Regular'
                    >
                      {errors.CallStatus}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>
            </HStack>

            <HStack
              my={'$2'}
              flexDirection='row'
              justifyContent='space-evenly'
              gap={'$2'}
              style={{ width: '100%', padding: '0%' }}
            >
              <View
                style={{
                  width:
                    EnquiryData.Followup_type === 'Followup' ? '50%' : '100%'
                }}
              >
                <Text mb={'$1'} fontFamily='MonaSans_400Regular'>
                  Followup Type <Text color='$red700'>*</Text>
                </Text>

                <Selects
                  selectype={'FollowupType'}
                  refreshData={refreshData}
                  onChangeText={value =>
                    handleChangeInput('Followup_type', value)
                  }
                  page={'NewEnquiry'}
                  color='$coolGray300'
                />

                {errors.Followup_type && (
                  <HStack flexDirection='row' gap={'$1'}>
                    <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                    <FormControlErrorText>
                      {errors.Followup_type}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>

              {EnquiryData.Followup_type === 'Followup' && (
                <>
                  <View style={{ width: '50%' }}>
                    <DatePicker
                      isOpen={DatePickerOpen}
                      onClose={() => setDatePickerOpen(false)}
                      SelectedDate={handleDatepicker}
                      mode='datetime'
                    />
                    <Text mt={'$1'}>
                      FollowUp Date <Text color='$red700'>*</Text>
                    </Text>
                    <Input>
                      <InputField
                        type='text'
                        value={EnquiryData.followup_Date}
                        onFocus={() => {
                          Keyboard.dismiss()
                          setDatePickerOpen(true)
                        }}
                        onPressIn={() => setDatePickerOpen(true)}
                      />
                    </Input>

                    {errors.followup_Date && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.followup_Date}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </View>
                </>
              )}
            </HStack>

            <VStack space='xs' my={'$2'}>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                style={{ borderRadius: 14 }}
              >
                <TextareaInput
                  placeholder='Enter Client Address...'
                  fontFamily='MonaSans_400Regular'
                  value={EnquiryData.client_address}
                  onChangeText={text =>
                    handleChangeInput('client_address', text)
                  }
                />
              </Textarea>

              {errors.client_address && (
                <HStack flexDirection='row' gap={'$1'}>
                  <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                  <FormControlErrorText>
                    {errors.client_address}
                  </FormControlErrorText>
                </HStack>
              )}
            </VStack>

            <VStack space='xs' my={'$2'}>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                style={{ borderRadius: 14 }}
              >
                <TextareaInput
                  placeholder='Enter Remarks...'
                  fontFamily='MonaSans_400Regular'
                  value={EnquiryData.Remarks}
                  onChangeText={text => handleChangeInput('Remarks', text)}
                />
              </Textarea>

              {errors.Remarks && (
                <HStack flexDirection='row' gap={'$1'}>
                  <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                  <FormControlErrorText>{errors.Remarks}</FormControlErrorText>
                </HStack>
              )}
            </VStack>

            {/* Button to trigger the file upload sheet */}
            <VStack
              space='xs'
              display={EnquiryData.visit_type === 'LiveVisit' ? 'flex' : 'none'}
            >
              {/* <TouchableOpacity>
                <Button onPress={handleOpenUpload}>
                  <ButtonText>Upload Photo</ButtonText>
                </Button>
              </TouchableOpacity> */}

              {/* <Box
                alignItems='center'
                mt={EnquiryData.images !== '' ? '$4' : '$6'}
              >
                <VStack>
                  {EnquiryData.images !== '' && (
                    <>
                      <Badge
                        bg='$red600'
                        style={{
                          zIndex: 10
                        }}
                        h={'$6'}
                        w={'$6'}
                        mb={'-$3.5'}
                        mr={'-$1.5'}
                        rounded={'$full'}
                        zIndex={10}
                        alignSelf='flex-end'
                        variant='solid'
                      >
                        <BadgeText color='white'>1</BadgeText>
                      </Badge>
                    </>
                  )}
                  <Button gap={'$1'} onPress={() => setUploadedOpen(true)}>
                    <Ionicons name='attach-outline' size={24} color='black' />
                    <ButtonText color='black' fontFamily='MonaSans_400Regular'>
                      Attach File
                    </ButtonText>
                  </Button>
                </VStack>
              </Box> */}

              {EnquiryData.images === '' && (
                <TouchableOpacity onPress={() => setUploadedOpen(true)}>
                  <Box
                    bg='#DCEEFC'
                    alignItems='center'
                    justifyContent='center'
                    my='$5'
                    style={{ borderRadius: 14, height: 54 }}
                  >
                    <View display='flex' flexDirection='row' gap='$3'>
                      <AttachPinSvg />
                      <Text color={'#0A1629'} fontFamily='NunitoSans_Regular'>
                        Attached files For Client Visit
                      </Text>
                    </View>
                  </Box>
                </TouchableOpacity>
              )}

              {EnquiryData.images !== '' && (
                <Box
                  bg='#FFFFFF'
                  style={{
                    borderRadius: 14,
                    height: 70,
                    borderWidth: 1,
                    borderColor: '#D8DDE5'
                  }}
                >
                  <HStack my='$3' mx='$2'>
                    <View display='flex' flexDirection='row'>
                      <TouchableOpacity onPress={() => setisImageViewer(true)}>
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${EnquiryData.images}`
                          }}
                          style={{
                            height: 44,
                            width: 44,
                            borderRadius: 14
                          }}
                        />
                      </TouchableOpacity>

                      <VStack
                        mx='$4'
                        w={
                          uploadfileDatas.filename.length > 40 ? '$56' : 'auto'
                        }
                      >
                        <Text
                          fontFamily='NunitoSans_Bold'
                          style={{ fontSize: 12 }}
                        >
                          {uploadfileDatas.filename}
                        </Text>
                        <Text
                          fontFamily='NunitoSans_Regular'
                          style={{ fontSize: 12 }}
                        >
                          {uploadfileDatas.size}
                        </Text>
                      </VStack>
                    </View>

                    <View>
                      <TouchableOpacity onPress={handleUploadRest}>
                        <Icon as={TrashIcon} size='md' color='red' />
                      </TouchableOpacity>
                    </View>
                  </HStack>
                </Box>
              )}

              {errors.images && (
                <HStack flexDirection='row' gap={'$1'}>
                  <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                  <FormControlErrorText>{errors.images}</FormControlErrorText>
                </HStack>
              )}
            </VStack>

            {/* Button to collect and submit data */}
            <VStack space='xs' mt='$2' mb={'$16'}>
              <TouchableOpacity>
                <Button onPress={() => handleSubmit()} rounded={'$2xl'}>
                  <ButtonText fontFamily='MonaSans_Bold'>
                    Register Client
                  </ButtonText>
                </Button>
              </TouchableOpacity>

              {errors.location && (
                <HStack flexDirection='row' gap={'$1'}>
                  <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                  <FormControlErrorText>{errors.location}</FormControlErrorText>
                </HStack>
              )}
            </VStack>
          </FormControl>
        </Card>
      </ScrollView>

      {/* Show the file upload modal when the button is pressed */}

      <FileUpload
        isOpen={uploadedOpen}
        onClose={handleCloseUpload}
        images={handleImageUpload} // Pass image upload handler
        ClearImage={handleUploadRest}
        fileData={(filename, size) => uploadFileData(filename, size)}
      />

      <View
        bg='$yellow100'
        w={'$full'}
        display={EnquiryData.visit_type === 'LiveVisit' ? 'flex' : 'none'}
      >
        <Locations
          isOpen={isActionsheetOpen}
          locationGet={handleLocation}
          onClose={handleCloseActionsheet}
        />
      </View>

      <View>
        <Center>
          {alertProps.visible && (
            <Alerts
              alertType={alertProps.alertType}
              content={alertProps.content}
              renderType={alertProps.renderType}
              visible={alertProps.visible}
              onClose={isVisible =>
                setAlertProps(prev => ({ ...prev, visible: isVisible }))
              }
            />
          )}
        </Center>
      </View>

      <ImagePreview
        imageBase64={EnquiryData.images}
        modalVisible={isImageViewer}
        closeModal={() => setisImageViewer(false)}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  Form: {
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

export default NewEnquiry
