import React, { useCallback, useEffect, useState } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image
} from 'react-native'
import {
  View,
  Text,
  Box,
  Fab,
  AddIcon,
  FabIcon,
  ModalHeader,
  Heading,
  ModalCloseButton,
  CloseIcon,
  InputField,
  FormControl,
  VStack,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
  Menu,
  MenuItemLabel,
  SettingsIcon,
  Divider,
  MenuSeparator,
  AlertCircleIcon
} from '@gluestack-ui/themed'
import EmployeeActivity from './EmployeeActivity'
import EmployeeList from './EmployeeList'
import { Modal } from '@gluestack-ui/themed'
import { ModalBackdrop } from '@gluestack-ui/themed'
import { ModalContent } from '@gluestack-ui/themed'
import { ModalBody } from '@gluestack-ui/themed'
import { Icon } from '@gluestack-ui/themed'
import { Input } from '@gluestack-ui/themed'
import { CloseSvg, DatePickerSvg, LocationSvg } from '@/assets/Icons/SvgIcons'
import DatePicker from '../Components/DatePicker'
import { Keyboard } from 'react-native'
import { ScrollView } from '@gluestack-ui/themed'
import { MenuItem } from '@gluestack-ui/themed'

import { useIsFocused, useNavigation } from '@react-navigation/native'
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
  ChevronDownIcon
} from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { FormControlErrorIcon } from '@gluestack-ui/themed'
import { FormControlErrorText } from '@gluestack-ui/themed'
import { HStack } from '@gluestack-ui/themed'
import { RefreshControl } from '@gluestack-ui/themed'
import Alerts from '../Components/Alert'
import { Center } from '@gluestack-ui/themed'
import { base64men, base64women } from '@/assets/Icons/AvatarSvg'
import MenAvatar from '@/assets/Icons/menIcon/MenAvatar'
import GirlAvatar from '@/assets/Icons/girlsIcon/GirlAvatar'
import { preloadAvatarMen, preloadAvatarWomen } from '../Hooks/usePreloadAvatar'
import * as FileSystem from 'expo-file-system'
import Spinner from 'react-native-loading-spinner-overlay'
const { width } = Dimensions.get('window')

const EmployeeTab = () => {
  const focus = useIsFocused()
  const navigation = useNavigation()

  const [activeTab, setActiveTab] = useState(0)

  const [showModal, setShowModal] = useState(false)

  const translateX = new Animated.Value(0)

  const tabs = ['List', 'Activity']

  const [DatePickerOpen, setDatePickerOpen] = useState(false)

  const [DesginationDropDown, setDesginationDropDown] = useState([])

  const [CompanyDropDown, SetCompanyDropDown] = useState([])

  const [refreshing, setRefreshing] = useState(false)

  const [loader, setloader] = useState(false)

  const [EmployeerRegisterData, SetEmployeerRegisterData] = useState({
    name: '',
    email: '',
    gender: '',
    DOB: '',
    mobile: '',
    address: '',
    des_id: '',
    cm_id: '',
    desginationname: '',
    comapnyname: '',
    profile: ''
  })

  const [preloadedAvatarmen, setpreloadedAvatarmen] = useState([])

  const [preloadedAvatarwomen, setpreloadedAvatarwomen] = useState([])

  const handleTabSwitch = (index, type) => {
    if (type !== 'settings') {
      setActiveTab(index)
      Animated.spring(translateX, {
        toValue: index * (width / 2),
        useNativeDriver: true
      }).start()
    }
  }

  const handleDatepicker = async Date => {
    SetEmployeerRegisterData(preData => ({ ...preData, DOB: Date }))
  }

  const handleChangeInput = async (name, value) => {
    const processedValue = typeof value === 'string' ? value.trim() : value

    try {
      // Update the form state for the given field
      SetEmployeerRegisterData(current => ({
        ...current,
        [name]: processedValue
      }))

      // Handle gender-specific logic
      if (name === 'gender') {
        const gender = processedValue // Use the new value directly
        const randomAvatar =
          gender === 'male'
            ? preloadedAvatarmen[
                Math.floor(Math.random() * preloadedAvatarmen.length)
              ]
            : preloadedAvatarwomen[
                Math.floor(Math.random() * preloadedAvatarwomen.length)
              ]

        // Clear the profile temporarily
        SetEmployeerRegisterData(current => ({
          ...current,
          profile: ''
        }))

        // Convert the selected avatar to a Base64 string
        const base64String = await FileSystem.readAsStringAsync(randomAvatar, {
          encoding: FileSystem.EncodingType.Base64
        })

        // Update the profile field with the Base64 string
        SetEmployeerRegisterData(current => ({
          ...current,
          profile: base64String
        }))

        return
      }
    } catch (error) {
      console.log('Error in handleChangeInput:', error)
    }
  }

  const fetchData = async () => {
    setloader(true)
    try {
      const userdesgination = await api.get('userdesgination')
      const company_fetch = await api.get('companymaster')
      setDesginationDropDown(userdesgination.data)
      SetCompanyDropDown(company_fetch.data)
      setloader(false)
    } catch (error) {
      console.log(error)
      setloader(false)
    }
  }

  useEffect(() => {
    if (focus) {
      fetchData()

      const loadAvatars = async () => {
        const menuri = await preloadAvatarMen()
        const womenuri = await preloadAvatarWomen()
        setpreloadedAvatarmen(menuri)
        setpreloadedAvatarwomen(womenuri)
      }

      loadAvatars()
    }
  }, [focus])

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    DOB: '',
    gender: '',
    mobile: '',
    address: '',
    des_id: '',
    cm_id: ''
  })

  const validate = () => {
    let isValid = true
    const newErrors = {}

    if (EmployeerRegisterData.name === '') {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (EmployeerRegisterData.gender === '') {
      newErrors.gender = 'Gender is required'
      isValid = false
    }

    if (EmployeerRegisterData.des_id === '') {
      newErrors.des_id = 'Employee Position is required'
      isValid = false
    }

    if (EmployeerRegisterData.cm_id === '') {
      newErrors.cm_id = 'Company Name is required'
      isValid = false
    }

    if (
      !EmployeerRegisterData.mobile ||
      !EmployeerRegisterData.mobile.trim() ||
      !/^\d{10}$/.test(EmployeerRegisterData.mobile.trim())
    ) {
      newErrors.mobile = 'Valid Contact Number is required (10 digits)'
      isValid = false
    }

    if (
      !EmployeerRegisterData.email ||
      typeof EmployeerRegisterData.email !== 'string' ||
      !EmployeerRegisterData.email.trim() ||
      !/\S+@\S+\.\S+/.test(EmployeerRegisterData.email.trim())
    ) {
      newErrors.email = 'Valid Email is required'
      isValid = false
    }

    if (!EmployeerRegisterData.address.trim()) {
      newErrors.address = 'Address is required'
      isValid = false
    }

    if (!EmployeerRegisterData.DOB.trim()) {
      newErrors.DOB = 'Date Of Birth is required'
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

  const handleSave = async () => {
    if (validate()) {
      setloader(true)
      try {
        // const payload = {
        //   ...EmployeerRegisterData,
        //   profile:
        //     EmployeerRegisterData.gender === 'male' ? base64men : base64women
        // }
        const response = await api.post('users', EmployeerRegisterData)
        if (response.status === 201) {
          setShowModal(false)
          setAlertProps({
            alertType: 'Success',
            content: `${EmployeerRegisterData.name} Register SuccessFully`,
            renderType: 'toast',
            visible: true
          })
          setloader(false)
          return
        }
        setloader(false)
      } catch (error) {
        setShowModal(false)
        setAlertProps({
          alertType: 'Error',
          content: error.response.data.message,
          renderType: 'toast',
          visible: true
        })
        setloader(false)
      }
    } else {
      console.log('failed validation')
    }
  }

  const restInputs = () => {
    setErrors(prevData => ({
      ...prevData,
      name: '',
      email: '',
      DOB: '',
      gender: '',
      mobile: '',
      address: '',
      des_id: '',
      cm_id: ''
    }))

    SetEmployeerRegisterData(prevData => ({
      ...prevData,
      name: '',
      email: '',
      DOB: '',
      gender: '',
      mobile: '',
      address: '',
      des_id: '',
      cm_id: '',
      profile: ''
    }))
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    restInputs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const toggleProfileimg = async () => {
    try {
      const randomAvatar =
        EmployeerRegisterData.gender === 'male'
          ? preloadedAvatarmen[
              Math.floor(Math.random() * preloadedAvatarmen.length)
            ]
          : preloadedAvatarwomen[
              Math.floor(Math.random() * preloadedAvatarwomen.length)
            ]

      const base64String = await FileSystem.readAsStringAsync(randomAvatar, {
        encoding: FileSystem.EncodingType.Base64
      })

      SetEmployeerRegisterData(current => ({
        ...current,
        profile: base64String
      }))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Animated.View
            style={[styles.activeTabIndicator, { transform: [{ translateX }] }]}
          />

          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabButton,
                activeTab === index && styles.activeTabButton
              ]}
              onPress={() => handleTabSwitch(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index ? styles.activeTabText : {}
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 0 ? (
            <View>
              <EmployeeList />
            </View>
          ) : (
            <View>
              <EmployeeActivity />
            </View>
          )}
        </View>
      </View>

      <Menu
        placement='top right'
        offset={5}
        trigger={({ ...triggerProps }) => {
          return (
            <Fab
              size='lg'
              placement='bottom right'
              isHovered={true}
              {...triggerProps}
            >
              <FabIcon as={AddIcon} />
            </Fab>
          )
        }}
        style={{ borderRadius: 10 }}
      >
        <MenuItem
          key={'Add employee'}
          textValue='Add employee'
          onPress={() => setShowModal(true)}
        >
          <Icon as={AddIcon} size='sm' mr={'$2'} />
          <MenuItemLabel size='sm'>Add employee</MenuItemLabel>
        </MenuItem>

        <MenuSeparator />

        <MenuItem
          key={'Settings'}
          textValue='Settings'
          onPress={() => navigation.navigate('adminSettings')}
        >
          <Icon as={SettingsIcon} size='sm' mr={'$2'} />
          <MenuItemLabel size='sm'>Settings</MenuItemLabel>
        </MenuItem>
      </Menu>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size='full'
        style={{ borderRadius: 50 }}
        p='$2'
      >
        <ModalBackdrop />
        <ModalContent
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'white' // Ensure background color is consistent
          }}
          my={'$10'}
        >
          <ModalHeader>
            <Text style={{ fontSize: 18 }} fontFamily='MonaSans_Bold'>
              Employee Profile
            </Text>
            <ModalCloseButton>
              <CloseSvg />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <ScrollView
              mb={'$5'}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View marginStart={'auto'} marginEnd={'auto'}>
                <TouchableOpacity onPress={() => toggleProfileimg()}>
                  <Image
                    source={{
                      uri: `data:image/png;base64,${EmployeerRegisterData.profile}`
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>

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
                        placeholder='Name'
                        fontFamily='MonaSans_400Regular'
                        style={{ fontSize: 15 }}
                        onChangeText={text => handleChangeInput('name', text)}
                        // value={EmployeerRegisterData.name}
                      />
                    </Input>

                    {errors.name && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                          {errors.name}
                        </FormControlErrorText>
                      </HStack>
                    )}
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
                      onValueChange={e => handleChangeInput('gender', e)}
                      key={refreshing}
                      value={EmployeerRegisterData.gender}
                    >
                      <SelectTrigger
                        variant='outline'
                        size='md'
                        rounded={'$xl'}
                      >
                        <SelectInput
                          placeholder='Select Gender'
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
                          <SelectItem label={'Male'} value={'male'} />
                          <SelectItem label={'Female'} value={'female'} />
                        </SelectContent>
                      </SelectPortal>
                    </Select>

                    {errors.gender && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.gender}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </VStack>

                  <VStack space='xs'>
                    <Text
                      fontFamily='MonaSans_Bold'
                      color='#7D8592'
                      style={{ fontSize: 14 }}
                    >
                      Position
                    </Text>

                    <Select
                      onValueChange={e => handleChangeInput('des_id', e)}
                      key={refreshing}
                      value={EmployeerRegisterData.des_id}
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
                          {DesginationDropDown &&
                            DesginationDropDown.map((data, index) => (
                              <SelectItem
                                label={data.DesginationName}
                                value={data.Des_id}
                              />
                            ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>

                    {errors.des_id && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.des_id}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </VStack>

                  <VStack space='xs'>
                    <Text
                      fontFamily='MonaSans_Bold'
                      color='#7D8592'
                      style={{ fontSize: 14 }}
                    >
                      Company
                    </Text>

                    <Select
                      onValueChange={e => handleChangeInput('cm_id', e)}
                      key={refreshing}
                      value={EmployeerRegisterData.cm_id}
                    >
                      <SelectTrigger
                        variant='outline'
                        size='md'
                        rounded={'$xl'}
                      >
                        <SelectInput
                          placeholder='Select Company'
                          fontFamily='MonaSans_400Regular'
                          //value={EmployeerRegisterData.cm_id}
                        />
                        <SelectIcon mr='$3' as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {CompanyDropDown &&
                            CompanyDropDown.map((data, index) => (
                              <SelectItem
                                label={data.CompanyName}
                                value={data.cm_id}
                              />
                            ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>

                    {errors.cm_id && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.cm_id}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </VStack>

                  <VStack space='xs'>
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
                        onChangeText={text =>
                          handleChangeInput('address', text)
                        }
                        //value={EmployeerRegisterData.address}
                      />

                      <InputSlot>
                        <InputIcon
                          style={{ width: 20, height: 20, marginRight: 10 }}
                        >
                          <LocationSvg />
                        </InputIcon>
                      </InputSlot>
                    </Input>

                    {errors.address && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.address}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </VStack>

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
                        value={EmployeerRegisterData.DOB}
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

                    {errors.DOB && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.DOB}
                        </FormControlErrorText>
                      </HStack>
                    )}
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
                      <InputField
                        type='text'
                        onChangeText={text => handleChangeInput('email', text)}
                        //value={EmployeerRegisterData.email}
                      />
                    </Input>

                    {errors.email && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.email}
                        </FormControlErrorText>
                      </HStack>
                    )}
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
                      <InputField
                        type='text'
                        onChangeText={text => handleChangeInput('mobile', text)}
                        keyboardType='phone-pad'
                        //value={EmployeerRegisterData.mobile}
                      />
                    </Input>

                    {errors.mobile && (
                      <HStack flexDirection='row' gap={'$1'}>
                        <FormControlErrorIcon as={AlertCircleIcon} mt={'$1'} />
                        <FormControlErrorText>
                          {errors.mobile}
                        </FormControlErrorText>
                      </HStack>
                    )}
                  </VStack>

                  <Button rounded={'$lg'} onPress={handleSave}>
                    <ButtonText fontFamily='MonaSans_SemiBold'>
                      Register Employee
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
        mode={'date'}
      />

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

      <Center>
        <Spinner size='large' visible={loader} />
      </Center>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FD',
    padding: 15
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EDF5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    overflow: 'hidden',
    width: '100%',
    height: 50
  },
  activeTabIndicator: {
    position: 'absolute',
    height: '100%',
    width: width / 2,
    borderRadius: 25,
    zIndex: 0
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 1,
    margin: 1
  },
  activeTabButton: {
    backgroundColor: '#3F8CFF', // Background color for active tab button
    borderRadius: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'MonaSans_400Regular'
  },
  activeTabText: {
    color: '#ffffff',
    fontFamily: 'MonaSans_Bold'
  },
  inactiveTabText: {
    color: '#6e6e6e'
  },
  content: {
    flex: 1
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 90
  }
})

export default EmployeeTab
