import React, { useCallback, useEffect, useState } from 'react'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native'
import {
  AlertCircleIcon,
  Avatar,
  AvatarFallbackText,
  Box,
  Button,
  ButtonText,
  Card,
  FormControl,
  HStack,
  Icon,
  Input,
  Pressable,
  ScrollView,
  TrashIcon,
  View,
  VStack
} from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { useIsFocused } from '@react-navigation/native'
import Selects from '../Components/Select'
import { LinearGradient } from 'expo-linear-gradient'
import Contact from '../Components/Contact'
import Locations from '../Components/Location'
import DatePicker from '../Components/DatePicker'
import { RefreshControl } from '@gluestack-ui/themed'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Badge } from '@gluestack-ui/themed'
import { BadgeText } from '@gluestack-ui/themed'
import FileUpload from '../Components/FileUpload'
import { Textarea } from '@gluestack-ui/themed'
import { TextareaInput } from '@gluestack-ui/themed'
import { FormControlErrorIcon } from '@gluestack-ui/themed'
import { FormControlErrorText } from '@gluestack-ui/themed'
import { Center } from '@gluestack-ui/themed'
import Alerts from '../Components/Alert'
import { StyleSheet } from 'react-native'
import { ColorCodes } from '../Components/ColorCodes'
import { Divider } from '@gluestack-ui/themed'
import { Heading } from '@gluestack-ui/themed'
import { InputField } from '@gluestack-ui/themed'
import { AttachPinSvg } from '@/assets/Icons/SvgIcons'

const FollowupEnquiry = ({ route, navigation }) => {


  const { Props } = route.params
 

  const focus = useIsFocused()

  const [ClientData, SetClientData] = useState({})

  const [isActionsheetOpen, setIsActionsheetOpen] = useState(false)

  const [isLocationOpen, setisLocationOpen] = useState(false)

  const [DatePickerOpen, setDatePickerOpen] = useState(false)

  const [refreshData, setRefreshData] = useState(false)

  const [uploadedOpen, setUploadedOpen] = useState(false)

  const fetchData = async () => {
    try {
      const response = await api.get(`client-vist/FollowpGetOne/${Props.id}`)

      SetClientData(response.data.followUp[0])
    } catch (error) {
      console.log(error)
    }
  }

  const [FollowupData, SetFollowupData] = useState({
    Services: '',
    visit_type: '',
    images: '',
    Followup_type: '',
    followup_Date: '',
    latitude: '',
    longitude: '',
    CallStatus: '',
    TeleCallMode: '',
    Remarks: ''
  })

  const [errors, setErrors] = useState({
    Services: '',
    visit_type: '',
    images: '',
    Followup_type: '',
    followup_Date: '',
    latitude: '',
    longitude: '',
    CallStatus: '',
    TeleCallMode: '',
    Remarks: ''
  })

  const handleImageUpload = async image => {
    SetFollowupData(prevData => ({
      ...prevData,
      images: image
    }))
  }

  const handleUploadRest = async image => {
    SetFollowupData(prevData => ({
      ...prevData,
      images: ''
    }))
  }

  const [refreshing, setRefreshing] = useState(false)

  const handleChangeInput = (name, value) => {
 

    SetFollowupData(preData => ({ ...preData, [name]: value }))

    if (name === 'visit_type' && value === 'TeleCall') {
      setIsActionsheetOpen(true)
    }

    if (name === 'visit_type' && value === 'LiveVisit') {
      setisLocationOpen(!isLocationOpen)
    }
    if (name === 'Followup_type' && value === 'Followup') {
      setDatePickerOpen(true)
    }
  }

  const handleLocation = async location => {
    SetFollowupData(prevData => ({
      ...prevData,
      latitude: location.latitude,
      longitude: location.longitude
    }))

  }

  const handleDatepicker = async Date => {
    SetFollowupData(preVData => ({ ...preVData, followup_Date: Date }))
  }

  const resetInputs = () => {
    SetFollowupData(prevData => ({
      ...prevData,
      Services: '',
      visit_type: '',
      images: '',
      Followup_type: '',
      followup_Date: '',
      latitude: '',
      longitude: '',
      CallStatus: '',
      TeleCallMode: '',
      Remarks: ''
    }))

    setErrors(prevData => ({
      ...prevData,
      Services: '',
      visit_type: '',
      images: '',
      Followup_type: '',
      followup_Date: '',
      latitude: '',
      longitude: '',
      CallStatus: '',
      TeleCallMode: '',
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

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setRefreshData(true)
    resetInputs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const handleVisitMode = d => {
    SetFollowupData(prevData => ({ ...prevData, TeleCallMode: d }))

  }

  const validation = () => {
    let isValid = true
    const newErrors = {}
    if (
      FollowupData.visit_type === 'TeleCall' &&
      FollowupData.TeleCallMode === ''
    ) {
   
      newErrors.TeleCallMode = 'Please Select TeleCall Any one Mode'

      isValid = false
    }

    if (
      FollowupData.visit_type === 'TeleCall' &&
      FollowupData.TeleCallMode === 'Call' &&
      FollowupData.CallStatus === ''
    ) {
    
      newErrors.CallStatus = 'Please Select TeleCall Status'

      isValid = false
    }

    if (FollowupData.visit_type === 'LiveVisit' && FollowupData.images === '') {
 
      newErrors.images = 'Visited Images is required'
      isValid = false
    }

    if (FollowupData.Followup_type === '') {
     
      newErrors.Followup_type = 'FollowUp Type is required'

      isValid = false
    }

    if (FollowupData.Remarks === '') {
      newErrors.Remarks = 'Remarks is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const handleFollowUpSubmit = async () => {
    if (validation()) {
      try {
        const allData = { FollowupData, ClientData }



        const response = await api.post('/client-vist/FollowUpSave', allData)


        if (response.status === 201) {
          resetInputs()
          setAlertProps({
            alertType: 'Success',
            content: 'Your Followup has been submitted successfully!',
            renderType: 'toast',
            visible: true
          })
          setRefreshData(prevState => !prevState)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDatedRest = async () => {
    SetFollowupData(prevData => ({
      ...prevData,
      followup_Date: ''
    }))
  }

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

  useEffect(() => {
    fetchData()
  }, [focus])

  return (
    <ScrollView
      showsHorizontalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: '#F4F9FD' }}
    >



      <View style={styles.cardWrapper}>
        <Card
          style={{ backgroundColor: '#FFFFFF', borderRadius: 20 }}
          mx={'$1'}
        >
          <View>
            <HStack space='md'>
              {ClientData.client_name && (
                <Avatar bg={ColorCodes(ClientData.client_name)}>
                  <AvatarFallbackText>
                    {ClientData.company_name}
                  </AvatarFallbackText>
                </Avatar>
              )}
              <VStack>
                <Heading size='sm' fontFamily='MonaSans_400Regular'>
                  {ClientData.company_name}
                </Heading>
                <Text
                  size='sm'
                  style={{ color: '#91929E', fontSize: 14 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Company Name
                </Text>
              </VStack>
            </HStack>
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
                  Client Name
                </Text>

                <Text
                  style={{ color: '#0A1629', fontSize: 16 }}
                  fontFamily='MonaSans_400Regular'
                >
                  {ClientData.client_name}
                </Text>
              </View>

              <View>
                <Text
                  style={{ color: '#91929E', fontSize: 14 }}
                  fontFamily='MonaSans_400Regular'
                >
                  Service Enquiry
                </Text>

                <Text
                  style={{ color: '#0A1629', fontSize: 16 }}
                  fontFamily='MonaSans_400Regular'
                >
                  {ClientData.servicename}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <Card
        style={{
          backgroundColor: '#FFFFFF'
        }}
        variant='elevated'
        style={{ borderRadius: 24 }}
        h={'auto'}
        mx={'$2'}
        mb={'$12'}
      >
        <VStack
          // flexDirection='row'
          // justifyContent='space-evenly'
          // gap={'$2'}
          style={{ width: '100%', padding: '0%' }}
        >
          <View style={{ width: '100%' }}>
            <Text mb={'$2'} fontFamily='NunitoSans_Bold' color='#7D8592'>
              Visit Type
            </Text>
            <Selects
              selectype={'Visittype'}
              refreshData={refreshData}
              onChangeText={value => handleChangeInput('visit_type', value)}
            />

            {errors.TeleCallMode && (
              <HStack flexDirection='row' gap={'$1'}>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  mt={'$1'}
                  size='xs'
                />
                <FormControlErrorText
                  fontFamily='MonaSans_400Regular'
                  fontSize={'$sm'}
                >
                  {errors.TeleCallMode}
                </FormControlErrorText>
              </HStack>
            )}
          </View>
          <View style={{ width: 'auto' }}>
            {FollowupData.TeleCallMode === 'Call' &&
              FollowupData.visit_type === 'TeleCall' && (
                <>
                  <Text
                    mb={'$1'}
                    fontFamily='MonaSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 14 }}
                    my={'$4'}
                  >
                    Call Status
                    <Text color='$red700'>*</Text>
                  </Text>
                  <Selects
                    selectype={'CallStatus'}
                    refreshData={refreshData}
                    onChangeText={value =>
                      handleChangeInput('CallStatus', value)
                    }
                    color={'$black'}
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
                </>
              )}
          </View>
        </VStack>

        {FollowupData.visit_type !== '' && (
          <>
            <View style={{ width: '100%' }} my={'$5'}>
              <VStack
                flexDirection='row'
                justifyContent='space-evenly'
                gap={'$2'}
                flexWrap='wrap'
                style={{ width: '100%', padding: '0%' }}
              >
                <View style={{ width: '100%' }}>
                  <Text
                    mb={'$2'}
                    fontFamily='NunitoSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 14 }}
                  >
                    FollowUp Type
                  </Text>
                  <Selects
                    selectype={'FollowupType'}
                    refreshData={refreshData}
                    onChangeText={value =>
                      handleChangeInput('Followup_type', value)
                    }
                    page={'Followup'}
                  />
                  {errors.Followup_type && (
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
                        {errors.Followup_type}
                      </FormControlErrorText>
                    </HStack>
                  )}
                </View>

                {FollowupData.Followup_type === 'Followup' && (
                  <View style={{ width: '100%' }} mt={'$1'}>
                    <Text
                      mb={'$1'}
                      fontFamily='NunitoSans_Bold'
                      color='#7D8592'
                      style={{ fontSize: 14 }}
                    >
                      Follow Up date
                    </Text>

                    <Input rounded={'$xl'}>
                      <InputField
                        type='text'
                        value={FollowupData.followup_Date}
                        fontFamily='MonaSans_400Regular'
                        style={{ fontSize: 15 }}
                        onPressIn={() => setDatePickerOpen(true)}
                        onFocus={() => {
                          Keyboard.dismiss()
                          setDatePickerOpen(true)
                        }}
                      />
                    </Input>

                    {/* <Selects
                    selectype={'Services'}
                    refreshData={refreshData}
                    onChangeText={value => handleChangeInput('Services', value)}
                  /> */}
                  </View>
                )}
              </VStack>
            </View>

            <VStack>
              <View>
                <Text
                  fontFamily='NunitoSans_Bold'
                  style={{ color: '#7D8592', fontSize: 16 }}
                  mb='$2'
                >
                  Description
                </Text>
                <Textarea
                  size='md'
                  borderColor='#7D8592'
                  style={{ borderRadius: 14 }}
                >
                  <TextareaInput
                    placeholder='Add some description of the request'
                    fontFamily='MonaSans_400Regular'
                    value={FollowupData.Remarks}
                    defaultValue={FollowupData.Remarks}
                    onChangeText={text =>
                      SetFollowupData(prevData => ({
                        ...prevData,
                        Remarks: text
                      }))
                    }
                  />
                </Textarea>

                {errors.Remarks && (
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
                      {errors.Remarks}
                    </FormControlErrorText>
                  </HStack>
                )}
              </View>

              {FollowupData.visit_type === 'LiveVisit' &&
                FollowupData.visit_type !== 'TeleCall' && (
                  <>
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
                          <Text
                            color={'#0A1629'}
                            fontFamily='NunitoSans_Regular'
                          >
                            Attached files For Client Visit
                          </Text>
                        </View>
                      </Box>
                    </TouchableOpacity>

                    {FollowupData.images !== '' && (
                      <>
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
                              <Image
                                source={{
                                  uri: `data:image/jpeg;base64,${FollowupData.images}`
                                }}
                                style={{
                                  height: 44,
                                  width: 44,
                                  borderRadius: 14
                                }}
                              />
                              <VStack
                                mx='$4'
                                w={
                                  uploadfileDatas.filename.length > 40
                                    ? '$56'
                                    : 'auto'
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
                      </>
                    )}

                    {errors.images && (
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
                          {errors.images}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </>
                )}

              <View my={'$5'}>
                <Pressable>
                  <Button onPress={handleFollowUpSubmit} rounded={'$3xl'}>
                    <ButtonText fontFamily='MonaSans_400Regular'>
                      Save Followup
                    </ButtonText>
                  </Button>
                </Pressable>
              </View>
            </VStack>
          </>
        )}
      </Card>

      <Contact
        isOpen={isActionsheetOpen}
        Datas={ClientData}
        onClose={() => setIsActionsheetOpen(false)}
        selectedMode={d => handleVisitMode(d)}
      />

      <View
        bg='$yellow100'
        w={'$full'}
        display={isActionsheetOpen ? 'flex' : 'none'}
      >
        <Locations
          isOpen={isLocationOpen}
          locationGet={handleLocation}
          onClose={() => setisLocationOpen(false)}
        />
      </View>

      <View>
        <DatePicker
          isOpen={DatePickerOpen}
          onClose={() => setDatePickerOpen(false)}
          SelectedDate={handleDatepicker}
          clearDate={handleDatedRest}
          mode={'datetime'}
        />
      </View>

      <View>
        {/* Show the file upload modal when the button is pressed */}
        <FileUpload
          isOpen={uploadedOpen}
          onClose={() => setUploadedOpen(false)}
          images={handleImageUpload}
          ClearImage={handleUploadRest}
          fileData={(filename, size) => uploadFileData(filename, size)}
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


    </ScrollView>
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

export default FollowupEnquiry
