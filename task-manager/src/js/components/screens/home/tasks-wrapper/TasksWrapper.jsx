import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'

import { TasksDataContext } from '../../../../provider/TasksDataProvider'
import styles from './TasksWrapper.module.css'
import TaskItem from '../task-item/TaskItem'

const sortTasks = ['По дате создания', 'По дате окончания']

const TasksWrapper = () => {
  const { tasksData, sortTasksData, isHiddenDoneTasks } =
    useContext(TasksDataContext)

  const [data, setData] = useState([])
  const [activeSort, setActiveSort] = useState('По дате создания')
  const [windowSize, setWindowSize] = useState(
    document.documentElement.clientWidth
  )

  const evenTasksData = data.filter((_, index) => index % 2 === 0)
  const oddTasksData = data.filter((_, index) => index % 2 !== 0)

  const handleClickSortTasks = (e, sort) => {
    e.preventDefault()

    setActiveSort(sort)
  }

  useEffect(() => {
    window.addEventListener('resize', () =>
      setWindowSize(document.documentElement.clientWidth)
    )

    return () =>
      window.removeEventListener('resize', () =>
        setWindowSize(document.documentElement.clientWidth)
      )
  }, [])

  useEffect(() => {
    setData(
      tasksData
        .filter(
          ({ tags, isDone }) =>
            (isHiddenDoneTasks &&
              isDone &&
              (tags.includes(sortTasksData) || sortTasksData === 'Всё')) ||
            (!isHiddenDoneTasks &&
              (tags.includes(sortTasksData) || sortTasksData === 'Всё'))
        )
        .sort((a, b) => {
          if (activeSort.toLowerCase() === 'по дате окончания' && activeSort) {
            return (
              new Date(a.deadline.end).getTime() -
              new Date(b.deadline.end).getTime()
            )
          }

          if (activeSort.toLowerCase() === 'по дате создания' && activeSort) {
            return (
              new Date(a.deadline.start).getTime() -
              new Date(b.deadline.start).getTime()
            )
          }
        })
    )
  }, [sortTasksData, isHiddenDoneTasks, tasksData, activeSort])

  return (
    <div className={styles.tasks_wrapper}>
      <nav>
        <ul>
          {sortTasks.map((sortTask) => (
            <li key={sortTask}>
              <a
                href='#'
                onClick={(e) => handleClickSortTasks(e, sortTask)}
                className={clsx('', {
                  [styles.active]: sortTask === activeSort
                })}
              >
                {sortTask}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {evenTasksData.length && windowSize > 680 ? (
          <div>
            {evenTasksData.map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </div>
        ) : windowSize <= 680 ? (
          <>
            {evenTasksData.map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </>
        ) : (
          ''
        )}
        {oddTasksData.length && windowSize > 680 ? (
          <div>
            {oddTasksData.map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </div>
        ) : windowSize <= 680 ? (
          <>
            {oddTasksData.map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default TasksWrapper
