import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'react-native'
import LottieView from 'lottie-react-native'
import api from '../Services/axiosConfig'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import config from '../config'
import { login } from '../../Slices/userSlice'
const logoUri = require('../../assets/vingrologo.png')

const lottiePath = require('../../assets/Icons/loginanimation.json')

export default function App () {
  const [isEmail, setIsEmail] = useState(true)

  const animation = useRef(null)

  const nav = useNavigation()

  const [LoginData, SetLoginData] = useState({
    email: '',
    password: ''
  })

  const dispatch = useDispatch()

  const [spinner, setspinner] = useState(false)

  const [loader, setloader] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      if (LoginData.email && LoginData.password) {
        const reponse = await api.post(`/auth/login`,LoginData)
        const token = reponse.data.access_token
        const user = reponse.data.userData

        const userData = { user, token }


        dispatch(login(userData))
        nav.navigate('DrawerNavigator')
      } else {
        alert('Please enter valid credentials')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleState = () => {
    setShowPassword(!showPassword)
  }

  return (
    <LinearGradient
      colors={['#990ECA', '#FFFFF']}
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
              defaultValue={LoginData.usercode}
            />
            <TextInput
              style={styles.input}
              placeholder='Enter Password'
              secureTextEntry
              onChangeText={e => SetLoginData({ ...LoginData, password: e })}
              defaultValue={LoginData.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    flex: 0, // Occupies the remaining space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
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
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 20,
    color: '#6A1B9A'
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6A1B9A'
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
    fontWeight: 'bold'
  },
  lottie: {
    width: Dimensions.get('window').width,
    height: 300,
    borderRadius: 12 // Optional: rounded corners for the animation container
  }
})
