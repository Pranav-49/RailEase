// Configuration
const API_BASE_URL = 'http://localhost:8086';

// Available station names for better UI
const stationNames = {
    'NDLS': 'New Delhi',
    'CST': 'Mumbai CST',
    'BOM': 'Mumbai Central',
    'DEL': 'Delhi',
    'KOL': 'Kolkata',
    'MAA': 'Chennai Central',
    'HYB': 'Hyderabad',
    'BLR': 'Bangalore',
    'PUNE': 'Pune',
    'AGR': 'Agra',
    'LKO': 'Lucknow',
    'JP': 'Jaipur',
    'ADI': 'Ahmedabad',
    'SBC': 'Bangalore City',
    'MAS': 'Chennai Central',
    'HWH': 'Howrah',
    'CSMT': 'Mumbai CSMT',
    'BCT': 'Mumbai Central',
    'GZB': 'Ghaziabad',
    'AMR': 'Amritsar'
};

// Common train types for reference
const trainTypes = [
    'Rajdhani Express',
    'Duranto Express',
    'Shatabdi Express',
    'Kalyan Express'
];

/**
 * Switch between tabs
 * @param {string} tabName - Name of the tab to switch to
 */
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Load data if needed
    if (tabName === 'all-trains') {
        loadAllTrains();
    }
}

/**
 * Show loading spinner
 * @param {string} containerId - ID of the container to show loading in
 */
function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = '<div class="loading">Loading trains...</div>';
}

/**
 * Show error message
 * @param {string} containerId - ID of the container to show error in
 * @param {string} message - Error message to display
 */
function showError(containerId, message) {
    document.getElementById(containerId).innerHTML = `<div class="error">❌ ${message}</div>`;
}

/**
 * Show success message
 * @param {string} containerId - ID of the container to show success in
 * @param {string} message - Success message to display
 */
function showSuccess(containerId, message) {
    document.getElementById(containerId).innerHTML = `
        <div class="success">✅ ${message}</div>
    `;
    
    // Auto hide success message after 3 seconds
    setTimeout(() => {
        const successElement = document.getElementById(containerId).querySelector('.success');
        if (successElement) {
            successElement.remove();
        }
    }, 3000);
}

/**
 * Get readable station name from code
 * @param {string} code - Station code
 * @returns {string} - Readable station name or code if not found
 */
function getStationName(code) {
    return stationNames[code] || code;
}

/**
 * Create HTML for a train card (updated for new API structure)
 * @param {Object} train - Train object from API
 * @returns {string} - HTML string for train card
 */
function createTrainCard(train) {
    return `
        <div class="train-card">
            <div class="train-header">
                <div class="train-number">${train.trainNumber || 'N/A'}</div>
                <div class="train-id">ID: ${train.id || 'N/A'}</div>
            </div>
            <div class="train-name">${train.trainName || 'Unknown Train'}</div>
            <div class="train-info">
                <div class="info-item">
                    <span class="label">Train Number:</span>
                    <span class="value">${train.trainNumber}</span>
                </div>
                <div class="info-item">
                    <span class="label">Train Name:</span>
                    <span class="value">${train.trainName}</span>
                </div>
                <div class="info-item">
                    <span class="label">Train ID:</span>
                    <span class="value">${train.id}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create HTML for search result train card
 * @param {Object} train - Train object from search API
 * @returns {string} - HTML string for train card
 */
function createSearchTrainCard(train) {
    return `
        <div class="train-card">
            <div class="train-header">
                <div class="train-number">${train.trainNumber || 'N/A'}</div>
            </div>
            <div class="train-name">${train.trainName || 'Unknown Train'}</div>
            <div class="train-route">
                <div class="station">
                    <div class="station-code">${train.sourceCode || 'N/A'}</div>
                    <div class="station-name">${getStationName(train.sourceCode)}</div>
                </div>
                <div class="route-line"></div>
                <div class="station">
                    <div class="station-code">${train.destinationCode || 'N/A'}</div>
                    <div class="station-name">${getStationName(train.destinationCode)}</div>
                </div>
            </div>
            <div class="train-timing">
                <span>Departure: ${train.departureTime || 'N/A'}</span>
                <span>Arrival: ${train.arrivalTime || 'N/A'}</span>
            </div>
        </div>
    `;
}

/**
 * Load all trains from the API
 */
async function loadAllTrains() {
    const container = document.getElementById('all-trains-container');
    showLoading('all-trains-container');
    
    try {
        const response = await fetch(`${API_BASE_URL}/trains`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const trains = await response.json();
        
        if (!Array.isArray(trains) || trains.length === 0) {
            container.innerHTML = '<div class="no-results">No trains found in the database</div>';
            return;
        }
        
        const trainsHTML = trains.map(train => createTrainCard(train)).join('');
        container.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #333;">Found ${trains.length} trains</h3>
            <div class="trains-grid">${trainsHTML}</div>
        `;
        
    } catch (error) {
        console.error('Error loading trains:', error);
        showError('all-trains-container', 
            'Failed to load trains. Please check if your Spring Boot server is running on http://localhost:8086');
    }
}

/**
 * Add a new train to the database
 */
async function addTrain() {
    const trainName = document.getElementById('newTrainName').value.trim();
    const trainNumber = document.getElementById('newTrainNumber').value.trim();
    const messageContainer = document.getElementById('add-train-message');
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Validation
    if (!trainName || !trainNumber) {
        showError('add-train-message', 'Please enter both train name and train number');
        return;
    }
    
    // Validate train number format (should be numeric)
    if (!/^\d+$/.test(trainNumber)) {
        showError('add-train-message', 'Train number should contain only digits');
        return;
    }
    
    const trainData = {
        trainName: trainName,
        trainNumber: trainNumber
    };
    
    try {
        showLoading('add-train-message');
        
        const response = await fetch(`${API_BASE_URL}/trains/addtrain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trainData)
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Train number already exists');
            } else if (response.status === 400) {
                throw new Error('Invalid train data provided');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const result = await response.json();
        
        showSuccess('add-train-message', `Train "${trainName}" added successfully!`);
        
        // Clear form
        document.getElementById('newTrainName').value = '';
        document.getElementById('newTrainNumber').value = '';
        
        // Refresh the all trains list if it's currently displayed
        const allTrainsTab = document.getElementById('all-trains');
        if (allTrainsTab.classList.contains('active')) {
            loadAllTrains();
        }
        
    } catch (error) {
        console.error('Error adding train:', error);
        showError('add-train-message', error.message);
    }
}

/**
 * Search trains by source and destination codes
 */
async function searchTrains() {
    const sourceCode = document.getElementById('sourceCode').value.trim().toUpperCase();
    const destinationCode = document.getElementById('destinationCode').value.trim().toUpperCase();
    const container = document.getElementById('search-results-container');
    
    // Validation
    if (!sourceCode || !destinationCode) {
        showError('search-results-container', 'Please enter both source and destination codes');
        return;
    }
    
    if (sourceCode === destinationCode) {
        showError('search-results-container', 'Source and destination codes cannot be the same');
        return;
    }
    
    showLoading('search-results-container');
    
    try {
        const url = `${API_BASE_URL}/search/by-code?sourceCode=${encodeURIComponent(sourceCode)}&destinationCode=${encodeURIComponent(destinationCode)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No trains found for the given route');
            } else if (response.status === 400) {
                throw new Error('Invalid station codes provided');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const trains = await response.json();
        
        if (!Array.isArray(trains) || trains.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    No trains found from ${sourceCode} to ${destinationCode}
                    <br><small>Please check if the station codes are correct</small>
                </div>
            `;
            return;
        }
        
        const trainsHTML = trains.map(train => createSearchTrainCard(train)).join('');
        container.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #333;">
                Found ${trains.length} trains from ${getStationName(sourceCode)} (${sourceCode}) to ${getStationName(destinationCode)} (${destinationCode})
            </h3>
            <div class="trains-grid">${trainsHTML}</div>
        `;
        
    } catch (error) {
        console.error('Error searching trains:', error);
        showError('search-results-container', error.message);
    }
}

/**
 * Clear search form
 */
function clearSearchForm() {
    document.getElementById('sourceCode').value = '';
    document.getElementById('destinationCode').value = '';
    document.getElementById('search-results-container').innerHTML = '';
}

/**
 * Initialize the application
 */
function initializeApp() {
    // Load all trains on page load
    loadAllTrains();
    
    // Add Enter key support for search inputs
    const sourceInput = document.getElementById('sourceCode');
    const destinationInput = document.getElementById('destinationCode');
    
    if (sourceInput) {
        sourceInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchTrains();
            }
        });
        
        // Convert to uppercase as user types
        sourceInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
    
    if (destinationInput) {
        destinationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchTrains();
            }
        });
        
        // Convert to uppercase as user types
        destinationInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
    
    // Add Enter key support for add train form
    const trainNameInput = document.getElementById('newTrainName');
    const trainNumberInput = document.getElementById('newTrainNumber');
    
    if (trainNameInput) {
        trainNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTrain();
            }
        });
    }
    
    if (trainNumberInput) {
        trainNumberInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTrain();
            }
        });
    }
}

/**
 * Add station to the station names dictionary
 * @param {string} code - Station code
 * @param {string} name - Station name
 */
function addStation(code, name) {
    stationNames[code.toUpperCase()] = name;
}

/**
 * Get all available station codes
 * @returns {Array} - Array of station codes
 */
function getAvailableStations() {
    return Object.keys(stationNames);
}

/**
 * Handle API configuration updates
 * @param {string} newBaseUrl - New base URL for the API
 */
function updateApiUrl(newBaseUrl) {
    API_BASE_URL = newBaseUrl;
    console.log(`API URL updated to: ${API_BASE_URL}`);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchTab,
        loadAllTrains,
        searchTrains,
        addTrain,
        clearSearchForm,
        addStation,
        getAvailableStations,
        updateApiUrl
    };
}