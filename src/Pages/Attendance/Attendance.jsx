import { Center, Text, View } from '@gluestack-ui/themed'
import { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { getUniqueId, getManufacturer } from 'react-native-device-info'
import store from '../../../Store/store'
import Locations from '../../Components/Location'
import api from '@/src/Services/axiosConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions } from 'react-native'
import { FlatList } from '@gluestack-ui/themed'
import {
  BreakSvg,
  CheckInSvg,
  CheckOutSvg,
  TotalDaySvg,
  TotalHoursSvg
} from '@/assets/Icons/SvgIcons'
import SwipeButton from '@/src/Components/SwipeButton'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { ScrollView } from '@gluestack-ui/themed'
import { RefreshControl } from 'react-native-gesture-handler'
import { Animated } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
const { width, height } = Dimensions.get('window')

const Attendance = () => {
  const state = store.getState()

  const focus = useIsFocused()

  const [selectedDate, setSelectedDate] = useState(null)

  const [dates, setDates] = useState([])

  const navigation = useNavigation()

  const [refreshing, setRefreshing] = useState(false)

  const [loader, setLoader] = useState(false) // Loader state

  const [isLocationOpen, setisLocationOpen] = useState(false)

  const [attendanceMood, setattendanceMood] = useState('')

  const [deviceUniqueid, setdeviceUniqueid] = useState(null)

  const userData = state.user.userData.user

  const user_id = state.user.userData.user.userid

  const [attendanceTime, setattendanceTime] = useState({
    intime: '',
    outtime: '',
    totalHours: ''
  })

  const [AttendanceMsg, SetAttendanceMsg] = useState('')

  const DeviceUniqueid = async () => {
    await getUniqueId().then(uniqueId => setdeviceUniqueid(uniqueId))
  }

  const handleLocation = async location => {
    try {
      if (location) {
        attendanceMood === 'checkin'
          ? CheckinConfirm(location)
          : CheckOutConfirm(location)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const generateWeekDates = () => {
    const today = new Date()
    const weekDates = []
    let daysAdded = 0

    for (let i = 0; daysAdded < 6; i--) {
      const date = new Date()
      date.setDate(today.getDate() + i)

      if (date.getDay() === 0) {
        continue // Skip Sundays
      }

      weekDates.push({
        day: date.getDate().toString().padStart(2, '0'),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        formattedDate: date.toISOString().split('T')[0],
        active: i === 0 // Default the first date as active
      })

      daysAdded++
    }

    setDates(weekDates.reverse())
  }

  useEffect(() => {
    if (focus) {
      setLoader(true) // Start loader
      DeviceUniqueid()
      generateWeekDates()
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0]
      setSelectedDate(formattedDate)
      fetchAttendance(formattedDate).then(() => setLoader(false)) // Stop loader after fetching
    }
  }, [focus])

  const handleCheckIn = async () => {
    try {
      DeviceUniqueid()
      setattendanceMood('checkin')
      setisLocationOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheckOut = async () => {
    try {
      DeviceUniqueid()
      setattendanceMood('checkout')
      setisLocationOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const CheckinConfirm = async location => {
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

      const locations = {
        latitude: location.latitude,
        longitude: location.longitude
      }
      const alldata = { ...locations, intime, uniqueid: deviceUniqueid }

      const response = await api.post('attendance/checkIn', alldata)

      if (response.status === 201) {
        fetchAttendance()
        console.log('check in Confirmed')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const CheckOutConfirm = async location => {
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

      const locations = {
        latitude: location.latitude,
        longitude: location.longitude
      }
      const alldata = { ...locations, Outtime, uniqueid: deviceUniqueid }
      const response = await api.patch(
        `attendance/checkout/${user_id}`,
        alldata
      )
      if (response.status === 200) {
        fetchAttendance()
        console.log('check out Confirmed')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchAttendance = async date => {
    const searchdate = date ? date : new Date()
    SetAttendanceMsg('')
    setLoader(true)
    try {
      const response = await api.get(
        `attendance/attendanceFind/${user_id}/${searchdate}`
      )

      if (response.status === 200 && response.data.status === 'Present') {
        setattendanceTime(prevData => ({
          ...prevData,
          intime: response.data.formattedIntime,
          outtime: response.data.formattedOuttime,
          totalHours: response.data.exactWorkingHours || null
        }))

        return
      }

      if (response.status === 200 && response.data.status === 'Absent') {
        setattendanceTime(prevData => ({
          ...prevData,
          intime: response.data.formattedIntime,
          outtime: response.data.formattedOuttime,
          totalHours: response.data.exactWorkingHours || null
        }))
        SetAttendanceMsg(response.data.status)
        return
      }
      if (response.status === 200 && response.data.status === '') {
        setattendanceTime(prevData => ({
          ...prevData,
          intime: response.data.formattedIntime,
          outtime: response.data.formattedOuttime,
          totalHours: response.data.exactWorkingHours || null
        }))
        SetAttendanceMsg('')
        return
      }
    } catch (error) {
      console.log(error)
      setattendanceTime(current => ({
        ...current,
        intime: '',
        outtime: '',
        totalHours: ''
      }))
    } finally {
      setLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    setSelectedDate(formattedDate)
    setRefreshing(true)
    fetchAttendance(formattedDate).then(() => setLoader(false)) // Stop loader after fetching
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const splitDateTime = datetime => {
    if (!datetime || typeof datetime !== 'string') {
      return null
    }

    const lastSpaceIndex = datetime.lastIndexOf(' ')
    const date = datetime.slice(0, lastSpaceIndex - 5)
    const time = datetime.slice(lastSpaceIndex - 5)
    return { date, time }
  }

  function dateFormatted (date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
  }

  // console.log(typeof(attendanceTime.intime),attendanceTime.intime,"attendanceTime.intime" )
  // console.log(typeof(attendanceTime.outtime),attendanceTime.outtime,"attendanceTime.outtime" )

  console.log(attendanceTime.intime === '' && AttendanceMsg === '','button status')
  return (
    <>
      <ScrollView
        flex={1}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <LinearGradient
            colors={['#F4F9FD', '#F4F9FD']}
            style={styles.gradient}
          >
            <FlatList
              data={dates}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(item.formattedDate)
                    fetchAttendance(item.formattedDate)
                  }}
                >
                  <View
                    style={[
                      styles.dateBox,
                      item.formattedDate === selectedDate &&
                        styles.activeDateBox
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        item.formattedDate === selectedDate &&
                          styles.activeDateText
                      ]}
                    >
                      {item.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateLabel,
                        item.formattedDate === selectedDate &&
                          styles.activeDateLabel
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.sectionTitle} mt='$2'>
              Today Attendance
            </Text>

            <View style={styles.attendanceCardWrapper}>
              <View style={styles.attendanceCard}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$7'
                    w='$7'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <CheckInSvg />
                  </View>

                  <View my='$1' mx='$2'>
                    <Text style={styles.attendanceLabel}>Check In</Text>
                  </View>
                </View>
                <Text style={styles.attendanceTime}>09:30 am</Text>
                <Text style={styles.attendanceStatus}>On Time</Text>
              </View>

              <View style={styles.attendanceCard}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$7'
                    w='$7'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <CheckOutSvg />
                  </View>

                  <View my='$1' mx='$2'>
                    <Text style={styles.attendanceLabel}>Check Out</Text>
                  </View>
                </View>
                <Text style={styles.attendanceTime}>06:30 pm</Text>
                <Text style={styles.attendanceStatus}>Go Home</Text>
              </View>

              <View style={styles.attendanceCard}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$7'
                    w='$7'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <BreakSvg />
                  </View>

                  <View my='$1' mx='$2'>
                    <Text style={styles.attendanceLabel}>Break Time</Text>
                  </View>
                </View>
                <Text style={styles.attendanceTime}>00:30 min</Text>
                <Text style={styles.attendanceStatus}>Avg Time 30 min</Text>
              </View>

              <View style={styles.attendanceCard}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$7'
                    w='$7'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <TotalDaySvg />
                  </View>

                  <View my='$1' mx='$2'>
                    <Text style={styles.attendanceLabel}>Total Days</Text>
                  </View>
                </View>
                <Text style={styles.attendanceTime}>28 Days</Text>
                <Text style={styles.attendanceStatus}>Working Days</Text>
              </View>
            </View>

            <View style={styles.activityHeader}>
              <Text style={styles.sectionTitle}>Your Activity</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AttendaceHistory')}
              >
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityDetails}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$10'
                    w='$10'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <CheckInSvg />
                  </View>

                  <View mx='$2'>
                    <Text
                      style={{
                        fontFamily: 'NunitoSans_Bold',
                        color: '#000'
                      }}
                    >
                      Check In
                    </Text>
                    <Text style={styles.activityDate}>
                      {dateFormatted(selectedDate)}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: 'NunitoSans_Bold',
                      color: '#000'
                    }}
                  >
                    {attendanceTime.intime &&
                      splitDateTime(attendanceTime.intime).time}
                  </Text>

                  <Text style={styles.activityDate}>On Time</Text>
                </View>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityDetails}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$10'
                    w='$10'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <CheckOutSvg />
                  </View>

                  <View mx='$2'>
                    <Text
                      style={{
                        fontFamily: 'NunitoSans_Bold',
                        color: '#000'
                      }}
                    >
                      Check Out
                    </Text>
                    <Text style={styles.activityDate}>
                      {dateFormatted(selectedDate)}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: 'NunitoSans_Bold',
                      color: '#000'
                    }}
                  >
                    {attendanceTime.outtime &&
                      splitDateTime(attendanceTime.outtime).time}
                  </Text>

                  <Text style={styles.attendanceStatus}>On Time</Text>
                </View>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityDetails}>
                <View display='flex' flexDirection='row'>
                  <View
                    h='$10'
                    w='$10'
                    bg='$blue100'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius={'$lg'}
                  >
                    <TotalHoursSvg />
                  </View>

                  <View mx='$2'>
                    <Text
                      style={{
                        fontFamily: 'NunitoSans_Bold',
                        color: '#000'
                      }}
                    >
                      Total Hours
                    </Text>
                    <Text style={styles.activityDate}>
                      {dateFormatted(selectedDate)}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: 'NunitoSans_Bold',
                      color: '#000'
                    }}
                  >
                    {attendanceTime.totalHours}
                  </Text>

                  <Text style={styles.attendanceStatus}>On Time</Text>
                </View>
              </View>
            </View>

            <View style={styles.swipeButtonWrapper}>
              {attendanceTime.intime === '' && AttendanceMsg === '' && (
                <SwipeButton
                  title='Swipe to Check In'
                  backgroundColor='#4285F4'
                  onComplete={handleCheckIn}
                />
              )}

              {attendanceTime.intime !== '' &&  attendanceTime.outtime === 'null' && (
                <SwipeButton
                title='Swipe to Check Out'
                backgroundColor='#cb202d'
                onComplete={handleCheckOut}
                />
              )}

            </View>

            {AttendanceMsg !== '' && (
              <View style={styles.errorContainer}>
                <Text
                  fontFamily='NunitoSans_Bold'
                  color='$white'
                  textAlign='center'
                >
                  {`Absent This ${dateFormatted(selectedDate)}`}
                </Text>
              </View>
            )}

            {attendanceTime.intime !== '' && attendanceTime.outtime !== 'null' && (
              <View style={styles.successContainer} mb='$10'>
                <Text
                  fontFamily='NunitoSans_Bold'
                  color='$white'
                  textAlign='center'
                >
                  {`You Have Done Ur ${dateFormatted(selectedDate)} Attendance`}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </ScrollView>

      <Center>
        <Spinner size={'large'} visible={loader} />
      </Center>

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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 10
  },
  dateBox: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 2,
    borderRadius: 10,
    backgroundColor: '#FFF'
  },
  activeDateBox: {
    backgroundColor: '#007AFF'
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  activeDateText: {
    color: '#FFF'
  },
  dateLabel: {
    fontSize: 14,
    color: '#8E8E8E'
  },
  activeDateLabel: {
    color: '#FFF'
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 5,
    color: '#000',
    fontFamily: 'NunitoSans_Bold'
  },
  attendanceCardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 0
  },
  attendanceCard: {
    width: width * 0.45,
    height: height * 0.13,
    padding: 16,
    marginVertical: 5,
    borderRadius: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  attendanceLabel: {
    fontSize: 14,
    color: '#8E8E8E',
    fontFamily: 'NunitoSans_Regular'
  },
  attendanceTime: {
    fontSize: 18,
    fontFamily: 'NunitoSans_Bold',
    marginVertical: 1,
    color: '#000'
  },
  attendanceStatus: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'NunitoSans_Regular'
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  viewAll: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'NunitoSans_Regular'
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'NunitoSans_Bold',
    color: '#000'
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  activityTime: {
    fontSize: 14,
    color: '#8E8E8E',
    fontFamily: 'NunitoSans_Regular'
  },
  activityDate: {
    fontSize: 14,
    color: '#8E8E8E',
    fontFamily: 'NunitoSans_Regular'
  },
  activityStatus: {
    fontSize: 12,
    color: '#8E8E8E',
    fontFamily: 'NunitoSans_Regular'
  },
  swipeButtonWrapper: {
    paddingHorizontal: 10,
    zIndex: 1,
    alignItems: 'center'
  },
  swipeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  swipeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'NunitoSans_Bold'
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 8,
    marginHorizontal: 20
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'NunitoSans_Bold'
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4BB543',
    borderRadius: 8,
    marginHorizontal: 20
  }
})

export default Attendance
