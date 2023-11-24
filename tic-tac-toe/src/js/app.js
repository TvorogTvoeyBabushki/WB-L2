class App {
  constructor() {
    this.statistics = {
      zeroWin: 0,
      crossWin: 0,
      deadHeat: 0
    }

    this.#initOptions()
    this.#drawStatistics()
    this.#handleClickCell()
    this.#restartGame()
  }

  #initOptions() {
    this.type = 'cross'
    this.gameFieldValue = ['', '', '', '', '', '', '', '', '']
  }

  #switchType() {
    const switchWrapper = document.querySelector('.tic-tac-toe__switch')

    if (this.type === 'cross') {
      switchWrapper.classList.remove('zero')
      switchWrapper.classList.add('cross')
    }

    if (this.type === 'zero') {
      switchWrapper.classList.remove('cross')
      switchWrapper.classList.add('zero')
    }
  }

  #handleRestartGame = () => {
    this.fieldWrapper.innerHTML = ''

    for (let i = 0; i < 9; i++) {
      const cellEl = document.createElement('div')

      cellEl.classList.add('tic-tac-toe__playing-cell')
      this.fieldWrapper.append(cellEl)
    }

    this.#initOptions()
    this.#handleClickCell()
    this.#switchType()
  }

  #restartGame() {
    const btnRestartWrapper = document.querySelector('.tic-tac-toe__restart')
    const btnRestart = btnRestartWrapper.querySelector('button')

    btnRestart.addEventListener('click', this.#handleRestartGame)
  }

  #handleClickCell() {
    this.fieldWrapper = document.querySelector('.tic-tac-toe__playing-field')
    const cells = this.fieldWrapper.querySelectorAll(
      '.tic-tac-toe__playing-cell'
    )

    cells.forEach((cell, index) => {
      cell.setAttribute('data-id', index)

      cell.addEventListener('click', ({ currentTarget }) => {
        const { type, id } = currentTarget.dataset
        if (type) return

        currentTarget.setAttribute('data-type', this.type)

        if (this.type === 'cross') {
          currentTarget.append(this.#drawCrossAndZero())

          this.gameFieldValue = this.gameFieldValue.map((field, index) => {
            if (index === +id) {
              field = 'x'
            }
            return field
          })

          this.type = 'zero'
          this.#switchType()
        } else {
          currentTarget.append(this.#drawCrossAndZero())

          this.gameFieldValue = this.gameFieldValue.map((field, index) => {
            if (index === +id) {
              field = '0'
            }
            return field
          })

          this.type = 'cross'
          this.#switchType()
        }

        this.#win()
      })
    })
  }

  #changeDeclination(n, forms) {
    n = Math.abs(n) % 100
    const n1 = n % 10

    if (n > 10 && n < 20) {
      return `${n} ${forms[2]}`
    }

    if (n1 === 1) {
      return `${n} ${forms[0]}`
    }

    if (n1 > 1 && n1 < 5) {
      return `${n} ${forms[1]}`
    }

    return `${n} ${forms[2]}`
  }

  #win() {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ]

    winCombos.forEach((winCombo) => {
      if (
        this.gameFieldValue[winCombo[0]] === 'x' &&
        this.gameFieldValue[winCombo[1]] === 'x' &&
        this.gameFieldValue[winCombo[2]] === 'x'
      ) {
        this.statistics.crossWin++
        this.#drawStatistics()
        this.#handleRestartGame()
      }

      if (
        this.gameFieldValue[winCombo[0]] === '0' &&
        this.gameFieldValue[winCombo[1]] === '0' &&
        this.gameFieldValue[winCombo[2]] === '0'
      ) {
        this.statistics.zeroWin++
        this.#drawStatistics()
        this.#handleRestartGame()
      }
    })

    if (!this.gameFieldValue.includes('')) {
      this.statistics.deadHeat++
      this.#drawStatistics()
      this.#handleRestartGame()
    }
  }

  #drawCrossAndZero() {
    const elWrapper = document.createElement('div')

    this.type === 'cross'
      ? elWrapper.classList.add('tic-tac-toe__cross-cell')
      : elWrapper.classList.add('tic-tac-toe__zero-cell')
    return elWrapper
  }

  #drawStatistics() {
    const statisticsWrapper = document.querySelector('.tic-tac-toe__statistics')

    statisticsWrapper.innerHTML = `
      <div class="tic-tac-toe__zero">
        <div></div>
        <div>${this.#changeDeclination(this.statistics.zeroWin, [
          'победа',
          'победы',
          'побед'
        ])}</div>
      </div>
      <div class="tic-tac-toe__cross">
        <div></div>
        <div>${this.#changeDeclination(this.statistics.crossWin, [
          'победа',
          'победы',
          'побед'
        ])}</div>
      </div>
      <div class="tic-tac-toe__scales">
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 1C12.5523 1 13 1.44772 13 2V3.03241C14.2498 3.11076 15.4551 3.31872 16.4996 3.51766C16.7363 3.56274 16.9614 3.6067 17.1766 3.64875C17.5772 3.72697 17.9442 3.79865 18.2885 3.85854C18.8201 3.95099 19.2169 4 19.5 4C20.0262 4 20.4799 3.824 20.8164 3.63176C20.987 3.53425 21.1544 3.42192 21.2985 3.28732C21.6895 2.90238 22.3185 2.90423 22.7071 3.29289C23.0976 3.68342 23.0976 4.31658 22.7071 4.70711C22.6248 4.78929 22.5358 4.8645 22.445 4.93712C22.2947 5.05735 22.08 5.21318 21.8086 5.36824C21.5531 5.51425 21.2396 5.66392 20.8766 5.7809L23.592 12.7633C23.8408 13.403 24.0883 14.3096 23.7733 15.2388C23.5809 15.8064 23.2111 16.5114 22.5024 17.0733C21.7828 17.6438 20.7978 18 19.5 18C18.2022 18 17.2172 17.6438 16.4976 17.0733C15.7889 16.5114 15.4191 15.8064 15.2267 15.2388C14.9117 14.3096 15.1592 13.403 15.408 12.7633L18.0948 5.85438C17.6825 5.78545 17.2363 5.69819 16.7643 5.60606C16.5535 5.5649 16.3394 5.5231 16.1254 5.48234C15.1314 5.293 14.0689 5.11204 13 5.03671V21H17C17.5523 21 18 21.4477 18 22C18 22.5523 17.5523 23 17 23H7C6.44772 23 6 22.5523 6 22C6 21.4477 6.44772 21 7 21H11V5.03671C9.93106 5.11204 8.86863 5.293 7.87462 5.48234C7.66063 5.5231 7.44651 5.5649 7.23567 5.60606C6.76375 5.69819 6.31749 5.78545 5.90522 5.85438L8.59203 12.7633C8.84079 13.403 9.08831 14.3096 8.77332 15.2388C8.58095 15.8064 8.21113 16.5114 7.50239 17.0733C6.78283 17.6438 5.79781 18 4.5 18C3.20219 18 2.21717 17.6438 1.49762 17.0733C0.788879 16.5114 0.419057 15.8064 0.226689 15.2388C-0.0883047 14.3096 0.15921 13.403 0.407975 12.7633L3.12336 5.7809C2.7604 5.66392 2.44688 5.51425 2.19136 5.36824C1.92 5.21318 1.70529 5.05735 1.555 4.93712C1.54623 4.9301 1.2929 4.70711 1.2929 4.70711C0.902372 4.31658 0.902372 3.68342 1.2929 3.29289C1.68155 2.90424 2.31052 2.90238 2.70147 3.2873C2.71455 3.29973 2.89568 3.46721 3.18364 3.63176C3.52007 3.824 3.97378 4 4.5 4C4.78311 4 5.17989 3.95099 5.71147 3.85854C6.05594 3.79863 6.42267 3.72701 6.8233 3.64876C7.03851 3.60673 7.26382 3.56272 7.50039 3.51766C8.54486 3.31872 9.75016 3.11076 11 3.03241V2C11 1.44772 11.4477 1 12 1ZM4.5 7.75903L2.46185 13H6.53816L4.5 7.75903ZM2.74016 15.5061C2.55191 15.3569 2.4102 15.1818 2.30351 15H6.6965C6.58981 15.1818 6.44809 15.3569 6.25985 15.5061C5.94444 15.7562 5.41585 16 4.5 16C3.58416 16 3.05556 15.7562 2.74016 15.5061ZM17.4618 13L19.5 7.75903L21.5382 13H17.4618ZM17.3035 15C17.4102 15.1818 17.5519 15.3569 17.7402 15.5061C18.0556 15.7562 18.5842 16 19.5 16C20.4158 16 20.9444 15.7562 21.2598 15.5061C21.4481 15.3569 21.5898 15.1818 21.6965 15H17.3035Z"
            fill="#898989"
          />
        </svg>
        <div>${this.#changeDeclination(this.statistics.deadHeat, [
          'победа',
          'победы',
          'побед'
        ])}</div>
      </div>
    `
  }
}

new App()
