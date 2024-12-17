import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'

const CalendarComponent = ({ onRangeSelect }) => {


  const [selectedRange, setSelectedRange] = useState({
    fromDate: null,
    toDate: null
  })

  let disabledDaysIndexes = [6, 7]
  // Handle date selection
  const handleDayPress = day => {
    const { dateString } = day

    // If no "fromDate" is set, set it
    if (
      !selectedRange.fromDate ||
      (selectedRange.fromDate && selectedRange.toDate)
    ) {
      setSelectedRange({ fromDate: dateString, toDate: null })
    }
    // If "fromDate" is set but no "toDate," set "toDate"
    else if (!selectedRange.toDate) {
      setSelectedRange(prev => ({
        ...prev,
        toDate: dateString > prev.fromDate ? dateString : prev.fromDate,
        fromDate: dateString < prev.fromDate ? dateString : prev.fromDate
      }))
      onRangeSelect?.({ fromDate: selectedRange.fromDate, toDate: dateString })
    }
  }

  // Highlight selected range
  const getMarkedDates = () => {
    const marked = {}
    const { fromDate, toDate } = selectedRange

    if (fromDate) {
      marked[fromDate] = {
        startingDay: true,
        color: '#00CFFF',
        textColor: '#FFFFFF'
      }
    }

    if (toDate) {
      marked[toDate] = {
        endingDay: true,
        color: '#00CFFF',
        textColor: '#FFFFFF'
      }

      // Highlight all dates in range
      let current = new Date(fromDate)
      const end = new Date(toDate)
      while (current < end) {
        current.setDate(current.getDate() + 1)
        const dateString = current.toISOString().split('T')[0]
        if (dateString !== toDate) {
          marked[dateString] = { color: '#CBEFFF', textColor: '#000000' }
        }
      }
    }

    return marked
  }

  return (
    <View style={styles.container}>
      <Calendar
        markingType='period'
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#00CFFF',
          arrowColor: '#00CFFF',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontFamily: 'NunitoSans_Regular'
        }}
        firstDay={1}
        hideExtraDays={true}
        enableSwipeMonths={true}
        disabledDaysIndexes={disabledDaysIndexes}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    elevation: 5,
    backgroundColor: '#FFFFFF'
  }
})

export default CalendarComponent
