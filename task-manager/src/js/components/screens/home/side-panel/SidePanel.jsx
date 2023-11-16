import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'

import { TasksDataContext } from '../../../../provider/TasksDataProvider'
import Checkbox from '../../../ui/checkbox/Checkbox'
import styles from './SidePanel.module.css'

const btnSortTodo = ['Всё', 'Работа', 'Учеба', 'Развлечение', 'Семья']

const SidePanel = () => {
  const { setSortTasksData, isHiddenDoneTasks, setIsHiddenDoneTasks } =
    useContext(TasksDataContext)
  const [activeSortTag, setActiveSortTag] = useState('Всё')

  const handleClickSortTag = (e, tag) => {
    e.preventDefault()

    setActiveSortTag(tag)
  }

  const handleChangeHiddenDoneTasks = () => {
    isHiddenDoneTasks ? setIsHiddenDoneTasks(false) : setIsHiddenDoneTasks(true)
  }

  useEffect(() => {
    setSortTasksData(activeSortTag)
  }, [activeSortTag])

  return (
    <aside className={styles.side_panel}>
      <nav>
        <ul>
          {btnSortTodo.map((btnEl) => (
            <li
              key={btnEl}
              className={clsx('', {
                [styles.active]: btnEl === activeSortTag
              })}
            >
              <a href='#' onClick={(e) => handleClickSortTag(e, btnEl)}>
                {btnEl}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Checkbox
        name='hide tasks'
        isActive={isHiddenDoneTasks}
        onChange={handleChangeHiddenDoneTasks}
      >
        Скрыть выполненные задачи
      </Checkbox>

      <div>
        <img src='image.png' alt='Изображение' />
      </div>
    </aside>
  )
}

export default SidePanel
