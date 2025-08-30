const API_BASE_URL = 'http://localhost:8086';

 function showTab(tabName) {

     const tabContents = document.querySelectorAll('.tab-content');
     tabContents.forEach(content => content.classList.remove('active'));
     
     const tabs = document.querySelectorAll('.tab');
     tabs.forEach(tab => tab.classList.remove('active'));
     
     document.getElementById(tabName).classList.add('active');
     event.target.classList.add('active');
 }

 async function searchTrains() {
     const searchType = document.getElementById('searchType').value;
     const source = document.getElementById('source').value.trim();
     const destination = document.getElementById('destination').value.trim();
     const resultsDiv = document.getElementById('searchResults');

     if (!source || !destination) {
         resultsDiv.innerHTML = '<div class="error">Please enter both source and destination.</div>';
         return;
     }

     resultsDiv.innerHTML = '<div class="loading">Searching for trains...</div>';

     try {
         let url;
         if (searchType === 'code') {
             url = `${API_BASE_URL}/search/by-code?sourceCode=${encodeURIComponent(source)}&destinationCode=${encodeURIComponent(destination)}`;
         } else {
             url = `${API_BASE_URL}/search/by-name?sourceName=${encodeURIComponent(source)}&destinationName=${encodeURIComponent(destination)}`;
         }

         const response = await fetch(url);
         
         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const trains = await response.json();
         console.log('Search results:', trains); // Debug log
         displaySearchResults(trains);
         
     } catch (error) {
         console.error('Search error:', error);
         resultsDiv.innerHTML = `<div class="error">Error searching trains: ${error.message}</div>`;
     }
 }

 // Display search results
 function displaySearchResults(trains) {
     const resultsDiv = document.getElementById('searchResults');
     
     if (trains.length === 0) {
         resultsDiv.innerHTML = '<div class="error">No trains found for the selected route.</div>';
         return;
     }

     let html = '<h3 style="margin-bottom: 20px; color: #333;">Available Trains</h3>';
     
     trains.forEach(schedule => {
         // Handle potential null/undefined values safely
         const trainName = schedule.train?.trainName || 'Unknown Train';
         const trainNumber = schedule.train?.trainNumber || 'N/A';
         const sourceStationName = schedule.sourceStation?.stationName || 'Unknown Station';
         const destinationStationName = schedule.destinationStation?.stationName || 'Unknown Station';
         const departureTime = schedule.departureTime || 'N/A';
         const arrivalTime = schedule.arrivalTime || 'N/A';
         
         html += `
             <div class="train-card">
                 <div class="train-header">
                     <div class="train-name">${trainName}</div>
                     <div class="train-number">#${trainNumber}</div>
                 </div>
                 <div class="route-info">
                     <div class="station-info">
                         <div class="station-name">${sourceStationName}</div>
                         <div class="station-time">Departure: ${departureTime}</div>
                     </div>
                     <div class="route-arrow">→</div>
                     <div class="station-info">
                         <div class="station-name">${destinationStationName}</div>
                         <div class="station-time">Arrival: ${arrivalTime}</div>
                     </div>
                 </div>
             </div>
         `;
     });

     resultsDiv.innerHTML = html;
 }

 // Get all trains function
 async function getAllTrains() {
     const resultsDiv = document.getElementById('trainResults');
     resultsDiv.innerHTML = '<div class="loading">Loading all trains...</div>';

     try {
         const response = await fetch(`${API_BASE_URL}/trains`);
         
         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const trains = await response.json();
         displayAllTrains(trains);
         
     } catch (error) {
         console.error('Get trains error:', error);
         resultsDiv.innerHTML = `<div class="error">Error loading trains: ${error.message}</div>`;
     }
 }

 // Display all trains
 function displayAllTrains(trains) {
     const resultsDiv = document.getElementById('trainResults');
     
     if (trains.length === 0) {
         resultsDiv.innerHTML = '<div class="error">No trains found in the database.</div>';
         return;
     }

     let html = '<h3 style="margin-bottom: 20px; color: #333;">All Trains</h3>';
     
     trains.forEach(train => {
         html += `
             <div class="train-card">
                 <div class="train-header">
                     <div class="train-name">${train.trainName}</div>
                     <div class="train-number">#${train.trainNumber}</div>
                 </div>
             </div>
         `;
     });

     resultsDiv.innerHTML = html;
 }

 // Add train function
 async function addTrain(event) {
     event.preventDefault();
     
     const trainName = document.getElementById('trainName').value.trim();
     const trainNumber = document.getElementById('trainNumber').value.trim();
     const resultsDiv = document.getElementById('trainResults');

     if (!trainName || !trainNumber) {
         resultsDiv.innerHTML = '<div class="error">Please fill in all fields.</div>';
         return;
     }

     try {
         const response = await fetch(`${API_BASE_URL}/trains/addtrain`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 trainName: trainName,
                 trainNumber: trainNumber,
                 trainSchedules: null
             })
         });

         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }

         const newTrain = await response.json();
         
         // Clear form
         document.getElementById('trainName').value = '';
         document.getElementById('trainNumber').value = '';
         
         resultsDiv.innerHTML = `
             <div class="success">
                 Train "${newTrain.trainName}" (#${newTrain.trainNumber}) added successfully!
             </div>
         `;

         // Refresh the train list
         setTimeout(() => {
             getAllTrains();
         }, 1000);

     } catch (error) {
         console.error('Add train error:', error);
         resultsDiv.innerHTML = `<div class="error">Error adding train: ${error.message}</div>`;
     }
 }

 // Initialize database function
 async function initializeData() {
     const resultsDiv = document.getElementById('initResults');
     resultsDiv.innerHTML = '<div class="loading">Initializing database...</div>';

     try {
         const response = await fetch(`${API_BASE_URL}/test`);
         
         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }

         resultsDiv.innerHTML = `
             <div class="success">
                 Database initialized successfully! 
                 <br><br>
                 <strong>Sample data added:</strong>
                 <ul style="margin-top: 10px; margin-left: 20px;">
                     <li><strong>Stations:</strong> New Delhi (NDLS), Mumbai Central (CST), Kolkata (KOO), Chennai Express (MAS)</li>
                     <li><strong>Trains:</strong> Rajdhani Express (#120665), Durantu Express (#128059), Shatabdi Express (#120541), Satara Express (#120649), Kalyan Express (#120550)</li>
                     <li><strong>Routes:</strong> Mumbai↔Delhi, Delhi↔Chennai, Chennai↔Kolkata</li>
                 </ul>
                 <br>
                 <strong>Test the search with these routes:</strong>
                 <ul style="margin-top: 5px; margin-left: 20px;">
                     <li>CST to NDLS (Mumbai to Delhi)</li>
                     <li>NDLS to MAS (Delhi to Chennai)</li>
                     <li>MAS to KOO (Chennai to Kolkata)</li>
                 </ul>
             </div>
         `;

     } catch (error) {
         console.error('Initialize error:', error);
         resultsDiv.innerHTML = `<div class="error">Error initializing database: ${error.message}</div>`;
     }
 }

 // Enter key support for search
 document.addEventListener('DOMContentLoaded', function() {
     const sourceInput = document.getElementById('source');
     const destinationInput = document.getElementById('destination');
     
     [sourceInput, destinationInput].forEach(input => {
         input.addEventListener('keypress', function(event) {
             if (event.key === 'Enter') {
                 searchTrains();
             }
         });
     });
 });

 // Sample data helper and auto-populate functionality
 document.addEventListener('DOMContentLoaded', function() {
     // Add some sample placeholder text to help users understand the format
     const searchTypeSelect = document.getElementById('searchType');
     const sourceInput = document.getElementById('source');
     const destinationInput = document.getElementById('destination');

     searchTypeSelect.addEventListener('change', function() {
         if (this.value === 'code') {
             sourceInput.placeholder = 'e.g., CST, NDLS, KOO, MAS';
             destinationInput.placeholder = 'e.g., NDLS, CST, KOO, MAS';
         } else {
             sourceInput.placeholder = 'e.g., Mumbai Central, New Delhi';
             destinationInput.placeholder = 'e.g., New Delhi, Chennai Express';
         }
     });

     // Add quick search buttons for common routes
     addQuickSearchButtons();
 });

 // Add quick search buttons for testing
 function addQuickSearchButtons() {
     const searchCard = document.querySelector('#search .card');
     const quickSearchDiv = document.createElement('div');
     quickSearchDiv.innerHTML = `
         <h4 style="margin: 20px 0 10px 0; color: #333;">Quick Search (Test Routes):</h4>
         <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
             <button class="btn" style="font-size: 14px; padding: 8px 15px;" onclick="fillQuickSearch('CST', 'NDLS', 'code')">Mumbai → Delhi</button>
             <button class="btn" style="font-size: 14px; padding: 8px 15px;" onclick="fillQuickSearch('NDLS', 'MAS', 'code')">Delhi → Chennai</button>
             <button class="btn" style="font-size: 14px; padding: 8px 15px;" onclick="fillQuickSearch('MAS', 'KOO', 'code')">Chennai → Kolkata</button>
             <button class="btn btn-secondary" style="font-size: 14px; padding: 8px 15px;" onclick="fillQuickSearch('Mumbai Central', 'New Delhi', 'name')">By Name</button>
         </div>
     `;
     
     const searchRow = searchCard.querySelector('.search-row');
     searchRow.parentNode.insertBefore(quickSearchDiv, searchRow);
 }

 // Fill quick search data
 function fillQuickSearch(source, destination, searchType) {
     document.getElementById('searchType').value = searchType;
     document.getElementById('source').value = source;
     document.getElementById('destination').value = destination;
     
     // Trigger placeholder update
     const event = new Event('change');
     document.getElementById('searchType').dispatchEvent(event);
 }
