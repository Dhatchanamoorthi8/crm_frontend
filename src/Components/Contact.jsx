import { View, Text, Linking } from 'react-native'
import React from 'react'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  EditIcon,
  MessageCircleIcon,
  PhoneIcon
} from '@gluestack-ui/themed'

const Contact = ({ isOpen, onClose, Datas, selectedMode }) => {
  const {
    contact,
    servicename,
    client_name,
    company_name
  } = Datas

  console.log(contact)

  const handlePhonePress = () => {
    Linking.openURL(`tel:+91${contact}`)
    onClose(false)
    selectedMode('Call')
  }

  const handleWhatsAppPress = () => {
    selectedMode('Message')
    const phoneNumber = `+91${contact}`
    const message = `
  Hi ${client_name},
  
  I hope this message finds you well! I'm reaching out regarding your interest in our service: *${servicename}*. 
  
  If you have any specific questions or require further assistance, feel free to let us know. Looking forward to hearing from you!
  
  Best regards,
  [Vingro]
  `

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`

    Linking.openURL(url)
      .then(supported => {
        if (!supported) {
          alert('WhatsApp is not installed on your device')
        }
      })
      .catch(err => console.error('Error opening WhatsApp:', err))

    onClose(false)
  }

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleWhatsAppPress}>
            <ActionsheetIcon
              className='stroke-background-700'
              as={MessageCircleIcon}
              size='lg'
            />
            <ActionsheetItemText size='lg'>Message</ActionsheetItemText>
          </ActionsheetItem>

          <ActionsheetItem onPress={handlePhonePress}>
            <ActionsheetIcon
              className='stroke-background-700'
              as={PhoneIcon}
              size='lg'
            />
            <ActionsheetItemText size='lg'>Call</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  )
}

export default Contact
