# Climate Change Analysis Dashboard

An interactive web-based dashboard for visualizing and analyzing global climate change data and CO₂ emissions. This project provides both map-based and trend-based visualizations of various climate-related metrics across different countries and time periods.

## Features

- Interactive world map visualization
- Time series trend analysis
- Multiple climate metrics:
  - CO₂ per capita
  - Temperature change from greenhouse gases
  - Cumulative CO₂ emissions
  - CO₂ growth percentage
  - Global CO₂ share
- Country selection and filtering
- Responsive design for desktop and mobile devices

## Prerequisites

- Python 3.7 or higher (for running the local server)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Git (for cloning the repository)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/climate-dashboard.git
cd climate-dashboard
```

2. (Optional) Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install the required Python packages:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the local development server:
```bash
python -m http.server 8000
```

2. Open your web browser and navigate to:
```
http://localhost:8000
```

The dashboard should now be running and accessible in your web browser.

## Project Structure

```
climate-dashboard/
├── css/
│   └── styles.css
├── js/
│   ├── dataLoader.js
│   ├── mapVisualization.js
│   ├── lineChartVisualization.js
│   └── main.js
├── index.html
├── requirements.txt
└── README.md
```

## Data Sources

The dashboard uses climate change and CO₂ emissions data from various global sources, processed and formatted for visualization purposes.

## Development Team

- Lineth Dariana Villalba Dominiquett
- Isabel Sofia Buelvas De la Hoz
- Alejandro Patron Montero

Data Science Students at Universidad Tecnológica de Bolívar

## Browser Compatibility

The dashboard is tested and works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

If you encounter any issues:

1. Make sure all prerequisites are installed
2. Check that you're using a supported browser version
3. Clear your browser cache
4. Ensure no other service is running on port 8000

For any other issues, please open an issue in the GitHub repository. 