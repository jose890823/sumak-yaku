import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface WaterQualityData {
  timestamp: Date
  turbidity: number // NTU (Nephelometric Turbidity Units)
  conductivity: number // μS/cm (microsiemens per centimeter)
  dissolvedOxygen: number // mg/L
  ph: number // pH scale (0-14)
  temperature: number // °C
  // Parámetros de contaminación adicionales
  turbidityMgL: number // mg/L (medición alternativa)
  organicMatter: number // mg/L (materia orgánica)
  fecalContamination: number // NPM (Número Más Probable - coliformes fecales)
  nitrates: number // mg/L (nitratos)
}

export interface SensorReading extends WaterQualityData {
  location: string
  sensorId: string
}

export const useWaterQualityStore = defineStore('waterQuality', () => {
  // Estado
  const currentData = ref<WaterQualityData>({
    timestamp: new Date(),
    turbidity: 0,
    conductivity: 0,
    dissolvedOxygen: 0,
    ph: 7,
    temperature: 0,
    turbidityMgL: 0,
    organicMatter: 0,
    fecalContamination: 0,
    nitrates: 0
  })

  const historicalData = ref<SensorReading[]>([])
  const isConnected = ref(false)
  const lastUpdate = ref<Date | null>(null)

  // Rangos óptimos para cada parámetro
  const optimalRanges = {
    turbidity: { min: 0, max: 5, unit: 'NTU' }, // Agua clara
    conductivity: { min: 50, max: 500, unit: 'μS/cm' }, // Agua de río limpia
    dissolvedOxygen: { min: 6, max: 14, unit: 'mg/L' }, // Adecuado para vida acuática
    ph: { min: 6.5, max: 8.5, unit: 'pH' }, // Rango neutro
    temperature: { min: 10, max: 25, unit: '°C' },
    // Rangos para parámetros de contaminación
    turbidityMgL: { recommended: 50, max: 120, unit: 'mg/L' }, // Turbidez en mg/L
    organicMatter: { recommended: 10, max: 30, unit: 'mg/L' }, // Materia orgánica
    fecalContamination: { recommended: 200, max: 1000, unit: 'NPM' }, // Contaminación fecal
    nitrates: { recommended: 10, max: 20, unit: 'mg/L' } // Nitratos
  }

  // Computados para evaluar la calidad
  const waterQualityStatus = computed(() => {
    const data = currentData.value
    let score = 0
    const issues: string[] = []

    // Evaluar turbidez
    if (data.turbidity >= optimalRanges.turbidity.min &&
        data.turbidity <= optimalRanges.turbidity.max) {
      score += 20
    } else {
      issues.push('Turbidez fuera de rango óptimo')
    }

    // Evaluar conductividad
    if (data.conductivity >= optimalRanges.conductivity.min &&
        data.conductivity <= optimalRanges.conductivity.max) {
      score += 20
    } else {
      issues.push('Conductividad fuera de rango óptimo')
    }

    // Evaluar oxígeno disuelto
    if (data.dissolvedOxygen >= optimalRanges.dissolvedOxygen.min &&
        data.dissolvedOxygen <= optimalRanges.dissolvedOxygen.max) {
      score += 30 // Más importante para vida acuática
    } else {
      issues.push('Oxígeno disuelto fuera de rango óptimo')
    }

    // Evaluar pH
    if (data.ph >= optimalRanges.ph.min &&
        data.ph <= optimalRanges.ph.max) {
      score += 30 // Muy importante
    } else {
      issues.push('pH fuera de rango óptimo')
    }

    let status: 'excelente' | 'bueno' | 'regular' | 'malo'
    if (score >= 90) status = 'excelente'
    else if (score >= 70) status = 'bueno'
    else if (score >= 50) status = 'regular'
    else status = 'malo'

    return { score, status, issues }
  })

  const turbidityStatus = computed(() => {
    const value = currentData.value.turbidity
    const range = optimalRanges.turbidity
    if (value >= range.min && value <= range.max) return 'normal'
    if (value > range.max && value <= range.max * 2) return 'warning'
    return 'critical'
  })

  const conductivityStatus = computed(() => {
    const value = currentData.value.conductivity
    const range = optimalRanges.conductivity
    if (value >= range.min && value <= range.max) return 'normal'
    if (value > range.max && value <= range.max * 2) return 'warning'
    return 'critical'
  })

  const dissolvedOxygenStatus = computed(() => {
    const value = currentData.value.dissolvedOxygen
    const range = optimalRanges.dissolvedOxygen
    if (value >= range.min && value <= range.max) return 'normal'
    if (value < range.min && value >= range.min * 0.7) return 'warning'
    return 'critical'
  })

  const phStatus = computed(() => {
    const value = currentData.value.ph
    const range = optimalRanges.ph
    if (value >= range.min && value <= range.max) return 'normal'
    if ((value < range.min && value >= range.min - 0.5) ||
        (value > range.max && value <= range.max + 0.5)) return 'warning'
    return 'critical'
  })

  // Computados para parámetros de contaminación
  const contaminationData = computed(() => {
    const getStatus = (value: number, recommended: number, max: number): 'normal' | 'warning' | 'critical' => {
      if (value <= recommended) return 'normal'
      if (value <= max) return 'warning'
      return 'critical'
    }

    return [
      {
        name: 'Turbidez mg/L',
        recommended: optimalRanges.turbidityMgL.recommended,
        measured: currentData.value.turbidityMgL,
        unit: optimalRanges.turbidityMgL.unit,
        status: getStatus(currentData.value.turbidityMgL, optimalRanges.turbidityMgL.recommended, optimalRanges.turbidityMgL.max)
      },
      {
        name: 'Materia Orgánica mg/L',
        recommended: optimalRanges.organicMatter.recommended,
        measured: currentData.value.organicMatter,
        unit: optimalRanges.organicMatter.unit,
        status: getStatus(currentData.value.organicMatter, optimalRanges.organicMatter.recommended, optimalRanges.organicMatter.max)
      },
      {
        name: 'Contaminación Fecal NPM',
        recommended: optimalRanges.fecalContamination.recommended,
        measured: currentData.value.fecalContamination,
        unit: optimalRanges.fecalContamination.unit,
        status: getStatus(currentData.value.fecalContamination, optimalRanges.fecalContamination.recommended, optimalRanges.fecalContamination.max)
      },
      {
        name: 'Nitratos mg/L',
        recommended: optimalRanges.nitrates.recommended,
        measured: currentData.value.nitrates,
        unit: optimalRanges.nitrates.unit,
        status: getStatus(currentData.value.nitrates, optimalRanges.nitrates.recommended, optimalRanges.nitrates.max)
      }
    ]
  })

  // Acciones
  function updateData(data: Partial<WaterQualityData>) {
    currentData.value = {
      ...currentData.value,
      ...data,
      timestamp: new Date()
    }
    lastUpdate.value = new Date()
  }

  function addHistoricalReading(reading: SensorReading) {
    historicalData.value.push(reading)
    // Mantener solo últimas 100 lecturas
    if (historicalData.value.length > 100) {
      historicalData.value.shift()
    }
  }

  function connectToSensor() {
    isConnected.value = true
    // Aquí se implementaría la conexión real con el ESP32
    startSimulation()
  }

  function disconnectFromSensor() {
    isConnected.value = false
  }

  // Simulación de datos para desarrollo (se reemplazará con datos reales del ESP32)
  let simulationInterval: ReturnType<typeof setInterval> | null = null

  function startSimulation() {
    if (simulationInterval) return

    simulationInterval = setInterval(() => {
      updateData({
        turbidity: Math.random() * 10 + 2,
        conductivity: Math.random() * 300 + 200,
        dissolvedOxygen: Math.random() * 4 + 6,
        ph: Math.random() * 2 + 6.5,
        temperature: Math.random() * 5 + 15,
        turbidityMgL: Math.random() * 80 + 40, // 40-120 mg/L
        organicMatter: Math.random() * 25 + 5, // 5-30 mg/L
        fecalContamination: Math.random() * 900 + 100, // 100-1000 NPM
        nitrates: Math.random() * 15 + 5 // 5-20 mg/L
      })
    }, 3000)
  }

  function stopSimulation() {
    if (simulationInterval) {
      clearInterval(simulationInterval)
      simulationInterval = null
    }
  }

  // Datos históricos de la última semana para la gráfica (valores simulados fijos)
  const weeklyHistory = computed(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    const today = new Date()

    // Valores fijos simulados para mostrar la evolución de la última semana
    const simulatedScores = [75, 78, 82, 85, 88, 90, 92]

    const history: Array<{ date: string; day: string; score: number }> = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1

      history.push({
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        day: days[dayIndex] ?? 'Dom',
        score: simulatedScores[6 - i] ?? 75
      })
    }

    return history
  })

  return {
    // Estado
    currentData,
    historicalData,
    isConnected,
    lastUpdate,
    optimalRanges,
    // Computados
    waterQualityStatus,
    turbidityStatus,
    conductivityStatus,
    dissolvedOxygenStatus,
    phStatus,
    contaminationData,
    weeklyHistory,
    // Acciones
    updateData,
    addHistoricalReading,
    connectToSensor,
    disconnectFromSensor,
    startSimulation,
    stopSimulation
  }
})
