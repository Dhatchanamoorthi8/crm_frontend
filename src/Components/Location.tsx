import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Alert, Platform } from 'react-native'
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
import { View, Text } from '@gluestack-ui/themed'
import { Center } from '@gluestack-ui/themed'
import Spinner from 'react-native-loading-spinner-overlay'
import Foundation from '@expo/vector-icons/Foundation'
import { Linking, PermissionsAndroid } from 'react-native'

import LottieView from 'lottie-react-native';

const lottiePath = require('../../assets/Icons/location1.json');

let MapView, Marker


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

  const animation = useRef<LottieView>(null);
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(0.01)
  const [loading, setLoading] = useState(false)

  const [hasPermission, setHasPermission] = useState(false)

  const defaultLocation = {
    latitude: 11.1271, // Latitude for Tamil Nadu
    longitude: 78.6569, // Longitude for Tamil Nadu
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  }

  const requestLocationPermission = async (retry = false) => {
    try {
      setLoading(true)
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

  const requestPermission = async () => {
    

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'Permission to access location was denied Please enable..!',
          buttonNeutral: 'Decide Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true)
      } else {
        setHasPermission(false)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])



  const handleClose = () => {
    onClose()
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
        snapPoints={[70]}
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

          {hasPermission ? (
            <>
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

              <ButtonGroup mb={'$12'} w={'$full'}>
                <Button
                  onPress={() => requestLocationPermission()}
                  gap={'$2'}
                  w={'$full'}
                  action='primary'
                >
                  <Foundation name='marker' size={24} color='red' />
                  <ButtonText color='$white'>Mark Location</ButtonText>
                </Button>
              </ButtonGroup>
            </>
          ) : (

            <>



              <View >
                {/* Centering the Lottie animation */}
                <View style={styles.animationContainer}>
                  <LottieView
                    autoPlay
                    loop
                    ref={animation}
                    style={styles.lottie}
                    source={lottiePath}  // Make sure lottiePath is a valid imported file or path
                  />
                </View>


              </View>


              <View style={styles.content}>
                <Text style={styles.heading}>Enable Access</Text>

                {/* Location Permission */}
                <Text style={styles.description}>
                  To personalize your experience, please enable location access.
                </Text>


              </View>
              <View>
                <ButtonGroup mb={'$12'} w={'$full'}>
                  <Button
                    onPress={() => requestPermission()}
                    gap={'$2'}
                    w={'$full'}
                    action='primary'
                  >
                    <Foundation name='marker' size={24} color='red' />
                    <ButtonText color='$white' fontFamily='MonaSans_Bold'>Enable Permission</ButtonText>
                  </Button>
                </ButtonGroup>

                {errorMsg && (
                  <View style={styles.errorContainer}>
                    <Text style={{ color: 'red' }}>{errorMsg}</Text>
                    <Button
                      onPress={() => requestPermission()}
                      action='secondary'
                    >
                      <ButtonText>Try Again</ButtonText>
                    </Button>
                  </View>
                )}
              </View>
            </>

          )}
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
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,  // Adds space between the animation and the content below
  },
  lottie: {
    width: 400,  // Adjust size as needed
    height: 300,
    borderRadius: 12,  // Optional: rounded corners for the animation container
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 320,  // Limit text width for better readability
  },
  heading: {
    fontFamily: 'MonaSans_Bold',  // Use your custom font
    fontSize: 24,
    color: '#333',
    marginBottom: 8,  // Space below the heading
  },
  description: {
    fontFamily: 'MonaSans_400Regular',
    fontSize: 14,
    color: '#777',
    lineHeight: 22,  // Adjust line height for readability
    marginBottom: 12,  // Space between the text blocks
  },
})
