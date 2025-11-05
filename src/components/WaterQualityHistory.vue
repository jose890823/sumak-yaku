<template>
  <div class="quality-history">
    <h3 class="chart-title">Evolución Última Semana</h3>

    <div class="chart-container">
      <div class="chart-wrapper">
        <!-- Gráfica de línea -->
        <svg class="line-chart" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
          <!-- Grid lines -->
          <line v-for="i in 5" :key="`grid-${i}`"
            :x1="0"
            :y1="(i - 1) * 60 + 20"
            :x2="600"
            :y2="(i - 1) * 60 + 20"
            stroke="#e5e7eb"
            stroke-width="1"
          />

          <!-- Y-axis labels -->
          <text
            v-for="i in 5"
            :key="`y-label-${i}`"
            :x="10"
            :y="(5 - i) * 60 + 25"
            font-size="12"
            fill="#6b7280"
          >
            {{ (i - 1) * 25 }}
          </text>

          <!-- Line path -->
          <polyline
            :points="linePoints"
            fill="none"
            stroke="url(#lineGradient)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Area under line -->
          <polygon
            :points="areaPoints"
            fill="url(#areaGradient)"
            opacity="0.3"
          />

          <!-- Data points -->
          <circle
            v-for="(point, index) in data"
            :key="`point-${index}`"
            :cx="50 + index * 80"
            :cy="280 - (point.score * 2.4)"
            r="5"
            :fill="getScoreColor(point.score)"
            stroke="white"
            stroke-width="2"
            class="data-point"
          >
            <title>{{ point.date }}: {{ point.score }}</title>
          </circle>

          <!-- Gradients -->
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="50%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <!-- X-axis labels (días) -->
        <div class="x-axis">
          <span v-for="(point, index) in data" :key="`label-${index}`" class="x-label">
            {{ point.day }}
          </span>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-label">Promedio</div>
          <div class="stat-value" :style="{ color: getScoreColor(averageScore) }">
            {{ averageScore.toFixed(0) }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mínimo</div>
          <div class="stat-value" :style="{ color: getScoreColor(minScore) }">
            {{ minScore }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Máximo</div>
          <div class="stat-value" :style="{ color: getScoreColor(maxScore) }">
            {{ maxScore }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Tendencia</div>
          <div class="stat-value" :class="trendClass">
            {{ trendText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HistoryPoint {
  date: string
  day: string
  score: number
}

interface Props {
  data: HistoryPoint[]
}

const props = defineProps<Props>()

const linePoints = computed(() => {
  return props.data
    .map((point, index) => `${50 + index * 80},${280 - (point.score * 2.4)}`)
    .join(' ')
})

const areaPoints = computed(() => {
  const points = props.data
    .map((point, index) => `${50 + index * 80},${280 - (point.score * 2.4)}`)
    .join(' ')
  const lastX = 50 + (props.data.length - 1) * 80
  return `${points} ${lastX},280 50,280`
})

const averageScore = computed(() => {
  const sum = props.data.reduce((acc, point) => acc + point.score, 0)
  return sum / props.data.length
})

const minScore = computed(() => {
  return Math.min(...props.data.map(p => p.score))
})

const maxScore = computed(() => {
  return Math.max(...props.data.map(p => p.score))
})

const trendClass = computed(() => {
  const firstHalf = props.data.slice(0, Math.floor(props.data.length / 2))
  const secondHalf = props.data.slice(Math.floor(props.data.length / 2))

  const firstAvg = firstHalf.reduce((acc, p) => acc + p.score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((acc, p) => acc + p.score, 0) / secondHalf.length

  if (secondAvg > firstAvg + 5) return 'trend-up'
  if (secondAvg < firstAvg - 5) return 'trend-down'
  return 'trend-stable'
})

const trendText = computed(() => {
  if (trendClass.value === 'trend-up') return '↗ Mejorando'
  if (trendClass.value === 'trend-down') return '↘ Empeorando'
  return '→ Estable'
})

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}
</script>

<style scoped>
.quality-history {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.chart-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.chart-container {
  width: 100%;
  max-width: 100%;
}

.chart-wrapper {
  margin-bottom: 24px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.line-chart {
  width: 100%;
  height: auto;
  max-width: 100%;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 7;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  margin-top: 8px;
}

.x-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.trend-up {
  color: #10b981 !important;
}

.trend-down {
  color: #ef4444 !important;
}

.trend-stable {
  color: #3b82f6 !important;
}

/* Tablet */
@media (max-width: 1024px) {
  .quality-history {
    padding: 24px 16px;
  }

  .chart-title {
    font-size: 20px;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 20px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .quality-history {
    padding: 20px 16px;
  }

  .chart-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .x-axis {
    padding: 0 20px;
  }

  .x-label {
    font-size: 10px;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 18px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .quality-history {
    padding: 16px 12px;
  }

  .chart-title {
    font-size: 16px;
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
