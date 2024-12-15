import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import * as Calendar from 'expo-calendar'
import * as Notifications from 'expo-notifications'

const CalendarEventCreator = ({
  title,
  startDate,
  endDate,
  notes,
  ownerEmail
}) => {
  const [calendarId, setCalendarId] = useState(null)

  useEffect(() => {
    ;(async () => {

      const { status } = await Calendar.requestCalendarPermissionsAsync()

      if (status === 'granted') {
    
        const calendars = await Calendar.getCalendarsAsync()
 

        const defaultCalendar = calendars.find(
          calendar => calendar.source.name === 'Default'
        )

        if (defaultCalendar) {
      
          setCalendarId(defaultCalendar.id)
        } else {
       
          const newCalendarId = await createCalendar()

          setCalendarId(newCalendarId)
        }
      } else {
        Alert.alert('Permission denied', 'Calendar permissions are required.')
      }

      // Request notification permissions
      const notificationStatus = await Notifications.requestPermissionsAsync()
      if (notificationStatus.status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Notifications permissions are required.'
        )
      }
    })()
  }, [])

  const createCalendar = async () => {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await Calendar.getDefaultCalendarSourceAsync()
        : { isLocalAccount: true, name: 'Expo Calendar' }

    return await Calendar.createCalendarAsync({
      title: 'Reusable Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'Reusable Calendar',
      ownerAccount: ownerEmail || 'default@example.com', // Use passed owner email or fallback
      accessLevel: Calendar.CalendarAccessLevel.OWNER
    })
  }

  const createEvent = async () => {


    if (!calendarId) {
      Alert.alert('Error', 'Calendar ID is not available.')
      console.error('Calendar ID is null. Check calendar creation logic.')
      return
    }

    const eventDetails = {
      title: title || 'Default Event',
      startDate: new Date(startDate),
      endDate: new Date(
        endDate || new Date(startDate).getTime() + 30 * 60 * 1000
      ), // Default: 30 mins
      timeZone: 'GMT',
      notes: notes || ''
    }



    try {
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails)



      scheduleNotification(title, startDate) // Schedule notification
      Alert.alert('Success', 'Event has been created in the calendar!')
    } catch (error) {
      console.error('Error creating event:', error)
      Alert.alert('Error', `Failed to create event: ${error.message}`)
    }
  }

  const scheduleNotification = async (eventTitle, eventDate) => {
    const notificationDate = new Date(eventDate).getTime() - 5 * 60 * 1000 // 5 minutes before the event
    if (notificationDate > Date.now()) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Event Reminder',
            body: `Your event "${eventTitle}" is starting soon!`
          },
          trigger: { date: new Date(notificationDate) }
        })
        Alert.alert(
          'Notification Scheduled',
          'You will be reminded about this event.'
        )
      } catch (error) {
        Alert.alert(
          'Error',
          `Failed to schedule notification: ${error.message}`
        )
      }
    } else {
      Alert.alert('Error', 'Notification time has already passed.')
    }
  }

  return { createEvent }
}

export default CalendarEventCreator
