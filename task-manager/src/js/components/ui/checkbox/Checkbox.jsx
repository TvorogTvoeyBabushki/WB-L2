import styles from './Checkbox.module.css'
import clsx from 'clsx'

const Checkbox = ({ name, children, isBold = false, isActive, onChange }) => {
  return (
    <label
      className={clsx(styles.checkbox, {
        [styles.active]: isActive,
        [styles.bold]: isBold && isActive
      })}
    >
      <input type='checkbox' name={name} onChange={onChange} />
      {children}
    </label>
  )
}

export default Checkbox
