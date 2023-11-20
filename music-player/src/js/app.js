import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import { convertSecondToMinSec } from './utils.js'
import { audioData } from './data.js'

class App {
  #data

  constructor() {
    this.#data = []
    this.position = 0
    this.volumeTrack = 0.5

    this.#loadData()
    this.#playAndPause()
    this.#switch()
    this.#repeat()
    this.#mixedUp()
    this.#volume()
    this.#showPlaylist()
  }

  #changeProgress(track) {
    const progressBar = document.querySelector('.music-player__progress-bar')
    const time = document.querySelector('#progress-time')
    const progress = document.querySelector('#progress')

    track.volume = this.volumeTrack
    track.addEventListener('timeupdate', ({ target }) => {
      let stepPercent = (100 * target.currentTime) / track.duration

      time.innerHTML = convertSecondToMinSec(target.currentTime)

      progress.value = stepPercent
      progress.style.background = `linear-gradient(
        90deg,
        var(--orange-color) ${stepPercent}%,
        var(--app-background) 0
      )`

      if (stepPercent === 100) {
        this.isRepeat
          ? ((target.currentTime = 0), target.play())
          : this.#handlerSwitch('increment')
      }
    })

    this.waveSurfer.on('seeking', (currentTime) => {
      let stepPercent = (100 * currentTime) / track.duration

      time.innerHTML = convertSecondToMinSec(currentTime)
      track.currentTime = currentTime

      progress.value = stepPercent
      progress.style.background = `linear-gradient(
        90deg,
        var(--orange-color) ${stepPercent}%,
        var(--app-background) 0
      )`
    })

    progress.addEventListener('input', ({ target }) => {
      let stepSecond = (target.value * track.duration) / 100

      time.innerHTML = convertSecondToMinSec(stepSecond)
      track.currentTime = stepSecond

      progress.style.background = `linear-gradient(
        90deg,
        var(--orange-color) ${target.value}%,
        var(--app-background) 0
      )`

      this.waveSurfer.setTime(stepSecond)
      this.waveSurfer.on('timeupdate', (currentTime) => {
        if (currentTime === track.duration) {
          this.waveSurfer.play()
        }
      })
    })

    progressBar.addEventListener('mouseenter', () =>
      progressBar.classList.add('active')
    )
    progressBar.addEventListener('mouseleave', () =>
      progressBar.classList.remove('active')
    )
  }

  #playAndPause() {
    const btnPlayback = document.querySelector('#playback')
    this.isPlay = false

    btnPlayback.addEventListener('click', ({ currentTarget }) => {
      if (this.isPlay) {
        this.#data[this.position].audioEl.pause()
        this.waveSurfer.pause()
        this.isPlay = false

        currentTarget.innerHTML = `
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"
                stroke="#fff"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
        `
      } else {
        this.#data[this.position].audioEl.play()
        this.waveSurfer.play()
        this.isPlay = true

        currentTarget.innerHTML = `
            <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M4 2h6v20H4zm10 20h6V2h-6z" />
              <path  fill="none" d="M0 0h24v24H0z" />
            </svg>
        `
      }
      currentTarget.classList.toggle('play')
    })
  }

  #repeat() {
    const btnRepeat = document.querySelector('#repeat')
    this.isRepeat = false

    btnRepeat.addEventListener('click', ({ currentTarget }) => {
      if (this.isRepeat) {
        this.isRepeat = false

        currentTarget.innerHTML = `
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM1.25 12C1.25 16.2802 4.72011 19.75 9.00028 19.75V18.25C5.54846 18.25 2.75 15.4517 2.75 12H1.25ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75Z"
              fill="#fff"
            />
            <path
              opacity="0.5"
              d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM22.75 12C22.75 7.71979 19.2802 4.25 15 4.25V5.75C18.4518 5.75 21.25 8.54822 21.25 12H22.75Z"
              fill="#c1c1c1"
            />
          </svg>
        `
      } else {
        this.isRepeat = true
        currentTarget.innerHTML = `
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM1.25 12C1.25 16.2802 4.72011 19.75 9.00028 19.75V18.25C5.54846 18.25 2.75 15.4517 2.75 12H1.25ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75Z" fill="#fff"/>
            <path opacity="0.5" d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM22.75 12C22.75 7.71979 19.2802 4.25 15 4.25V5.75C18.4518 5.75 21.25 8.54822 21.25 12H22.75Z" fill="#fff"/>
            <path d="M10.5 11.5L12 10V14" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      }
      currentTarget.classList.toggle('active')
    })
  }

  #handlerSwitch = (variant) => {
    this.isPlay && this.#data[this.position].audioEl.pause()
    this.#data[this.position].audioEl.currentTime = 0

    if (variant === 'decrement') {
      this.position === 0
        ? (this.position = this.#data.length - 1)
        : this.position--
    }

    if (variant === 'increment') {
      this.position === this.#data.length - 1
        ? (this.position = 0)
        : this.position++
    }

    if (this.isPlay) {
      const timerId = setTimeout(() => {
        this.#data[this.position].audioEl.play()
        clearTimeout(timerId)
      }, 20)
    }
    this.#render(this.#data[this.position])
    this.#changeProgress(this.#data[this.position].audioEl)
    this.isShowPlaylist = true
  }

  #switch() {
    const btnPrevTrack = document.querySelector('#prev-track')
    const btnNextTrack = document.querySelector('#next-track')

    btnPrevTrack.addEventListener('click', () => {
      this.#data[this.position].audioEl.currentTime > 5
        ? (this.#data[this.position].audioEl.currentTime = 0)
        : this.#handlerSwitch('decrement')
    })
    btnNextTrack.addEventListener('click', () =>
      this.#handlerSwitch('increment')
    )
  }

  #mixedUp() {
    const btnMixedUp = document.querySelector('#mixed-up')
    this.isMixedUp = false

    btnMixedUp.addEventListener('click', ({ currentTarget }) => {
      if (this.isMixedUp) {
        this.isMixedUp = false
      } else {
        this.isMixedUp = true
        let currentTrack = this.#data[this.position]
        this.position = 0

        for (let i = this.#data.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1))

          ;[this.#data[i], this.#data[j]] = [this.#data[j], this.#data[i]]
        }
        this.#data = this.#data.filter(({ id }) => id !== currentTrack.id)
        this.#data.unshift(currentTrack)
      }

      currentTarget.classList.toggle('active')
      if (!this.isShowPlaylist) {
        this.coverWrapper.removeChild(this.coverWrapper.querySelector('div'))

        this.isShowPlaylist = true
        this.#handleShowPlaylist()
      }
    })
  }

  #volume() {
    const volumeWrapper = document.querySelector('#volume')
    const btnVolumeSvg = document.querySelector('#volumeSvg')
    const volumeRangeWrapper = document.createElement('label')
    const volumeRange = document.createElement('input')

    volumeRange.setAttribute('type', 'range')
    volumeRange.setAttribute('min', '0')
    volumeRange.setAttribute('max', '1')
    volumeRange.setAttribute('step', '0.01')
    volumeRange.setAttribute('value', '0.5')

    volumeRange.addEventListener('input', ({ target }) => {
      if (+target.value === 0) {
        btnVolumeSvg.innerHTML = `
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14 3.00001C14 1.07799 11.5532 0.262376 10.4 1.8L6.5 7H4C2.34315 7 1 8.34315 1 10V14C1 15.6569 2.34315 17 4 17H6.49356L10.3878 22.3049C11.5313 23.8627 14 23.0539 14 21.1214V3.00001ZM8.1 8.2L12 3V21.1214L8.10581 15.8165C7.72901 15.3032 7.13031 15 6.49356 15H4C3.44772 15 3 14.5523 3 14V10C3 9.44772 3.44772 9 4 9H6.5C7.12951 9 7.72229 8.70361 8.1 8.2Z" fill="#fff"/>
          <path d="M21.2929 8.57094C21.6834 8.18041 22.3166 8.18042 22.7071 8.57094C23.0976 8.96146 23.0976 9.59463 22.7071 9.98515L20.7603 11.9319L22.7071 13.8787C23.0976 14.2692 23.0976 14.9024 22.7071 15.2929C22.3166 15.6834 21.6834 15.6834 21.2929 15.2929L19.3461 13.3461L17.3994 15.2929C17.0088 15.6834 16.3757 15.6834 15.9852 15.2929C15.5946 14.9023 15.5946 14.2692 15.9852 13.8787L17.9319 11.9319L15.9852 9.98517C15.5946 9.59464 15.5946 8.96148 15.9852 8.57096C16.3757 8.18043 17.0088 8.18043 17.3994 8.57096L19.3461 10.5177L21.2929 8.57094Z" fill="#fff"/>
        `
      } else {
        btnVolumeSvg.innerHTML = `
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.4 1.8C11.5532 0.262376 14 1.07799 14 3.00001V21.1214C14 23.0539 11.5313 23.8627 10.3878 22.3049L6.49356 17H4C2.34315 17 1 15.6569 1 14V10C1 8.34315 2.34315 7 4 7H6.5L10.4 1.8ZM12 3L8.1 8.2C7.72229 8.70361 7.12951 9 6.5 9H4C3.44772 9 3 9.44772 3 10V14C3 14.5523 3.44772 15 4 15H6.49356C7.13031 15 7.72901 15.3032 8.10581 15.8165L12 21.1214V3Z"
            fill="#fff"
          />
          <path
            d="M16.2137 4.17445C16.1094 3.56451 16.5773 3 17.1961 3C17.6635 3 18.0648 3.328 18.1464 3.78824C18.4242 5.35347 19 8.96465 19 12C19 15.0353 18.4242 18.6465 18.1464 20.2118C18.0648 20.672 17.6635 21 17.1961 21C16.5773 21 16.1094 20.4355 16.2137 19.8256C16.5074 18.1073 17 14.8074 17 12C17 9.19264 16.5074 5.8927 16.2137 4.17445Z"
            fill="#fff"
          />
          <path
            d="M21.41 5C20.7346 5 20.2402 5.69397 20.3966 6.35098C20.6758 7.52413 21 9.4379 21 12C21 14.5621 20.6758 16.4759 20.3966 17.649C20.2402 18.306 20.7346 19 21.41 19C21.7716 19 22.0974 18.7944 22.2101 18.4509C22.5034 17.5569 23 15.5233 23 12C23 8.47672 22.5034 6.44306 22.2101 5.54913C22.0974 5.20556 21.7716 5 21.41 5Z"
            fill="#c1c1c1"
          />
        `
      }

      this.#data[this.position].audioEl.volume = target.value
      this.volumeTrack = target.value
      target.style.background = `
        linear-gradient(
          90deg,
          var(--white-color) ${target.value * 100}%,
          var(--app-background) ${target.value / 100}%
        )
      `
    })

    volumeWrapper.addEventListener('mouseenter', ({ currentTarget }) => {
      volumeRangeWrapper.append(volumeRange)
      currentTarget.insertAdjacentElement('afterbegin', volumeRangeWrapper)
    })
    volumeWrapper.addEventListener('mouseleave', ({ currentTarget }) => {
      currentTarget.removeChild(volumeRangeWrapper)
    })
  }

  #handleShowPlaylist = () => {
    this.coverWrapper = document.querySelector('.music-player__cover')
    const playlistWrapper = document.createElement('div')

    if (!this.isShowPlaylist) {
      this.coverWrapper.removeChild(this.coverWrapper.querySelector('div'))

      this.isShowPlaylist = true
      return
    }

    this.#data.forEach(({ track, audioEl, cover, album, group, id }) => {
      playlistWrapper.innerHTML += `
        <div class="music-player__playlist-item" data-id="${id}">
          <div>
            <div>
              <img src="${cover}" alt="${album}"/>
            </div>
            <div>
              <div>${track}</div>
              <div>${group}</div>
            </div>
          </div>
          <div>${convertSecondToMinSec(audioEl.duration)}</div>
        </div>
      `
    })
    this.coverWrapper.append(playlistWrapper)
    this.isShowPlaylist = false

    const playlistItems = playlistWrapper.querySelectorAll(
      '.music-player__playlist-item'
    )
    playlistItems.forEach((playlistItem) => {
      playlistItem.addEventListener('click', ({ currentTarget }) => {
        const { id } = currentTarget.dataset

        this.#data.forEach((track, index) => {
          if (track.id === +id) {
            this.isShowPlaylist = true

            this.isPlay && this.#data[this.position].audioEl.pause()
            this.#data[this.position].audioEl.currentTime = 0
            this.position = index

            if (this.isPlay) {
              const timerId = setTimeout(() => {
                this.#data[this.position].audioEl.play()
                clearTimeout(timerId)
              }, 20)
            }

            this.#render(track)
            this.#changeProgress(track.audioEl)
          }
        })
      })
    })
  }

  #showPlaylist() {
    const btnPlaylist = document.querySelector('#playlist')
    this.isShowPlaylist = true

    btnPlaylist.addEventListener('click', this.#handleShowPlaylist)
  }

  #loadData() {
    const data = localStorage.getItem('playlist')
      ? [...JSON.parse(localStorage.getItem('playlist'))]
      : audioData
    let isFirstRender = true

    data.forEach((track) => {
      const audioEl = new Audio(track.src)

      audioEl.addEventListener('loadeddata', () => {
        this.#data.push({ ...track, audioEl })

        if (isFirstRender) {
          this.#render(this.#data[0])
          this.#changeProgress(audioEl)
          isFirstRender = false
        }
      })
    })
    localStorage.setItem('playlist', JSON.stringify(data))
  }

  #render({ cover, album, group, track, audioEl, src }) {
    const waveSurferWrapper = document.querySelector(
      '.music-player__wave-surfer'
    )
    waveSurferWrapper.innerHTML = ''

    this.waveSurfer = WaveSurfer.create({
      container: waveSurferWrapper,
      waveColor: '#666',
      progressColor: '#ff5500',
      height: 50,
      barWidth: 2,
      normalize: true,
      interact: true,
      cursorWidth: 0,
      barGap: 2,
      url: `${src}`
    })
    this.waveSurfer.on('loading', () => {
      this.waveSurfer.setVolume(0)
    })
    this.waveSurfer.on('ready', () => {
      this.isPlay && this.waveSurfer.play()
    })

    this.trackWrapper = document.querySelector('.music-player__track')

    this.trackWrapper.innerHTML = `
      <div class="music-player__cover">
        <img src="${cover}" alt="${album}" />
      </div>

      <div class="music-player__info">
        <div>${track}</div>
        <div>${group} — ${album}</div>
      </div>

      <div class="music-player__progress-bar">
        <label>
          <input id="progress" type="range" min="0" max="100" value="0" step="0.01"/>
        </label>

        <div>
          <span id="progress-time">0:00</span>
          <span>${convertSecondToMinSec(audioEl.duration)}</span>
        </div>
      </div>
    `
  }
}

new App()
