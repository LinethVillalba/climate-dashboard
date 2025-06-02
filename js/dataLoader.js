class DataLoader {
    constructor() {
        this.data = null;
        this.countries = new Set();
        this.years = new Set();
        this.selectedCountries = new Set();
        this.currentVariable = 'co2_per_capita';
        this.currentYear = 2021;
    }

    async loadData() {
        try {
            console.log('Attempting to load CSV file...');
            // Use absolute path from current location
            const response = await fetch(window.location.href.replace(/\/[^/]*$/, '') + '/data/CO2_imputed_combinedNUEVO.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            console.log('CSV file loaded, first 100 chars:', csvText.substring(0, 100));
            
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        console.log('Papa Parse complete. Row count:', results.data.length);
                        console.log('First row sample:', results.data[0]);
                        console.log('Available columns:', results.meta.fields);
                        
                        if (results.errors.length > 0) {
                            console.warn('Papa Parse errors:', results.errors);
                        }
                        
                        // Filter out any rows without country or year
                        this.data = results.data.filter(row => 
                            row.country && 
                            row.year && 
                            !isNaN(row.year) && 
                            row.year.toString().length === 4
                        );
                        
                        if (this.data.length === 0) {
                            throw new Error('No valid data found in CSV file');
                        }
                        
                        this.processData();
                        resolve(this.data);
                    },
                    error: (error) => {
                        console.error('Papa Parse error:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    processData() {
        console.log('Processing data...');
        this.data.forEach(row => {
            if (row.country && row.year) {
                this.countries.add(row.country);
                this.years.add(row.year);
            }
        });
        
        // Convert sets to sorted arrays
        this.countries = Array.from(this.countries).sort();
        this.years = Array.from(this.years).sort((a, b) => a - b);
        
        console.log('Data processed:', {
            countryCount: this.countries.length,
            yearRange: `${Math.min(...this.years)} - ${Math.max(...this.years)}`,
            sampleCountries: this.countries.slice(0, 5)
        });
    }

    getCountries() {
        return Array.from(this.countries);
    }

    getYears() {
        return Array.from(this.years);
    }

    getDataForYear(year, variable) {
        const data = this.data.filter(row => row.year === year)
            .map(row => ({
                country: row.country,
                value: row[variable]
            }));
        console.log(`Data for year ${year}, variable ${variable}:`, {
            count: data.length,
            sample: data.slice(0, 3)
        });
        return data;
    }

    getTimeSeriesData(countries, variable) {
        console.log('Getting time series data for:', {
            countries,
            variable
        });
        
        const timeSeriesData = {};
        
        countries.forEach(country => {
            timeSeriesData[country] = this.data
                .filter(row => row.country === country)
                .sort((a, b) => a.year - b.year)
                .map(row => ({
                    year: row.year,
                    value: row[variable]
                }));
        });
        
        console.log('Time series data sample:', {
            sampleCountry: Object.keys(timeSeriesData)[0],
            sampleData: timeSeriesData[Object.keys(timeSeriesData)[0]]?.slice(0, 3)
        });
        
        return timeSeriesData;
    }

    setSelectedCountries(countries) {
        this.selectedCountries = new Set(countries);
        console.log('Selected countries updated:', Array.from(this.selectedCountries));
    }

    getSelectedCountries() {
        return Array.from(this.selectedCountries);
    }

    setCurrentVariable(variable) {
        this.currentVariable = variable;
        console.log('Current variable updated:', this.currentVariable);
    }

    getCurrentVariable() {
        return this.currentVariable;
    }

    setCurrentYear(year) {
        this.currentYear = year;
        console.log('Current year updated:', this.currentYear);
    }

    getCurrentYear() {
        return this.currentYear;
    }
}

// Create and export a singleton instance
const dataLoader = new DataLoader();
window.dataLoader = dataLoader; // Make it globally accessible 