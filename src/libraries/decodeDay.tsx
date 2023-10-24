// Parse hours string and return true if open now
const dayAbbreviations: Record<string, string> = {
  'Sunday': 'Su',
  'Monday': 'Mo',
  'Tuesday': 'Tu',
  'Wednesday': 'We',
  'Thursday': 'Th',
  'Friday': 'Fr',
  'Saturday': 'Sa',
}

export function isOpenNow(hoursString: string | undefined) {
  if (!hoursString) return false

  // Split into day groups
  const regex = /(?<=[0-9]);?:?\s*(?=[a-zA-Z])/
  const dayGroups = hoursString.split(regex)

  // Get current day/time
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dayAbbreviation = dayAbbreviations[dayName] || dayName.slice(0, 2)
  const dayShort = dayAbbreviations[dayAbbreviation]

  const time = now.getHours() + now.getMinutes() / 60

  // Loop through groups
  for (const group of dayGroups) {
    // Split days and hours
    const [days, hours] = group.split(' ')
    const [startDay, endDay] = days.split('-').map(day => dayAbbreviations[day] || day.slice(0, 2))

    // Get open/close times
    const [open, close] = hours.split('-')
    const openTime = parseTime(open)
    const closeTime = parseTime(close)

    // Check if current day/time is within range
    if (isDayInSeries(startDay, endDay, dayShort) && time >= openTime && time < closeTime) {
      return true
    }
  }

  return false
}

// Helper function to get day name
// function getDayName(dayNumber) {
//   const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
//   return days[dayNumber]
// }

// Find if day is in series
function isDayInSeries(start: string, end: string, day: string) {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const startIndex = days.indexOf(start)
  const endIndex = days.indexOf(end)
  const dayIndex = days.indexOf(day)
  if (startIndex < endIndex) {
    return dayIndex >= startIndex && dayIndex <= endIndex
  } else {
    return dayIndex >= startIndex || dayIndex <= endIndex
  }
}

function parseTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(':')
  return parseInt(hours) + parseInt(minutes) / 60
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  let isPM = false
  let convertedHours = parseInt(hours, 10)

  if (convertedHours > 12) {
    convertedHours -= 12
    isPM = true
  } else if (convertedHours === 0) {
    convertedHours = 12
  }

  const suffix = isPM ? 'pm' : 'am'
  return `${convertedHours}:${minutes}${suffix}`
}

export function formatTimes(timeString: string): string {
  const dayRegex = /\b([a-zA-Z]+day)\b/g
  const timeRegex = /(\d{1,2}:\d{2}[ap]m)|(\d{1,2}:\d{2})-(\d{1,2}:\d{2}[ap]m|\d{1,2}:\d{2})/g

  const formattedTimeString = timeString.replace(dayRegex, match => {
    const dayAbbreviation = dayAbbreviations[match] || match.slice(0, 2)
    return dayAbbreviation
  })

  const formattedTimes = formattedTimeString.match(timeRegex)

  if (!formattedTimes) {
    return formattedTimeString
  }

  return formattedTimes.reduce((acc, time) => {
    if (time.includes('-')) {
      const [start, end] = time.split('-')
      const formattedStart = formatTime(start)
      const formattedEnd = formatTime(end)
      const formattedTime = `${formattedStart}-${formattedEnd}`
      return acc.replace(time, formattedTime)
    } else {
      const formattedTime = formatTime(time)
      return acc.replace(time, formattedTime)
    }
  }, formattedTimeString)
}