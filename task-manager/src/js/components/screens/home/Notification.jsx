import { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TasksDataContext } from '../../../provider/TasksDataProvider'

const Notification = () => {
  const { tasksData } = useContext(TasksDataContext)
  const [isNotification, setIsNotification] = useState(false)

  const showMessage = (message, id) => {
    toast.info(message, {
      position: toast.POSITION.TOP_RIGHT,
      toastId: id
      // autoClose: false
    })
  }

  const getDateDay = (date) => `${new Date(date)}`.split(' ')[2]

  useEffect(() => {
    setIsNotification(false)

    tasksData.forEach((task) => {
      if (
        getDateDay(task.deadline.end) === getDateDay(new Date()) &&
        !task.isDeadline
      ) {
        task.isDeadline = true

        showMessage(
          `Последний день дедлайна у задачи - ${task.title}`,
          `${task.deadline.end}`
        )
        setIsNotification(true)
      }
    })
  }, [tasksData])

  useEffect(() => {
    const handler = setTimeout(() => {
      toast.dismiss()
    }, 6000)

    return () => {
      clearTimeout(handler)
    }
  }, [isNotification])

  return <ToastContainer autoClose={5000} limit={7} />
}

export default Notification
