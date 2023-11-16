export const formDate = ({ start, end }) => {
  const startDay = `${new Date(start)}`.split(' ')[2]
  const startMonth = `${new Date(start)}`.split(' ')[1]
  const startYear = new Date(start).getFullYear()
  const endDay = `${new Date(end)}`.split(' ')[2]
  const endMonth = `${new Date(end)}`.split(' ')[1]
  const endYear = new Date(end).getFullYear()
  const endTime = `${new Date(end)}`.split(' ')[4].split(':')
  const endTimeHour = endTime[0]
  const endTimeMinute = endTime[1]

  if (startDay === endDay) {
    return `${startDay} ${startMonth} ${startYear} ${endTimeHour}:${endTimeMinute}`
  }

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear} ${endTimeHour}:${endTimeMinute}`
  }

  if (startMonth !== endMonth && startYear === endYear) {
    return `${startDay} - ${endDay} ${startMonth}/${endMonth} ${startYear} ${endTimeHour}:${endTimeMinute}`
  }

  if (startMonth === endMonth && startYear !== endYear) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear}/${`${endYear}`.replace(
      /^20/,
      ''
    )} ${endTimeHour}:${endTimeMinute}`
  }

  if (startMonth !== endMonth && startYear !== endYear) {
    return `${startDay} - ${endDay} ${startMonth}/${endMonth} ${startYear}/${`${endYear}`.replace(
      /^20/,
      ''
    )} ${endTimeHour}:${endTimeMinute}`
  }
}
