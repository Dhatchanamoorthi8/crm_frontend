import React, { useRef } from 'react'
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Easing
} from 'react-native'

const ImagePreview = ({ imageBase64, modalVisible, closeModal }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current // For opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current // For scaling

  React.useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [modalVisible])

  if (!modalVisible) return null

  return (
    <Modal
      transparent={true}
      animationType='none'
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} onPress={closeModal} />
        <Animated.View
          style={[
            styles.imageWrapper,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Image
            source={{
              uri: `data:image/jpeg;base64,${imageBase64}`
            }}
            style={styles.image}
            resizeMode='contain'
          />
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  imageWrapper: {
    width: '90%',
    height: '45%',
    borderRadius: 22,
    backgroundColor: 'white',
    padding: 10,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    padding: 10,
    width: '80%',
    height: '80%',
    borderRadius: 620,
    borderCurve: 'circular',
    backgroundColor: 'transparent'
  }
})

export default ImagePreview
