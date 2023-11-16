import { useContext, useEffect } from 'react'

import { TasksDataContext } from '../../../provider/TasksDataProvider'
import SidePanel from './side-panel/SidePanel'
import Layout from '../../layout/Layout'
import styles from './Home.module.css'
import TasksWrapper from './tasks-wrapper/TasksWrapper'
import Notification from './Notification'

const Home = () => {
  const { tasksData } = useContext(TasksDataContext)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasksData))
  }, [tasksData])

  return (
    <>
      <Layout>
        <main className={styles.home}>
          <SidePanel />

          <TasksWrapper />
        </main>
      </Layout>
      <Notification />
    </>
  )
}

export default Home
