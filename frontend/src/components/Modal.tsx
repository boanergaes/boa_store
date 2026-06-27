import type { ReactNode } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
