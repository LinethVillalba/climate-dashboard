class LineChartVisualization {
    constructor() {
        this.chart = null;
        this.initialize();
    }

    initialize() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animation for better performance
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest',
                    axis: 'x'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Climate Data Trends',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 6
                        },
                        maxHeight: 50
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Year'
                        },
                        ticks: {
                            maxTicksLimit: 10, // Limit number of x-axis ticks
                            maxRotation: 0
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        beginAtZero: true
                    }
                },
                elements: {
                    point: {
                        radius: 0, // Hide points for better performance
                        hitRadius: 10, // Area for hover interaction
                        hoverRadius: 4 // Show points on hover
                    },
                    line: {
                        tension: 0.2 // Reduce line curve for better performance
                    }
                }
            }
        });
    }

    updateChart(timeSeriesData, variable) {
        const colors = [
            '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f',
            '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#c0392b'
        ];

        // Get all years from the data
        const years = new Set();
        Object.values(timeSeriesData).forEach(countryData => {
            countryData.forEach(point => years.add(point.year));
        });
        const sortedYears = Array.from(years).sort((a, b) => a - b);

        // Reduce data points if there are too many
        const stride = Math.ceil(sortedYears.length / 100); // Limit to ~100 points
        const filteredYears = sortedYears.filter((_, i) => i % stride === 0);

        // Create datasets with reduced points
        const datasets = Object.entries(timeSeriesData).map(([country, data], index) => {
            const filteredData = data.filter(d => filteredYears.includes(d.year));
            return {
                label: country,
                data: filteredData.map(d => ({
                    x: d.year,
                    y: d.value
                })),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                fill: false,
                borderWidth: 2
            };
        });

        // Update chart data and options
        this.chart.data.labels = filteredYears;
        this.chart.data.datasets = datasets;
        
        // Update axis labels and formatting
        this.chart.options.scales.y.title.text = this.getVariableLabel(variable);
        this.chart.options.plugins.title.text = `${this.getVariableLabel(variable)} Over Time`;

        // Set appropriate y-axis format based on variable
        this.setAxisFormat(variable);

        // Update the chart
        this.chart.update('none'); // Use 'none' mode for better performance
    }

    setAxisFormat(variable) {
        // Configure y-axis based on variable type
        const config = {
            'co2_per_capita': {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value.toFixed(1)}`
                }
            },
            'temperature_change_from_ghg': {
                beginAtZero: false,
                ticks: {
                    callback: value => `${value.toFixed(2)}°C`
                }
            },
            'co2_growth_prct': {
                beginAtZero: false,
                ticks: {
                    callback: value => `${value.toFixed(1)}%`
                }
            },
            'share_global_co2': {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value.toFixed(1)}%`
                }
            },
            'cumulative_co2': {
                beginAtZero: true,
                ticks: {
                    callback: value => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value.toFixed(0)
                }
            }
        };

        this.chart.options.scales.y = {
            ...this.chart.options.scales.y,
            ...(config[variable] || config['co2_per_capita'])
        };
    }

    getVariableLabel(variable) {
        const labels = {
            'co2_per_capita': 'CO₂ per capita',
            'temperature_change_from_ghg': 'Temperature Change from GHG',
            'cumulative_co2': 'Cumulative CO₂',
            'co2_growth_prct': 'CO₂ Growth %',
            'share_global_co2': 'Share of Global CO₂'
        };
        return labels[variable] || variable;
    }

    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
}

// Create and export a singleton instance
const lineChartVisualization = new LineChartVisualization();
window.lineChartVisualization = lineChartVisualization; 