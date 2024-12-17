import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  Animated
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import api from '../Services/axiosConfig'
import { useNavigation } from '@react-navigation/native'

const lottiePath = require('../../assets/Icons/otp-animation.json')

export default function ForgotPasswordScreen () {
  const animation = useRef(null)

  const nav = useNavigation()

  // States
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('') // Date of Birth
  const [otpSent, setOtpSent] = useState(false) // OTP Sent State
  const [otpVerified, setOtpVerified] = useState(false) // OTP Verified State
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [errorOpacity] = useState(new Animated.Value(0))

  // Send OTP
  const sendOtp = async () => {
    try {
      if (!email || !dob) {
        Alert.alert('Error', 'Please fill in all fields.')
        return
      }

      // API call to send OTP
      const response = await api.post('/auth/send-otp', { email })
      if (response.status === 201) {
        setOtpSent(true)
        Alert.alert('Success', 'OTP has been sent to your email.')
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP.')
      }
    } catch (error) {
      console.error(error)
      const backendMessage =
        error.response.data?.message || 'Something went wrong!'
      showErrorMessage(backendMessage)
      Alert.alert('Error', 'Failed to send OTP. Please try again.')
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    try {
      if (!otp) {
        Alert.alert('Error', 'Please enter the OTP.')
        return
      }
      const response = await api.post('/auth/verify-otp', { email, otp })
      if (response.status === 201) {
        setOtpVerified(true)
        Alert.alert('Success', 'OTP Verified! You can now reset your password.')
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP.')
      }
    } catch (error) {
      console.error(error)
      const backendMessage =
        error.response.data?.message || 'Something went wrong!'
      showErrorMessage(backendMessage)
      //Alert.alert('Error', 'Failed to verify OTP. Please try again.')
    }
  }

  // Reset Password
  const resetPassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields.')
        return
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.')
        return
      }

      const payload = { email, otp, password: newPassword }

      // API call to reset password
      const response = await api.post('/auth/reset-password', payload)

      if (response.status === 201) {
        nav.navigate('Login')
        // Alert.alert('Success', 'Password has been reset. You can now log in.')

        setOtpSent(false)
        setOtpVerified(false)
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to reset password.'
        )
      }
    } catch (error) {
      console.error(error)
      const backendMessage =
        error.response.data?.message || 'Something went wrong!'
      showErrorMessage(backendMessage)
      //Alert.alert('Error', 'Failed to reset password. Please try again.')
    }
  }

  const showErrorMessage = message => {
    setErrorMessage(message)

    Animated.timing(errorOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      // Fade out after 2 seconds
      setTimeout(() => {
        Animated.timing(errorOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start()
      }, 2000)
    })
  }

  return (
    <LinearGradient
      colors={['#990ECA', 'white']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#8E24AA', '#6A1B9A']}
          style={styles.curvedBackground}
        >
          <View>
            <LottieView
              autoPlay
              loop
              ref={animation}
              style={styles.lottie}
              source={lottiePath}
            />
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          {!otpSent && !otpVerified && (
            <>
              <Text style={styles.title}>Forgot Password</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your Date of Birth (YYYY-MM-DD)'
                value={dob}
                onChangeText={setDob}
              />
              <TouchableOpacity style={styles.button} onPress={sendOtp}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </>
          )}

          {otpSent && !otpVerified && (
            <>
              <Text style={styles.title}>Verify OTP</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter OTP'
                keyboardType='numeric'
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}

          {otpVerified && (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter New Password'
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder='Confirm New Password'
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.button} onPress={resetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Animated Error Message */}
        <Animated.View
          style={[styles.errorContainer, { opacity: errorOpacity }]}
        >
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradientBackground: {
    flex: 1
  },
  curvedBackground: {
    flex: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    flex: 1,
    marginTop: 30,
    padding: 25
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#6A1B9A',
    fontFamily: 'NunitoSans_Bold',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D1C4E9',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F3E5F5'
  },
  button: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  lottie: {
    width: Dimensions.get('window').width,
    height: 300,
    borderRadius: 12
  },
  errorContainer: {
    position: 'absolute',
    bottom: 50, // Error message at the bottom of the screen
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 8,
    marginHorizontal: 20
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'NunitoSans_Bold'
  }
})
