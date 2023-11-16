import { useContext } from 'react'

import { ModalContext } from '../../../provider/ModalProvider'
import styles from './Modal.module.css'

const Modal = ({ children }) => {
  const { setIsModal } = useContext(ModalContext)

  const handleClickCloseModal = (e) => {
    if (e.target.classList.contains(styles.modal)) {
      setIsModal(false)
    }
  }

  return (
    <div onClick={(e) => handleClickCloseModal(e)} className={styles.modal}>
      {children}
    </div>
  )
}

export default Modal
