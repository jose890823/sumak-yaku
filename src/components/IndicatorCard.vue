<template>
  <div :class="['indicator-card', statusClass]">
    <div class="indicator-header">
      <div class="indicator-icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
    </div>

    <div class="indicator-value">
      <span class="value">{{ formattedValue }}</span>
      <span class="unit">{{ unit }}</span>
    </div>

    <div class="indicator-range">
      <div class="range-bar">
        <div
          class="range-fill"
          :style="{ width: `${percentage}%` }"
        ></div>
        <div
          class="range-marker"
          :style="{ left: `${markerPosition}%` }"
        ></div>
      </div>
      <div class="range-labels">
        <span>{{ min }}</span>
        <span class="optimal">Óptimo</span>
        <span>{{ max }}</span>
      </div>
    </div>

    <div class="indicator-status">
      <span :class="['status-badge', statusClass]">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number
  unit: string
  min: number
  max: number
  status: 'normal' | 'warning' | 'critical'
  icon: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => props.value.toFixed(2))

const statusClass = computed(() => `status-${props.status}`)

const statusText = computed(() => {
  switch (props.status) {
    case 'normal': return 'Normal'
    case 'warning': return 'Precaución'
    case 'critical': return 'Crítico'
    default: return 'Desconocido'
  }
})

// Calcular posición del marcador en la barra (0-100%)
const markerPosition = computed(() => {
  const range = props.max - props.min
  const position = ((props.value - props.min) / range) * 100
  return Math.max(0, Math.min(100, position))
})

// Calcular ancho de la barra de rango óptimo
const percentage = computed(() => {
  return 100 // La barra completa representa el rango
})
</script>

<style scoped>
.indicator-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.indicator-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.indicator-card.status-normal {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.indicator-card.status-warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.indicator-card.status-critical {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.indicator-icon {
  font-size: 32px;
  line-height: 1;
}

.indicator-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.indicator-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
}

.indicator-value .value {
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.indicator-value .unit {
  font-size: 20px;
  color: #6b7280;
  font-weight: 500;
}

.indicator-range {
  margin-bottom: 16px;
}

.range-bar {
  position: relative;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: visible;
  margin-bottom: 8px;
}

.range-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.range-marker {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: #1f2937;
  border: 3px solid white;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.range-labels .optimal {
  color: #10b981;
  font-weight: 600;
}

.indicator-status {
  display: flex;
  justify-content: center;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-normal {
  background: #10b981;
  color: white;
}

.status-badge.status-warning {
  background: #f59e0b;
  color: white;
}

.status-badge.status-critical {
  background: #ef4444;
  color: white;
}

/* Tablet */
@media (max-width: 1024px) {
  .indicator-card {
    padding: 20px;
  }

  .indicator-header h3 {
    font-size: 16px;
  }

  .indicator-icon {
    font-size: 28px;
  }

  .indicator-value .value {
    font-size: 42px;
  }

  .indicator-value .unit {
    font-size: 18px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .indicator-card {
    padding: 16px;
  }

  .indicator-header {
    gap: 10px;
    margin-bottom: 12px;
  }

  .indicator-icon {
    font-size: 24px;
  }

  .indicator-header h3 {
    font-size: 15px;
  }

  .indicator-value {
    gap: 6px;
    margin-bottom: 16px;
  }

  .indicator-value .value {
    font-size: 36px;
  }

  .indicator-value .unit {
    font-size: 16px;
  }

  .range-bar {
    height: 6px;
  }

  .range-marker {
    width: 14px;
    height: 14px;
    border: 2px solid white;
  }

  .range-labels {
    font-size: 11px;
  }

  .status-badge {
    padding: 5px 14px;
    font-size: 12px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .indicator-card {
    padding: 14px;
  }

  .indicator-icon {
    font-size: 22px;
  }

  .indicator-header h3 {
    font-size: 14px;
  }

  .indicator-value .value {
    font-size: 32px;
  }

  .indicator-value .unit {
    font-size: 14px;
  }

  .range-labels {
    font-size: 10px;
  }

  .status-badge {
    padding: 4px 12px;
    font-size: 11px;
  }
}
</style>
