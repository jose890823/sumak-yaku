<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>🌊 Sumak Yaku - Monitoreo Río Ambi</h1>
        <p class="subtitle">Sistema de Monitoreo de Calidad del Agua</p>
      </div>
      <div class="header-actions">
        <button
          @click="toggleConnection"
          :class="['btn-connection', { active: store.isConnected }]"
        >
          {{ store.isConnected ? '🔌 Desconectar' : '🔌 Conectar Sensor' }}
        </button>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- Resumen General y Gráficas -->
      <section class="top-section">
        <div class="top-grid">
          <WaterQualitySummary
            :score="store.waterQualityStatus.score"
            :status="store.waterQualityStatus.status"
            :issues="store.waterQualityStatus.issues"
            :is-connected="store.isConnected"
            :last-update="store.lastUpdate"
          />
          <ContaminationChart :data="store.contaminationData" />
          <WaterQualityHistory :data="store.weeklyHistory" />
        </div>
      </section>

      <!-- Indicadores Principales -->
      <section class="indicators-section">
        <h2 class="section-title">📊 Indicadores en Tiempo Real</h2>
        <div class="indicators-grid">
          <IndicatorCard
            title="Turbidez"
            :value="store.currentData.turbidity"
            unit="NTU"
            :min="store.optimalRanges.turbidity.min"
            :max="store.optimalRanges.turbidity.max"
            :status="store.turbidityStatus"
            icon="💧"
          />
          <IndicatorCard
            title="Conductividad"
            :value="store.currentData.conductivity"
            unit="μS/cm"
            :min="store.optimalRanges.conductivity.min"
            :max="store.optimalRanges.conductivity.max"
            :status="store.conductivityStatus"
            icon="⚡"
          />
          <IndicatorCard
            title="Oxígeno Disuelto"
            :value="store.currentData.dissolvedOxygen"
            unit="mg/L"
            :min="store.optimalRanges.dissolvedOxygen.min"
            :max="store.optimalRanges.dissolvedOxygen.max"
            :status="store.dissolvedOxygenStatus"
            icon="🫧"
          />
          <IndicatorCard
            title="pH"
            :value="store.currentData.ph"
            unit="pH"
            :min="store.optimalRanges.ph.min"
            :max="store.optimalRanges.ph.max"
            :status="store.phStatus"
            icon="🧪"
          />
        </div>
      </section>

      <!-- Información del Proyecto -->
      <section class="project-info">
        <h2 class="section-title">🌱 Sobre el Proyecto</h2>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">🌿</div>
            <h3>Biofiltros Naturales</h3>
            <p>
              Utilizamos plantas nativas de la zona como lenteja de agua,
              totora y carrizo para purificar el agua del río de forma natural
              y sostenible.
            </p>
          </div>
          <div class="info-card">
            <div class="info-icon">🔬</div>
            <h3>Tecnología IoT</h3>
            <p>
              Sensores conectados a microcontroladores ESP-32 monitorean
              continuamente la calidad del agua y envían datos en tiempo real.
            </p>
          </div>
          <div class="info-card">
            <div class="info-icon">🏔️</div>
            <h3>Comunidad Imantag</h3>
            <p>
              Trabajamos con la comunidad indígena Imantag para recuperar las
              memorias ancestrales y generar conciencia ambiental.
            </p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎯</div>
            <h3>Objetivo</h3>
            <p>
              Reducir la contaminación del Río Ambi mediante soluciones
              sostenibles que combinen ciencia, tecnología y sabiduría
              ancestral.
            </p>
          </div>
        </div>
      </section>

      <!-- Parámetros Medidos -->
      <section class="parameters-section">
        <h2 class="section-title">📖 Guía de Parámetros</h2>
        <div class="parameters-grid">
          <div class="parameter-card">
            <h4>💧 Turbidez</h4>
            <p>
              Mide la claridad del agua. Valores bajos indican agua clara;
              valores altos sugieren contaminación por sedimentos o
              microorganismos.
            </p>
            <div class="range-info">
              Óptimo: 0-5 NTU
            </div>
          </div>
          <div class="parameter-card">
            <h4>⚡ Conductividad</h4>
            <p>
              Indica la cantidad de sales disueltas. Valores muy altos pueden
              señalar contaminación industrial o agrícola.
            </p>
            <div class="range-info">
              Óptimo: 50-500 μS/cm
            </div>
          </div>
          <div class="parameter-card">
            <h4>🫧 Oxígeno Disuelto</h4>
            <p>
              Esencial para la vida acuática. Niveles bajos indican
              contaminación orgánica o falta de circulación del agua.
            </p>
            <div class="range-info">
              Óptimo: 6-14 mg/L
            </div>
          </div>
          <div class="parameter-card">
            <h4>🧪 pH</h4>
            <p>
              Mide la acidez o alcalinidad. Valores extremos pueden ser tóxicos
              para organismos acuáticos.
            </p>
            <div class="range-info">
              Óptimo: 6.5-8.5
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="dashboard-footer">
      <p>
        💚 Proyecto Sumak Yaku - Agua Buena | Imbabura, Ecuador
      </p>
      <p class="footer-note">
        En colaboración con la comunidad indígena Imantag
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useWaterQualityStore } from '@/stores/waterQuality'
import IndicatorCard from '@/components/IndicatorCard.vue'
import WaterQualitySummary from '@/components/WaterQualitySummary.vue'
import ContaminationChart from '@/components/ContaminationChart.vue'
import WaterQualityHistory from '@/components/WaterQualityHistory.vue'

const store = useWaterQualityStore()

function toggleConnection() {
  if (store.isConnected) {
    store.disconnectFromSensor()
    store.stopSimulation()
  } else {
    store.connectToSensor()
  }
}

onMounted(() => {
  // Auto-conectar en modo desarrollo para mostrar datos
  store.connectToSensor()
})

onUnmounted(() => {
  store.stopSimulation()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 100%);
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.dashboard-header {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 24px 3vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 24px;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-connection {
  padding: 12px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-sizing: border-box;
}

.btn-connection:hover {
  background: white;
  color: #059669;
}

.btn-connection.active {
  background: white;
  color: #059669;
}

.dashboard-content {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 32px 3vw;
  box-sizing: border-box;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.top-section {
  margin-bottom: 48px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.top-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  box-sizing: border-box;
}

.indicators-section {
  margin-bottom: 48px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.project-info {
  margin-bottom: 48px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.info-card:hover {
  transform: translateY(-4px);
}

.info-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.info-card h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #111827;
}

.info-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.parameters-section {
  margin-bottom: 48px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.parameter-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #059669;
  box-sizing: border-box;
}

.parameter-card h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #111827;
}

.parameter-card p {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.range-info {
  padding: 8px 12px;
  background: #ecfdf5;
  border-radius: 6px;
  color: #047857;
  font-weight: 600;
  font-size: 14px;
}

.dashboard-footer {
  background: #047857;
  color: white;
  padding: 24px 3vw;
  text-align: center;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
}

.dashboard-footer p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.footer-note {
  font-size: 14px;
  opacity: 0.8;
}

/* Tablet */
@media (max-width: 1024px) {
  .dashboard-header {
    padding: 24px 3%;
    flex-wrap: wrap;
  }

  .dashboard-content {
    padding: 24px 3%;
  }

  .top-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .indicators-grid,
  .info-grid,
  .parameters-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    padding: 20px 4%;
    gap: 12px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-connection {
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
  }

  .dashboard-content {
    padding: 16px 4%;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .top-grid,
  .indicators-grid,
  .info-grid,
  .parameters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-card,
  .parameter-card {
    padding: 16px;
  }

  .dashboard-footer {
    padding: 16px 4%;
  }

  .dashboard-footer p {
    font-size: 14px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .header-content h1 {
    font-size: 20px;
  }
}
</style>
