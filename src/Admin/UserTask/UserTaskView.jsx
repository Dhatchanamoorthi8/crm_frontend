import React, { useEffect, useRef, useState } from 'react'
import api from '@/src/Services/axiosConfig'
import {
  AvatarFallbackText,
  Card,
  Center,
  Icon,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
  ScrollView,
  View,
  VStack
} from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { Calendar, EmptyWork, FilterSvg } from '@/assets/Icons/SvgIcons'
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { ColorCodes } from '@/src/Components/ColorCodes'
import { HStack } from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { AvatarImage } from '@gluestack-ui/themed'
import { Heading } from '@gluestack-ui/themed'
import { Menu } from '@gluestack-ui/themed'
import { Divider } from '@gluestack-ui/themed'
import CalendarComponent from '@/src/Components/CalendarComponent'
import Animated from 'react-native-reanimated'
import Spinner from 'react-native-loading-spinner-overlay'
import { RefreshControl, Box, Badge, BadgeText } from '@gluestack-ui/themed'
import AdminConversation from '@/src/Messages/AdminConversation'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const UserTaskView = ({ route }) => {
  const nav = useNavigation()

  const { userid, userdata } = route.params

  const userRole = useSelector(state => state.user.userData.user.role)

  const userData = useSelector(state => state.user.userData.user)

  const [UserTaskData, SetUserTaskData] = useState([])

  const [isCalendarVisible, setisCalendarVisible] = useState(false)

  const [loader, setloader] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  const [isChatOpen, SetisChatOpen] = useState(false)

  const [messagesCount, setMessagesCount] = useState(null)

  const fetchTaskData = async (mood, range) => {
    const moods = mood === undefined ? 'today' : mood
    console.log(mood, range, 'mood, range')

    setloader(true)

    try {
      const response = await api.get(
        `user-task/adminTaskView/${userid}?mood=${moods}&fromdate=${
          range ? range.fromDate : 'null'
        }&todate=${range ? range.toDate : 'null'}`
      )

      if (response.status === 200) {
        SetUserTaskData(response.data)
        setloader(false)
      }
    } catch (error) {
      setloader(false)
      console.log(error)
    }
  }

  const handleRangeSelect = async range => {
    if (!range && !range.fromDate && !range.toDate) {
      return
    }
    fetchTaskData('custom', range)
    setisCalendarVisible(false)
  }

  async function fetchUnreadMessages () {
    try {
      const response = await api.get(
        `conversation/unread-messages/${userData.userid}/${userData.role}`
      )
      if (response.status === 200) {
        setMessagesCount(response.data.unreadCount)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTaskData()
    fetchUnreadMessages()
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchTaskData()
    fetchUnreadMessages()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card
          variant='elevated'
          mx={'$2'}
          my={'$3'}
          rounded={'$2xl'}
          style={styles.card}
        >
          <View flexDirection='row' gap={'$3'} justifyContent='space-between'>
            <View alignItems='flex-start'>
              <Text fontFamily='MonaSans_Bold' fontSize={'$lg'}>
                User Details
              </Text>
            </View>
            <View alignItems='flex-start' borderRadius={'$full'}>
              <Menu
                placement='bottom'
                offset={-34}
                selectionMode='single'
                trigger={({ ...triggerProps }) => {
                  return (
                    <TouchableOpacity {...triggerProps}>
                      <FilterSvg />
                    </TouchableOpacity>
                  )
                }}
                style={{
                  borderRadius: 10,
                  marginRight: 9
                }}
              >
                <MenuItem
                  key={'ToDay'}
                  textValue='ToDay'
                  onPress={() => fetchTaskData('today')}
                >
                  <MenuItemLabel size='sm' fontFamily='MonaSans_Black'>
                    ToDay
                  </MenuItemLabel>
                </MenuItem>

                <MenuSeparator />

                <MenuItem
                  key={'yesterday'}
                  textValue='yesterday'
                  onPress={() => fetchTaskData('yesterday')}
                >
                  <MenuItemLabel size='sm' fontFamily='MonaSans_Black'>
                    YesterDay
                  </MenuItemLabel>
                </MenuItem>

                <MenuSeparator />

                <MenuItem
                  key={'custome'}
                  textValue='custome'
                  onPress={() => setisCalendarVisible(true)}
                >
                  <MenuItemLabel size='sm' fontFamily='MonaSans_Black'>
                    Custom Day
                  </MenuItemLabel>
                </MenuItem>
              </Menu>
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
            {userdata ? (
              <HStack space='md'>
                <Avatar bg={ColorCodes(userdata.name)}>
                  <AvatarFallbackText className='text-white'>
                    {userdata.name}
                  </AvatarFallbackText>

                  <AvatarImage
                    source={{
                      uri: `data:image/png;base64,${userdata.profile}`
                    }}
                    alt={'User Avatar'} // Optional alt text to suppress the warning
                  />
                </Avatar>
                <VStack>
                  <Heading size='sm' fontFamily='MonaSans_400Regular'>
                    {userdata.name}
                  </Heading>
                  <Text
                    size='sm'
                    style={{ color: '#91929E', fontSize: 14 }}
                    fontFamily='MonaSans_400Regular'
                  >
                    {userdata.desgination}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <EmptyWork />
            )}
          </View>
        </Card>

        <View>
          <Text textAlign='center' fontFamily='NunitoSans_Regular'></Text>
        </View>

        <View>
          {UserTaskData.length > 0 ? (
            UserTaskData.map((item, index) => (
              <>
                <View>
                  <Card
                    key={index}
                    variant='elevated'
                    mx='$2'
                    my='$3'
                    rounded='$2xl'
                    style={styles.card}
                  >
                    <View
                      flexDirection='row'
                      gap='$3'
                      justifyContent='space-between'
                    >
                      <View alignItems='flex-start'>
                        <Text fontFamily='NunitoSans_Bold' fontSize='$xl'>
                          Task
                        </Text>
                      </View>

                      <View alignItems='flex-start'>
                        {messagesCount && messagesCount ? (
                          <TouchableOpacity
                            onPress={() =>
                              nav.navigate('ChatScreen', {
                                userid: userid
                              })
                            }
                          >
                            <Box className='items-center'>
                              <VStack>
                                <Badge
                                  className='z-10 self-end h-[22px] w-[22px] bg-red-600 rounded-full -mb-3.5 -mr-3.5'
                                  variant='solid'
                                  bg='$red600'
                                  rounded={'$full'}
                                >
                                  <BadgeText style={{ color: 'white' }}>
                                    {messagesCount}
                                  </BadgeText>
                                </Badge>

                                <MaterialIcons
                                  name='chat'
                                  size={24}
                                  color='black'
                                />
                              </VStack>
                            </Box>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              nav.navigate('ChatScreen', {
                                userid: userid
                              })
                            }
                          >
                            <MaterialIcons
                              name='chat'
                              size={24}
                              color='black'
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <View my='$5'>
                      <VStack space='4xl'>
                        <HStack
                          space='md'
                          justifyContent='space-between'
                          alignItems='center'
                        >
                          <HStack space='md'>
                            <Avatar
                              className='bg-indigo-600'
                              bg={ColorCodes(item.Taskname)}
                            >
                              <AvatarFallbackText className='text-white'>
                                {item.Taskname}
                              </AvatarFallbackText>

                              <AvatarImage
                                source={{
                                  uri: `data:image/png;base64,${item.taskprofile}`
                                }}
                                alt={'User Avatar'} // Optional alt text to suppress the warning
                              />
                            </Avatar>

                            <VStack>
                              <Text
                                size='sm'
                                fontFamily='NunitoSans_Regular'
                                style={{ color: '#91929E', fontSize: 14 }}
                              >
                                TSN000{index + 1234}
                              </Text>
                              <Text
                                my='$2'
                                size='sm'
                                style={{ color: '#0A1629', fontSize: 18 }}
                                fontFamily='NunitoSans_Bold'
                              >
                                {item.Taskname}
                              </Text>
                            </VStack>
                          </HStack>
                        </HStack>
                      </VStack>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Space between elements
                        gap: 10 // Small gap for alignment
                      }}
                    >
                      {/* Created At Text with Calendar Icon */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5
                        }}
                      >
                        <Calendar color={'#7D8592'} />
                        <Text color='#7D8592' fontFamily='NunitoSans_Regular'>
                          Created{' '}
                          {new Date(item.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }
                          )}
                        </Text>
                      </View>

                      {/* Task Status Badge */}

                      <View
                        style={{
                          backgroundColor:
                            item.TaskStatus === 'Completed'
                              ? '#E0F9F2' // Light green for Completed
                              : item.TaskStatus === 'Pending'
                              ? '#FFF8E1' // Light yellow for Pending
                              : '#E6F3FF', // Light blue for In Progress
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          borderRadius: 12,
                          width: 100,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text
                          style={{
                            color:
                              item.TaskStatus === 'Completed'
                                ? '#28A745' // Dark green for Completed
                                : item.TaskStatus === 'Pending'
                                ? '#FFC107' // Amber for Pending
                                : '#007BFF', // Blue for In Progress
                            fontFamily: 'MonaSans_Bold',
                            fontSize: 12
                          }}
                        >
                          {item.TaskStatus}
                        </Text>
                      </View>
                    </View>

                    <Divider my={'$5'} />

                    <View>
                      <View>
                        <Text color='#0A1629' fontFamily='NunitoSans_Bold'>
                          Project Data
                        </Text>
                      </View>

                      <View my='$3'>
                        <Text color='#0A1629' fontFamily='MonaSans_400Regular'>
                          {item.Description}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              </>
            ))
          ) : (
            <Card
              variant='elevated'
              mx={'$2'}
              my={'$3'}
              rounded={'$2xl'}
              style={styles.card}
            >
              <EmptyWork />
            </Card>
          )}
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType='none'
        visible={isCalendarVisible}
        onRequestClose={() => setisCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setisCalendarVisible(false)}
          />
          <Animated.View style={[styles.imageWrapper]}>
            <CalendarComponent onRangeSelect={handleRangeSelect} />
          </Animated.View>
        </View>
      </Modal>

      <Center>
        <Spinner size={'large'} visible={loader} />
      </Center>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', // White background for card
    borderRadius: 24, // Rounded corners
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  imageWrapper: {
    width: '95%',
    height: '50%',
    borderRadius: 14,
    backgroundColor: 'white',
    padding: 10,
    overflow: 'hidden'
  }
})
export default UserTaskView
