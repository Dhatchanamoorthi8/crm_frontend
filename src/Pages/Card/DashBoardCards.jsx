import { Calendar, EmptyTask, EmptyWork } from '@/assets/Icons/SvgIcons'
import { ColorCodes } from '@/src/Components/ColorCodes'
import {
  AvatarFallbackText,
  AvatarImage,
  Card,
  Center,
  Heading,
  Icon,
  Image,
  Menu,
  MenuItem,
  ScrollView
} from '@gluestack-ui/themed'
import { Avatar } from '@gluestack-ui/themed'
import { AvatarBadge } from '@gluestack-ui/themed'
import { View, Text } from '@gluestack-ui/themed'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { RefreshControl } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import Menus from '@/src/Components/Menu'
import { Platform } from 'react-native'
import { VStack } from '@gluestack-ui/themed'
import { HStack } from '@gluestack-ui/themed'
import { Divider } from '@gluestack-ui/themed'
import { MenuItemLabel } from '@gluestack-ui/themed'
import { MenuSeparator } from '@gluestack-ui/themed'
import { TrashIcon, EditIcon } from '@gluestack-ui/themed'
import api from '@/src/Services/axiosConfig'
import Spinner from 'react-native-loading-spinner-overlay'
import ImagePreview from '@/src/Components/ImagePreview'
import DraggableCard from './DraggableCard'
import TaskEditForm from '../TaskForm/TaskEditForm'

const DashBoardCards = ({ user_id, isRefresh, setisRefresh }) => {
  const nav = useNavigation()

  const focus = useIsFocused()

  const [refreshing, setRefreshing] = useState(false)

  const [loader, setloader] = useState(false)

  const [CardCount, SetCardCount] = useState({
    newEnquiry: 0,
    Followup: 0
  })

  const target = 10
  const currentProgress = CardCount.newEnquiry

  const fillPercentage = (Number(currentProgress) / Number(target)) * 100

  const [TableData, SetTableData] = useState([])

  const [TaskData, SetTaskData] = useState([])

  const [isEdittaskData, setisEdittaskData] = useState({
    isopen: false,
    taskid: null,
    taskData: {}
  })

  const handlePartynameclick = async item => {
    const Props = {
      id: item
    }
    nav.navigate('Followup', { Props })
  }

  const handleDeleteTask = (id, taskname) => {
    try {
      Alert.alert(
        'Delete Task',
        `Do you want to delete this task: "${taskname}"?`,
        [
          {
            text: 'No',
            onPress: () => console.log('Task deletion cancelled'),
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: async () => {
              await deletetask()
            }
          }
        ],
        { cancelable: true }
      )

      // Function to delete the task
      async function deletetask () {
        try {
          const response = await api.delete(`user-task/${id}`)
          if (response.status === 200) {
            fetchData()
            Alert.alert(
              'Task Deleted',
              `The task "${taskname}" has been deleted successfully.`
            )
            // Update your local state or refresh task list here
          }
        } catch (error) {
          console.error('Error deleting task:', error)
          Alert.alert(
            'Deletion Failed',
            'There was an error while trying to delete the task. Please try again.'
          )
        }
      }
    } catch (error) {
      console.error('Error handling task delete:', error)
    }
  }

  const handleEditTask = (id, taskname, index) => {
    try {
      // Retrieve task data from the index
      const taskToEdit = TaskData[index]

      // Check if the task exists
      if (!taskToEdit) {
        console.error(`Task not found at index ${index}`)
        return
      }

      setisEdittaskData(current => ({
        ...current,
        taskid: id,
        isopen: true,
        taskData: taskToEdit
      }))
    } catch (error) {
      console.error('Error handling task edit:', error)
    }
  }

  const fetchData = async () => {
    setloader(true)
    try {
      const [dashboardResponse, taskResponse] = await Promise.all([
        api.get(`dashboard/${user_id}`),
        api.get(`user-task/${user_id}`)
      ])

      if (dashboardResponse.status === 200) {
        setloader(false)
        SetTableData(dashboardResponse.data.followUpClients)
        SetCardCount(prevData => ({
          ...prevData,
          newEnquiry: dashboardResponse.data.newClientsCount,
          Followup: dashboardResponse.data.followUpClientsCount
        }))
        SetTaskData(taskResponse.data)
      }
    } catch (error) {
      console.log(error)
      setloader(false)
    }
  }

  useEffect(() => {
    if (focus) {
      fetchData()
    }
  }, [isRefresh])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const [isImageViewer, setisImageViewer] = useState(false)

  const [ProfileViewImgae, setProfileViewImgae] = useState(null)

  const { width, height } = Dimensions.get('window')
  return (
    <>
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          {/* Cards Section */}

          <Card
            variant='elevated'
            rounded={'$2xl'}
            style={[
              styles.card,
              {
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center'
              }
            ]}
            justifyContent={'space-between'}
          >
            {/* Card 1 */}
            <View style={[styles.cardItem, { flex: 1, maxWidth: width * 0.6 }]}>
              <LinearGradient
                colors={['#fbc2eb', '#a6c1ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientCard}
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
                  <View style={{ position: 'relative' }}>
                    <Menus
                      placement='bottom left'
                      offset={5}
                      className='p-1.5'
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
                    w={'auto'}
                  >
                    <AnimatedCircularProgress
                      size={Platform.OS === 'android' ? 55 : 50}
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
            <View style={[styles.cardItem, { flex: 1, maxWidth: width * 0.6 }]}>
              <LinearGradient
                colors={['#ff8a00', '#e52e71']} // Orange to pink gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientCard}
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
                    w={'auto'}
                  >
                    <AnimatedCircularProgress
                      size={Platform.OS === 'android' ? 55 : 90}
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
          </Card>
          {/* Followup Cards Section */}

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
                    key={item} // Use a unique key for each item
                    onPress={() => handlePartynameclick(item.id)} // Trigger action on press
                    style={{
                      width: '45%',
                      marginBottom: 16
                    }}
                  >
                    <Card
                      key={index}
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
                          fontFamily: 'NunitoSans_Bold',
                          fontSize: 16
                        }}
                        isTruncated={true}
                      >
                        {item.company_name}
                      </Text>
                      <Text
                        fontFamily='NunitoSans_Regular'
                        isTruncated={true}
                        style={{ fontSize: 12 }}
                      >
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

          {/* Task   Cards Section */}

          <View>
            {TaskData.length > 0 ? (
              TaskData.map((item, index) => (
                <DraggableCard index={index}>
                  <Card
                    key={index} // Always include a unique key for items in a list
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
                        <View>
                          <Menu
                            placement='bottom'
                            offset={2}
                            trigger={({ ...triggerProps }) => {
                              return (
                                <TouchableOpacity {...triggerProps}>
                                  <Entypo
                                    name='dots-three-vertical'
                                    size={24}
                                    color='black'
                                  />
                                </TouchableOpacity>
                              )
                            }}
                            style={{ borderRadius: 10 }}
                          >
                            <MenuItem
                              key={'Edit Task'}
                              textValue='Edit Task'
                              onPress={() =>
                                handleEditTask(
                                  item.taskid,
                                  item.Taskname,
                                  index
                                )
                              }
                            >
                              <Icon as={EditIcon} size='sm' mr={'$2'} />
                              <MenuItemLabel
                                size='sm'
                                fontFamily='MonaSans_Black'
                              >
                                Edit Task
                              </MenuItemLabel>
                            </MenuItem>

                            <MenuSeparator />

                            <MenuItem
                              key={'Delete Task'}
                              textValue='Delete Task'
                              onPress={() =>
                                handleDeleteTask(item.taskid, item.Taskname)
                              }
                            >
                              <Icon as={TrashIcon} size='sm' mr={'$2'} />
                              <MenuItemLabel
                                size='sm'
                                fontFamily='MonaSans_Black'
                              >
                                Delete Task
                              </MenuItemLabel>
                            </MenuItem>
                          </Menu>
                        </View>
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
                            {item.taskprofile ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setProfileViewImgae(item.taskprofile)
                                  setisImageViewer(true)
                                }}
                              >
                                <Image
                                  source={{
                                    uri: `data:image/jpeg;base64,${item.taskprofile}`
                                  }}
                                  alt='task-images'
                                  style={{
                                    height: 60,
                                    width: 60,
                                    borderRadius: 14
                                  }}
                                />
                              </TouchableOpacity>
                            ) : (
                              <Avatar
                                className='bg-indigo-600'
                                bg={ColorCodes(item.Taskname)}
                              >
                                <AvatarFallbackText className='text-white'>
                                  {item.Taskname}
                                </AvatarFallbackText>
                              </Avatar>
                            )}

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
                </DraggableCard>
              ))
            ) : (
              <Card
                variant='elevated'
                mx='$2'
                my='$3'
                rounded='$2xl'
                style={styles.card}
              >
                <View mt='$4' marginStart='auto' marginEnd='auto'>
                  <View mx='$12'>
                    <EmptyTask />
                    <Text
                      textAlign='center'
                      fontFamily='MonaSans_SemiBold'
                      my='$2'
                    >
                      There are no tasks in this project yet. Let's add them!
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>

      <Center>
        <Spinner size='large' visible={loader} />
      </Center>

      <ImagePreview
        imageBase64={ProfileViewImgae}
        modalVisible={isImageViewer}
        closeModal={() => setisImageViewer(false)}
      />

      {isEdittaskData.isopen && (
        <TaskEditForm
          isopen={isEdittaskData.isopen}
          onclose={() =>
            setisEdittaskData(current => ({
              ...current,
              isopen: false
            }))
          }
          taskid={isEdittaskData.taskid}
          taskData={isEdittaskData.taskData}
          setisRefresh={setisRefresh}
        />
      )}
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
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#FFFFFF', // White background for card
    borderRadius: 24, // Rounded corners
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow blur radius
    elevation: 5, // Elevation for Android (shadow on Android)
    marginBottom: 20 // Space between cards
  },

  scoreCard: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 10
  },
  cardItem: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'scroll',
    height: 150,
    width: 'auto',
    paddingLeft: 5
  },
  gradientCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20
  }
})

export default DashBoardCards
