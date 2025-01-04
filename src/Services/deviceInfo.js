import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import UUID from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Application from 'expo-application'

const getDeviceInfo = async () => {
  let deviceId = null

  // Persist or retrieve a unique device ID (fallback to UUID)
  deviceId = await getOrGenerateDeviceId()

  // Check if Constants.manifest is available
  const appVersion = Application.nativeApplicationVersion //Constants.manifest ? Constants.manifest.version : 'Unknown App Version'

  // Device info object
  const deviceInfo = {
    deviceName: Device.deviceName || 'Unknown Device',
    deviceBrand: Device.brand || 'Unknown Brand',
    deviceModel: Device.modelName || 'Unknown Model',
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion || Platform.Version,
    appVersion: appVersion,
    deviceId: deviceId
  }

  return { deviceId, deviceInfo }
}

const getOrGenerateDeviceId = async () => {
  let deviceId = await AsyncStorage.getItem('device-id')
  if (!deviceId) {
    deviceId = UUID.v4()
    await AsyncStorage.setItem('device-id', deviceId)
  }
  return deviceId
}

export default getDeviceInfo
