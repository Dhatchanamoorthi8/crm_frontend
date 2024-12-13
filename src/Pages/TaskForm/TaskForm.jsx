import React, { useCallback, useState } from 'react'
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

const TaskForm = ({ setShowModal }) => {
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

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null) // Keep track of which task is being updated

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
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    )
    setTasks(updatedTasks)
  }

  const saveTasks = async () => {
    try {
      console.log(tasks)

      const response = await api.post('/user-task', { tasks })

      if (response.status === 201) {
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

  const [base64Image, setBase64Image] = useState('')

  const [uploadedOpen, setUploadedOpen] = useState(false)

  const handleImageUpload = async image => {}

  const handleUploadRest = async image => {
    console.log(image)
  }

  const handleImagePress = async (image, taskIndex) => {
    console.log(image)

    try {
      if (image.id === 12) {
        setUploadedOpen(true)
      } else {
        setSelectedImage(image.source)

        // Convert bundled image to Base64 (use fetch approach)
        const response = await fetch(Image.resolveAssetSource(image.source).uri)
        const blob = await response.blob()
        const reader = new FileReader()

        reader.onloadend = () => {
          const base64String = `data:image/jpeg;base64,${reader.result.split(',')[1]}`; 

          // Update the specific task's profile image
          const updatedTasks = tasks.map((task, i) =>
            i === taskIndex
              ? { ...task, taskprofile: base64String, source: image.source }
              : task
          )
          setTasks(updatedTasks)

          // console.log('Base64 String:', base64String)
        }

        reader.readAsDataURL(blob)
      }
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
                  {tasks.length > 1 && (
                    <>
                      <Tooltip
                        placement='top'
                        trigger={triggerProps => {
                          return (
                            <TouchableOpacity {...triggerProps}>
                              <Icon
                                as={TrashIcon}
                                size='md'
                                onPress={() => removeTask(index)}
                                color='$red600'
                              />
                            </TouchableOpacity>
                          )
                        }}
                      >
                        <TooltipContent>
                          <TooltipText>Tooltip</TooltipText>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
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
                      value={task.Taskname}
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
                      value={task.Description}
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
                    {TaskImages.map((image, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleImagePress(image, index)}
                        style={[
                          styles.imageWrapper,
                          task.source === image.source && styles.selectedImage
                        ]}
                      >
                        <Image source={image.source} style={styles.image} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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
