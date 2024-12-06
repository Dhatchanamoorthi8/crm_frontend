import {
  Avatar,
  AvatarBadge,
  Card,
  Fab,
  FabIcon,
  Icon,
  Text,
  View
} from '@gluestack-ui/themed'
import React, { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Table, Row } from 'react-native-table-component'
import { ArrowDownIcon } from '@gluestack-ui/themed'
import { ArrowUpIcon } from '@gluestack-ui/themed'
import Menus from '../Components/Menu'
import api from '../Services/axiosConfig'
import store from '../../Store/store'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { RefreshControl } from '@gluestack-ui/themed'
import { InfoIcon } from '@gluestack-ui/themed'
import { CalendarDaysIcon } from '@gluestack-ui/themed'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { AvatarImage } from '@gluestack-ui/themed'
import { AddIcon } from '@gluestack-ui/themed'
import { FabLabel } from '@gluestack-ui/themed'
import { EmptyTask, EmptyWork } from '@/assets/Icons/SvgIcons'

import {
  Box,
  Modal,
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
  ModalBackdrop,
  ModalContent,
  ModalBody,
  Input
} from '@gluestack-ui/themed'

import { DatePickerSvg, LocationSvg } from '@/assets/Icons/SvgIcons'
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification'
import { ColorCodes } from '../Components/ColorCodes'

const DashBoardPage = () => {
  const state = store.getState()

  const userData = state.user.userData.user

  const focus = useIsFocused()
  const fill = 20

  const [showModal, setShowModal] = useState(false)

  const nav = useNavigation()

  const [TableData, SetTableData] = useState([])

  const [refreshing, setRefreshing] = useState(false)

  const [CardCount, SetCardCount] = useState({
    newEnquiry: 0,
    Followup: 0
  })

  const target = 10
  const currentProgress = CardCount.newEnquiry

  // Calculate the fill percentage
  const fillPercentage = (Number(currentProgress) / Number(target)) * 100

  const [showAll, setShowAll] = useState(false)

  const [DatePickerOpen, setDatePickerOpen] = useState(false)

  const toggleShowMore = () => {
    setShowAll(!showAll)
  }

  const fetchData = async () => {
    try {
      const state = store.getState()
      const isAuthenticated = state.user.isAuthenticated
      const user_id = isAuthenticated ? state.user.userData.user.userid : null

      const response = await api.get(`dashboard/${user_id}`)

      SetTableData(response.data.followUpClients)
      SetCardCount(prevData => ({
        ...prevData,
        newEnquiry: response.data.newClientsCount,
        Followup: response.data.followUpClientsCount
      }))
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (focus) {
      fetchData()
    }
  }, [])

  const handlePartynameclick = async item => {
    console.log('called', item)

    const Props = {
      id: item
    }
    nav.navigate('Followup', { Props })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const getFormattedDate = () => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(new Date())
  }



  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: '#F4F9FD' }}
      >
        <View mx={'$3'} my={'$3'}>
          <Text
            fontFamily='MonaSans_400Regular'
            textTransform='capitalize'
            color='#7D8592'
          >
            Welcome back, {userData.username} !
          </Text>
        </View>

        <View
          mx={'$3'}
          my={'$3'}
          bg='#E6EDF5'
          p={'$3'}
          style={{
            height: 48,
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderRadius: 14
          }}
        >
          <View
            flexDirection='row'
            alignItems='center'
            gap={'$5'}
            justifyContent='center'
          >
            <Icon
              as={CalendarDaysIcon}
              className='text-typography-500 m-2 w-4 h-4'
            />
            <Text fontFamily='MonaSans_400Regular' color='black'>
              {getFormattedDate()}
            </Text>
          </View>
        </View>

        {/* Fab Task Create  */}

        <Fab
          size='lg'
          placement='bottom right'
          backgroundColor='#000'
          onPress={() => setShowModal(true)}
        >
          <FabIcon as={AddIcon} />
        </Fab>

        {/* Cards Section */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            backgroundColor: '#A0A8B'
          }}
          $lg-m='$10'
          $lg-gap='$20'
          gap={10}
          mt={'$2'}
          $web-paddingTop='$0'
          $web-marginTop='$0'
        >
          {/* Card 1 */}
          <View h={'$40'}>
            <LinearGradient
              colors={['#fbc2eb', '#a6c1ee']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 20,
                padding: 20
              }}
            >
              <View
                display='flex'
                justifyContent='space-between'
                flexDirection='row'
              >
                <View
                  h={'$9'}
                  w={'$9'}
                  borderRadius={'$lg'}
                  bg='$cyan700'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                >
                  <AntDesign name='adduser' size={24} color='black' />
                </View>
                <View>
                  <Menus
                    placement='right start'
                    offset={2}
                    disabledKeys={['Settings']}
                    trigger={triggerProps => (
                      <TouchableOpacity {...triggerProps}>
                        <Entypo
                          name='dots-three-vertical'
                          size={24}
                          color='black'
                        />
                      </TouchableOpacity>
                    )}
                    menuitemsShow={2}
                  />
                </View>
              </View>

              <View
                display='flex'
                justifyContent='space-between'
                flexDirection='row'
              >
                <View pt={'$8'} w={'$20'}>
                  <Text
                    style={{
                      fontFamily: 'MonaSans_400Regular',
                      fontSize: 20
                    }}
                  >
                    10
                  </Text>
                </View>

                <View
                  $web-pt={'$1'}
                  $android-pt={'$6'}
                  paddingStart={'$2'}
                  w={'auto'}
                >
                  <AnimatedCircularProgress
                    size={Platform.OS === 'android' ? 60 : 90}
                    width={5}
                    style={{ fontFamily: 'MonaSans_400Regular' }}
                    backgroundWidth={15}
                    fill={fillPercentage}
                    prefill={0}
                    tintColor='#00e0ff'
                    onAnimationComplete={() =>
                      console.log('onAnimationComplete')
                    }
                    backgroundColor='#3d5875'
                  >
                    {fill => <Text>{fill}</Text>}
                  </AnimatedCircularProgress>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Second Card */}
          <View h={'$40'}>
            <LinearGradient
              colors={['#ff8a00', '#e52e71']} // Orange to pink gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 20,
                padding: 20
              }}
            >
              <View
                display='flex'
                justifyContent='space-between'
                flexDirection='row'
              >
                <View
                  h={'$10'}
                  w={'$10'}
                  borderRadius={'$lg'}
                  bg='$tertiary600'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                >
                  <FontAwesome name='tasks' size={24} color='black' />
                </View>
                <View>
                  <Menus
                    placement='right'
                    offset={0}
                    disabledKeys={['Settings']}
                    trigger={triggerProps => (
                      <TouchableOpacity {...triggerProps}>
                        <Entypo
                          name='dots-three-vertical'
                          size={24}
                          color='black'
                        />
                      </TouchableOpacity>
                    )}
                    menuitemsShow={1}
                  />
                </View>
              </View>

              <View
                display='flex'
                justifyContent='space-between'
                flexDirection='row'
              >
                <View pt={'$8'} w={'$20'}>
                  <Text
                    style={{
                      fontFamily: 'MonaSans_400Regular',
                      fontSize: 20
                    }}
                  >
                    00
                  </Text>
                </View>

                <View
                  $web-pt={'$1'}
                  $android-pt={'$6'}
                  paddingStart={'$2'}
                  w={'auto'}
                >
                  <AnimatedCircularProgress
                    size={Platform.OS === 'android' ? 60 : 90}
                    width={5}
                    style={{ fontFamily: 'MonaSans_400Regular' }}
                    backgroundWidth={15}
                    fill={CardCount.Followup}
                    prefill={0}
                    tintColor='#00e0ff'
                    onAnimationComplete={() =>
                      console.log('onAnimationComplete')
                    }
                    backgroundColor='#3d5875'
                  >
                    {fill => <Text>{fill}</Text>}
                  </AnimatedCircularProgress>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Followup Cards Section */}

        <View>
          <Card
            variant='elevated'
            mx={'$2'}
            my={'$3'}
            rounded={'$2xl'}
            style={styles.card}
          >
            <View flexDirection='row' gap={'$3'} justifyContent='space-between'>
              <View alignItems='flex-start'>
                <Text fontFamily='MonaSans_Bold' fontSize={'$xl'}>
                  Workload
                </Text>
              </View>

              <View alignItems='flex-start'>
                <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                  View More
                </Text>
              </View>
            </View>

            <View
              mt={'$4'}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                padding: 5,
                gap: 16
              }}
            >
              {TableData.length > 0 ? (
                TableData.map((item, index) => (
                  <TouchableOpacity
                    key={item.id} // Use a unique key for each item
                    onPress={() => handlePartynameclick(item.id)} // Trigger action on press
                    style={{
                      width: '45%',
                      marginBottom: 16
                    }}
                  >
                    <Card
                      variant='elevated'
                      style={{
                        marginBottom: 16,
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: '#F4F9FD'
                      }}
                      rounded={'$lg'}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <AnimatedCircularProgress
                          size={70}
                          width={3}
                          fill={80}
                          tintColor={
                            item.Status === 'P' ? '#3F8CFF' : '#3F8CFF'
                          } // Progress ring color
                          backgroundColor='#E6EDF5'
                        >
                          {() => (
                            <Avatar size='md' bg={ColorCodes(item.client_name)}>
                              <AvatarFallbackText>
                                {item.client_name}
                              </AvatarFallbackText>
                              {item.Status === 'P' ? (
                                <AvatarBadge bg='red' />
                              ) : (
                                <AvatarBadge bg='green' />
                              )}
                            </Avatar>
                          )}
                        </AnimatedCircularProgress>
                      </View>
                      <Text
                        style={{
                          marginTop: 8,
                          color: '#0A1629',
                          fontFamily: 'MonaSans_Bold'
                        }}
                      >
                        {item.company_name}
                      </Text>
                      <Text fontFamily='MonaSans_400Regular'>
                        {item.client_name}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                ))
              ) : (
                <EmptyWork />
              )}
            </View>
          </Card>
        </View>

        {/* Task   Cards Section */}

        <View>
          <Card
            variant='elevated'
            mx={'$2'}
            my={'$3'}
            rounded={'$2xl'}
            style={styles.card}
          >
            <View flexDirection='row' gap={'$3'} justifyContent='space-between'>
              <View alignItems='flex-start'>
                <Text fontFamily='MonaSans_Bold' fontSize={'$xl'}>
                  Task
                </Text>
              </View>

              <View alignItems='flex-start'>
                <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                  View More
                </Text>
              </View>
            </View>

            <View mt={'$4'} marginStart={'auto'} marginEnd={'auto'}>
              <View mx={'$12'}>
                <EmptyTask />
                <Text
                  textAlign='center'
                  fontFamily='MonaSans_SemiBold'
                  my={'$2'}
                >
                  There are no tasks in this project yet Let's add them
                </Text>
              </View>

              <View></View>
            </View>
          </Card>
        </View>
      </ScrollView>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size='lg'
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
              Add Task
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size='md'
                className='stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900'
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody my={'$1'}>
            <ScrollView>
              <FormControl p={'$2'} rounded={'$lg'}>
                <VStack space='xl'>
                  <VStack space='xs'>
                    <Text
                      fontFamily='MonaSans_Bold'
                      color='#7D8592'
                      style={{ fontSize: 14 }}
                    >
                      Task Name
                    </Text>
                    <Input rounded={'$xl'}>
                      <InputField
                        type='text'
                        placeholder='Position'
                        fontFamily='MonaSans_400Regular'
                        style={{ fontSize: 15 }}
                      />
                    </Input>
                  </VStack>

                  <VStack space='xs'>
                    <Text
                      fontFamily='MonaSans_Bold'
                      color='#7D8592'
                      style={{ fontSize: 14 }}
                    >
                      Company
                    </Text>
                    <Input rounded={'$xl'}>
                      <InputField
                        type='text'
                        placeholder='Company'
                        fontFamily='MonaSans_400Regular'
                        style={{ fontSize: 15 }}
                      />
                    </Input>
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
                      />

                      <InputSlot>
                        <InputIcon
                          style={{ width: 20, height: 20, marginRight: 10 }}
                        >
                          <LocationSvg />
                        </InputIcon>
                      </InputSlot>
                    </Input>
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
                        //defaultValue={NewEmployeeData.dob}
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
                      <InputField type='text' />
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
                      <InputField type='text' />
                    </Input>
                  </VStack>

                  <Button rounded={'$lg'}>
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F9FD'
  },
  scrollContent: {
    paddingBottom: 80
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

export default DashBoardPage
