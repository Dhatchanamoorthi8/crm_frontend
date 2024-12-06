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

const DatePicker = ({ isOpen, onClose, SelectedDate, clearDate }) => {
  const [selectedDate, setSelectedDate] = useState('')

  const resetDate = () => {
    setSelectedDate('')
    clearDate()
  }

  const handlepressdate = day => {
    SelectedDate(day.dateString)
    onClose(false)
    return day.dateString
  }

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose} size='lg'>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <VStack>
              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                style={{ width: '100%' }}
              >
                <View>
                  <Text>Select Follow-Up Date</Text>
                </View>

                <View>
                  <TouchableOpacity onPress={onClose}>
                    <Icon as={CloseCircleIcon} size='xl' onPress={onClose} />
                  </TouchableOpacity>
                </View>
              </View>
            </VStack>
          </AlertDialogHeader>

          <AlertDialogBody mt={'$3'} mb={'$4'}>
            <Center>
              <Calendar
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  height: 350
                }}
                onDayPress={day => {
                  setSelectedDate(day.dateString) // Save the selected date
                  handlepressdate(day)
                }}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  textSectionTitleDisabledColor: '#d9e1e8',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#000',
                  arrowColor: 'orange',
                  disabledArrowColor: '#d9e1e8',
                  monthTextColor: 'black',
                  indicatorColor: 'blue',
                  textDayFontFamily: 'MonaSans_Black',
                  textMonthFontFamily: 'MonaSans_Black',
                  textDayHeaderFontFamily: 'MonaSans_Black',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16
                }}
                enableSwipeMonths={true}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: 'black' }
                }} // Mark the selected date
              />
            </Center>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DatePicker
