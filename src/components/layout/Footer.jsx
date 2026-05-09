import styles from '@/components/layout/Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.root}>
      <p style={{ margin: 0 }}>
        Демо-интерфейс дилерской системы. Визуальный стиль вдохновлён премиальными автосалонами.
      </p>
    </footer>
  )
}
