import { Center, Fab, FabIcon, Icon, Text, View } from '@gluestack-ui/themed'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import api from '../Services/axiosConfig'
import store from '../../Store/store'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { CalendarDaysIcon } from '@gluestack-ui/themed'
import { AddIcon } from '@gluestack-ui/themed'
import { CloseSvg } from '@/assets/Icons/SvgIcons'
import {
  Modal,
  ModalHeader,
  Heading,
  ModalCloseButton,
  ModalBackdrop,
  ModalContent,
  ModalBody
} from '@gluestack-ui/themed'

import Spinner from 'react-native-loading-spinner-overlay'
import TaskForm from './TaskForm/TaskForm'
import DashBoardCards from './Card/DashBoardCards'

const DashBoardPage = () => {
  const state = store.getState()

  const userData = state.user.userData.user

  const user_id = state.user.userData.user.userid

  const focus = useIsFocused()

  const [showModal, setShowModal] = useState(false)

  const nav = useNavigation()

  const [refreshing, setRefreshing] = useState(false)

  const [loader, setloader] = useState(false)

  const [showAll, setShowAll] = useState(false)

  const [isRefresh, setisRefresh] = useState(false)

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
  }, [])

  const getFormattedDate = () => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(new Date())
  }

  return (
    <>
      <ScrollView className='bg-lightBackground dark:bg-black'>
        {userData ? (
          <View flex={1}>
            <View mx='$3' my='$3'>
              <Text
                fontFamily='NunitoSans_Regular'
                textTransform='capitalize'
                color='#7D8592'
              >
                Welcome back, {userData.username} !
              </Text>
            </View>

            <View
              mx='$3'
              my='$3'
              bg='#E6EDF5'
              p='$3'
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'flex-start',
                borderRadius: 14
              }}
            >
              <View
                flexDirection='row'
                alignItems='center'
                gap='$5'
                justifyContent='center'
              >
                <Icon
                  as={CalendarDaysIcon}
                  className='text-typography-500 m-2 w-4 h-4'
                />
                <Text
                  style={{ fontSize: 16 }}
                  fontFamily='NunitoSans_Regular'
                  color='black'
                >
                  {getFormattedDate()}
                </Text>
              </View>
            </View>

            {/* Followup Cards Section */}
            <View>
              <DashBoardCards
                user_id={user_id}
                isRefresh={isRefresh}
                setisRefresh={setisRefresh}
              />

              <Center>
                <Spinner size='large' visible={loader} />
              </Center>
            </View>
          </View>
        ) : (
          <Center>
            <Spinner size='large' visible={loader} />
          </Center>
        )}

        {/* Floating Action Button */}
        <Fab
          size='lg'
          placement='bottom right'
          backgroundColor='#000'
          onPress={() => setShowModal(true)}
        >
          <FabIcon as={AddIcon} />
        </Fab>
      </ScrollView>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size='full'
        p='$2'
        style={{ borderRadius: 50 }}
      >
        <ModalBackdrop />
        <ModalContent
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'white',
            height: '99.5%', // Set modal height to leave space at the top and bottom
            marginTop: 1, // 2px from top
            marginBottom: 2
          }}
        >
          <ModalHeader>
            <Heading size='md' className='text-typography-950'>
              Add Task
            </Heading>
            <ModalCloseButton>
              <CloseSvg />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody
            style={{
              flex: 1 // Make sure body takes the remaining space
            }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <TaskForm
                setShowModal={setShowModal}
                setisRefresh={setisRefresh}
              />
            </ScrollView>
          </ModalBody>
        </ModalContent>
      </Modal>
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
    borderRadius: 13, // Rounded corners
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow blur radius
    elevation: 5, // Elevation for Android (shadow on Android)
    marginBottom: 20 // Space between cards
  }
})

export default DashBoardPage
