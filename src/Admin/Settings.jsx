import React, { useState } from 'react'
import { ScrollView, View, Text } from '@gluestack-ui/themed'
import { StyleSheet } from 'react-native'
import { TouchableOpacity, Animated } from 'react-native'
import AddCompany from './Settings/AddCompany'
import AddPosition from './Settings/AddPosition'
import { Dimensions } from 'react-native'
import AddServices from './Settings/AddServices'

const { width } = Dimensions.get('window')

const Settings = () => {
  const [SettingsactiveTab, SetSettingsactiveTab] = useState(0)

  const translateX = new Animated.Value(0)

  const Settingtabs = ['Position', 'Company', 'Services']

  const handleTabSwitch = (index, type) => {
    if (type === 'settings') {
      SetSettingsactiveTab(index)
      Animated.spring(translateX, {
        toValue: index * (width / 2),
        useNativeDriver: true
      }).start()
    }
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Animated.View
            style={[styles.activeTabIndicator, { transform: [{ translateX }] }]}
          />

          {Settingtabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabButton,
                SettingsactiveTab === index && styles.activeTabButton
              ]}
              onPress={() => handleTabSwitch(index, 'settings')}
            >
              <Text
                style={[
                  styles.tabText,
                  SettingsactiveTab === index ? styles.activeTabText : {}
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          <View display={SettingsactiveTab === 0 ? 'flex' : 'none'}>
            <AddPosition />
          </View>

          <View display={SettingsactiveTab === 1 ? 'flex' : 'none'}>
            <AddCompany />
          </View>

          <View display={SettingsactiveTab === 2 ? 'flex' : 'none'}>
            <AddServices />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FD',
    padding: 15
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
    fontSize: 14,
    fontFamily: 'MonaSans_400Regular'
  },
  activeTabText: {
    color: '#ffffff',
    fontFamily: 'MonaSans_Bold'
  },
  inactiveTabText: {
    color: '#6e6e6e'
  },
  content: {
    flex: 1
  }
})
export default Settings
