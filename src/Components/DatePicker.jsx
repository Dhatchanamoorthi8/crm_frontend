import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Center,
  CloseCircleIcon,
  Icon,
  View,
  VStack,
  Text
} from '@gluestack-ui/themed'
import { Calendar } from 'react-native-calendars'
import { TouchableOpacity } from 'react-native'

import Datetimepicker from '@react-native-community/datetimepicker'

const DatePicker = ({ isOpen, onClose, SelectedDate, clearDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const resetDate = () => {
    setSelectedDate('')
    clearDate()
  }

  const handlepressdate = day => {
    SelectedDate(day.dateString)
    onClose(false)
    return day.dateString
  }

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0] // Format the date as yyyy-mm-dd
      setSelectedDate(selectedDate)
      SelectedDate(formattedDate)
      onClose(false)
    }
  }

  return (
    <>
      <Center>
        {isOpen && (
          <Datetimepicker
            display='calendar'
            mode='date'
            value={selectedDate}
            onChange={onChangeDate}
          />
        )}
      </Center>
    </>
  )
}

export default DatePicker
