import { useContext } from 'react'

import ModalContent from '../screens/home/modal-content/ModalContent'
import { ModalContext } from '../../provider/ModalProvider'
import Modal from '../ui/modal/Modal'
import Header from './header/Header'

const Layout = ({ children }) => {
  const { isModal } = useContext(ModalContext)

  return (
    <>
      <section>
        <div className='container'>
          <section className='task-manager'>
            <Header />
            {children}
          </section>
        </div>
      </section>
      {isModal && (
        <Modal>
          <ModalContent />
        </Modal>
      )}
    </>
  )
}

export default Layout
