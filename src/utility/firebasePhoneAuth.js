import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

let verifier = null

/**
 * Initializes invisible reCAPTCHA and sends OTP to the given phone number.
 * @param {string} phoneNumber
 * @returns {Promise<ConfirmationResult>} Firebase confirmation result
 */
export const sendOTP = async phoneNumber => {
  console.log('Sending OTP to phone number:', phoneNumber)

  if (!verifier) {
    verifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      auth
    )
  }

  try {
    const confirmation = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    )
    return confirmation
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

/**
 * Confirms the OTP code with Firebase confirmation result
 * @param {ConfirmationResult} confirmation
 * @param {string} otp
 * @returns {Promise<UserCredential>}
 */
export const verifyOTP = async (confirmation, otp) => {
  try {
    const result = await confirmation.confirm(otp)
    return result
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}
