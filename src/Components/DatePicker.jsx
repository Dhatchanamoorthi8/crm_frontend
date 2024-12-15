import React, { useEffect, useState } from 'react'
import { Center } from '@gluestack-ui/themed'
import Datetimepicker from '@react-native-community/datetimepicker'

const DatePicker = ({
  isOpen,
  onClose,
  SelectedDate,
  clearDate,
  value,
  mode
}) => {
  const [currentMode, setCurrentMode] = useState('date')
  const [tempDate, setTempDate] = useState(new Date()) // Temporary holder for date
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
    }
  }, [value])

  const resetDate = () => {
    setSelectedDate(null)
    clearDate()
  }

  const formatDateToIST = (date, isDateOnly = false) => {
    // Format the date in IST using Intl.DateTimeFormat
    const options = isDateOnly
      ? {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }
      : {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }

    const formatter = new Intl.DateTimeFormat('en-IN', options)
    const parts = formatter.formatToParts(date)

    if (isDateOnly) {
      // Format date only: yyyy-MM-dd
      return `${parts.find(p => p.type === 'year').value}-${
        parts.find(p => p.type === 'month').value
      }-${parts.find(p => p.type === 'day').value}`
    }

    // Format full datetime: yyyy-MM-dd HH:mm:ss
    return `${parts.find(p => p.type === 'year').value}-${
      parts.find(p => p.type === 'month').value
    }-${parts.find(p => p.type === 'day').value} ${
      parts.find(p => p.type === 'hour').value
    }:${parts.find(p => p.type === 'minute').value}:${
      parts.find(p => p.type === 'second').value
    }`
  }

  const onChangeDate = (event, date) => {
    if (event.type === 'dismissed') {
      onClose(false) // Close picker if dismissed
      return
    }

    if (date) {
      if (mode === 'datetime' && currentMode === 'date') {
        // Save selected date temporarily and show time picker
        setTempDate(date)
        setCurrentMode('time') // Switch to time picker
      } else {
        // Finalize selection for both 'date' and 'time' modes
        const finalDate =
          mode === 'datetime'
            ? new Date(
                tempDate.getFullYear(),
                tempDate.getMonth(),
                tempDate.getDate(),
                date.getHours(),
                date.getMinutes()
              )
            : date

        // Format date based on mode (datetime or date only)
        const formattedDate =
          mode === 'date'
            ? formatDateToIST(finalDate, true) // Only date in yyyy-MM-dd
            : formatDateToIST(finalDate) // Full datetime in yyyy-MM-dd HH:mm:ss

        setSelectedDate(finalDate)
        SelectedDate(formattedDate) // Pass formatted date/time back to parent
        onClose(false)
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
          mode={currentMode}
          value={currentMode === 'time' ? tempDate : selectedDate}
          onChange={onChangeDate}
        />
      )}
    </Center>
  )
}

export default DatePicker
