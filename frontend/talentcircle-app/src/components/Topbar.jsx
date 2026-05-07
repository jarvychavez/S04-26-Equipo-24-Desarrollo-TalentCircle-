import { useLocation } from 'react-router-dom'
import { Bell, Play, MoreVertical } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { triggerExecution } from '../services/adminService'
import styles from './Topbar.module.css'

const META = {
  '/dashboard':  { title: 'Dashboard Semanal',       sub: 'Semana del 21 al 28 de abril, 2025' },
  '/drafts':     { title: 'Borradores',               sub: '6 borradores · 4 pendientes de revisión' },
  '/executions': { title: 'Historial de Ejecuciones', sub: 'Registro completo del pipeline' },
  '/admin':      { title: 'Administración',            sub: 'Configuración del sistema y usuarios' },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const showToast = useAppStore((s) => s.showToast)
  const currentUser = useAppStore((s) => s.currentUser)
  const { title, sub } = META[pathname] || { title: 'TalentCircle', sub: '' }

  const runPipeline = async () => {
    showToast('⚙', 'Pipeline iniciado', 'Recolectando actividad de la comunidad…')
    try {
      await triggerExecution(currentUser?.name ?? 'Manual')
      setTimeout(() => showToast('🤖', 'Analizando con IA', 'Procesando contribuciones…'), 2500)
      setTimeout(() => showToast('✎', 'Generando borradores', 'Creando contenido por canal…'), 5000)
      setTimeout(() => showToast('✅', 'Pipeline completado', '6 borradores nuevos listos'), 7500)
    } catch {
      // Backend no disponible → simulación demo
      setTimeout(() => showToast('🤖', 'Analizando con IA', 'Procesando contribuciones…'), 2500)
      setTimeout(() => showToast('✎', 'Generando borradores', 'Creando contenido por canal…'), 5000)
      setTimeout(() => showToast('✅', 'Pipeline completado (demo)', '6 borradores nuevos listos'), 7500)
    }
  }

  return (
    <header className={styles.topbar}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.sub}>{sub}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnRun} onClick={runPipeline}>
          <span className={styles.pulse} />
          <Play size={12} fill="currentColor" /> Ejecutar Pipeline
        </button>
        <button className={styles.iconBtn} onClick={() => showToast('🔔','Sin notificaciones nuevas','Todo está al día')}>
          <Bell size={16} />
          <span className={styles.notifDot} />
        </button>
        <button className={styles.iconBtn}><MoreVertical size={16} /></button>
      </div>
    </header>
  )
}
