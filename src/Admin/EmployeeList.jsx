import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  AvatarBadge,
  Avatar,
  AvatarImage,
  Card,
  Divider,
  ScrollView,
  VStack,
  HStack,
  Heading,
  View,
  Menu,
  Fab,
  MenuItem,
  AddIcon,
  MenuItemLabel,
  EditIcon,
  TrashIcon,
  ButtonGroup,
  ButtonText
} from '@gluestack-ui/themed'
import { AvatarFallbackText } from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { Text } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { ColorCodes } from '../Components/ColorCodes'
import { Icon } from '@gluestack-ui/themed'
import { MenuSeparator } from '@gluestack-ui/themed'

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
  CloseIcon,
  CheckCircleIcon
} from '@gluestack-ui/themed'
import { Button } from '@gluestack-ui/themed'
import Alerts from '../Components/Alert'
import { Center } from '@gluestack-ui/themed'
import Spinner from 'react-native-loading-spinner-overlay'
import { RefreshControl } from 'react-native-gesture-handler'

const EmployeeList = () => {
  const [CardDatas, SetCardDatas] = useState([])

  const [ShowAlertDialog, setShowAlertDialog] = useState(false)

  const [ShowalertStatus, SetShowalertStatus] = useState('')

  const [inActiveid, SetinActiveid] = useState(null)

  const [loader, setLoader] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const fetchCardData = async () => {
    setLoader(true)
    try {
      const response = await api.get('users')

      if (response.status === 200) {
        SetCardDatas(response.data)
        setLoader(false)
      }
    } catch (error) {
      console.log(error)
      setLoader(false)
    }
  }

  const handlactiveChange = async (id, mood) => {
    if (mood === 'inactive') {
      setShowAlertDialog(true)
      SetinActiveid(id)
      SetShowalertStatus('InActive')
      return
    } else {
      setShowAlertDialog(true)
      SetinActiveid(id)
      SetShowalertStatus('Active')
    }
  }

  const handleActiveConfirm = async () => {
    try {
      const response = await api.post(
        `users/activeUser/${inActiveid}?mood=${ShowalertStatus}`
      )

      if (response.status === 201) {
        fetchCardData()
        setShowAlertDialog(!ShowAlertDialog)
        setAlertProps({
          alertType: 'Success',
          content: `${
            ShowalertStatus === 'InActive'
              ? 'InActive User successfully!'
              : 'Active User successfully!'
          }`,
          renderType: 'toast',
          visible: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCardData()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchCardData()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])
  return (
    <>
      <ScrollView
        style={{ backgroundColor: '#F4F9FD' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardWrapper}>
          {CardDatas && CardDatas.length > 0 ? (
            CardDatas.map((item, index) => (
              <Card variant='elevated' style={styles.card}>
                <View>
                  <VStack space='4xl'>
                    <HStack
                      space='md'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <HStack space='md'>
                        <Avatar
                          className='bg-indigo-600'
                          bg={ColorCodes(item.name)}
                        >
                          <AvatarFallbackText className='text-white'>
                            {item.name}
                          </AvatarFallbackText>

                          <AvatarImage
                            source={{
                              uri: `data:image/png;base64,${item.profile}`
                            }}
                          />
                          {item.isactive ? (
                            <AvatarBadge bg='$green400' />
                          ) : (
                            <AvatarBadge bg='$red400' />
                          )}
                        </Avatar>
                        <VStack>
                          <Heading size='sm' fontFamily='MonaSans_400Regular'>
                            {item.name}
                          </Heading>
                          <Text
                            size='sm'
                            style={{ color: '#91929E', fontSize: 14 }}
                            fontFamily='MonaSans_400Regular'
                          >
                            {item.designationName}
                          </Text>
                        </VStack>
                      </HStack>

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
                            key={1}
                            textValue='Add account'
                            onPress={() =>
                              handlactiveChange(
                                item.user_id,
                                'active',
                                item.name
                              )
                            }
                          >
                            <Icon as={CheckCircleIcon} size='sm' mr={'$2'} />
                            <MenuItemLabel
                              size='sm'
                              fontFamily='MonaSans_Black'
                            >
                              Active
                            </MenuItemLabel>
                          </MenuItem>

                          <MenuSeparator />

                          <MenuItem
                            key={2}
                            textValue='Settings'
                            onPress={() =>
                              handlactiveChange(
                                item.user_id,
                                'inactive',
                                item.name
                              )
                            }
                          >
                            <Icon as={TrashIcon} size='sm' mr={'$2'} />
                            <MenuItemLabel
                              size='sm'
                              fontFamily='MonaSans_Black'
                            >
                              InActive
                            </MenuItemLabel>
                          </MenuItem>
                        </Menu>
                      </View>
                    </HStack>
                  </VStack>
                </View>
                <Divider my={'$5'} />

                <View
                  display='flex'
                  flexDirection='row'
                  justifyContent='space-between'
                  my={'$5'}
                >
                  <View>
                    <Text
                      style={{ color: '#91929E', fontSize: 14 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      Gender
                    </Text>

                    <Text
                      style={{ color: '#0A1629', fontSize: 16 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      Male
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{ color: '#91929E', fontSize: 14 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      Birthday
                    </Text>

                    <Text
                      style={{ color: '#0A1629', fontSize: 16 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      {item.DOB}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{ color: '#91929E', fontSize: 14 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      Full age
                    </Text>

                    <Text
                      style={{ color: '#0A1629', fontSize: 16 }}
                      fontFamily='MonaSans_400Regular'
                    >
                      {item.age}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={{ color: '#91929E', fontSize: 14 }}
                    fontFamily='MonaSans_400Regular'
                  >
                    Position
                  </Text>

                  <Text
                    style={{ color: '#0A1629', fontSize: 16 }}
                    fontFamily='MonaSans_400Regular'
                  >
                    {item.designationName}
                  </Text>
                </View>
              </Card>
            ))
          ) : (
            <>
              <Center>
                <Spinner size={'large'} visible={true} />
              </Center>
              <Text textAlign='center' mt='$4'>
                No results found.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <AlertDialog
        isOpen={ShowAlertDialog}
        onClose={() => {
          setShowAlertDialog(false)
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size='lg' fontFamily='MonaSans_Bold'>
              {ShowalertStatus === 'InActive' ? 'InActive User' : 'Active User'}
            </Heading>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size='sm' fontFamily='MonaSans_Black'>
              {ShowalertStatus === 'InActive'
                ? 'Are You Sure Inactive This User'
                : 'Are You Sure Active This User'}
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
                <ButtonText fontFamily='MonaSans_Black'>Cancel</ButtonText>
              </Button>
              <Button action='negative' onPress={() => handleActiveConfirm()}>
                <ButtonText fontFamily='MonaSans_Black'>
                  {ShowalertStatus === 'InActive' ? 'InActive' : 'Active'}
                </ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 5,
    paddingVertical: 10
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

export default EmployeeList
