# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto Sumak Yaku - Monitoreo Río Ambi

Sistema de monitoreo de calidad del agua para el Río Ambi en Imbabura, Ecuador. Combina tecnología IoT (sensores ESP-32), biofiltros naturales y recuperación de memorias ancestrales de la comunidad indígena Imantag.

## Comandos Comunes

### Desarrollo
```bash
cd sumak-yaku-dashboard
npm run dev              # Iniciar servidor de desarrollo (http://localhost:5173)
npm run build           # Compilar para producción
npm run preview         # Vista previa de la compilación de producción
```

### Linting y Type Checking
```bash
npm run type-check      # Verificar tipos TypeScript
npm run build-only      # Solo compilar sin verificar tipos
```

## Arquitectura del Proyecto

### Estructura General
```
sumak_yaku/
├── sumak-yaku-dashboard/    # Aplicación Vue 3 con TypeScript
│   ├── src/
│   │   ├── stores/          # Pinia stores (gestión de estado)
│   │   ├── components/      # Componentes reutilizables
│   │   ├── views/           # Vistas/páginas principales
│   │   ├── router/          # Configuración de Vue Router
│   │   └── assets/          # Recursos estáticos
└── Río Ambi.xlsx            # Datos de referencia del proyecto
```

### Componentes Clave

#### `stores/waterQuality.ts`
Store de Pinia que gestiona:
- Datos actuales de sensores (turbidez, conductividad, oxígeno disuelto, pH, temperatura)
- Datos históricos de lecturas
- Estado de conexión con sensores ESP-32
- Rangos óptimos y evaluación de calidad del agua
- Lógica de simulación para desarrollo (reemplazar con datos reales del ESP-32)

**Parámetros monitoreados:**

Calidad del agua:
- **Turbidez**: 0-5 NTU (óptimo) - mide claridad del agua
- **Conductividad**: 50-500 μS/cm (óptimo) - indica sales disueltas
- **Oxígeno Disuelto**: 6-14 mg/L (óptimo) - esencial para vida acuática
- **pH**: 6.5-8.5 (óptimo) - mide acidez/alcalinidad
- **Temperatura**: 10-25°C (óptimo) - afecta otros parámetros

Contaminación:
- **Turbidez**: ≤50 mg/L (recomendado) - partículas suspendidas
- **Materia Orgánica**: ≤10 mg/L (recomendado) - residuos orgánicos
- **Contaminación Fecal**: ≤200 NPM (recomendado) - coliformes fecales
- **Nitratos**: ≤10 mg/L (recomendado) - provienen de fertilizantes

#### `components/IndicatorCard.vue`
Tarjeta visual para mostrar un indicador individual con:
- Valor actual y unidad de medida
- Barra de progreso con marcador
- Estado (normal/precaución/crítico)
- Rangos óptimos
- Diseño responsivo con colores temáticos

#### `components/WaterQualitySummary.vue`
Resumen general de la calidad del agua:
- Score de calidad (0-100) con círculo de progreso animado
- Estado general (excelente/bueno/regular/malo)
- Lista de observaciones/problemas detectados
- Indicador de conexión en tiempo real
- Mensaje cultural "Sumak Yaku - Agua Buena"

#### `components/ContaminationChart.vue`
Gráfico de barras horizontal comparativo:
- Compara valores recomendados vs medidos
- Barras azules para valores recomendados
- Barras de colores (verde/amarillo/rojo) según estado para valores medidos
- Grid de fondo con escala numérica
- Tabla de datos con información detallada
- Responsive para móvil y desktop

#### `components/WaterQualityHistory.vue`
Visualización de historial de calidad del agua de la última semana

#### `views/DashboardView.vue`
Vista principal de calidad del agua:
- Navegación entre vistas (Dashboard / Contaminación)
- Resumen de calidad del agua
- Grid de 4 indicadores principales
- Información del proyecto (biofiltros, IoT, comunidad, objetivos)
- Guía de parámetros con explicaciones educativas
- Botón para conectar/desconectar sensores

#### `views/ContaminationView.vue`
Vista de análisis de contaminación:
- Gráfico de barras comparativo (recomendado vs medido)
- Tarjetas informativas sobre cada parámetro
- Sección de recomendaciones (biofiltros, riberas, desechos, agricultura)
- Sistema de alertas activas (warning/critical)
- Cálculo automático de porcentaje de exceso
- Tema amarillo/naranja para distinguir de la vista principal

### Stack Tecnológico
- **Framework**: Vue 3 con Composition API y `<script setup>`
- **Lenguaje**: TypeScript
- **Gestión de Estado**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **CSS**: Scoped styles con gradientes y animaciones

### Integración con Hardware
El sistema está diseñado para recibir datos de:
- **Microcontrolador**: ESP-32
- **Sensores**:
  - Turbidez
  - Conductividad
  - Oxígeno disuelto
  - pH
  - Temperatura

**Nota**: Actualmente usa simulación de datos. Para integrar sensores reales:
1. Implementar conexión WebSocket o API REST en `stores/waterQuality.ts`
2. Reemplazar método `startSimulation()` con `connectToRealSensor()`
3. Configurar endpoint del ESP-32

### Diseño y Temas
- **Colores principales**: Verde (#059669, #047857) representando la naturaleza
- **Gradientes**: Del azul al verde simbolizando agua y naturaleza
- **Estados de alerta**:
  - Verde: Normal/Óptimo
  - Amarillo: Precaución/Warning
  - Rojo: Crítico
- **Iconos**: Emojis temáticos para accesibilidad y claridad visual

### Biofiltros Naturales
El proyecto utiliza plantas nativas:
- **Lenteja de agua** (Lemna minor)
- **Totora** (Schoenoplectus californicus)
- **Carrizo** (Phragmites australis)

Estas plantas purifican el agua de forma natural, removiendo contaminantes orgánicos e inorgánicos.

### Contexto Cultural
- **Comunidad**: Indígena Imantag, Imbabura
- **Filosofía**: "Sumak Yaku" (Agua Buena en Kichwa)
- **Objetivo Social**: Recuperar memorias ancestrales sobre el cuidado del agua
- **Sostenibilidad**: Enfoque en soluciones a largo plazo con participación comunitaria

## Consideraciones para Desarrollo

### Añadir nuevos parámetros de medición
1. Actualizar interfaz `WaterQualityData` en `stores/waterQuality.ts`
2. Agregar rango óptimo en objeto `optimalRanges`
3. Crear computed property para estado del parámetro
4. Añadir nuevo `IndicatorCard` en `DashboardView.vue`

### Conectar con API/WebSocket del ESP-32
1. Instalar cliente WebSocket: `npm install socket.io-client`
2. Modificar `connectToSensor()` en el store para establecer conexión real
3. Implementar listeners para recibir datos del sensor
4. Manejar reconexión automática y manejo de errores

### Responsive Design
El dashboard está optimizado para:
- Desktop: Grid de 4 columnas para indicadores
- Tablet: Grid de 2 columnas (auto-fit)
- Mobile: Grid de 1 columna
- Breakpoint principal: 768px

### Performance
- Componentes usan `<script setup>` para mejor tree-shaking
- Los datos históricos se limitan a 100 lecturas
- Las transiciones CSS son hardware-accelerated
- Actualización de datos cada 3 segundos (configurable)
