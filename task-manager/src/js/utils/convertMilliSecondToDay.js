export const convertMilliSecondToDay = (milliSec) => {
  const hour = 24
  const minute = 60
  const second = 60
  const milliSecond = 1000

  return Math.round(milliSec / milliSecond / second / minute / hour)
}
