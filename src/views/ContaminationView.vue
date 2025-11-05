<template>
  <div class="contamination-view">
    <header class="view-header">
      <div class="header-content">
        <h1>📊 Análisis de Contaminación</h1>
        <p class="subtitle">Monitoreo de parámetros de contaminación del Río Ambi</p>
      </div>
    </header>

    <div class="view-content">
      <!-- Gráfico de Contaminación -->
      <section class="chart-section">
        <ContaminationChart :data="store.contaminationData" />
      </section>

      <!-- Información Detallada -->
      <section class="info-section">
        <h2 class="section-title">📋 Información de Parámetros</h2>
        <div class="info-cards">
          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">💧</span>
              <h3>Turbidez</h3>
            </div>
            <p>
              La turbidez mide la claridad del agua. Valores altos indican
              presencia de partículas suspendidas, sedimentos o microorganismos
              que pueden afectar la calidad del agua y la vida acuática.
            </p>
            <div class="card-range">
              <strong>Valor recomendado:</strong> ≤ 50 mg/L
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">🦠</span>
              <h3>Materia Orgánica</h3>
            </div>
            <p>
              La materia orgánica incluye residuos de plantas, animales y
              desechos orgánicos. Niveles elevados pueden reducir el oxígeno
              disuelto y promover el crecimiento de bacterias nocivas.
            </p>
            <div class="card-range">
              <strong>Valor recomendado:</strong> ≤ 10 mg/L
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">🦠</span>
              <h3>Contaminación Fecal</h3>
            </div>
            <p>
              Medida en NPM (Número Más Probable) de coliformes fecales. Indica
              contaminación por desechos humanos o animales. Es un indicador
              crítico de salubridad del agua.
            </p>
            <div class="card-range">
              <strong>Valor recomendado:</strong> ≤ 200 NPM
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">🌾</span>
              <h3>Nitratos</h3>
            </div>
            <p>
              Los nitratos provienen principalmente de fertilizantes agrícolas
              y desechos orgánicos. Niveles altos pueden causar eutrofización
              y son peligrosos para la salud humana.
            </p>
            <div class="card-range">
              <strong>Valor recomendado:</strong> ≤ 10 mg/L
            </div>
          </div>
        </div>
      </section>

      <!-- Acciones y Recomendaciones -->
      <section class="recommendations-section">
        <h2 class="section-title">💡 Recomendaciones</h2>
        <div class="recommendations-grid">
          <div class="recommendation-card">
            <div class="rec-icon">🌿</div>
            <h4>Biofiltros Naturales</h4>
            <p>
              Las plantas como la lenteja de agua, totora y carrizo ayudan a
              reducir contaminantes orgánicos y nitratos de forma natural.
            </p>
          </div>

          <div class="recommendation-card">
            <div class="rec-icon">🏞️</div>
            <h4>Protección de Riberas</h4>
            <p>
              Mantener la vegetación en las riberas del río ayuda a filtrar
              escorrentías y prevenir la erosión que aumenta la turbidez.
            </p>
          </div>

          <div class="recommendation-card">
            <div class="rec-icon">🚫</div>
            <h4>Control de Desechos</h4>
            <p>
              Evitar el vertido de aguas residuales y desechos orgánicos
              directamente al río para reducir la contaminación fecal.
            </p>
          </div>

          <div class="recommendation-card">
            <div class="rec-icon">🌱</div>
            <h4>Agricultura Sostenible</h4>
            <p>
              Reducir el uso de fertilizantes químicos y promover prácticas
              agrícolas que minimicen la escorrentía de nitratos.
            </p>
          </div>
        </div>
      </section>

      <!-- Alertas Activas -->
      <section v-if="hasAlerts" class="alerts-section">
        <h2 class="section-title">⚠️ Alertas Activas</h2>
        <div class="alerts-list">
          <div
            v-for="(item, index) in store.contaminationData"
            :key="index"
            v-show="item.status !== 'normal'"
            :class="['alert-card', `alert-${item.status}`]"
          >
            <div class="alert-icon">
              {{ item.status === 'critical' ? '🚨' : '⚠️' }}
            </div>
            <div class="alert-content">
              <h4>{{ item.name }}</h4>
              <p>
                Valor medido: <strong>{{ item.measured.toFixed(1) }} {{ item.unit }}</strong>
                (Recomendado: {{ item.recommended }} {{ item.unit }})
              </p>
              <p class="alert-message">
                {{ getAlertMessage(item) }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWaterQualityStore } from '@/stores/waterQuality'
import ContaminationChart from '@/components/ContaminationChart.vue'

const store = useWaterQualityStore()

const hasAlerts = computed(() => {
  return store.contaminationData.some(item => item.status !== 'normal')
})

const getAlertMessage = (item: any): string => {
  const exceedPercent = ((item.measured - item.recommended) / item.recommended * 100).toFixed(0)

  if (item.status === 'critical') {
    return `⚠️ CRÍTICO: El valor excede el recomendado en un ${exceedPercent}%. Se requiere acción inmediata.`
  } else if (item.status === 'warning') {
    return `⚠️ PRECAUCIÓN: El valor está por encima del nivel recomendado. Monitorear de cerca.`
  }
  return ''
}
</script>

<style scoped>
.contamination-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #fef3c7 0%, #fef9e7 100%);
}

.view-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.view-content {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 24px 16px;
}

.chart-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.info-section {
  margin-bottom: 48px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 32px;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.info-card p {
  margin: 0 0 16px 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.card-range {
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
}

.recommendations-section {
  margin-bottom: 48px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
}

.rec-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.recommendation-card h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #111827;
}

.recommendation-card p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.alerts-section {
  margin-bottom: 48px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid;
}

.alert-warning {
  background: #fffbeb;
  border-color: #f59e0b;
}

.alert-critical {
  background: #fef2f2;
  border-color: #ef4444;
}

.alert-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #111827;
}

.alert-content p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.alert-message {
  font-weight: 600;
  color: #92400e;
}

.alert-critical .alert-message {
  color: #991b1b;
}

/* Tablet */
@media (max-width: 1024px) {
  .view-content {
    padding: 24px 32px;
  }

  .info-cards {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .recommendations-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

/* Mobile */
@media (max-width: 768px) {
  .view-header {
    padding: 20px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .view-content {
    padding: 16px 12px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .chart-section,
  .info-section,
  .recommendations-section,
  .alerts-section {
    margin-bottom: 32px;
  }

  .info-cards,
  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-card,
  .recommendation-card {
    padding: 16px;
  }

  .card-icon {
    font-size: 28px;
  }

  .card-header h3 {
    font-size: 18px;
  }

  .rec-icon {
    font-size: 40px;
  }

  .recommendation-card h4 {
    font-size: 16px;
  }

  .alert-card {
    padding: 16px;
    gap: 12px;
  }

  .alert-icon {
    font-size: 28px;
  }

  .alert-content h4 {
    font-size: 16px;
  }

  .alert-content p {
    font-size: 13px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .header-content h1 {
    font-size: 20px;
  }

  .view-content {
    padding: 12px 8px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
