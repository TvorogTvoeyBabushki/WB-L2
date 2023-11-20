export const convertSecondToMinSec = (time) => {
  const minutes = Math.floor(time / 60)
  const second = Math.floor(time - minutes * 60)

  return `${minutes < 1 ? 0 : minutes}:${second < 10 ? `0${second}` : second}`
}
