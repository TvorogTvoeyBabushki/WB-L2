class App {
  constructor() {
    this.textId = 0
    this.textOptions = []

    this.#uploadImage()
    this.#addText()
  }

  #uploadImage() {
    this.imageWrapper = document.querySelector('.meme-generator__image-wrapper')
    const uploadImageEl = document.querySelector('#upload-image')

    uploadImageEl.addEventListener('change', ({ target }) => {
      const fileRef = target.files[0]

      if (fileRef) {
        this.imgEl = new Image()
        this.canvas = document.querySelector('#canvas-image')
        this.context = this.canvas.getContext('2d')
        this.size = 500
        const reader = new FileReader()

        reader.readAsDataURL(fileRef)
        reader.onload = ({ target }) => (this.imgEl.src = target.result)

        const timerId = setTimeout(() => {
          this.context.drawImage(this.imgEl, 0, 0, this.size, this.size)
          this.#downloadImage()

          clearTimeout(timerId)
        }, 100)
      }
    })
  }

  #addText() {
    const toolbarWrapper = document.querySelector('.meme-generator__toolbar')
    const btnAddText = document.querySelector('.meme-generator__add-text')
    let dragEl = null
    let coordsEl = { x: 0, y: 0 }

    btnAddText.addEventListener('click', () => {
      const textEl = document.createElement('div')
      textEl.setAttribute('data-id', this.textId)

      toolbarWrapper.insertAdjacentElement(
        'afterbegin',
        this.#drawTextFieldWrapper()
      )
      this.imageWrapper.append(textEl)

      this.textOptions.push({
        id: this.textId,
        isActiveUppercaseText: false,
        isActiveBoldText: false,
        isActiveItalicText: false,
        fontSize: 16,
        opacity: 1,
        content: '',
        coords: {
          x: 0,
          y: 0
        },
        color: '#000000'
      })

      this.#changeTextField(textEl)
      this.#changeColor(textEl)
      this.#showOptions(textEl, this.textId)
      this.textId++

      const textEls = this.imageWrapper.querySelectorAll('div')
      textEl.style.left = `${textEls.length * 10}px`
      textEl.style.top = `${textEls.length * 10}px`

      textEls.forEach((textEl) => {
        textEl.draggable = true
        textEl.addEventListener('dragstart', ({ target }) => {
          dragEl = target
        })
        textEl.addEventListener('dragend', () => {
          dragEl = null
        })

        textEl.addEventListener('mousedown', (e) => {
          coordsEl.x = e.offsetX
          coordsEl.y = e.offsetY
        })
      })

      this.imageWrapper.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
      this.imageWrapper.addEventListener('drop', (e) => {
        dragEl.style.top = `${e.offsetY - coordsEl.y}px`
        dragEl.style.left = `${e.offsetX - coordsEl.x}px`

        this.textOptions.forEach(({ id, coords }) => {
          if (id === +dragEl.dataset.id) {
            coords.x =
              dragEl.offsetLeft + dragEl.querySelector('span').offsetLeft + 1
            coords.y =
              dragEl.offsetTop +
              dragEl.clientHeight / 2 +
              dragEl.querySelector('span').clientHeight / 2 +
              0.5
          }
        })
      })

      this.imageWrapper.addEventListener('mouseenter', ({ target }) => {
        target.classList.add('hover')
      })
      this.imageWrapper.addEventListener('mouseleave', ({ target }) => {
        target.classList.remove('hover')
      })
    })
  }

  #changeTextField(textEl) {
    const textFieldEls = document.querySelectorAll(
      '.meme-generator__field-text'
    )

    textFieldEls.forEach((textFieldEl) => {
      const parent = textFieldEl.parentElement

      textFieldEl.addEventListener('input', ({ target }) => {
        if (textEl.dataset.id === parent.dataset.id) {
          textEl.innerHTML = `<span>${target.value}</span>`
          target.value.length
            ? textEl.classList.add('active')
            : textEl.classList.remove('active')

          this.textOptions.map((textElItem) => {
            if (textElItem.id === +textEl.dataset.id) {
              textElItem.content = target.value
            }
            return textElItem
          })
        }
      })
    })
  }

  #changeColor(textEl) {
    const textFieldEls = document.querySelectorAll(
      '.meme-generator__change-color'
    )

    textFieldEls.forEach((textFieldEl) => {
      const parent = textFieldEl.parentElement.parentElement

      textFieldEl.addEventListener('input', ({ target }) => {
        if (textEl.dataset.id === parent.dataset.id) {
          textEl.style.color = `${target.value}`
        }

        this.textOptions.forEach((textElItem) => {
          if (textElItem.id === +textEl.dataset.id) {
            textElItem.color = target.value
          }
        })
      })
    })
  }

  #showOptions(textEl, textId) {
    const btnOptionsEls = document.querySelectorAll(
      '.meme-generator__btn-options'
    )

    btnOptionsEls.forEach((btnOptionsEl) => {
      btnOptionsEl.addEventListener('click', ({ target, currentTarget }) => {
        const { id } = currentTarget.parentElement.parentElement.dataset

        if (textId === +id) {
          const optionsWrapper = currentTarget.querySelector(
            '.meme-generator__options-wrapper'
          )

          if (optionsWrapper && !optionsWrapper.contains(target)) {
            optionsWrapper.remove()
            return
          }

          if (optionsWrapper) {
            return
          }

          currentTarget.append(this.#drawOptions(textId))
          this.#changeOptions(textEl, textId)
        }
      })

      document.addEventListener('click', ({ target }) => {
        const optionsWrapper = btnOptionsEl.querySelector(
          '.meme-generator__options-wrapper'
        )

        if (optionsWrapper && !btnOptionsEl.contains(target)) {
          optionsWrapper.remove()
        }
      })
      document.removeEventListener('click', ({ target }) => {
        const optionsWrapper = btnOptionsEl.querySelector(
          '.meme-generator__options-wrapper'
        )

        if (optionsWrapper && !btnOptionsEl.contains(target)) {
          optionsWrapper.remove()
        }
      })
    })
  }

  #handleChangeOptions = (target, textEl, textId, isActive, prop) => {
    const parent = target.parentElement
    const currentTextEl = this.textOptions.filter(({ id }) => id === textId)[0]

    if (currentTextEl[isActive]) {
      parent.classList.remove('active')

      textEl.style[prop[0]] = prop[2]
      currentTextEl[isActive] = false
    } else {
      parent.classList.add('active')

      textEl.style[prop[0]] = prop[1]
      currentTextEl[isActive] = true
    }
  }

  #changeOptions(textEl, textId) {
    const uppercaseText = document.querySelector('#uppercase-text')
    const boldText = document.querySelector('#bold-text')
    const italicText = document.querySelector('#italic-text')
    const sizeText = document.querySelector('#size-text')
    const opacityText = document.querySelector('#opacity-text')
    const btnRemoveText = document.querySelector('#remove-text')

    uppercaseText.addEventListener('change', ({ target }) =>
      this.#handleChangeOptions(
        target,
        textEl,
        textId,
        'isActiveUppercaseText',
        ['textTransform', 'uppercase', 'none']
      )
    )

    boldText.addEventListener('change', ({ target }) =>
      this.#handleChangeOptions(target, textEl, textId, 'isActiveBoldText', [
        'fontWeight',
        '700',
        '400'
      ])
    )

    italicText.addEventListener('change', ({ target }) =>
      this.#handleChangeOptions(target, textEl, textId, 'isActiveItalicText', [
        'fontStyle',
        'italic',
        'normal'
      ])
    )

    sizeText.addEventListener('input', ({ target }) => {
      const currentTextEl = this.textOptions.filter(
        ({ id }) => id === textId
      )[0]

      textEl.style.fontSize = `${target.value}px`
      currentTextEl.fontSize = target.value
      currentTextEl.coords.x =
        textEl.offsetLeft + textEl.querySelector('span').offsetLeft + 1
      currentTextEl.coords.y =
        textEl.offsetTop +
        textEl.clientHeight / 2 +
        textEl.querySelector('span').clientHeight / 2 +
        0.5
    })

    opacityText.addEventListener('input', ({ target }) => {
      const currentTextEl = this.textOptions.filter(
        ({ id }) => id === textId
      )[0]

      currentTextEl.opacity = target.value
      textEl.style.opacity = target.value
    })

    btnRemoveText.addEventListener('click', () => {
      const textFieldEls = document.querySelectorAll(
        '.meme-generator__text-element'
      )

      textFieldEls.forEach((textFieldEl) => {
        const { id } = textFieldEl.dataset

        if (+id === textId) {
          textFieldEl.remove()
        }
      })

      textEl.remove()
      this.textOptions = this.textOptions.filter(({ id }) => id !== textId)
    })
  }

  #hexToRgb(color, opacity) {
    const red = parseInt(color.slice(1, 3), 16),
      green = parseInt(color.slice(3, 5), 16),
      blue = parseInt(color.slice(5, 7), 16)

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`
  }

  #downloadImage() {
    const btnDownloadImg = document.querySelector(
      '.meme-generator__download-image'
    )

    if (!this.imgEl) return

    btnDownloadImg.addEventListener('click', () => {
      this.textOptions.forEach(
        ({
          isActiveUppercaseText,
          isActiveItalicText,
          isActiveBoldText,
          fontSize,
          content,
          opacity,
          coords,
          color
        }) => {
          this.context.font = `${isActiveItalicText ? 'italic' : 'normal'} ${
            isActiveBoldText ? 'bold' : 'normal'
          } ${fontSize}px Open Sans`
          this.context.fillStyle = this.#hexToRgb(color, opacity)
          this.context.fillText(
            isActiveUppercaseText ? content.toUpperCase() : content,
            coords.x,
            coords.y
          )
        }
      )

      this.canvas.toBlob((blob) => {
        const link = document.createElement('a')

        link.href = URL.createObjectURL(blob)
        link.download = 'image.png'

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.drawImage(this.imgEl, 0, 0, this.size, this.size)

        link.click()
        URL.revokeObjectURL(link.href)
      }, 'image/png')
    })
  }

  #drawOptions(textId) {
    const optionsWrapper = document.createElement('div')

    optionsWrapper.classList.add('meme-generator__options-wrapper')
    optionsWrapper.innerHTML = `
      <div>
        <label class="${
          this.textOptions.filter(({ id }) => id === textId)[0]
            .isActiveUppercaseText
            ? 'active'
            : ''
        }">
          <input id="uppercase-text" type="checkbox" />
          Заглавные буквы
        </label>
        <label class="${
          this.textOptions.filter(({ id }) => id === textId)[0].isActiveBoldText
            ? 'active'
            : ''
        }">
          <input id="bold-text" type="checkbox" />
          Жирность
        </label>
        <label class="${
          this.textOptions.filter(({ id }) => id === textId)[0]
            .isActiveItalicText
            ? 'active'
            : ''
        }">
          <input id="italic-text" type="checkbox" />
          Курсив
        </label>
      </div>
      <div>
        <div>Макс. размер шрифта (px)</div>
        <input id="size-text" type="number" value="${
          this.textOptions.filter(({ id }) => id === textId)[0].fontSize
        }"/>
      </div>
      <div>
        <div>Прозрачность</div>
        <input id="opacity-text" type="number" value="${
          this.textOptions.filter(({ id }) => id === textId)[0].opacity
        }" max="1" step="0.1"/>
      </div>
      <div>
        <button id="remove-text">Удалить</button>
      </div>
    `

    return optionsWrapper
  }

  #drawTextFieldWrapper() {
    const fieldWrapper = document.createElement('div')

    fieldWrapper.setAttribute('data-id', this.textId)
    fieldWrapper.classList.add('meme-generator__text-element')
    fieldWrapper.innerHTML = `
      <input class="meme-generator__field-text" type="text" placeholder="Текст..."/>
      <div>
        <input class="meme-generator__change-color" type="color" value="#000"/>
        <button class="meme-generator__btn-options">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
       
      </div>

    `

    return fieldWrapper
  }
}

new App()
