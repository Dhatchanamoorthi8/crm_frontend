import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import api from '../Services/axiosConfig'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { login } from '../../Slices/userSlice'

const logoUri = require('../../assets/vingrologo.png')

const lottiePath = require('../../assets/Icons/loginanimation.json')

export default function App () {
  const [isEmail, setIsEmail] = useState(true)
  const animation = useRef(null)
  const nav = useNavigation()
  const [LoginData, SetLoginData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [errorOpacity] = useState(new Animated.Value(0)) // Animation for error message

  const handleLogin = async () => {
    try {
      if (LoginData.email && LoginData.password) {
        const response = await api.post(`/auth/login`, LoginData)
        const token = response.data.access_token
        const user = response.data.userData

        const userData = { user, token }

        dispatch(login(userData))
        nav.navigate('DrawerNavigator')
      } else {
        showErrorMessage('Please enter valid credentials')
      }
    } catch (error) {
      if (error.response) {
        const backendMessage =
          error.response.data?.message || 'Something went wrong!'
        showErrorMessage(backendMessage)
      } else if (error.request) {
        showErrorMessage('No response from the server. Please try again later.')
      } else {
        showErrorMessage('An unexpected error occurred. Please try again.')
      }
      console.log('Error:', error)
    }
  }

  const showErrorMessage = message => {
    setErrorMessage(message)

    // Fade in the error message
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
              loop={true}
              ref={animation}
              style={styles.lottie}
              source={lottiePath}
            />
          </View>
        </LinearGradient>

        <View style={styles.loginCardContainer}>
          <LinearGradient
            colors={['#ffffff', '#F3E5F5', '#ffffff']}
            style={styles.formContainer}
          >
            <Text style={styles.loginWith}>
              Login With {isEmail ? 'Email' : 'Phone Number'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isEmail ? 'Enter email ID' : 'Enter phone number'}
              keyboardType={isEmail ? 'email-address' : 'phone-pad'}
              onChangeText={e => SetLoginData({ ...LoginData, email: e })}
              defaultValue={LoginData.email}
            />
            <TextInput
              style={styles.input}
              placeholder='Enter Password'
              secureTextEntry
              onChangeText={e => SetLoginData({ ...LoginData, password: e })}
              defaultValue={LoginData.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => nav.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
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
  loginCardContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  formContainer: {
    width: '90%',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  loginWith: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    color: '#6A1B9A',
    fontFamily: 'NunitoSans_Bold'
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
    backgroundColor: '#F3E5F5',
    fontFamily: 'NunitoSans_Regular'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6A1B9A',
    fontFamily: 'NunitoSans_Regular'
  },
  loginButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NunitoSans_Bold'
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
