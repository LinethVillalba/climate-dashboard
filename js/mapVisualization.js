class MapVisualization {
    constructor() {
        this.map = null;
        this.geojsonLayer = null;
        this.colorScales = {
            // Rojo para emisiones de CO2 (más intenso = más emisiones)
            'co2_per_capita': d3.scaleSequential(d3.interpolate('#fee5d9', '#a50f15')),
            'cumulative_co2': d3.scaleSequential(d3.interpolate('#fee5d9', '#a50f15')),
            // Naranja para crecimiento (más intenso = mayor crecimiento)
            'co2_growth_prct': d3.scaleSequential(d3.interpolate('#fff5eb', '#d94801')),
            // Verde-Rojo para cambios de temperatura (verde = menor cambio, rojo = mayor cambio)
            'temperature_change_from_ghg': d3.scaleSequential(d3.interpolate('#4575b4', '#d73027')),
            // Morado para participación global (más intenso = mayor participación)
            'share_global_co2': d3.scaleSequential(d3.interpolate('#f2f0f7', '#54278f'))
        };
        this.currentScale = this.colorScales['co2_per_capita'];
        this.currentData = null;
        this.selectedCountries = new Set();
        this.initialize();
    }

    initialize() {
        // Initialize the map
        this.map = L.map('map').setView([20, 0], 2);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Load world GeoJSON data
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(response => response.json())
            .then(geojsonData => {
                this.geojsonData = geojsonData;
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    updateMap(data, variable, selectedCountries) {
        if (!this.geojsonData) return;
        
        this.currentData = data;
        this.selectedCountries = new Set(selectedCountries);
        this.currentScale = this.colorScales[variable] || this.colorScales['co2_per_capita'];
        
        // Remove existing layer if it exists
        if (this.geojsonLayer) {
            this.map.removeLayer(this.geojsonLayer);
        }

        // Calculate min and max values for color scale using only selected countries
        const selectedData = data.filter(d => this.selectedCountries.has(d.country));
        const values = selectedData.map(d => d.value).filter(v => v != null);
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        // Update color scale domain
        this.currentScale.domain([min, max]);

        // Create the new layer
        this.geojsonLayer = L.geoJSON(this.geojsonData, {
            style: (feature) => this.getCountryStyle(feature, data),
            onEachFeature: (feature, layer) => {
                const countryData = data.find(d => d.country === feature.properties.name);
                const isSelected = this.selectedCountries.has(feature.properties.name);
                
                // Format value based on variable type
                let formattedValue = 'No data';
                if (countryData && countryData.value != null) {
                    formattedValue = this.formatValue(countryData.value, variable);
                }
                
                // Tooltip content
                let tooltipContent = `<strong>${feature.properties.name}</strong><br>`;
                if (isSelected) {
                    tooltipContent += `${this.getVariableLabel(variable)}: ${formattedValue}`;
                } else {
                    tooltipContent += '(Not selected)';
                }
                
                layer.bindTooltip(tooltipContent, {
                    className: 'tooltip'
                });

                // Add hover effects
                layer.on({
                    mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                            weight: 2,
                            fillOpacity: isSelected ? 0.9 : 0.3
                        });
                        layer.bringToFront();
                    },
                    mouseout: (e) => {
                        const layer = e.target;
                        this.geojsonLayer.resetStyle(layer);
                    }
                });
            }
        }).addTo(this.map);

        // Add legend if there are selected countries
        if (selectedData.length > 0) {
            this.updateLegend(variable, min, max);
        }
    }

    getCountryStyle(feature, data) {
        const countryData = data.find(d => d.country === feature.properties.name);
        const isSelected = this.selectedCountries.has(feature.properties.name);
        
        if (!isSelected) {
            // Style for unselected countries
            return {
                fillColor: '#e0e0e0',
                weight: 1,
                opacity: 0.5,
                color: 'white',
                fillOpacity: 0.2
            };
        }
        
        // Style for selected countries
        return {
            fillColor: countryData && countryData.value != null ? 
                this.currentScale(countryData.value) : '#e0e0e0',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    formatValue(value, variable) {
        switch(variable) {
            case 'co2_per_capita':
                return `${value.toFixed(2)} tons`;
            case 'temperature_change_from_ghg':
                return `${value.toFixed(2)}°C`;
            case 'co2_growth_prct':
                return `${value.toFixed(1)}%`;
            case 'share_global_co2':
                return `${value.toFixed(1)}%`;
            case 'cumulative_co2':
                return value >= 1000 ? 
                    `${(value/1000).toFixed(1)}k MtCO₂` : 
                    `${value.toFixed(0)} MtCO₂`;
            default:
                return value.toFixed(2);
        }
    }

    getVariableLabel(variable) {
        const labels = {
            'co2_per_capita': 'CO₂ per capita',
            'temperature_change_from_ghg': 'Temperature Change',
            'cumulative_co2': 'Cumulative CO₂',
            'co2_growth_prct': 'CO₂ Growth',
            'share_global_co2': 'Global CO₂ Share'
        };
        return labels[variable] || variable;
    }

    updateLegend(variable, min, max) {
        // Remove existing legend
        const existingLegend = document.querySelector('.map-legend');
        if (existingLegend) {
            existingLegend.remove();
        }

        // Create new legend
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend');
            const steps = 5;
            const delta = (max - min) / (steps - 1);
            
            div.innerHTML = `
                <h4>${this.getVariableLabel(variable)}</h4>
                <div class="legend-scale">
                    ${Array.from({length: steps}, (_, i) => {
                        const value = min + (delta * i);
                        const color = this.currentScale(value);
                        return `
                            <div class="legend-item">
                                <span class="legend-color" style="background: ${color}"></span>
                                <span class="legend-label">${this.formatValue(value, variable)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            return div;
        };
        legend.addTo(this.map);
    }

    resize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }
}

// Create and export a singleton instance
const mapVisualization = new MapVisualization();
window.mapVisualization = mapVisualization; 