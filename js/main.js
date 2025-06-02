document.addEventListener('DOMContentLoaded', async () => {
    // Initialize UI elements
    const countrySelector = document.querySelector('.country-selector');
    const variableSelector = document.getElementById('variable');
    const yearSlider = document.getElementById('yearSlider');
    const yearDisplay = document.getElementById('yearDisplay');
    const resetButton = document.getElementById('resetFilters');
    const searchInput = document.getElementById('countrySearch');
    const clearSearchButton = document.getElementById('clearSearch');
    const selectAllButton = document.getElementById('selectAll');
    const deselectAllButton = document.getElementById('deselectAll');
    const selectedCountDisplay = document.getElementById('selectedCount');

    // Load data
    try {
        await dataLoader.loadData();
        initializeUI();
        setupEventListeners();
        updateVisualizations();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        alert('Error loading data. Please try refreshing the page.');
    }

    function initializeUI() {
        // Populate country selector
        const countries = dataLoader.getCountries();
        countrySelector.innerHTML = countries.map(country => `
            <div class="country-checkbox" data-country="${country.toLowerCase()}">
                <input type="checkbox" id="${country}" value="${country}">
                <label for="${country}">${country}</label>
            </div>
        `).join('');

        // Initialize year slider
        const years = dataLoader.getYears();
        yearSlider.min = Math.min(...years);
        yearSlider.max = Math.max(...years);
        yearSlider.value = yearSlider.max;
        yearDisplay.textContent = yearSlider.value;

        // Select top 5 climate impact countries
        const defaultCountries = ['United States', 'China', 'Russia', 'India', 'Qatar'];
        defaultCountries.forEach(country => {
            const checkbox = document.getElementById(country);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        dataLoader.setSelectedCountries(defaultCountries);
        updateSelectedCount();
    }

    function setupEventListeners() {
        // Country selection
        countrySelector.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                updateSelectedCountries();
            }
        });

        // Search functionality
        searchInput.addEventListener('input', debounce(filterCountries, 300));
        
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            filterCountries();
        });

        // Select/Deselect All
        selectAllButton.addEventListener('click', () => {
            const visibleCheckboxes = countrySelector.querySelectorAll('.country-checkbox:not(.hidden) input[type="checkbox"]');
            visibleCheckboxes.forEach(checkbox => checkbox.checked = true);
            updateSelectedCountries();
        });

        deselectAllButton.addEventListener('click', () => {
            const visibleCheckboxes = countrySelector.querySelectorAll('.country-checkbox:not(.hidden) input[type="checkbox"]');
            visibleCheckboxes.forEach(checkbox => checkbox.checked = false);
            updateSelectedCountries();
        });

        // Variable selection
        variableSelector.addEventListener('change', () => {
            dataLoader.setCurrentVariable(variableSelector.value);
            updateVisualizations();
        });

        // Year slider
        yearSlider.addEventListener('input', () => {
            yearDisplay.textContent = yearSlider.value;
            dataLoader.setCurrentYear(parseInt(yearSlider.value));
            updateMapVisualization();
        });

        // Reset button
        resetButton.addEventListener('click', () => {
            // Clear search
            searchInput.value = '';
            filterCountries();

            // Uncheck all countries first
            countrySelector.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset to default values
            variableSelector.value = 'co2_per_capita';
            yearSlider.value = yearSlider.max;
            yearDisplay.textContent = yearSlider.value;

            // Check default countries
            const defaultCountries = ['United States', 'China', 'Russia', 'India', 'Qatar'];
            defaultCountries.forEach(country => {
                const checkbox = document.getElementById(country);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            // Update state
            dataLoader.setSelectedCountries(defaultCountries);
            dataLoader.setCurrentVariable('co2_per_capita');
            dataLoader.setCurrentYear(parseInt(yearSlider.value));

            // Update visualizations
            updateVisualizations();
            updateSelectedCount();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            mapVisualization.resize();
            lineChartVisualization.resize();
        });

        // Visualization toggle functionality
        const vizSelectors = document.querySelectorAll('.viz-selector');
        const vizPanels = document.querySelectorAll('.viz-panel');

        vizSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                // Remove active class from all selectors and panels
                vizSelectors.forEach(s => s.classList.remove('active'));
                vizPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked selector and corresponding panel
                selector.classList.add('active');
                const targetViz = selector.dataset.viz;
                document.querySelector(`#${targetViz}-container`).classList.add('active');
                
                // Trigger resize for map if map panel is activated
                if (targetViz === 'map') {
                    mapVisualization.resize();
                }
            });
        });
    }

    function updateSelectedCountries() {
        const selectedCountries = Array.from(countrySelector.querySelectorAll('input:checked'))
            .map(checkbox => checkbox.value);
        dataLoader.setSelectedCountries(selectedCountries);
        updateSelectedCount();
        updateVisualizations();
    }

    function updateSelectedCount() {
        const count = dataLoader.getSelectedCountries().length;
        selectedCountDisplay.textContent = count;
    }

    function filterCountries() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const countryElements = countrySelector.querySelectorAll('.country-checkbox');
        
        countryElements.forEach(element => {
            const countryName = element.dataset.country;
            if (!searchTerm || countryName.includes(searchTerm)) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateVisualizations() {
        updateMapVisualization();
        updateLineChartVisualization();
    }

    function updateMapVisualization() {
        const year = parseInt(yearSlider.value);
        const variable = variableSelector.value;
        const data = dataLoader.getDataForYear(year, variable);
        const selectedCountries = dataLoader.getSelectedCountries();
        mapVisualization.updateMap(data, variable, selectedCountries);
    }

    function updateLineChartVisualization() {
        const selectedCountries = dataLoader.getSelectedCountries();
        const variable = variableSelector.value;
        const timeSeriesData = dataLoader.getTimeSeriesData(selectedCountries, variable);
        lineChartVisualization.updateChart(timeSeriesData, variable);
    }
}); 