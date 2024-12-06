import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {
  AddIcon,
  Card,
  Fab,
  View,
  Text,
  FabIcon,
  ScrollView,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  Icon,
  ModalBody,
  Input,
  InputField,
  Button,
  ButtonText,
  TrashIcon,
  EditIcon,
  FormControl
} from '@gluestack-ui/themed'
import api from '@/src/Services/axiosConfig'
import { EditSvg } from '@/assets/Icons/SvgIcons'
import { Modal } from '@gluestack-ui/themed'
import { CloseIcon } from '@gluestack-ui/themed'
import { ButtonIcon } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { RefreshControl } from '@gluestack-ui/themed'
import { Center } from '@gluestack-ui/themed'
import Alerts from '../../Components/Alert'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { Dimensions } from 'react-native'

const AddPosition = () => {
  const screenHeight = Dimensions.get('screen').height

  console.log(screenHeight, 'screenHeight')

  const [DesginationData, setDesginationData] = useState([])

  const [ModelState, SetModelState] = useState({
    isOpen: false,
    type: ''
  })

  const [desginationEditData, setdesginationEditData] = useState({
    Des_id: undefined,
    DesginationName: ''
  })

  const [NewDesginationName, SetNewDesginationName] = useState({
    DesginationName: ''
  })

  const [refreshing, setRefreshing] = useState(false)

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const apiCall = async () => {
    try {
      const response = await api.get('userdesgination')

      if (response.status === 200) {
        setDesginationData(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlepressEdit = (id, name) => {
    console.log(id, name)
    setdesginationEditData(current => ({
      ...current,
      Des_id: id,
      DesginationName: name
    }))

    SetModelState(current => ({ ...current, isOpen: true, type: 'Edit' }))
  }

  const handleSave = async () => {
    if (NewDesginationName.name === '') {
      return
    }

    console.log(NewDesginationName)

    try {
      const response = await api.post('userdesgination', NewDesginationName)

      if (response.status === 201) {
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `Your New ${NewDesginationName.DesginationName} Name successfully!`,
          renderType: 'toast',
          visible: true
        })

        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditConfirm = async () => {
    try {
      const response = await api.patch('userdesgination', desginationEditData)
      if (response.status === 200) {
        apiCall()
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `${desginationEditData.DesginationName} Name Edited successfully!`,
          renderType: 'toast',
          visible: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await api.delete(
        `userdesgination/${desginationEditData.Des_id}`
      )

      console.log(response.data)

      if (response.status === 200) {
        apiCall()
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `${desginationEditData.DesginationName} Name Deleted successfully!`,
          renderType: 'toast',
          visible: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    apiCall()
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await apiCall() // Ensure API call is made when refreshing.
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      style={{ backgroundColor: '#F4F9FD' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.cardWrapper} mb='$2'>
        {DesginationData && DesginationData.length > 0 ? (
          DesginationData.map((item, index) => (
            <Card variant='elevated' style={styles.card} key={item.Des_id}>
              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <View>
                  <Text>{index + 202401}</Text>
                </View>

                <View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      width: 35,
                      borderRadius: 20,
                      backgroundColor: '#F4F9FD',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() =>
                      handlepressEdit(item.Des_id, item.DesginationName)
                    }
                  >
                    <EditSvg />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                my='$4'
              >
                <View style={{ alignItems: 'center' }}>
                  <Text
                    textAlign='center'
                    fontFamily='MonaSans_SemiBold'
                    style={{ color: '#0A1629', fontSize: 16 }}
                  >
                    {item.DesginationName}
                  </Text>
                  <Text
                    textAlign='center'
                    fontFamily='MonaSans_400Regular'
                    style={{ color: '#91929E', fontSize: 14 }}
                  >
                    Designation
                  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text
                    textAlign='center'
                    fontFamily='MonaSans_SemiBold'
                    style={{ color: '#0A1629', fontSize: 16 }}
                  >
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    }).format(new Date(item.created_at))}
                  </Text>
                  <Text
                    textAlign='center'
                    fontFamily='MonaSans_400Regular'
                    style={{ color: '#91929E', fontSize: 14 }}
                  >
                    Created
                  </Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Text textAlign='center' mt='$4'>
            No results found.
          </Text>
        )}
      </View>

      <Modal
        isOpen={ModelState.isOpen}
        onClose={() => {
          SetModelState(current => ({ ...current, isOpen: false, type: '' }))
        }}
        size='full'
        style={{ borderRadius: 50 }}
      >
        <ModalBackdrop />
        <ModalContent
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'white'
          }}
        >
          <ModalHeader>
            <Heading size='md' className='text-typography-950'>
              {ModelState.type === 'Edit' ? 'Edit' : 'Add Desgination'}
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size='md'
                className='stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900'
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {ModelState.isOpen && ModelState.type === 'Edit' && (
              <>
                <FormControl p={'$2'} rounded={'$lg'}>
                  <VStack space='xl'>
                    <VStack space='xs'>
                      <Input
                        variant='outline'
                        size='md'
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        rounded={'$xl'}
                      >
                        <InputField
                          defaultValue={desginationEditData.DesginationName}
                          value={desginationEditData.DesginationName}
                          onChangeText={e =>
                            setdesginationEditData(current => ({
                              ...current,
                              DesginationName: e
                            }))
                          }
                        />
                      </Input>

                      <View
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-around'
                        my={'$5'}
                      >
                        <View>
                          <Button
                            size='md'
                            variant='solid'
                            action='primary'
                            bg='#3F8CFF'
                            onPress={() => handleEditConfirm()}
                          >
                            <ButtonText>Save</ButtonText>
                            <ButtonIcon as={EditIcon} ml={'$2'} />
                          </Button>
                        </View>
                        <View>
                          <Button
                            size='md'
                            variant='solid'
                            action='negative'
                            onPress={() => handleDelete()}
                          >
                            <ButtonText>Delete</ButtonText>
                            <ButtonIcon as={TrashIcon} ml={'$2'} />
                          </Button>
                        </View>
                      </View>
                    </VStack>
                  </VStack>
                </FormControl>
              </>
            )}

            {ModelState.isOpen && ModelState.type === 'New' && (
              <FormControl p={'$2'} rounded={'$lg'}>
                <VStack space='xl'>
                  <VStack space='xs'>
                    <Input
                      variant='outline'
                      size='md'
                      isDisabled={false}
                      isInvalid={false}
                      isReadOnly={false}
                      rounded={'$xl'}
                    >
                      <InputField
                        placeholder='Enter Desgination'
                        fontFamily='MonaSans_400Regular'
                        style={{ fontSize: 15 }}
                        onChangeText={e =>
                          SetNewDesginationName(current => ({
                            ...current,
                            DesginationName: e
                          }))
                        }
                      />
                    </Input>

                    <View>
                      <TouchableOpacity>
                        <Button
                          size='md'
                          variant='solid'
                          action='primary'
                          rounded={'$xl'}
                          marginLeft={'$10'}
                          marginRight={'$10'}
                          my={'$3'}
                          onPress={handleSave}
                        >
                          <ButtonText>Save</ButtonText>
                        </Button>
                      </TouchableOpacity>
                    </View>
                  </VStack>
                </VStack>
              </FormControl>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Fab
        size='lg'
        isHovered={true}
        onPress={() =>
          SetModelState(current => ({
            ...current,
            isOpen: true,
            type: 'New'
          }))
        }
      >
        <FabIcon as={AddIcon} />
      </Fab>

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
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  }
})

export default AddPosition
