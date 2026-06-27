import type { ReactNode } from 'react'
import styles from './Header.module.css'

type HeaderProps = {
  title: string
  subtitle?: string
  right?: ReactNode
}

export function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right ? <div className={styles.actions}>{right}</div> : null}
    </header>
  )
}
