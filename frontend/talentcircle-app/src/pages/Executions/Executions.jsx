import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getExecutions } from '../../services/adminService'
import styles from './Executions.module.css'

const STATUS_META = {
  completed: { label: 'Completado', color: 'var(--green)' },
  running:   { label: 'En curso',   color: 'var(--amber)' },
  failed:    { label: 'Fallido',    color: 'var(--rose)'  },
}

export default function Executions() {
  const mockExecutions = useAppStore((s) => s.executions)
  const showToast      = useAppStore((s) => s.showToast)
  const [executions, setExecutions] = useState(mockExecutions)
  const [usingBackend, setUsingBackend] = useState(false)

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const data = await getExecutions()
        // Normalizar respuesta del backend
        const normalized = data.map((ex) => ({
          id: ex.id,
          week: ex.weekLabel ?? ex.week ?? '',
          status: ex.status?.toLowerCase() ?? 'completed',
          activities: ex.activitiesCount ?? ex.activities ?? 0,
          drafts: ex.draftsCount ?? ex.drafts ?? 0,
          duration: ex.durationFormatted ?? ex.duration ?? '—',
          triggeredBy: ex.triggeredBy ?? 'Scheduler',
          progress: ex.progressPercent ?? ex.progress ?? 100,
        }))
        setExecutions(normalized)
        setUsingBackend(true)
      } catch {
        // Backend no disponible → usar datos mock
        setExecutions(mockExecutions)
        setUsingBackend(false)
      }
    }
    fetchExecutions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.page}>
      {!usingBackend && (
        <div style={{ padding: '8px 16px', background: 'rgba(245,166,35,.12)', borderRadius: 8, marginBottom: 12, fontSize: 12, color: 'var(--amber)' }}>
          ⚠ Modo demo — backend no disponible. Mostrando datos locales.
        </div>
      )}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['ID Ejecución','Semana','Estado','Actividades','Borradores','Duración','Iniciado por','Progreso'].map((h) => (
                <th key={h} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {executions.map((ex) => {
              const sm = STATUS_META[ex.status] ?? STATUS_META.completed
              return (
                <tr key={ex.id} className={styles.row} onClick={() => showToast('🔍', `Ejecución ${ex.id}`, `Semana: ${ex.week} · ${ex.activities} actividades procesadas`)}>
                  <td className={styles.tdId}>#{ex.id}</td>
                  <td className={styles.td}>{ex.week}</td>
                  <td className={styles.td}>
                    <span className={styles.statusChip}>
                      <span className={styles.statusDot} style={{ background: sm.color, boxShadow: ex.status==='running' ? `0 0 6px ${sm.color}` : 'none' }} />
                      {sm.label}
                    </span>
                  </td>
                  <td className={styles.tdMono}>{ex.activities}</td>
                  <td className={styles.tdMono}>{ex.drafts}</td>
                  <td className={styles.tdDuration}>{ex.duration}</td>
                  <td className={styles.td}>{ex.triggeredBy}</td>
                  <td className={styles.td}>
                    <div className={styles.progTrack}>
                      <div className={styles.progFill}
                        style={{ width:`${ex.progress}%`, background: ex.status==='failed'?'var(--rose)':'linear-gradient(90deg,var(--amber),var(--teal))' }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
