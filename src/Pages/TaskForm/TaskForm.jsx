import React, { useCallback, useEffect, useState } from 'react'
import {
  FormControl,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  HStack,
  Icon,
  ScrollView
} from '@gluestack-ui/themed'
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
import { TrashIcon } from '@gluestack-ui/themed'
import { Alert, Image, TouchableOpacity } from 'react-native'
import { Tooltip, TooltipContent, TooltipText } from '@gluestack-ui/themed'
import { AddSvg } from '@/assets/Icons/SvgIcons'
import { View } from '@gluestack-ui/themed'
import { TextareaInput } from '@gluestack-ui/themed'
import { InputField } from '@gluestack-ui/themed'
import api from '@/src/Services/axiosConfig'
import { Center } from '@gluestack-ui/themed'
import Alerts from '@/src/Components/Alert'
import { StyleSheet } from 'react-native'
import TaskImages from '@/assets/Icons/TaskSvg'
import { launchImageLibrary } from 'react-native-image-picker'
import FileUpload from '@/src/Components/FileUpload'
import { RefreshControl } from '@gluestack-ui/themed'
import { preloadTaskImages } from '@/src/Hooks/usePreloadAvatar'
import * as FileSystem from 'expo-file-system'
import { Box } from '@gluestack-ui/themed'
const TaskForm = ({ setShowModal, setisRefresh }) => {
  const [tasks, setTasks] = useState([
    {
      Taskname: '',
      TaskStatus: '',
      Description: '',
      taskprofile: '',
      source: null
    }
  ])

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        Taskname: '',
        TaskStatus: '',
        Description: '',
        taskprofile: '',
        source: null
      }
    ])
  }

  const removeTask = index => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const handleInputChange = (index, field, value) => {
    const processedValue = typeof value === 'string' ? value.trim() : value
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: processedValue } : task
    )
    setTasks(updatedTasks)
  }

  const saveTasks = async () => {
    const incompleteTasks = tasks.some(
      task =>
        !task.Taskname ||
        !task.TaskStatus ||
        !task.Description ||
        !task.taskprofile
    )

    if (incompleteTasks) {
      setShowModal(false)
      setAlertProps({
        alertType: 'Error',
        content: 'Please fill in all fields for each task before submitting.',
        renderType: 'toast',
        visible: true
      })
      return
    }

    try {
      const response = await api.post('/user-task', { tasks })

      if (response.status === 201) {
        setisRefresh(true)
        setAlertProps({
          alertType: 'Success',
          content: 'Your Task has been submitted successfully!',
          renderType: 'toast',
          visible: true
        })

        setShowModal(false)

        //alert('Tasks saved successfully!')
      }
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  const [selectedImage, setSelectedImage] = useState(null)

  const [uploadedOpen, setUploadedOpen] = useState(false)

  const [preloadedTaskimg, setpreloadedTaskimg] = useState([])

  const [selectedIndex, setselectedIndex] = useState(null)

  const handleImageUpload = async image => {
    const imagestring = `${image}`
    const updatedTasks = tasks.map((task, i) =>
      i === selectedIndex ? { ...task, taskprofile: imagestring } : task
    )

    setTasks(updatedTasks)
  }

  const handleUploadRest = async image => {
    const updatedTasks = tasks.map((task, i) =>
      i === taskIndex ? { ...task, taskprofile: '' } : task
    )
    setTasks(updatedTasks)
    setSelectedImages(prevImages =>
      prevImages.filter((_, idx) => idx !== taskIndex)
    )
  }

  const handleImagePress = async (image, taskIndex) => {
    const imageName = image.split('/').pop()
    setselectedIndex(taskIndex)

    console.log(`Image Name: ${imageName}`, typeof imageName)

    if (imageName === '12') {
      setUploadedOpen(true)
      return
    }

    try {
      const base64String = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64
      })

      const imagestring = `${base64String}`

      const updatedTasks = tasks.map((task, i) =>
        i === taskIndex ? { ...task, taskprofile: imagestring } : task
      )
      setSelectedImage(image)
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Error converting to Base64:', error)
      Alert.alert('Error', 'Failed to select or convert the image.')
    }
  }

  const [refreshing, setRefreshing] = useState(false)

  const resetInputs = () => {
    setTasks([
      {
        Taskname: '',
        TaskStatus: '',
        Description: '',
        taskprofile: '',
        source: null
      }
    ])
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    resetInputs()
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

  useEffect(() => {
    const loadAvatars = async () => {
      const uris = await preloadTaskImages()
      setpreloadedTaskimg(uris)
    }

    loadAvatars()
  }, [])

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FormControl p={'$2'} rounded={'$lg'}>
          <VStack space='xl'>
            {tasks.map((task, index) => (
              <VStack key={index} space='xs'>
                <HStack justifyContent='space-between' alignItems='center'>
                  <Text
                    fontFamily='MonaSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 12 }}
                  >
                    Task {index + 1}
                  </Text>
                </HStack>

                {/* Task Name */}
                <VStack space='xs' my='$2'>
                  <Text
                    fontFamily='MonaSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 14 }}
                  >
                    Task Name
                  </Text>
                  <Input style={{ borderRadius: 14 }}>
                    <InputField
                      //value={task.Taskname}
                      onChangeText={value =>
                        handleInputChange(index, 'Taskname', value)
                      }
                      placeholder='Task Name...'
                      fontFamily='MonaSans_400Regular'
                      style={{ fontSize: 15 }}
                    />
                  </Input>
                </VStack>

                {/* Task Status */}

                <VStack space='xs' my='$2'>
                  <Text
                    fontFamily='MonaSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 14 }}
                  >
                    Task Status
                  </Text>

                  <Select
                    value={task.TaskStatus}
                    onValueChange={value =>
                      handleInputChange(index, 'TaskStatus', value)
                    }
                    key={refreshing}
                  >
                    <SelectTrigger
                      variant='outline'
                      size='md'
                      style={{ borderRadius: 14 }}
                    >
                      <SelectInput
                        placeholder='Select Task Status'
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
                        <SelectItem label={'Completed'} value={'Completed'} />
                        <SelectItem label={'Pending'} value={'Pending'} />
                        <SelectItem label='On Progress' value='Progress' />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </VStack>

                {/* Description */}
                <VStack space='xs' my='$2'>
                  <Text
                    fontFamily='MonaSans_Bold'
                    color='#7D8592'
                    style={{ fontSize: 14 }}
                  >
                    Description
                  </Text>
                  <Textarea
                    size='md'
                    isReadOnly={false}
                    isInvalid={false}
                    isDisabled={false}
                    style={{ borderRadius: 14 }}
                  >
                    <TextareaInput
                      size='sm'
                      placeholder='Add some description of the project'
                      color='#7D8592'
                      fontFamily='MonaSans_400Regular'
                      //value={task.Description}
                      onChangeText={value =>
                        handleInputChange(index, 'Description', value)
                      }
                    />
                  </Textarea>
                </VStack>

                {/* Task Profile Images */}

                <View style={styles.container}>
                  <View my='$3'>
                    <Text
                      color='#0A1629'
                      fontFamily='MonaSans_Bold'
                      style={{ fontSize: 18 }}
                    >
                      Select image
                    </Text>

                    <Text
                      style={{ fontSize: 16 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      Select or upload an avatar for the project (available
                      formats: jpg, png)
                    </Text>
                  </View>
                  <View style={styles.imageGrid}>
                    {preloadedTaskimg.map((uri, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleImagePress(uri, index)}
                        style={[
                          styles.imageWrapper,
                          selectedImage === uri && styles.selectedImage
                        ]}
                      >
                        <Image source={{ uri }} style={styles.image} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* <View>
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
                </View> */}
              </VStack>
            ))}

            {/* Add Task Button */}

            <View>
              <TouchableOpacity
                onPress={addTask}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <AddSvg style={{ marginRight: 10 }} />

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#3F8CFF',
                    marginLeft: 10
                  }}
                >
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>

            {/* Save Tasks Button */}
            <Button rounded={'$lg'} onPress={saveTasks} mb='$6'>
              <Text fontFamily='MonaSans_SemiBold' color='white'>
                Save Tasks
              </Text>
            </Button>
          </VStack>
        </FormControl>
      </ScrollView>

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

      {/* Show the file upload modal when the button is pressed */}
      <FileUpload
        isOpen={uploadedOpen}
        onClose={() => setUploadedOpen(false)}
        images={handleImageUpload}
        ClearImage={handleUploadRest}
        fileData={(filename, size) => uploadFileData(filename, size)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#CED5E0'
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  imageWrapper: {
    margin: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 5,
    borderRadius: 8
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  selectedImage: {
    borderColor: '#3498db'
  }
})
export default TaskForm
