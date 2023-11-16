import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'

import { TasksDataContext } from '../../../../provider/TasksDataProvider'
import { ModalContext } from '../../../../provider/ModalProvider'
import { formDate } from '../../../../utils/formDate'
import Checkbox from '../../../ui/checkbox/Checkbox'
import styles from './TaskItem.module.css'

const options = ['Изменить', 'Удалить']

const TaskItem = ({ task }) => {
  const { setTasksData } = useContext(TasksDataContext)
  const { setIsModal, setTask } = useContext(ModalContext)
  const [isDoneTask, setIsDoneTask] = useState(task.isDone)
  const [isShowOptions, setIsShowOptions] = useState(false)

  const handleChangeDoneTask = () => {
    isDoneTask ? setIsDoneTask(false) : setIsDoneTask(true)
  }

  useEffect(() => {
    setTasksData((prev) =>
      prev.map((prevTask) => {
        if (prevTask.deadline.start === task.deadline.start) {
          prevTask.isDone = isDoneTask
        }
        return prevTask
      })
    )
  }, [isDoneTask])

  useEffect(() => {
    setIsDoneTask(task.isDone)
  }, [task])

  const handleClickOption = (option) => {
    if (option.toLowerCase() === 'удалить') {
      setTasksData((prev) =>
        prev.filter(({ deadline }) => deadline.start !== task.deadline.start)
      )
    }

    if (option.toLowerCase() === 'изменить') {
      setIsModal(true)
      setTask(task)
      setIsShowOptions(false)
    }
  }

  return (
    <div
      className={clsx(styles.task, {
        [styles.done]: isDoneTask
      })}
    >
      <div className={styles.header}>
        <h2>{task.title}</h2>
        <button
          onMouseEnter={() => setIsShowOptions(true)}
          onMouseLeave={() => setIsShowOptions(false)}
        >
          <span>...</span>
          {isShowOptions && (
            <ul>
              {options.map((option) => (
                <li key={option}>
                  <a onClick={() => handleClickOption(option)} href='#'>
                    {option}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </button>
      </div>
      {task.description && <p>{task.description}</p>}
      <div className={styles.footer}>
        <div className={styles.tags}>
          {task.tags.map((tag) => (
            <div
              key={tag}
              className={clsx('', {
                [styles.work]: tag.toLowerCase() === 'работа',
                [styles.study]: tag.toLowerCase() === 'учеба',
                [styles.entertainment]: tag.toLowerCase() === 'развлечение',
                [styles.family]: tag.toLowerCase() === 'семья'
              })}
            ></div>
          ))}
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            isBold={true}
            isActive={isDoneTask}
            onChange={handleChangeDoneTask}
          >
            Завершенный
          </Checkbox>
        </div>
        <div className={styles.date}>{formDate(task.deadline)}</div>
      </div>
    </div>
  )
}

export default TaskItem
