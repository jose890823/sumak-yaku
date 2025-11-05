<template>
  <div :class="['quality-summary', statusClass]">
    <div class="summary-header">
      <div class="header-content">
        <h2>Estado del Río Ambi</h2>
        <p class="location">Comunidad Imantag, Imbabura</p>
      </div>
      <div class="connection-status">
        <span :class="['status-dot', { connected: isConnected }]"></span>
        <span class="status-text">
          {{ isConnected ? 'Conectado' : 'Desconectado' }}
        </span>
      </div>
    </div>

    <div class="quality-score">
      <div class="score-circle">
        <svg viewBox="0 0 200 200" class="score-ring">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="12"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            :stroke="scoreColor"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="scoreOffset"
            transform="rotate(-90 100 100)"
            class="score-progress"
          />
        </svg>
        <div class="score-content">
          <div class="score-value">{{ score }}</div>
          <div class="score-label">{{ statusLabel }}</div>
        </div>
      </div>
    </div>

    <div class="quality-message">
      <p class="message-text">{{ statusMessage }}</p>
    </div>

    <div v-if="issues.length > 0" class="issues-list">
      <h4>Observaciones:</h4>
      <ul>
        <li v-for="(issue, index) in issues" :key="index">{{ issue }}</li>
      </ul>
    </div>

    <div class="last-update">
      <span>Última actualización: {{ lastUpdateText }}</span>
    </div>

    <div class="cultural-message">
      <p>"Sumak Yaku - Agua Buena"</p>
      <p class="subtitle">Recuperando la memoria del agua ancestral</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  score: number
  status: 'excelente' | 'bueno' | 'regular' | 'malo'
  issues: string[]
  isConnected: boolean
  lastUpdate: Date | null
}

const props = defineProps<Props>()

const statusClass = computed(() => `status-${props.status}`)

const statusLabel = computed(() => {
  switch (props.status) {
    case 'excelente': return 'Excelente'
    case 'bueno': return 'Bueno'
    case 'regular': return 'Regular'
    case 'malo': return 'Malo'
    default: return 'Desconocido'
  }
})

const statusMessage = computed(() => {
  switch (props.status) {
    case 'excelente':
      return 'El río presenta condiciones óptimas para la vida acuática y el ecosistema.'
    case 'bueno':
      return 'El río está en buenas condiciones, pero requiere monitoreo continuo.'
    case 'regular':
      return 'Se detectan algunos parámetros fuera de rango. Se recomienda atención.'
    case 'malo':
      return 'El río requiere atención inmediata. Varios parámetros están en niveles críticos.'
    default:
      return 'Esperando datos del sensor...'
  }
})

const scoreColor = computed(() => {
  switch (props.status) {
    case 'excelente': return '#10b981'
    case 'bueno': return '#3b82f6'
    case 'regular': return '#f59e0b'
    case 'malo': return '#ef4444'
    default: return '#9ca3af'
  }
})

const circumference = computed(() => 2 * Math.PI * 85)

const scoreOffset = computed(() => {
  const progress = props.score / 100
  return circumference.value * (1 - progress)
})

const lastUpdateText = computed(() => {
  if (!props.lastUpdate) return 'Nunca'

  const now = new Date()
  const diff = now.getTime() - props.lastUpdate.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) return `hace ${seconds} segundos`
  if (minutes < 60) return `hace ${minutes} minutos`
  if (hours < 24) return `hace ${hours} horas`
  return props.lastUpdate.toLocaleString('es-ES')
})
</script>

<style scoped>
.quality-summary {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.location {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #9ca3af;
  transition: all 0.3s ease;
}

.status-dot.connected {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.quality-score {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.score-ring {
  width: 100%;
  height: 100%;
}

.score-progress {
  transition: stroke-dashoffset 1s ease, stroke 0.3s ease;
}

.score-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 56px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 8px;
}

.score-label {
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-excelente .score-label {
  color: #10b981;
}

.status-bueno .score-label {
  color: #3b82f6;
}

.status-regular .score-label {
  color: #f59e0b;
}

.status-malo .score-label {
  color: #ef4444;
}

.quality-message {
  text-align: center;
  margin-bottom: 24px;
}

.message-text {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.issues-list {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.issues-list h4 {
  margin: 0 0 12px 0;
  color: #92400e;
  font-size: 16px;
}

.issues-list ul {
  margin: 0;
  padding-left: 20px;
}

.issues-list li {
  color: #78350f;
  margin-bottom: 4px;
}

.last-update {
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 24px;
}

.cultural-message {
  text-align: center;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.cultural-message p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #059669;
  font-style: italic;
}

.cultural-message .subtitle {
  font-size: 14px;
  color: #6b7280;
  font-style: normal;
  font-weight: 400;
  margin-top: 8px;
}

/* Tablet */
@media (max-width: 1024px) {
  .quality-summary {
    padding: 24px;
  }

  .header-content h2 {
    font-size: 24px;
  }

  .score-circle {
    width: 180px;
    height: 180px;
  }

  .score-value {
    font-size: 48px;
  }

  .score-label {
    font-size: 16px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .quality-summary {
    padding: 20px 16px;
    margin-bottom: 24px;
  }

  .summary-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-content h2 {
    font-size: 22px;
  }

  .location {
    font-size: 14px;
  }

  .connection-status {
    align-self: flex-start;
    padding: 6px 12px;
  }

  .status-text {
    font-size: 12px;
  }

  .score-circle {
    width: 160px;
    height: 160px;
  }

  .score-value {
    font-size: 42px;
  }

  .score-label {
    font-size: 14px;
  }

  .message-text {
    font-size: 14px;
  }

  .issues-list {
    padding: 12px;
  }

  .issues-list h4 {
    font-size: 14px;
  }

  .issues-list li {
    font-size: 13px;
  }

  .last-update {
    font-size: 12px;
  }

  .cultural-message p {
    font-size: 18px;
  }

  .cultural-message .subtitle {
    font-size: 12px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .quality-summary {
    padding: 16px 12px;
  }

  .header-content h2 {
    font-size: 20px;
  }

  .score-circle {
    width: 140px;
    height: 140px;
  }

  .score-value {
    font-size: 36px;
  }

  .score-label {
    font-size: 12px;
  }

  .cultural-message p {
    font-size: 16px;
  }
}
</style>
