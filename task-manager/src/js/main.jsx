import React from 'react'
import ReactDOM from 'react-dom/client'

import TasksDataProvider from './provider/TasksDataProvider'
import ModalProvider from './provider/ModalProvider'
import Home from './components/screens/home/Home'
import '../assets/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksDataProvider>
      <ModalProvider>
        <Home />
      </ModalProvider>
    </TasksDataProvider>
  </React.StrictMode>
)
