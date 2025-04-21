
// DOM Elements
const incidentForm = document.getElementById('incident-form');
const alertList = document.getElementById('alert-list');
const safeButton = document.getElementById('safe-button');
const safeStatus = document.getElementById('safe-status');
const themeToggle = document.getElementById('theme-toggle');
const getLocationBtn = document.getElementById('get-location');
const locationStatus = document.getElementById('location-status');
const lastCheckin = document.getElementById('last-checkin');
const safeCount = document.getElementById('safe-count');

// Initialize Map
const map = L.map('map').setView([51.505, -0.09], 13); // Default to London
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Incident Reporting
let userLocation = null;

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = [position.coords.latitude, position.coords.longitude];
                locationStatus.textContent = "Location captured!";
                locationStatus.style.color = "var(--success)";
                
                // Add marker to map
                L.marker(userLocation, {
                    icon: L.icon({
                        iconUrl: 'assets/map-marker.png',
                        iconSize: [32, 32]
                    })
                }).addTo(map)
                .bindPopup("Your location").openPopup();
                
                map.setView(userLocation, 15);
            },
            (error) => {
                locationStatus.textContent = "Failed to get location.";
                locationStatus.style.color = "var(--danger)";
            }
        );
    } else {
        locationStatus.textContent = "Geolocation not supported.";
        locationStatus.style.color = "var(--danger)";
    }
});

incidentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('incident-title').value.trim();
    const description = document.getElementById('incident-description').value.trim();
    
    if (!title || !description) {
        showAlert("Please fill all fields!", "error");
        return;
    }
    
    if (!userLocation) {
        showAlert("Please set your location!", "error");
        return;
    }
    
    // Add to alerts
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';
    alertItem.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <small>${new Date().toLocaleString()}</small>
    `;
    alertList.prepend(alertItem);
    
    // Add to map
    L.marker(userLocation).addTo(map)
        .bindPopup(`<b>${title}</b><br>${description}`)
        .openPopup();
    
    // Reset form
    incidentForm.reset();
    showAlert("Incident reported successfully!", "success");
});

// Safety Check-In
let checkIns = JSON.parse(localStorage.getItem('checkIns')) || { count: 0, last: null };

safeButton.addEventListener('click', () => {
    const now = new Date();
    checkIns.count++;
    checkIns.last = now.toISOString();
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
    
    safeStatus.textContent = `✅ Checked in at ${now.toLocaleTimeString()}`;
    safeStatus.style.color = "var(--success)";
    
    updateSafetyStats();
});

function updateSafetyStats() {
    lastCheckin.textContent = `Last check-in: ${checkIns.last ? new Date(checkIns.last).toLocaleString() : 'Never'}`;
    safeCount.textContent = `Total check-ins: ${checkIns.count}`;
}

updateSafetyStats();

// Helper: Show temporary alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => alert.remove(), 3000);
}
