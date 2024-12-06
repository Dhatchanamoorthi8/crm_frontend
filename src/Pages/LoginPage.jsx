// app/Pages/LoginPage.jsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import {
  ArrowRightIcon,
  AtSignIcon,
  Box,
  Center,
  EyeIcon,
  EyeOffIcon,
  FormControl,
  InputField,
  InputSlot,
  LockIcon,
  Text,
  View,
  VStack
} from '@gluestack-ui/themed'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Input } from '@gluestack-ui/themed'
import { Icon } from '@gluestack-ui/themed'
import { login } from '../Slices/userSlice'
import config from '../config'
import { InputIcon } from '@gluestack-ui/themed'
import api from '../Services/axiosConfig'
import { Image } from '@gluestack-ui/themed'

const image = require('../../assets/logo-01-04.png')

const LoginPage = () => {
  console.log(config.API_URL)

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
        console.log(`${config.API_URL}/auth/login`, LoginData)
        const reponse = await api.post(
          `${config.API_URL}/auth/login`,
          LoginData
        )

        const token = reponse.data.access_token
        const user = reponse.data.userData

        const userData = { user, token }

        console.log(userData)

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
    <>
      {/* <View  p={'$20'}>
        <Image
          source={image}
          alt='logo'
          style={styles.logo}
          resizeMode='cover'
        />
      </View> */}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
        marginTop={Keyboard.isVisible ? '$24' : '$0'}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          disabled={Platform.OS === 'web'}
        >
          <Box
            width='$96'
            borderWidth='$1'
            borderRadius='$lg'
            borderColor='$borderLight300'
            padding={'$4'}
          >
            <VStack space='xs' mb={'$5'}>
              <Text
                textAlign='center'
                color='$black'
                fontSize={'$3xl'}
                fontFamily='MonaSans_400Regular'
                textTransform='uppercase'
              >
                Vingro CRM
              </Text>
            </VStack>

            <FormControl
              $dark-borderWidth='$1'
              $dark-borderRadius='$lg'
              $dark-borderColor='$borderDark800'
              borderRadius='$lg'
              adding={'$6'}
              style={{ backgroundColor: 'transparent' }}
              mb={'$11'}
            >
              <VStack space='xl'>
                <Center bg='$error500'>
                  <Spinner visible={spinner} />
                </Center>

                {/* <Heading color="$black" lineHeight="$md" textAlign="center">
                                Login
                            </Heading> */}
                <VStack space='xs' mb={'$4'}>
                  <Text
                    color='$black'
                    lineHeight='$xs'
                    marginBottom={'$1.5'}
                    fontSize={'$md'}
                    marginLeft={'$3'}
                    fontFamily='MonaSans_400Regular'
                  >
                    Email
                  </Text>
                  <Input borderRadius={'$full'}>
                    <Icon
                      as={AtSignIcon}
                      m='$3'
                      w='$4'
                      h='$4'
                      marginLeft={'$3'}
                    />
                    <InputField
                      autoComplete='off'
                      placeholder='Enter Email'
                      fontFamily='MonaSans_400Regular'
                      type='text'
                      color='$black'
                      value={LoginData.usercode}
                      onChangeText={e =>
                        SetLoginData({ ...LoginData, email: e })
                      }
                      defaultValue={LoginData.usercode}
                    />
                  </Input>
                </VStack>

                <VStack space='xs'>
                  <Text
                    color='$black'
                    lineHeight='$xs'
                    marginBottom={'$1.5'}
                    fontSize={'$md'}
                    marginLeft={'$3'}
                    fontFamily='MonaSans_400Regular'
                  >
                    Password
                  </Text>
                  <Input alignItems='center' borderRadius={'$full'}>
                    <Icon
                      as={LockIcon}
                      m='$2'
                      w='$4'
                      h='$4'
                      marginLeft={'$3'}
                    />
                    <InputField
                      autoComplete='off'
                      fontFamily='MonaSans_400Regular'
                      placeholder='Enter Password'
                      color='$black'
                      value={LoginData.password}
                      type={showPassword ? 'text' : 'password'}
                      onChangeText={e =>
                        SetLoginData({ ...LoginData, password: e })
                      }
                      defaultValue={LoginData.password}
                    />
                    <InputSlot pr='$3' onPress={handleState}>
                      <InputIcon
                        as={showPassword ? EyeIcon : EyeOffIcon}
                        color='$black'
                      />
                    </InputSlot>
                  </Input>
                </VStack>
                <Center>
                  <View style={styles.container}>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={handleLogin}
                      disabled={loader === true}
                    >
                      <View>
                        <Icon
                          as={ArrowRightIcon}
                          size='xl'
                          m='$2'
                          w='$7'
                          h='$7'
                        />
                      </View>
                      {/* <ButtonSpinner mr='$1' style={{ display: loader === true ? "flex" : "none" }} /> */}
                    </TouchableOpacity>
                  </View>

                  {/* <Button borderRadius={"$2xl"} mt={"$2"}  width={"$56"} style={{ display: loader === true ? "none" : "flex" }} disabled={loader === true}>
                                    <ButtonText color="$white">Login</ButtonText>
                                </Button> */}
                </Center>
              </VStack>
            </FormControl>
          </Box>
        </TouchableWithoutFeedback>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    borderRadius: 64,
    backgroundColor: '#74e3ba',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10
  },
  button: {
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#259c70',
    transition: 'background-color 0.3s ease',
    height: 80,
    width: 80
  },
  buttonPressed: {
    backgroundColor: '#FF0000'
  },
  topSvgContainer: {
    position: 'absolute',
    top: -20,
    width: '100%',
    height: '32%',
    zIndex: -1,
    backgroundColor: 'transparent'
  },
  topSvg: {
    width: '100%',
    height: '100%'
  },
  bottomSvgContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '29%',
    zIndex: -1,
    backgroundColor: 'transparent'
  },
  bottomSvg: {
    width: '100%',
    height: '100%'
  },
  logo: {
    width: 150, // Adjust the width of the logo
    height: 110 // Adjust the height of the logo
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000',
    position: 'absolute',
    top: Keyboard.isVisible ? 120 : 150,
    right: 150,
    borderRadius: 200,
    height: 130,
    width: 130,
    zIndex: 1,
    
  }
})

export default LoginPage
