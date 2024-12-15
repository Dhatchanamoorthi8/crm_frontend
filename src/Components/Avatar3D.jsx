import GirlAvatar from '@/assets/Icons/girlsIcon/GirlAvatar'
import MenAvatar from '@/assets/Icons/menIcon/MenAvatar'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ScrollView,
  View
} from '@gluestack-ui/themed'

import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import RNFS from 'react-native-fs'
import api from '../Services/axiosConfig'
import * as FileSystem from 'expo-file-system'
import { preloadAvatars } from '../Hooks/usePreloadAvatar'

const Avatar3D = ({ isOpen, onClose, images, ClearImage }) => {

  const [selectedImage, setSelectedImage] = useState(null)

  const [preloadedAvatars, setPreloadedAvatars] = useState([])

  useEffect(() => {
    const loadAvatars = async () => {
      const uris = await preloadAvatars()
      setPreloadedAvatars(uris)
    }

    loadAvatars()
  }, [])

  const handleImagePress = async uri => {
    try {
      
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      })


      setSelectedImage(uri) // Highlight the selected image
      images(base64String) // Pass Base64 string to the parent
    } catch (error) {
      console.error('Error converting to Base64:', error)
      Alert.alert(
        'Error',
        `Failed to convert image to Base64: ${error.message}`
      )
    }
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[80]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ScrollView my='$20'>
          <View style={styles.imageGrid}>
            {preloadedAvatars.map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleImagePress(uri)}
                style={[
                  styles.imageWrapper,
                  selectedImage === uri && styles.selectedImage
                ]}
              >
                <Image source={{ uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  )
}

const styles = StyleSheet.create({
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  imageWrapper: {
    margin: 2,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    borderRadius: 8
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 40
  },
  selectedImage: {
    borderColor: '#3498db'
  }
})

export default Avatar3D
