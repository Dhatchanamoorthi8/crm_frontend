import {
  Text,
  View,
  Card,
  Heading,
  Button,
  ButtonText,
  ButtonGroup,
  ScrollView,
  Box,
  HStack,
  ButtonIcon
} from '@gluestack-ui/themed'
import { useCallback, useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
  Icon,
  CloseIcon,
  CheckCircleIcon
} from '@gluestack-ui/themed'
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  Pressable,
  ButtonSpinner,
  VStack,
  RefreshControl
} from '@gluestack-ui/themed'

import { Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import { getUniqueId, getManufacturer } from 'react-native-device-info'
import store from '../../Store/store'
import Locations from '../Components/Location'
import api from '../Services/axiosConfig'

const Attendance = ({ onScroll }) => {
  const navigation = useNavigation()

  const state = store.getState()

  const userData = state.user.userData.user
  const user_id = state.user.userData.user.userid
  const focus = useIsFocused()

  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [ShowalertStatus, SetShowalertStatus] = useState('')
  const [isLocationOpen, setisLocationOpen] = useState(false)
  const [Location, setisLocation] = useState({ latitude: '', longitude: '' })
  const [loader, setloader] = useState(false)
  const [attendanceTime, setattendanceTime] = useState({
    intime: '',
    outtime: '',
    totalHours: ''
  })
  const [deviceUniqueid, setdeviceUniqueid] = useState(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  )



  const toast = useToast()

  // Timer-related functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setElapsedTime(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning])

  const startTimer = () => setIsTimerRunning(true)
  const stopTimer = () => setIsTimerRunning(false)

  // Format elapsed time (hh:mm:ss)
  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
  }

  const DeviceUniqueid = async () => {
    await getUniqueId().then(uniqueId => setdeviceUniqueid(uniqueId))
  }

  const ApiCall = async () => {
    try {
      const response = await api.get(`attendance/${user_id}`)
      if (response.status === 200 && response.data) {
        setattendanceTime(prevData => ({
          ...prevData,
          intime: response.data.formattedIntime,
          outtime: response.data.formattedOuttime,
          totalHours: response.data.exactWorkingHours || null
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLocation = async location => {
    setisLocation({
      latitude: location.latitude,
      longitude: location.longitude
    })
    setShowAlertDialog(true)
    SetShowalertStatus(attendanceTime.intime === '' ? 'checkin' : 'checkout')
  }

  const attendancein = async () => {
    await setisLocationOpen(true)
  }

  const CheckinConfirm = async () => {
    setloader(true)
    try {
      const currentDate = new Date()
      const intime = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
        2,
        '0'
      )} ${String(currentDate.getHours()).padStart(2, '0')}:${String(
        currentDate.getMinutes()
      ).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`

      const alldata = { ...Location, intime, uniqueid: deviceUniqueid }
      const response = await api.post('attendance/checkIn', alldata)

      if (response.status === 201) {
        setattendanceTime(prevData => ({
          ...prevData,
          intime: response.data.formattedIntime
        }))
        SetShowalertStatus('')
        ApiCall()
        setElapsedTime(0) // Reset elapsed time on check-in
        startTimer() // Start the timer
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <Toast action='success' nativeID={'toast-' + id}>
              <Icon as={CheckCircleIcon} mt='$1' mr='$3' />
              <VStack space='xs'>
                <ToastTitle>Check In Success</ToastTitle>
                <ToastDescription>
                  Your Check In was successful!
                </ToastDescription>
              </VStack>
              <Pressable mt='$1' onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </Toast>
          )
        })
      }
    } catch (err) {
      console.log(err)
      setloader(false)
    }
  }

  const attendanceout = async () => {
    await setisLocationOpen(true)
  }

  const CheckOutConfirm = async () => {
    try {
      const currentDate = new Date()
      const Outtime = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
        2,
        '0'
      )} ${String(currentDate.getHours()).padStart(2, '0')}:${String(
        currentDate.getMinutes()
      ).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`

      const alldata = { ...Location, Outtime, uniqueid: deviceUniqueid }
      const response = await api.patch(
        `attendance/checkout/${user_id}`,
        alldata
      )

      if (response.status === 200) {
        SetShowalertStatus('')
        ApiCall()
        stopTimer()
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <Toast action='success' nativeID={'toast-' + id}>
              <Icon as={CheckCircleIcon} mt='$1' mr='$3' />
              <VStack space='xs'>
                <ToastTitle>Check Out Success</ToastTitle>
                <ToastDescription>
                  Your Check Out was successful!
                </ToastDescription>
              </VStack>
              <Pressable mt='$1' onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </Toast>
          )
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    ApiCall()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (focus) {
      DeviceUniqueid()
      ApiCall()
    }
  }, [focus])

  const onNavigateAway = () => {
    stopTimer() // Stop the timer when the user navigates away
  }

  const onNavigateBack = () => {
    startTimer() // Start the timer again when the user comes back
  }

  useEffect(() => {
    navigation.addListener('focus', onNavigateBack)
    navigation.addListener('blur', onNavigateAway)

    return () => {
      navigation.removeListener('focus', onNavigateBack)
      navigation.removeListener('blur', onNavigateAway)
    }
  }, [navigation])

  return (
    <>
      <ScrollView
        left={'auto'}
        style={{ backgroundColor: '#F4F9FD' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          p={'$3'}
          mt={'$3'}
          mb={'$0'}
          pb={'$0'}
          style={{ display: attendanceTime.intime === '' ? 'flex' : 'none' }}
        >
          <Heading
            size='lg'
            textAlign='center'
            borderRadius={'$lg'}
            opacity={'$95'}
          >
            <Text
              color='$black'
              fontFamily='Inter_700Bold'
              fontSize={'$xl'}
              isTruncated
            >
              Have Nice Day {''}
              <Text fontSize={'$xl'} textTransform='capitalize'>
                "{userData.username}"
              </Text>
            </Text>
          </Heading>
        </View>

        <Box display='flex' style={{ flex: 1 }} width={'$full'}>
          <HStack
            p={'$2'}
            display='flex'
            flexWrap='wrap'
            alignItems='center'
            justifyContent='center'
          >
            <View
              w={'$full'}
              $lg-w={'$80'}
              mt={'$4'}
              p={'$6'}
              borderRadius={'$lg'}
              borderWidth={'$2'}
              borderColor='$black'
              style={{ backgroundColor: '#2F2F2F' }}
            >
              <Text
                textAlign='center'
                color='$light300'
                fontSize={'$3xl'}
                fontFamily='Inter_500Medium'
                my={'$2'}
              >
                {new Date().toUTCString().slice(0, 17)}
              </Text>

              <Text
                textAlign='center'
                color='$light500'
                fontSize={'$2xl'}
                fontFamily='Inter_500Medium'
                my={'$2'}
              >
                {currentTime}
              </Text>
            </View>
          </HStack>
        </Box>

        <Card m={'$2.5'} my={'$0'} bg='$orange400'>
          <View
            display='flex'
            flexDirection='row'
            justifyContent='center'
            gap={'$2'}
          >
            <Text
              style={{ fontSize: 16, fontFamily: 'MonaSans_Bold' }}
              color='black'
              isTruncated
            >
              Total Hours :
            </Text>

            <Text
              style={{ fontSize: 16, fontFamily: 'MonaSans_Bold' }}
              color='$light500'
              textTransform='capitalize'
              isTruncated
            >
              {attendanceTime.totalHours}
            </Text>
          </View>
        </Card>

        <View display='flex' p={'$2'} gap={'$1'}>
          <View
            display='flex'
            flexDirection='row'
            p={'$0'}
            gap={'$2'}
            alignItems='center'
            justifyContent='center'
            marginStart={'auto'}
            marginEnd={'auto'}
            mt={'$5'}
            $web-alignItems='center'
            $web-justifyContent='center'
          >
            <Card w={'$48'} $web-w={'$64'} bg='$green400'>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontFamily: 'MonaSans_400Regular' }}
                    color='black'
                  >
                    Check In
                  </Text>
                  <FontAwesome5 name='cloud-sun' size={24} color='black' />
                </View>

                <Text
                  fontFamily='Inter_500Medium'
                  isTruncated={true}
                  numberOfLines={1}
                  mt={'$4'}
                  style={{ fontSize: 15 }}
                  color='black'
                >
                  {attendanceTime.intime}
                </Text>
              </View>
            </Card>

            <Card w={'$48'} $web-w={'$64'} bg='$error300'>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontFamily: 'MonaSans_400Regular' }}
                    color='black'
                  >
                    Check Out
                  </Text>
                  <FontAwesome5 name='moon' size={20} color='black' />
                </View>

                <Text
                  style={{ fontFamily: 'Inter_500Medium', fontSize: 15 }}
                  numberOfLines={1}
                  mt={'$4'}
                  color='black'
                >
                  {attendanceTime.outtime}
                </Text>
              </View>
            </Card>
          </View>

          <View
            style={{
              display:
                attendanceTime.outtime !== null && attendanceTime.outtime !== ''
                  ? 'none'
                  : 'flex'
            }}
            w={'$full'}
            flexDirection='row'
            mt={'$5'}
          >
            <View
              style={[
                styles.container,
                {
                  backgroundColor:
                    attendanceTime.intime === '' ? '#b1f0c2' : '#e38686'
                }
              ]}
              alignItems='center'
              marginStart={'auto'}
              marginEnd={'auto'}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    display:
                      attendanceTime.outtime !== null &&
                      attendanceTime.outtime !== ''
                        ? 'none'
                        : 'flex',
                    backgroundColor:
                      attendanceTime.intime === '' ? '#55d978' : '#e34949'
                  }
                ]}
                disabled={
                  attendanceTime.outtime !== null &&
                  attendanceTime.outtime !== ''
                }
                onPress={() =>
                  attendanceTime.intime === ''
                    ? attendancein()
                    : attendanceout()
                }
              >
                <View>
                  <Text
                    fontFamily='Inter_500Medium'
                    p={'$1'}
                    color={attendanceTime.intime === '' ? '$black' : '$white'}
                  >
                    {attendanceTime.intime === '' ? 'Check In' : 'Check Out'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {attendanceTime.outtime !== null && attendanceTime.outtime !== '' && (
            <Text
              style={{
                display:
                  attendanceTime.outtime !== null &&
                  attendanceTime.outtime !== ''
                    ? 'flex'
                    : 'none'
              }}
              fontFamily='MonaSans_400Regular'
              textAlign='center'
              fontSize={'$lg'}
              mt={'$4'}
              $lg-alignItems='center'
              $lg-justifyContent='center'
              color='$green700'
            >
              Your Today Attendance As Done
            </Text>
          )}

          <AlertDialog
            isOpen={showAlertDialog}
            onClose={() => {
              setShowAlertDialog(false)
            }}
          >
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading size='lg' fontFamily='Inter_700Bold'>
                  {ShowalertStatus === 'checkin' ? 'Check In' : 'Check Out'}
                </Heading>
                <AlertDialogCloseButton>
                  <Icon as={CloseIcon} />
                </AlertDialogCloseButton>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text size='sm' fontFamily='Inter_700Bold'>
                  {ShowalertStatus === 'checkin'
                    ? 'Are You Sure Check In Attendance'
                    : 'Are You Sure Check Out Attendance'}
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <ButtonGroup space='lg'>
                  <Button
                    variant='outline'
                    action='secondary'
                    onPress={() => {
                      setShowAlertDialog(false)
                    }}
                  >
                    <ButtonText fontFamily='Inter_400Regular'>
                      Cancel
                    </ButtonText>
                  </Button>
                  <Button
                    action='positive'
                    onPress={() => {
                      ShowalertStatus === 'checkin'
                        ? CheckinConfirm()
                        : CheckOutConfirm()
                      setShowAlertDialog(false)
                    }}
                  >
                    <ButtonText fontFamily='Inter_900Black'>
                      {ShowalertStatus === 'checkin' ? 'Check In' : 'Check Out'}
                    </ButtonText>
                  </Button>
                </ButtonGroup>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <View
            bg='$yellow100'
            w={'$full'}
            display={isLocationOpen ? 'flex' : 'none'}
          >
            <Locations
              isOpen={isLocationOpen}
              locationGet={handleLocation}
              onClose={() => setisLocationOpen(false)}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
    height: 90,
    width: 90
  },
  buttonPressed: {
    backgroundColor: '#FF0000'
  }
})

export default Attendance
