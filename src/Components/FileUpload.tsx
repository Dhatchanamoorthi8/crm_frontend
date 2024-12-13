import React, { useState, useRef, useEffect } from 'react'
import {
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  Alert,
  ButtonGroup,
  ButtonText,
  HStack,
  Icon,
  View
} from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { CloseIcon, DownloadIcon } from '@gluestack-ui/themed'

import { Center } from '@gluestack-ui/themed'

import { Box } from '@gluestack-ui/themed'
import { ModalFooter } from '@gluestack-ui/themed'
import { Heading } from '@gluestack-ui/themed'
import { RepeatIcon } from '@gluestack-ui/themed'
import { Actionsheet } from '@gluestack-ui/themed'
import { ActionsheetDragIndicator } from '@gluestack-ui/themed'
import { VStack } from '@gluestack-ui/themed'
import { Pressable } from '@gluestack-ui/themed'
import { ActionsheetBackdrop, Text } from '@gluestack-ui/themed'
import { Button } from '@gluestack-ui/themed'
import { StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Image } from '@gluestack-ui/themed'

import { Camera, CameraType, CameraView, FlashMode, useCameraPermissions, } from 'expo-camera'
import { Linking, PermissionsAndroid } from 'react-native'
import { CloseSvg } from '@/assets/Icons/SvgIcons'

import LottieView from 'lottie-react-native';

const lottiePath = require('../../assets/Icons/permission.json');

const FileUpload = ({ isOpen, onClose, images, ClearImage }) => {


  const animation = useRef<LottieView>(null);

  const [imageBase64, setImageBase64] = useState(null)

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const [hasPermission, setHasPermission] = useState(false)

  const [isCameraActive, setIsCameraActive] = useState(false)

  const [cameraType, setCameraType] = useState<CameraType>('back');

  const [flashMode, setFlashMode] = useState<FlashMode>('off');

  const cameraRef = useRef(null)


  const requestCameraPermission = async () => {

    console.log("clicked");
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Access Required',
          message:
            'To capture photos, this app requires access to your camera. Please grant permission to enable camera functionality.',
          buttonNeutral: 'Decide Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        setHasPermission(true)
        setIsCameraActive(true)
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };


  useEffect(() => {

    const getPermission = async () => {
      const { granted } = await Camera.getCameraPermissionsAsync()
      if (granted === false) {
        return
      }
      setHasPermission(true)
      setIsCameraActive(true)

    }

    getPermission()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    })

    if (!result.canceled) {
      try {
        const uri = result.assets[0]?.uri || ''
        const fileExtension = uri.split('.').pop()?.toLowerCase()

        if (
          fileExtension !== 'png' &&
          fileExtension !== 'jpg' &&
          fileExtension !== 'jpeg'
        ) {
          setAlertProps({
            alertType: 'Error',
            content: 'Only PNG and JPG formats are supported.!',
            renderType: 'Dialog',
            visible: true
          })
          //onClose()
        } else {
          const image = result.assets.map(data => data.base64)
          setImageBase64(image[0])
        }
      } catch (err) {
        console.error('Error selecting image:', err.message)
        onClose()
      }
    }
  }

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'))
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 1,
        skipProcessing: true
      })
      console.log(photo)
      setImageBase64(photo.base64)
      setIsCameraActive(false)
      //onClose()
    } else {
      setAlertProps({
        alertType: 'Error',
        content: 'SomeThing Went Wrong Please Take Again Photo.!',
        renderType: 'Dialog',
        visible: true
      })
      onClose()
    }
  }

  const resetImage = () => {
    setImageBase64(null)
    ClearImage()
    setIsCameraActive(true)
  }

  const uploadimg = () => {
    if (imageBase64) {
      images(imageBase64)
      onClose()
    }
  }

  const toggleFlashMode = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'))
  }

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[90]} >
        <ActionsheetBackdrop />
        < ActionsheetContent mx={'$0'} px={'$0'} bg='#F2F2F2' >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>



          {hasPermission ? (
            isCameraActive && imageBase64 === null ? (

              < View >
                <View
                  style={
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      display: 'flex'
                    }
                  }
                  mx="$2"
                >
                  <Heading size='md' color='typography.950' >
                    Take Photo
                  </Heading>

                  <Pressable onPress={() => onClose()}>
                    <CloseSvg />
                  </Pressable>
                </View>
                < View style={styles.container} >
                  <CameraView
                    style={styles.camera}
                    ref={cameraRef}
                    facing={cameraType}
                    flash={flashMode}
                    mute={true}
                  >
                    <View style={styles.overlay}>
                      {/* Bottom Control Buttons */}
                      < HStack style={styles.bottomButtons} >
                        {/* Select Image Button */}
                        < Pressable style={styles.iconButton} onPress={pickImage} >
                          <MaterialIcons
                            name='photo-library'
                            color={'white'}
                            style={{ fontSize: 30 }}
                          />
                        </Pressable>

                        {/* Flash on off*/}
                        <Pressable
                          style={styles.iconButton}
                          onPress={toggleFlashMode}
                        >
                          <MaterialIcons
                            name={flashMode === 'off' ? 'flash-off' : 'flash-on'}
                            color={'white'}
                            style={{ fontSize: 30 }}
                          />
                        </Pressable>

                        {/* Take Photo Button */}
                        <Pressable style={styles.captureButton} onPress={takePhoto} >
                          <View style={styles.innerCaptureButton} />
                        </Pressable>

                        {/* Flip Camera Button */}
                        <Pressable
                          style={styles.iconButton}
                          onPress={toggleCameraType}
                        >
                          <MaterialIcons
                            name='flip-camera-android'
                            color={'white'}
                            style={{ fontSize: 30 }}
                          />
                        </Pressable>
                      </HStack>
                    </View>
                  </CameraView>
                </View>
              </View>

            ) : (

              < View display={imageBase64 !== null ? 'flex' : 'none'} my={'$10'} >
                <View position='relative' >
                  <View>
                    <Image
                      size='2xl'
                      source={{
                        uri: `data:image/jpeg;base64,${imageBase64}`
                      }}
                      alt='uploaded image'
                      rounded={'$lg'}
                    />
                  </View>

                  < View
                    position='absolute'
                    rounded={'$full'}
                    right={'$2'}
                    top={'$2'}
                  >
                    {/* <Pressable onPress={resetImage}>
                  <Icon
                    as={CloseIcon}
                    size='lg'
                    className='stroke-background-500'
                  />
                </Pressable> */}

                    < Pressable style={styles.restIconbtn} onPress={() => resetImage()} >
                      <MaterialIcons
                        name='close'
                        color={'white'}
                        style={{ fontSize: 15 }}
                      />
                    </Pressable>
                  </View>

                  < Button my={'$5'} onPress={uploadimg} >
                    <ButtonText fontFamily='MonaSans_SemiBold' > Proceed </ButtonText>
                  </Button>
                </View>
              </View>
            )
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

              {/* Separate content for location and camera access */}
              <View style={styles.content}>
                <Text style={styles.heading}>Enable Access</Text>

                {/* Location Permission */}
                {/* <Text style={styles.description}>
                    To personalize your experience, please enable location access.
                  </Text> */}

                {/* Camera Permission */}
                <Text style={styles.description}>
                  To use camera features, please enable camera access.
                </Text>
              </View>


              <Button onPress={() => requestCameraPermission()}>
                <ButtonText fontFamily='MonaSans_Bold'>Enable Camera</ButtonText>
              </Button>

            </>


          )}




        </ActionsheetContent>
      </Actionsheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: '85%',
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 3,
    overflow: 'hidden',
    margin: 1,
    marginTop: 20
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Push buttons to the bottom
    alignItems: 'center'
  },
  bottomButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around', // Evenly distribute buttons
    alignItems: 'center',
    paddingBottom: 20 // Space from bottom
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30
  },
  restIconbtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  innerCaptureButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white'
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,  // Adds space between the animation and the content below
  },
  lottie: {
    width: 500,  // Adjust size as needed
    height: 500,
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
export default FileUpload
