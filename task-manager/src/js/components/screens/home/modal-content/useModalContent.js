import { useContext, useEffect, useMemo, useState } from 'react'

import { convertMilliSecondToDay } from '../../../../utils/convertMilliSecondToDay'
import { convertDayToMilliSecond } from '../../../../utils/convertDayToMilliSecond'
import { TasksDataContext } from '../../../../provider/TasksDataProvider'
import { ModalContext } from '../../../../provider/ModalProvider'

export const useModalContent = () => {
  const { setTasksData } = useContext(TasksDataContext)
  const { isModal, setIsModal, task } = useContext(ModalContext)

  const [fieldTitleValue, setFieldTitleValue] = useState('')
  const [fieldDescriptionValue, setFieldDescriptionValue] = useState('')
  const [fieldDeadlineValue, setFieldDeadlineValue] = useState('')

  const [startDateTask, setStartDateTask] = useState(new Date())
  const [selectedTags, setSelectedTags] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [isValidate, setIsValidate] = useState(false)

  const autoResizeTextarea = (e) => {
    const textarea = e.target

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`

    if (textarea.scrollHeight < 200) {
      textarea.style.overflow = 'hidden'
    } else {
      textarea.style.overflow = 'auto'
    }
  }

  const handleInputField = (e, variant) => {
    if (variant === 'title') {
      setIsValidate(false)
      setFieldTitleValue(e.target.value)
    }

    if (variant === 'description') {
      autoResizeTextarea(e)
      setFieldDescriptionValue(e.target.value)
    }

    if (variant === 'deadline') {
      const field = e.target
      field.value = field.value.trim().replace(/\D/g, '')
      setFieldDeadlineValue(field.value)
    }
  }

  const handleClickCloseModal = (e) => {
    e.preventDefault()
    setIsModal(false)
  }

  const handleClickSelectTag = (e, tag) => {
    e.preventDefault()

    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((prevTag) => prevTag !== tag)
      }

      return [...prev, tag]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    data.title = data.title.trim()
    data.description = data.description.trim()
    data.tags = selectedTags
    data.deadline = {
      start: startDateTask,
      end: new Date(Date.now() + convertDayToMilliSecond(data.deadline))
    }
    data.isDone = isDone

    if (!data.title.length) {
      setIsValidate(true)
      return
    }

    setTasksData((prev) => {
      if (task) {
        return prev.map((prevTask) => {
          if (prevTask.deadline.start === task.deadline.start) {
            prevTask = { ...data }
          }
          return prevTask
        })
      }

      return [...prev, data]
    })

    setIsModal(false)
  }

  useEffect(() => {
    setSelectedTags([])
  }, [isModal])

  useEffect(() => {
    if (task) {
      setSelectedTags(task.tags)
      setFieldTitleValue(task.title)
      setFieldDescriptionValue(task.description)
      setStartDateTask(task.deadline.start)
      setFieldDeadlineValue(
        convertMilliSecondToDay(
          new Date(task.deadline.end).getTime() -
            new Date(task.deadline.start).getTime()
        )
      )
      setIsDone(task.isDone)
    }
  }, [task])

  return useMemo(
    () => ({
      fieldTitleValue,
      fieldDescriptionValue,
      fieldDeadlineValue,
      isValidate,
      selectedTags,
      handle: {
        handleClickCloseModal,
        handleClickSelectTag,
        handleSubmit,
        handleInputField
      }
    }),
    [
      fieldTitleValue,
      fieldDescriptionValue,
      fieldDeadlineValue,
      isValidate,
      selectedTags
    ]
  )
}
