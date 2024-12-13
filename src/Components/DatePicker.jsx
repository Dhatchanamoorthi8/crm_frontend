import React, { useEffect, useState } from 'react'
import { Center } from '@gluestack-ui/themed'
import Datetimepicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'

const DatePicker = ({
  isOpen,
  onClose,
  SelectedDate,
  clearDate,
  value,
  mode
}) => {
  const [currentMode, setCurrentMode] = useState('date')
  const [tempDate, setTempDate] = useState(new Date()) 
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
    }
  }, [value])

  const resetDate = () => {
    setSelectedDate('')
    clearDate()
  }

  const onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      onClose(false) // Close picker if dismissed
      return
    }

    if (selectedDate) {
      if (mode === 'datetime' && currentMode === 'date') {
        // Save selected date temporarily and show time picker
        setTempDate(selectedDate)
        setCurrentMode('time') // Switch to time picker
      } else {
        // Finalize selection for both 'date' and 'time' modes
        const finalDate =
          mode === 'datetime'
            ? new Date(
                tempDate.getFullYear(),
                tempDate.getMonth(),
                tempDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes()
              )
            : selectedDate

        const formattedDate =
          mode === 'datetime'
            ? finalDate.toISOString() // Full datetime in ISO format
            : finalDate.toISOString().split('T')[0] // Only date in yyyy-mm-dd format

        setSelectedDate(finalDate)
        SelectedDate(formattedDate) // Pass formatted date/time back to parent
        onClose(false) // Close picker
        setCurrentMode('date') // Reset mode for next use
      }
    }
  }

  return (
    <Center>
      {isOpen && (
        <Datetimepicker
          testID='datetimepicker'
          display='default'
          mode={currentMode} // Dynamic mode: 'date' or 'time'
          value={selectedDate}
          onChange={onChangeDate}
          is24Hour={true} // 24-hour format for time picker
        />
      )}
    </Center>
  )
}

export default DatePicker
