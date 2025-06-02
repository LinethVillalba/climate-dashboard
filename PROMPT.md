# Proceso de Desarrollo del Dashboard de Análisis Climático

Este documento detalla el proceso de desarrollo del dashboard, comenzando con las especificaciones iniciales y siguiendo con las iteraciones de mejora.

## Especificaciones Iniciales

### Objetivo Principal
Crear una página web responsive con gráficos interactivos para análisis de datos de cambio climático usando el archivo `data/CO2_imputed_combinedNUEVO.csv`.

### Estructura del Proyecto
```
proyecto/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── mapVisualization.js
│   ├── lineChartVisualization.js
│   └── dataLoader.js
└── data/
    └── CO2_imputed_combinedNUEVO.csv
```

### Variables del Dataset
1. **co2_per_capita**: CO₂ per cápita
   - Propósito: Métrica para comparaciones directas entre países
   - Formato: X.XX tons
   - Escala de color: Rojos (fee5d9 a a50f15)

2. **temperature_change_from_ghg**: Cambio de temperatura por GEI
   - Propósito: Conexión entre emisiones e impacto climático
   - Formato: X.XX°C
   - Escala de color: Azul a rojo (4575b4 a d73027)

3. **cumulative_co2**: CO₂ acumulado histórico
   - Propósito: Responsabilidad histórica y contexto
   - Formato: X.XXk MtCO₂
   - Escala de color: Rojos (fee5d9 a a50f15)

4. **co2_growth_prct**: Crecimiento porcentual del CO₂
   - Propósito: Tendencia y velocidad del cambio
   - Formato: X.X%
   - Escala de color: Naranjas (fff5eb a d94801)

5. **share_global_co2**: Participación en CO₂ global
   - Propósito: Identificación de actores principales
   - Formato: X.X%
   - Escala de color: Morados (f2f0f7 a 54278f)

## Proceso de Iteración y Mejoras

### 1. Implementación Base
```
"Implementar estructura inicial:
- Layout responsive (sidebar 30%, área principal 70%)
- Carga y procesamiento del archivo CO2_imputed_combinedNUEVO.csv
- Selector de países en sidebar
- Visualizaciones básicas con Leaflet.js y Chart.js
- Manejo de datos faltantes y optimización inicial"
```

### 2. Mejora de Visualizaciones
```
"Optimizar rendimiento y visualización:
- Reducir puntos de datos en gráficos extensos
- Implementar debouncing en filtros
- Mejorar dimensiones y responsividad
- Agregar controles de animación
- Optimizar actualización de visualizaciones"
```

### 3. Mejoras en Selección de Países
```
"Implementar funcionalidades de selección:
- Búsqueda de países
- Botones 'Seleccionar Todo' y 'Deseleccionar Todo'
- Contador de países seleccionados
- Scroll y feedback visual mejorados
- Países iniciales por defecto:
  * Estados Unidos
  * China
  * Rusia
  * India
  * Qatar"
```

### 4. Optimización de Espacio
```
"Mejorar uso del espacio:
- Alternar entre mapa y gráfico de tendencias
- Agregar título con icono de globo terráqueo
- Implementar pie de página compacto
- Mantener consistencia en alturas de header y footer"
```

## Consideraciones Técnicas

### Librerías Utilizadas
- Leaflet.js para mapas
- Chart.js para gráficos
- PapaParse para procesamiento CSV
- Lodash para manipulación de datos
- D3.js para escalas de color

### Manejo de Datos
1. **Carga**:
   - Lectura del archivo CO2_imputed_combinedNUEVO.csv
   - Validación de campos requeridos
   - Procesamiento de valores nulos

2. **Procesamiento**:
   - Filtrado por países y años
   - Cálculo de rangos para escalas
   - Formateo según tipo de variable

3. **Optimización**:
   - Caché de datos procesados
   - Actualización eficiente de visualizaciones
   - Lazy loading para datos extensos

## Estructura de Datos
```javascript
// Formato de datos procesados
{
    country: string,       // Nombre del país
    year: number,         // Año del registro
    co2_per_capita: number,
    temperature_change_from_ghg: number,
    cumulative_co2: number,
    co2_growth_prct: number,
    share_global_co2: number
}
```

## Equipo de Desarrollo
Estudiantes de Ciencias de Datos - Universidad Tecnológica de Bolívar:
- Lineth Dariana Villalba Dominiquett
- Isabel Sofia Buelvas De la Hoz
- Alejandro Patron Montero 