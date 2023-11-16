export const convertDayToMilliSecond = (day) => {
  const hour = 24
  const minute = 60
  const second = 60
  const milliSecond = 1000

  return day * hour * minute * second * milliSecond
}
