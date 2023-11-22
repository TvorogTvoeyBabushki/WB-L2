class App {
  constructor() {
    this.#initOptions('default')
    this.#changeField()
    this.#checkNumber()
    this.#renderInfo()
    this.#restartGame()
    this.#changeRange()
  }

  #initOptions(variant) {
    if (variant === 'default') {
      this.range = 100
      this.quantityOfHearts = 10
      this.bestQuantityOfAttempts = localStorage.getItem(
        'bestResultRangeOneHundred'
      )
        ? JSON.parse(localStorage.getItem('bestResultRangeOneHundred'))
        : 0
    }

    if (variant === 'update') {
      this.range = 1000
      this.quantityOfHearts = 100
      this.bestQuantityOfAttempts = localStorage.getItem(
        'bestResultRangeOneThousand'
      )
        ? JSON.parse(localStorage.getItem('bestResultRangeOneThousand'))
        : 0
    }

    this.guessNumber = 0
    this.randomNumber = Math.floor(Math.random() * this.range + 1)
    this.oddEven = this.randomNumber % 2 === 0 ? 'четное' : 'нечетное'
    this.quantityOfAttempts = 0
  }

  #changeField() {
    this.field = document.querySelector('.guess-number__field')

    this.field.value = ''
    this.field.addEventListener(
      'change',
      ({ target }) => (this.guessNumber = +target.value.trim())
    )
  }

  #winAndLose(variant) {
    variant === 'win'
      ? (this.messageWrapper.innerHTML = '!! Ты выиграл !!')
      : (this.messageWrapper.innerHTML = '!! Ты проиграл !!')

    this.messageWrapper.classList.remove('close')
    this.btnCheckNumber.classList.add('disabled')

    this.btnCheckNumber.disabled = true
    this.field.disabled = true
  }

  #changeRange() {
    const rangeWrapper = document.querySelector('.guess-number__range')
    let isShowList = false

    rangeWrapper.addEventListener('click', ({ target }) => {
      if (!isShowList) {
        rangeWrapper.innerHTML = `
          <div class="guess-number__range-selected">Диапазон 1-${
            this.range
          }</div>
          <div class="guess-number__range-list">${
            this.range === 100 ? '1-1000' : '1-100'
          }</div>
        `

        rangeWrapper.classList.add('active')
        isShowList = true
      } else {
        if (target.classList.contains('guess-number__range-list')) {
          this.range === 100
            ? this.#initOptions('update')
            : this.#initOptions('default')

          this.#handleRestartGame()
        }

        rangeWrapper.innerHTML = `
          <div class="guess-number__range-selected">Диапазон 1-${this.range}</div>
        `

        rangeWrapper.classList.remove('active')
        isShowList = false
      }
    })
  }

  #checkNumber() {
    this.btnCheckNumber = document.querySelector('#check-number')
    this.messageWrapper = document.querySelector('.guess-number__message')
    this.isMore = false
    this.isLess = false

    this.btnCheckNumber.addEventListener('click', () => {
      console.log(this.randomNumber)
      if (
        isNaN(this.guessNumber) ||
        this.guessNumber < 1 ||
        this.guessNumber > this.range
      ) {
        isNaN(this.guessNumber)
          ? (this.messageWrapper.innerHTML = 'Введите число')
          : (this.messageWrapper.innerHTML = 'Диапазон от 1 до 100')

        this.messageWrapper.classList.remove('close')
        this.messageWrapper.classList.add('validation')

        return
      }

      if (this.messageWrapper.classList.contains('validation')) {
        this.messageWrapper.classList.remove('validation')
        this.messageWrapper.innerHTML = ''
        this.isMore = false
        this.isLess = false
      }

      this.quantityOfAttempts++
      this.quantityOfHearts--
      this.#renderInfo()

      if (this.guessNumber === this.randomNumber) {
        this.messageWrapper.classList.remove('lose')
        this.messageWrapper.classList.add('win')

        if (
          (this.quantityOfAttempts < this.bestQuantityOfAttempts &&
            this.bestQuantityOfAttempts) ||
          !this.bestQuantityOfAttempts
        ) {
          this.range === 100
            ? localStorage.setItem(
                'bestResultRangeOneHundred',
                JSON.stringify(this.quantityOfAttempts)
              )
            : localStorage.setItem(
                'bestResultRangeOneThousand',
                JSON.stringify(this.quantityOfAttempts)
              )
        }

        this.#winAndLose('win')
        return
      }

      if (this.quantityOfHearts < 1) {
        this.messageWrapper.classList.remove('win')
        this.messageWrapper.classList.add('lose')

        this.#winAndLose('lose')
        return
      }

      if (this.guessNumber > this.randomNumber) {
        if (!this.isLess && this.quantityOfAttempts < 3) {
          this.messageWrapper.innerHTML = 'Загаданное число меньше'
        }

        if (this.quantityOfAttempts === 3) this.isLess = false

        if (this.quantityOfAttempts >= 3 && !this.isLess) {
          this.messageWrapper.innerHTML = `Загаданное число меньше и ${this.oddEven}`
        }

        this.messageWrapper.classList.add('close')
        this.isLess = true
        this.isMore = false
      }

      if (this.guessNumber < this.randomNumber) {
        if (!this.isMore && this.quantityOfAttempts < 3) {
          this.messageWrapper.innerHTML = 'Загаданное число больше'
        }

        if (this.quantityOfAttempts === 3) this.isMore = false

        if (this.quantityOfAttempts >= 3 && !this.isMore) {
          this.messageWrapper.innerHTML = `Загаданное число больше и ${this.oddEven}`
        }

        this.messageWrapper.classList.add('close')
        this.isMore = true
        this.isLess = false
      }
    })
  }

  #renderInfo() {
    const infoWrapper = document.querySelector('.guess-number__info-wrapper')

    infoWrapper.innerHTML = `
      <div class="guess-number__info-number">${this.guessNumber}</div>
      <div class="guess-number__info">
        <div>
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              fill="white"
              fill-opacity="0.01"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.8712 33.0436L15.9976 44.7036C15.9362 45.5229 16.6646 46.0872 17.3161 45.722C21.9289 43.1382 36.3783 33.6479 43.7017 12.7899C44.0376 11.8331 43.1352 10.9697 42.3646 11.5094C38.0387 14.539 28.5846 20.8006 22.7421 21.9934C22.7421 21.9934 26.4836 19.3946 28.7231 15.4053C28.9426 15.0143 28.9244 14.5136 28.6796 14.1606L20.5127 2.38925C20.0287 1.69147 19.0354 1.98057 18.8606 2.87002L16.3181 15.8073L4.38437 26.2226C3.78602 26.7446 3.90808 27.7996 4.5989 28.079L16.8712 33.0436Z"
              fill="#320e3b"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M37.9745 28.448C37.2188 29.5025 35.5908 31.6717 34.0876 32.9974C33.7871 33.2624 33.8276 33.7068 34.1724 33.9234L42.1145 38.909C42.5926 39.2091 43.2384 38.8529 43.1576 38.3323C42.7882 35.9496 41.7237 30.9818 39.0328 28.3741C38.7322 28.083 38.2142 28.1136 37.9745 28.448Z"
              fill="#320e3b"
            />
          </svg>
          <div>Количество попыток: ${this.quantityOfAttempts}</div>
        </div>
        <div>
          <svg
            height="800px"
            width="800px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512.026 512.026"
            xml:space="preserve"
            fill="#320e3b"
          >
            <g>
              <g>
                <g>
                  <path
                    d="M124.686,281.028c-18.283-17.323-91.392-22.933-113.365-24.235c-2.795-0.021-5.803,0.875-7.936,2.88
  c-2.155,2.027-3.371,4.843-3.371,7.787v192c0,5.888,4.779,10.667,10.667,10.667h64c4.608,0,8.704-2.965,10.155-7.36
  c1.557-4.779,38.315-117.589,43.136-173.056C128.27,286.468,127.033,283.268,124.686,281.028z"
                  />
                  <path
                    d="M312.334,231.428c2.005,2.069,4.779,3.264,7.68,3.264s5.675-1.195,7.68-3.264l100.139-104.064
  c13.013-13.483,20.181-31.424,20.181-52.459c0-36.565-24.811-68.331-57.707-73.899c-29.419-5.013-56.107,9.301-70.293,32.491
  c-14.187-23.211-40.896-37.525-70.293-32.491c-32.896,5.568-57.707,37.333-57.707,75.883c0,19.072,7.168,36.992,20.16,50.475
  L312.334,231.428z"
                  />
                  <path
                    d="M510.883,412.015c-14.528-29.035-48.213-44.565-79.723-36.672l-48.235,12.053c0.725,4.885,1.088,10.005,1.088,15.36
  v3.371c0,14.699-9.984,27.477-24.256,31.04l-28.715,7.168c-7.552,1.899-15.381,2.859-23.275,2.859
  c-6.379,0-12.715-0.619-18.816-1.856l-92.565-18.517c-5.781-1.152-9.536-6.763-8.384-12.544
  c1.173-5.803,6.891-9.493,12.544-8.363l92.587,18.517c10.624,2.133,22.165,1.856,32.704-0.768l28.736-7.168
  c4.779-1.216,8.107-5.461,8.107-10.368v-3.371c0-3.904-0.256-7.552-0.704-11.051c-0.128-1.003-0.363-1.899-0.533-2.88
  c-0.427-2.475-0.896-4.907-1.579-7.189c-0.299-1.003-0.661-1.92-1.003-2.88c-0.747-2.112-1.579-4.181-2.581-6.123
  c-0.448-0.853-0.939-1.685-1.429-2.517c-1.109-1.899-2.347-3.712-3.733-5.44c-0.555-0.704-1.131-1.408-1.749-2.069
  c-1.536-1.728-3.243-3.349-5.077-4.885c-0.64-0.533-1.259-1.088-1.941-1.621c-2.048-1.557-4.309-3.008-6.677-4.373
  c-0.64-0.363-1.237-0.789-1.92-1.131c-2.752-1.472-5.739-2.773-8.917-4.011c-0.469-0.171-0.875-0.384-1.344-0.576
  c-3.755-1.387-7.787-2.624-12.117-3.712l-152.896-33.984c-2.859-0.619-5.803-0.064-8.235,1.557s-4.075,4.16-4.587,7.019
  c-7.68,43.712-24.341,100.437-33.579,130.368c-1.707,5.547,1.323,11.435,6.805,13.269l122.645,40.896
  c16.427,6.208,29.184,10.603,44.245,10.603c0,0,0,0,0.021,0c21.888,0,46.677-9.28,102.592-32.192L505.721,426.5
  c2.624-1.195,4.672-3.413,5.653-6.144C512.377,417.626,512.185,414.618,510.883,412.015z"
                  />
                </g>
              </g>
            </g>
          </svg>
          <div>Количество жизней: ${this.quantityOfHearts}</div>
        </div>
        <div>
          <svg
            fill="#000000"
            height="800px"
            width="800px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 325.266 325.266"
            xml:space="preserve"
          >
            <path
              d="M234.544,126.74h18.221c39.977,0,72.5-32.523,72.5-72.5c0-4.143-3.357-7.5-7.5-7.5h-52.273
  c1.643-11.026,2.487-22.399,2.487-33.959c0-4.143-3.357-7.5-7.5-7.5s-7.5,3.357-7.5,7.5c0,38.059-9.707,73.738-27.333,100.465
  c-16.991,25.764-39.265,39.953-62.718,39.953s-45.728-14.189-62.719-39.953C83.747,88.282,74.192,55.509,73.003,20.281h134.081
  c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5H65.377c-4.143,0-7.5,3.357-7.5,7.5c0,11.56,0.844,22.933,2.487,33.959H7.5
  c-4.143,0-7.5,3.357-7.5,7.5c0,30.601,19.359,58.054,48.172,68.315c0.832,0.296,1.681,0.437,2.517,0.437
  c3.082,0,5.972-1.916,7.065-4.985c1.39-3.902-0.647-8.192-4.549-9.582c-20.468-7.289-34.921-25.52-37.713-46.685h47.65
  c4.936,22.227,13.247,42.631,24.545,59.764c13.87,21.03,31.088,35.451,49.975,42.243v83.737h-7.938
  c-17.36,0-31.887,12.365-35.235,28.75H76.201c-4.143,0-7.5,3.357-7.5,7.5v28.75c0,4.143,3.357,7.5,7.5,7.5h173.454
  c4.143,0,7.5-3.357,7.5-7.5v-28.75c0-4.143-3.357-7.5-7.5-7.5h-18.288c-3.349-16.385-17.875-28.75-35.234-28.75h-7.938v-83.737
  C205.469,157.535,221.347,144.939,234.544,126.74z M309.778,61.74c-3.686,28.176-27.848,50-57.013,50h-8.685
  c8.319-14.928,14.604-31.854,18.633-50H309.778z M242.155,304.984H83.701v-13.75h17.561h123.333h17.561V304.984z M215.816,276.234
  H110.04c2.947-8.016,10.659-13.75,19.685-13.75h15.438h35.532h15.438C205.158,262.484,212.869,268.219,215.816,276.234z
  M173.194,247.484h-20.532v-80.008c3.389,0.476,6.813,0.723,10.267,0.723c3.453,0,6.877-0.247,10.266-0.723V247.484z"
              fill="#320e3b"
            />
          </svg>
          <div>Лучший результат: ${this.bestQuantityOfAttempts}</div>
        </div>
      </div>
    `
  }

  #handleRestartGame = () => {
    this.btnCheckNumber.classList.remove('disabled')
    this.btnCheckNumber.disabled = false
    this.field.disabled = false

    this.messageWrapper.innerHTML = ''
    this.isMore = false
    this.isLess = false
    this.field.value = ''

    this.#initOptions(this.range === 100 ? 'default' : 'update')
    this.#renderInfo()
  }

  #restartGame() {
    const btnRestartGame = document.querySelector('#restart-game')

    btnRestartGame.addEventListener('click', this.#handleRestartGame)
  }
}

new App()
