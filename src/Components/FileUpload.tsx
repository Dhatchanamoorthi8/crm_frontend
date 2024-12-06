import React, { useState, useRef, useEffect } from 'react'
import {
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ButtonGroup,
  ButtonText,
  HStack,
  Icon,
  View
} from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { CloseIcon, DownloadIcon } from '@gluestack-ui/themed'

import { Center } from '@gluestack-ui/themed'

import Alerts from './Alert'
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

import { Camera, CameraType, CameraView, FlashMode, } from 'expo-camera'

const FileUpload = ({ isOpen, onClose, images, ClearImage }) => {




  const [imageBase64, setImageBase64] = useState(null)

  const [alertProps, setAlertProps] = useState({
    alertType: '',
    content: '',
    renderType: '',
    visible: false
  })

  const [hasPermission, setHasPermission] = useState(null)

  const [isCameraActive, setIsCameraActive] = useState(false)

  const [cameraType, setCameraType] = useState<CameraType>('back');

  const [flashMode, setFlashMode] = useState<FlashMode>('off');

  const cameraRef = useRef(null)

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Camera.getCameraPermissionsAsync()
      setHasPermission(status === 'granted')
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

          < View display={imageBase64 === null ? 'flex' : 'none'
          }>
            <View
              style={
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'flex'
                }
              }
            >
              <Heading size='md' color='typography.950' >
                Take Photo
              </Heading>

              <Pressable onPress={() => onClose()}>
                <Icon
                  as={CloseIcon}
                  size='md'
                />
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
                    {/* < Pressable style={styles.iconButton} onPress={pickImage} >
                      <MaterialIcons
                        name='photo-library'
                        color={'white'}
                        style={{ fontSize: 30 }}
                      />
                    </Pressable> */}

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

                < Pressable style={styles.restIconbtn} onPress={resetImage} >
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
    marginTop:20
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
  }
})
export default FileUpload
