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
  ScrollView,
  InputField
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
import { Alert, StyleSheet } from 'react-native'
import { RefreshControl } from '@gluestack-ui/themed'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  TextareaInput
} from '@gluestack-ui/themed'
import { CloseSvg } from '@/assets/Icons/SvgIcons'
import api from '@/src/Services/axiosConfig'

const TaskEditForm = ({ isopen, onclose, taskid, taskData, setisRefresh }) => {
  const [editedtaskData, SeteditedtaskData] = useState({
    Taskname: taskData.Taskname,
    TaskStatus: taskData.TaskStatus,
    Description: taskData.Description,
    Taskid: taskid
  })

  const handleInputChange = (field, value) => {
    const processedValue = typeof value === 'string' ? value.trim() : value
    SeteditedtaskData(current => ({ ...current, [field]: processedValue }))
  }

  const saveTasks = async () => {
    try {
      if (
        !editedtaskData.Taskname ||
        !editedtaskData.TaskStatus ||
        !editedtaskData.Description
      ) {
        Alert.alert('Error', 'Please Fill All Field Then Save')
        return
      }

      const response = await api.patch(
        `user-task/${editedtaskData.Taskid}`,
        editedtaskData
      )
      if (response.status === 200) {
        setisRefresh(true)
        onclose()
        Alert.alert('Success', 'Your Task Data Edited SuccessFully')
      }
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    resetInputs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  return (
    <>
      <Modal
        isOpen={isopen}
        onClose={onclose}
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
              Edit Task
            </Text>
            <ModalCloseButton>
              <CloseSvg />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <ScrollView
              showsHorizontalScrollIndicator={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <FormControl p={'$2'} rounded={'$lg'}>
                <VStack space='xl'>
                  <VStack space='xs'>
                    <HStack justifyContent='space-between' alignItems='center'>
                      <Text
                        fontFamily='MonaSans_Bold'
                        color='#7D8592'
                        style={{ fontSize: 12 }}
                      >
                        Task
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
                          value={editedtaskData.Taskname}
                          onChangeText={value =>
                            handleInputChange('Taskname', value)
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
                        value={editedtaskData.TaskStatus}
                        onValueChange={value =>
                          handleInputChange('TaskStatus', value)
                        }
                        defaultValue={editedtaskData.TaskStatus}
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
                            <SelectItem
                              label={'Completed'}
                              value={'Completed'}
                            />
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
                          value={editedtaskData.Description}
                          onChangeText={value =>
                            handleInputChange('Description', value)
                          }
                        />
                      </Textarea>
                    </VStack>
                  </VStack>

                  {/* Save Tasks Button */}
                  <Button rounded={'$lg'} onPress={saveTasks} mb='$6'>
                    <Text fontFamily='MonaSans_SemiBold' color='white'>
                      Save Tasks
                    </Text>
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
export default TaskEditForm
