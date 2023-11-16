import { createContext, useState } from 'react'

export const TasksDataContext = createContext(null)

const TasksDataProvider = ({ children }) => {
  const [tasksData, setTasksData] = useState(
    JSON.parse(localStorage.getItem('tasks')) || []
  )
  const [sortTasksData, setSortTasksData] = useState('Всё')
  const [isHiddenDoneTasks, setIsHiddenDoneTasks] = useState(false)

  return (
    <TasksDataContext.Provider
      value={{
        tasksData,
        setTasksData,
        sortTasksData,
        setSortTasksData,
        isHiddenDoneTasks,
        setIsHiddenDoneTasks
      }}
    >
      {children}
    </TasksDataContext.Provider>
  )
}

export default TasksDataProvider
