import React, { useCallback, useEffect, useState } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native'
import { View, Text } from '@gluestack-ui/themed'
import { Keyboard } from 'react-native'
import { ScrollView } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { RefreshControl } from '@gluestack-ui/themed'
import Alerts from '../../Components/Alert'
import { Center } from '@gluestack-ui/themed'
import Attendance from './Attendance'
import AttendaceHistory from './AttendaceHistory'

const { width } = Dimensions.get('window')

const AttendanceTab = () => {
  const navigation = useNavigation()

  const [activeTab, setActiveTab] = useState(0)

  const [showModal, setShowModal] = useState(false)

  const translateX = new Animated.Value(0)

  const tabs = ['Attendance', 'History']

  const [DatePickerOpen, setDatePickerOpen] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  const handleTabSwitch = (index, type) => {
    if (type !== 'settings') {
      setActiveTab(index)
      Animated.spring(translateX, {
        toValue: index * (width / 2),
        useNativeDriver: true
      }).start()
    }
  }

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    restInputs()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Animated.View
            style={[styles.activeTabIndicator, { transform: [{ translateX }] }]}
          />

          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabButton,
                activeTab === index && styles.activeTabButton
              ]}
              onPress={() => handleTabSwitch(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index ? styles.activeTabText : {}
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 0 ? (
            <View>
              <Attendance />
            </View>
          ) : (
            <View>
              <AttendaceHistory />
            </View>
          )}
        </View>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: '#F4F9FD',
    padding: 1
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EDF5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    overflow: 'hidden',
    width: '100%',
    height: 50
  },
  activeTabIndicator: {
    position: 'absolute',
    height: '100%',
    width: width / 2,
    borderRadius: 25,
    zIndex: 0
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 1,
    margin: 1
  },
  activeTabButton: {
    backgroundColor: '#3F8CFF', // Background color for active tab button
    borderRadius: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  tabText: {
    fontSize: 12
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  inactiveTabText: {
    color: '#6e6e6e'
  },
  content: {
    flex: 1
  }
})

export default AttendanceTab
