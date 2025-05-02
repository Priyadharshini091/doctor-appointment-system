// Pharmacy Functionality
function initPharmacyServices() {
    const locateMeBtn = document.getElementById('pharmacy-locate-me');
    const pharmacyList = document.getElementById('pharmacy-list');
    const medicineSearchForm = document.getElementById('medicine-search-form');
    
    if (locateMeBtn && pharmacyList) {
        locateMeBtn.addEventListener('click', function() {
            // Show loading state
            pharmacyList.innerHTML = '<div class="loading">Finding nearby pharmacies...</div>';
            
            // In a real app, this would use the Geolocation API
            // For demo purposes, we'll use sample data
            setTimeout(() => {
                const pharmacies = getNearbyPharmacies();
                displayPharmacies(pharmacies);
                
                // Update map marker (in a real app, this would be a proper map)
                const mapMarker = document.querySelector('#pharmacy-map-container .location-picker');
                mapMarker.style.backgroundColor = '#4CAF50';
                mapMarker.innerHTML = '<i class="fas fa-check"></i>';
                mapMarker.style.width = '30px';
                mapMarker.style.height = '30px';
                mapMarker.style.display = 'flex';
                mapMarker.style.alignItems = 'center';
                mapMarker.style.justifyContent = 'center';
            }, 1500);
        });
        
        // Load sample pharmacies by default
        const defaultPharmacies = getNearbyPharmacies();
        displayPharmacies(defaultPharmacies);
    }
    
    if (medicineSearchForm) {
        medicineSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const medicineName = document.getElementById('medicine-name').value.trim();
            const location = document.getElementById('medicine-location').value.trim();
            const distance = document.getElementById('medicine-distance').value;
            
            if (!medicineName) {
                alert('Please enter a medicine name');
                return;
            }
            
            // In a real app, this would search an API
            // For demo, we'll just show the medicine availability section
            document.querySelector('.medicine-availability').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Sort functionality
    const pharmacySort = document.getElementById('pharmacy-sort');
    if (pharmacySort) {
        pharmacySort.addEventListener('change', function() {
            const pharmacies = Array.from(document.querySelectorAll('.pharmacy-card'));
            
            pharmacies.sort((a, b) => {
                const aValue = getSortValue(a, this.value);
                const bValue = getSortValue(b, this.value);
                
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
            
            const pharmacyList = document.getElementById('pharmacy-list');
            pharmacyList.innerHTML = '';
            pharmacies.forEach(pharmacy => {
                pharmacyList.appendChild(pharmacy);
            });
        });
    }
}

function getSortValue(pharmacyCard, sortBy) {
    switch (sortBy) {
        case 'distance':
            const distanceText = pharmacyCard.querySelector('.distance').textContent;
            return parseFloat(distanceText.split(' ')[0]);
        case 'rating':
            const ratingText = pharmacyCard.querySelector('.rating').textContent;
            return parseFloat(ratingText.split(' ')[1]);
        case 'name':
            return pharmacyCard.querySelector('h5').textContent;
        default:
            return 0;
    }
}

function getNearbyPharmacies() {
    // Sample data - in a real app, this would come from an API
    return [
        {
            id: 1,
            name: 'City Health Pharmacy',
            distance: '0.3 miles',
            rating: 4.5,
            reviews: 128,
            address: '123 Medical Way, Suite 100, Medical City',
            hours: 'Open today until 9:00 PM',
            phone: '(123) 456-7890',
            is24Hour: false
        },
        {
            id: 2,
            name: '24-Hour Emergency Pharmacy',
            distance: '0.8 miles',
            rating: 4.0,
            reviews: 87,
            address: '456 Health Ave, Medical City',
            hours: 'Open 24 hours',
            phone: '(123) 456-7891',
            is24Hour: true
        },
        {
            id: 3,
            name: 'MediQuick Pharmacy',
            distance: '1.2 miles',
            rating: 4.2,
            reviews: 64,
            address: '789 Quick Lane, Medical City',
            hours: 'Open today until 8:00 PM',
            phone: '(123) 456-7892',
            is24Hour: false
        },
        {
            id: 4,
            name: 'HealthPlus Pharmacy',
            distance: '1.5 miles',
            rating: 3.9,
            reviews: 42,
            address: '321 Wellness Blvd, Medical City',
            hours: 'Open today until 7:30 PM',
            phone: '(123) 456-7893',
            is24Hour: false
        }
    ];
}

function displayPharmacies(pharmacies) {
    const pharmacyList = document.getElementById('pharmacy-list');
    
    let html = '';
    
    pharmacies.forEach(pharmacy => {
        html += `
            <div class="pharmacy-card">
                <div class="pharmacy-info">
                    <h5>${pharmacy.name}</h5>
                    <div class="pharmacy-meta">
                        <span class="distance">${pharmacy.distance}</span>
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="${pharmacy.rating >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}"></i>
                            ${pharmacy.rating} (${pharmacy.reviews})
                        </span>
                    </div>
                    <div class="pharmacy-address">
                        <i class="fas fa-map-marker-alt"></i> ${pharmacy.address}
                    </div>
                    <div class="pharmacy-hours">
                        <i class="fas fa-clock"></i> ${pharmacy.hours}
                    </div>
                    <div class="pharmacy-phone">
                        <i class="fas fa-phone-alt"></i> ${pharmacy.phone}
                    </div>
                </div>
                <div class="pharmacy-actions">
                    <a href="#" class="btn btn-outline">View Details</a>
                    <a href="#" class="btn btn-primary">Get Directions</a>
                </div>
            </div>
        `;
    });
    
    pharmacyList.innerHTML = html;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPharmacyServices();
});