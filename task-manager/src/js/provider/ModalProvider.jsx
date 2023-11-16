import { createContext, useEffect, useState } from 'react'

export const ModalContext = createContext(null)

const ModalProvider = ({ children }) => {
  const [isModal, setIsModal] = useState(false)
  const [task, setTask] = useState(null)

  useEffect(() => {
    !isModal && setTask(null)
  }, [isModal])

  return (
    <ModalContext.Provider value={{ isModal, setIsModal, task, setTask }}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
