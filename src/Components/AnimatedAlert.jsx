import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'

const AnimatedAlert = ({ message, onClose }) => {
  return (
    <Animatable.View
      animation='fadeInUp'
      duration={1000}
      style={{
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </Animatable.View>
  )
}

export default AnimatedAlert
