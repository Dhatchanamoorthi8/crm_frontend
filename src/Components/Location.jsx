import React, { useState } from 'react'
import {
  StyleSheet,
  Alert,
  Platform,
  Text,
  ActivityIndicator
} from 'react-native'
import * as Location from 'expo-location'
import {
  Button,
  ButtonGroup,
  ButtonText,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper
} from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { Center } from '@gluestack-ui/themed'
import Spinner from 'react-native-loading-spinner-overlay'
import Foundation from '@expo/vector-icons/Foundation'

let MapView, Marker

// Conditional imports to avoid registering views twice
if (Platform.OS === 'web') {
  const {
    MapContainer,
    TileLayer,
    Marker: WebMarker
  } = require('react-leaflet')
  MapView = ({ region, children, style }) => (
    <MapContainer
      center={[region.latitude, region.longitude]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {children}
    </MapContainer>
  )
  Marker = WebMarker
} else {
  const RNMaps = require('react-native-maps')
  MapView = RNMaps.default
  Marker = RNMaps.Marker
}

const Locations = ({ isOpen, onClose, locationGet }) => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(0.01)
  const [loading, setLoading] = useState(false)

  const defaultLocation = {
    latitude: 11.1271, // Latitude for Tamil Nadu
    longitude: 78.6569, // Longitude for Tamil Nadu
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  }

  const requestLocationPermission = async (retry = false) => {
    try {
      setLoading(true)

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        setLoading(false)
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      })

      if (
        currentLocation?.coords?.latitude &&
        currentLocation?.coords?.longitude
      ) {
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        })
        setLoading(false)
        locationGet(currentLocation.coords)
        Alert.alert(
          'Location Marked',
          'Your location has been marked on the map.'
        )
        setTimeout(() => {
          onClose(false)
        }, 2000)
      } else {
        setLoading(false)
        if (!retry) {
          Alert.alert(
            'Error',
            'Failed to get valid location coordinates. Try again.',
            [
              {
                text: 'Retry',
                onPress: () => requestLocationPermission(true)
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          )
        } else {
          setErrorMsg('Failed to get valid location coordinates.')
        }
      }
    } catch (error) {
      setLoading(false)
      console.log('Error:', error)
      if (!retry) {
        Alert.alert(
          'Error',
          'Something went wrong while fetching your location. Try again.',
          [
            {
              text: 'Retry',
              onPress: () => requestLocationPermission(true)
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        )
      } else {
        setErrorMsg('An unexpected error occurred.')
      }
    }
  }

  const handleClose = () => {
    onClose() // Call the external onClose prop to handle closing
  }

  return (
    <View style={styles.container}>
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text>{errorMsg}</Text>
        </View>
      )}

      <Actionsheet
        isOpen={isOpen}
        onClose={handleClose}
        snapPoints={[60]}
        flex={1}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent py={'$10'}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <Center>
            <Spinner
              visible={loading}
              textContent={'Fetching your location...'}
              color='white'
              size={'large'}
            />
          </Center>

          {/* Map container with borderRadius */}
          <View style={styles.mapContainer} my={'$1'}>
            <MapView
              style={styles.map}
              region={
                location
                  ? {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: zoomLevel,
                      longitudeDelta: zoomLevel
                    }
                  : defaultLocation
              }
            >
              {/* Marker to show user's location after Check-In */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  title='You are here'
                  description='This is your current location'
                  style={styles.mapContainer}
                />
              )}
            </MapView>
          </View>

          <View>
            <ButtonGroup mb={'$12'} w={'$full'}>
              <Button
                onPress={requestLocationPermission}
                gap={'$2'}
                w={'$full'}
                action='primary'
              >
                <Foundation name='marker' size={24} color='red' />
                <ButtonText color='$white'>Mark Location</ButtonText>
              </Button>
            </ButtonGroup>

            {errorMsg && (
              <View style={styles.errorContainer}>
                <Text style={{ color: 'red' }}>{errorMsg}</Text>
                <Button
                  onPress={() => requestLocationPermission()}
                  action='secondary'
                >
                  <ButtonText>Try Again</ButtonText>
                </Button>
              </View>
            )}
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  )
}

export default Locations

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapContainer: {
    flex: 1,
    borderBlockColor: 'black',
    borderWidth: 1,
    width: '100%',
    height: '100%'
  },
  map: {
    flex: 1,
    borderRadius: 60,
    ...StyleSheet.absoluteFillObject
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
