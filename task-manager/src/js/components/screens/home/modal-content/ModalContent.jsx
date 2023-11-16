import { useContext } from 'react'
import clsx from 'clsx'

import { ModalContext } from '../../../../provider/ModalProvider'
import { useModalContent } from './useModalContent'
import styles from './ModalContent.module.css'

const tags = ['Работа', 'Учеба', 'Развлечение', 'Семья']

const ModalContent = () => {
  const { task } = useContext(ModalContext)
  const {
    fieldDeadlineValue,
    fieldDescriptionValue,
    fieldTitleValue,
    isValidate,
    selectedTags,
    handle: {
      handleClickCloseModal,
      handleClickSelectTag,
      handleSubmit,
      handleInputField
    }
  } = useModalContent()

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.modal_content}>
      <div className={styles.btn_panel}>
        <button onClick={(e) => handleClickCloseModal(e)}>Отмена</button>
        <button>{task ? 'Изменить' : 'Добавить'}</button>
      </div>

      <label>
        <span>
          Заголовок<span>*</span>
        </span>
        <input
          type='text'
          placeholder='Заголовок...'
          name='title'
          value={fieldTitleValue}
          onInput={(e) => {
            handleInputField(e, 'title')
          }}
        />
        {isValidate && <div>Поле заголовок является обязательным</div>}
      </label>

      <label>
        <span>Описание</span>
        <textarea
          placeholder='Описание...'
          name='description'
          value={fieldDescriptionValue}
          onInput={(e) => {
            handleInputField(e, 'description')
          }}
        />
      </label>

      <label>
        <span>Срок выполнения</span>
        <input
          type='text'
          placeholder='Укажите количество дней'
          value={fieldDeadlineValue}
          onInput={(e) => {
            handleInputField(e, 'deadline')
          }}
          name='deadline'
        />
      </label>

      <div className={styles.tags}>
        <h3>Tags</h3>
        <nav>
          <ul>
            {tags.map((tag) => (
              <li
                key={tag}
                className={clsx('', {
                  [styles.active]: selectedTags.includes(tag)
                })}
              >
                <a href='#' onClick={(e) => handleClickSelectTag(e, tag)}>
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </form>
  )
}

export default ModalContent
