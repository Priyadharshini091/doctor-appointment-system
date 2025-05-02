// Emergency Services Functionality
function initEmergencyServices() {
    const locateMeBtn = document.getElementById('locate-me');
    const hospitalList = document.getElementById('hospital-list');
    
    if (locateMeBtn && hospitalList) {
        locateMeBtn.addEventListener('click', function() {
            // Show loading state
            hospitalList.innerHTML = '<div class="loading">Finding nearest hospitals...</div>';
            
            // In a real app, this would use the Geolocation API
            // For demo purposes, we'll use sample data
            setTimeout(() => {
                const hospitals = getNearbyHospitals();
                displayHospitals(hospitals);
                
                // Update map marker (in a real app, this would be a proper map)
                const mapMarker = document.querySelector('.location-picker');
                mapMarker.style.backgroundColor = '#4CAF50';
                mapMarker.innerHTML = '<i class="fas fa-check"></i>';
                mapMarker.style.width = '30px';
                mapMarker.style.height = '30px';
                mapMarker.style.display = 'flex';
                mapMarker.style.alignItems = 'center';
                mapMarker.style.justifyContent = 'center';
            }, 1500);
        });
        
        // Load sample hospitals by default
        const defaultHospitals = getNearbyHospitals();
        displayHospitals(defaultHospitals);
    }
}

function getNearbyHospitals() {
    // Sample data - in a real app, this would come from an API
    return [
        {
            id: 1,
            name: 'City General Hospital',
            distance: '0.5 miles',
            waitTime: '25 min',
            rating: 4.9,
            reviews: 342,
            address: '123 Medical Center Drive, Medical City',
            phone: '(123) 456-7890',
            services: ['Trauma Center', 'Pediatric ER', 'Stroke Center']
        },
        {
            id: 2,
            name: 'Children\'s Medical Center',
            distance: '1.2 miles',
            waitTime: '40 min',
            rating: 4.7,
            reviews: 215,
            address: '456 Pediatric Way, Medical City',
            phone: '(123) 456-7891',
            services: ['Pediatric ER', 'NICU', 'Child Life']
        },
        {
            id: 3,
            name: 'Memorial Medical Center',
            distance: '2.1 miles',
            waitTime: '15 min',
            rating: 4.5,
            reviews: 187,
            address: '789 Health Avenue, Medical City',
            phone: '(123) 456-7892',
            services: ['Cardiac Emergency', 'Burn Unit']
        },
        {
            id: 4,
            name: 'Westside Urgent Care',
            distance: '0.8 miles',
            waitTime: '10 min',
            rating: 4.3,
            reviews: 92,
            address: '321 Care Street, Medical City',
            phone: '(123) 456-7893',
            services: ['Urgent Care', 'X-Ray']
        }
    ];
}

function displayHospitals(hospitals) {
    const hospitalList = document.getElementById('hospital-list');
    
    let html = '';
    
    hospitals.forEach(hospital => {
        html += `
            <div class="hospital-item">
                <h5>${hospital.name}</h5>
                <div class="hospital-meta">
                    <span class="distance">${hospital.distance}</span>
                    <span class="rating">
                        <i class="fas fa-star"></i> ${hospital.rating} (${hospital.reviews})
                    </span>
                    <span class="wait-time">
                        <i class="fas fa-clock"></i> ER Wait: ${hospital.waitTime}
                    </span>
                </div>
                <div class="hospital-address">
                    <i class="fas fa-map-marker-alt"></i> ${hospital.address}
                </div>
                <div class="hospital-services">
                    ${hospital.services.map(service => `<span class="badge">${service}</span>`).join('')}
                </div>
                <div class="hospital-phone">
                    <i class="fas fa-phone-alt"></i> ${hospital.phone}
                </div>
                <div class="hospital-actions">
                    <a href="hospitals.html?id=${hospital.id}" class="btn btn-outline">View Details</a>
                    <a href="#" class="btn btn-primary">Get Directions</a>
                </div>
            </div>
        `;
    });
    
    hospitalList.innerHTML = html;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEmergencyServices();
});