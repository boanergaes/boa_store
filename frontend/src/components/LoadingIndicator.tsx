import styles from './LoadingIndicator.module.css'

type LoadingIndicatorProps = {
  message?: string
}

export function LoadingIndicator({ message = 'Loading...' }: LoadingIndicatorProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span>{message}</span>
    </div>
  )
}
