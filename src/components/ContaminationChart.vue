<template>
  <div class="contamination-chart">
    <h3 class="chart-title">Contaminación del Agua</h3>

    <div class="chart-container">
      <div class="chart-content">
        <!-- Eje Y - Nombres de parámetros -->
        <div class="y-axis">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="y-label"
          >
            {{ item.name }}
          </div>
        </div>

        <!-- Área de barras -->
        <div class="bars-area">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="bar-group"
          >
            <!-- Barra recomendada (azul) -->
            <div class="bar-wrapper">
              <div
                class="bar bar-recommended"
                :style="{ width: getBarWidth(item.recommended) }"
              >
                <span class="bar-label">{{ item.recommended }}</span>
              </div>
            </div>

            <!-- Barra medida (rojo/amarillo/verde) -->
            <div class="bar-wrapper">
              <div
                :class="['bar', 'bar-measured', `bar-${item.status}`]"
                :style="{ width: getBarWidth(item.measured) }"
              >
                <span class="bar-label">{{ item.measured.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Grid de fondo -->
          <div class="grid-lines">
            <div
              v-for="i in 7"
              :key="i"
              class="grid-line"
              :style="{ left: `${(i - 1) * 16.67}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Eje X -->
      <div class="x-axis">
        <span v-for="i in 7" :key="i" class="x-label">
          {{ (i - 1) * 200 }}
        </span>
      </div>

      <!-- Leyenda -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color legend-recommended"></div>
          <span>Recomendado</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-measured"></div>
          <span>Medido</span>
        </div>
      </div>
    </div>

    <!-- Tabla de datos -->
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>Parámetro</th>
            <th>Recomendado</th>
            <th>Medido</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.recommended }} {{ item.unit }}</td>
            <td>{{ item.measured.toFixed(1) }} {{ item.unit }}</td>
            <td>
              <span :class="['status-badge', `status-${item.status}`]">
                {{ getStatusText(item.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContaminationItem {
  name: string
  recommended: number
  measured: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
}

interface Props {
  data: ContaminationItem[]
}

const props = defineProps<Props>()

// Calcular el ancho de la barra como porcentaje del máximo valor
const getBarWidth = (value: number): string => {
  const maxValue = 1200 // Valor máximo del eje X
  const percentage = (value / maxValue) * 100
  return `${Math.min(percentage, 100)}%`
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'normal': return '✓ Normal'
    case 'warning': return '⚠ Precaución'
    case 'critical': return '✗ Crítico'
    default: return 'Desconocido'
  }
}
</script>

<style scoped>
.contamination-chart {
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
  margin-bottom: 32px;
}

.chart-container {
  margin-bottom: 32px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.chart-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 180px;
  flex-shrink: 0;
  padding: 12px 0;
}

.y-label {
  height: 80px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.bars-area {
  position: relative;
  flex: 1;
  padding: 12px 0;
  overflow: visible;
}

.bar-group {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bar-wrapper {
  height: 32px;
  position: relative;
}

.bar {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: width 0.5s ease;
  position: relative;
  z-index: 10;
  min-width: 60px;
}

.bar-label {
  font-size: 12px;
  font-weight: 600;
  color: white;
  position: absolute;
  right: 8px;
  white-space: nowrap;
}

.bar-recommended {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.bar-measured {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.bar-normal {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%) !important;
}

.bar-warning {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%) !important;
}

.bar-critical {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%) !important;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e5e7eb;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  margin-left: 196px;
  margin-bottom: 24px;
  width: calc(100% - 196px);
  max-width: calc(100% - 196px);
}

.x-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 24px;
  height: 16px;
  border-radius: 4px;
}

.legend-recommended {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.legend-measured {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.legend-item span {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.data-table {
  margin-top: 32px;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
}

table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

td {
  padding: 12px 16px;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background: #f9fafb;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge.status-normal {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-critical {
  background: #fee2e2;
  color: #991b1b;
}

/* Tablet */
@media (max-width: 1024px) {
  .contamination-chart {
    padding: 24px 16px;
  }

  .chart-title {
    font-size: 20px;
  }

  .y-axis {
    width: 140px;
  }

  .x-axis {
    margin-left: 156px;
    width: calc(100% - 156px);
    max-width: calc(100% - 156px);
  }

  .y-label {
    font-size: 13px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .contamination-chart {
    padding: 16px 12px;
  }

  .chart-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .chart-content {
    flex-direction: column;
    gap: 12px;
  }

  .y-axis {
    min-width: 100%;
    flex-direction: column;
    padding: 0;
  }

  .y-label {
    height: auto;
    font-size: 12px;
    padding: 8px 0;
    writing-mode: horizontal-tb;
  }

  .bars-area {
    padding: 8px 0;
  }

  .bar-group {
    height: 60px;
    margin-bottom: 12px;
  }

  .bar-wrapper {
    height: 24px;
  }

  .bar-label {
    font-size: 11px;
  }

  .x-axis {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
    font-size: 10px;
  }

  .x-label {
    font-size: 10px;
  }

  .legend {
    gap: 16px;
    flex-wrap: wrap;
  }

  .legend-item {
    font-size: 12px;
  }

  .data-table {
    margin-top: 20px;
  }

  th,
  td {
    padding: 8px 12px;
    font-size: 12px;
  }

  th {
    font-size: 12px;
  }

  .status-badge {
    font-size: 10px;
    padding: 3px 8px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .contamination-chart {
    padding: 12px 8px;
  }

  .chart-title {
    font-size: 16px;
  }

  .y-label {
    font-size: 11px;
  }

  .bar-group {
    height: 50px;
    margin-bottom: 10px;
  }

  .bar-wrapper {
    height: 20px;
  }

  th,
  td {
    padding: 6px 8px;
    font-size: 11px;
  }
}
</style>
