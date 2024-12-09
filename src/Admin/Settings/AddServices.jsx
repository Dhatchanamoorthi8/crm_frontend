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
import { Dimensions } from 'react-native'

const AddServices = () => {
  const screenHeight = Dimensions.get('screen').height

  console.log(screenHeight, 'screenHeight')

  const [ServicesData, SetServicesData] = useState([])

  const [ModelState, SetModelState] = useState({
    isOpen: false,
    type: ''
  })

  const [ServicesEditData, setServicesEditData] = useState({
    s_id: undefined,
    servicename: ''
  })

  const [NewServicesName, SetNewServicesName] = useState({
    servicename: ''
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
      const response = await api.get('services-offer')

      if (response.status === 200) {
        SetServicesData(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlepressEdit = (id, name) => {
    console.log(id, name)
    setServicesEditData(current => ({
      ...current,
      s_id: id,
      servicename: name
    }))

    SetModelState(current => ({ ...current, isOpen: true, type: 'Edit' }))
  }

  const handleSave = async () => {
    if (NewServicesName.servicename === '') {
      SetModelState(c => ({ ...c, isOpen: false, type: '' }))
      setAlertProps({
        alertType: 'Error',
        content: `Please Enter Valid Service Name`,
        renderType: 'toast',
        visible: true
      })

      return
    }
    try {
      const response = await api.post('services-offer', NewServicesName)

      if (response.status === 201) {
        apiCall()
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `Your New ${NewServicesName.servicename} Name successfully!`,
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
      const response = await api.patch(
        `services-offer/${ServicesEditData.s_id}`,
        ServicesEditData
      )
      if (response.status === 200) {
        apiCall()
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `${ServicesEditData.servicename} Name Edited successfully!`,
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
        `services-offer/${ServicesEditData.s_id}`
      )

      console.log(response.data)

      if (response.status === 200) {
        apiCall()
        SetModelState(c => ({ ...c, isOpen: false, type: '' }))
        setAlertProps({
          alertType: 'Success',
          content: `${ServicesEditData.servicename} Name Deleted successfully!`,
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
      await apiCall()
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
        {ServicesData && ServicesData.length > 0 ? (
          ServicesData.map((item, index) => (
            <Card variant='elevated' style={styles.card} key={item.s_id}>
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
                    onPress={() => handlepressEdit(item.s_id, item.servicename)}
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
                    {item.servicename}
                  </Text>
                  <Text
                    textAlign='center'
                    fontFamily='MonaSans_400Regular'
                    style={{ color: '#91929E', fontSize: 14 }}
                  >
                    Services
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
                    }).format(new Date(item.createdAt))}
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
                          defaultValue={ServicesEditData.servicename}
                          value={ServicesEditData.servicename}
                          onChangeText={e =>
                            setServicesEditData(current => ({
                              ...current,
                              servicename: e
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
                          SetNewServicesName(current => ({
                            ...current,
                            servicename: e
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

export default AddServices
