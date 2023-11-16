import { useContext } from 'react'

import { ModalContext } from '../../../provider/ModalProvider'
import styles from './Header.module.css'

const Header = () => {
  const { setIsModal } = useContext(ModalContext)
  const handleClickAddTask = () => {
    setIsModal(true)
  }

  return (
    <header className={styles.header}>
      <h1>todo</h1>
      <button onClick={handleClickAddTask}>+</button>
    </header>
  )
}

export default Header
