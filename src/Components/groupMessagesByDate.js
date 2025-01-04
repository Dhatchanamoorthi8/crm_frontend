import { format, isToday, isYesterday, parseISO } from 'date-fns'

export default function groupMessagesByDate(messages) {
  const grouped = {}

  messages.forEach(message => {
    const messageDate = parseISO(message.createdAt)
    let dateKey

    if (isToday(messageDate)) {
      dateKey = 'Today'
    } else if (isYesterday(messageDate)) {
      dateKey = 'Yesterday'
    } else {
      dateKey = format(messageDate, 'MMMM dd, yyyy') // e.g., December 18, 2024
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(message)
  })

  return grouped
}
