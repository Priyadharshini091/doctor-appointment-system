// Doctor Availability Functionality
function initDoctorAvailability() {
    const doctorSearchForm = document.getElementById('doctor-search-form');
    const doctorResults = document.getElementById('doctor-results');
    
    if (doctorSearchForm && doctorResults) {
        doctorSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const specialty = document.getElementById('specialty').value;
            const hospital = document.getElementById('hospital').value;
            const date = document.getElementById('date').value;
            
            // Show loading state
            doctorResults.innerHTML = '<div class="loading">Searching for doctors...</div>';
            
            // Simulate API call
            setTimeout(() => {
                // Sample doctor data
                const doctors = getSampleDoctors(specialty, hospital, date);
                
                // Display results
                if (doctors.length > 0) {
                    displayDoctorResults(doctors);
                } else {
                    doctorResults.innerHTML = '<div class="no-results">No doctors found matching your criteria. Please try different search parameters.</div>';
                }
            }, 1000);
        });
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
}

function getSampleDoctors(specialty, hospital, date) {
    // This is sample data - in a real app, you would fetch this from an API
    const allDoctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            hospital: 'City General Hospital',
            image: 'images/doctor1.jpg',
            experience: '15 years',
            rating: 4.9,
            reviews: 127,
            available: true,
            nextAvailable: 'Today, 2:00 PM'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            hospital: 'Memorial Medical Center',
            image: 'images/doctor2.jpg',
            experience: '10 years',
            rating: 4.8,
            reviews: 94,
            available: true,
            nextAvailable: 'Tomorrow, 9:00 AM'
        },
        {
            id: 3,
            name: 'Dr. Lisa Rodriguez',
            specialty: 'Pediatrics',
            hospital: 'Children\'s Hospital',
            image: 'images/doctor3.jpg',
            experience: '12 years',
            rating: 4.9,
            reviews: 156,
            available: false,
            nextAvailable: 'Next Monday, 10:00 AM'
        },
        {
            id: 4,
            name: 'Dr. David Kim',
            specialty: 'Orthopedics',
            hospital: 'City General Hospital',
            image: 'images/doctor4.jpg',
            experience: '8 years',
            rating: 4.7,
            reviews: 82,
            available: true,
            nextAvailable: 'Today, 4:30 PM'
        },
        {
            id: 5,
            name: 'Dr. Emily Wilson',
            specialty: 'Dermatology',
            hospital: 'Memorial Medical Center',
            image: 'images/doctor5.jpg',
            experience: '7 years',
            rating: 4.8,
            reviews: 73,
            available: true,
            nextAvailable: 'Tomorrow, 11:00 AM'
        }
    ];
    
    // Filter doctors based on search criteria
    return allDoctors.filter(doctor => {
        let matches = true;
        
        if (specialty && doctor.specialty.toLowerCase() !== specialty.toLowerCase()) {
            matches = false;
        }
        
        if (hospital && doctor.hospital.toLowerCase() !== hospital.toLowerCase()) {
            matches = false;
        }
        
        return matches;
    });
}

function displayDoctorResults(doctors) {
    const doctorResults = document.getElementById('doctor-results');
    
    let html = '<div class="doctor-results-grid">';
    
    doctors.forEach(doctor => {
        html += `
            <div class="doctor-card">
                <div class="doctor-image">
                    <img src="${doctor.image}" alt="${doctor.name}">
                </div>
                <div class="doctor-info">
                    <h4>${doctor.name}</h4>
                    <p class="specialty">${doctor.specialty}</p>
                    <div class="doctor-meta">
                        <span class="experience">
                            <i class="fas fa-briefcase"></i> ${doctor.experience}
                        </span>
                        <span class="rating">
                            <i class="fas fa-star"></i> ${doctor.rating} (${doctor.reviews})
                        </span>
                    </div>
                    <div class="doctor-availability">
                        <span class="badge ${doctor.available ? 'available' : 'limited'}">
                            ${doctor.available ? 'Available ' + doctor.nextAvailable : 'Next available ' + doctor.nextAvailable}
                        </span>
                    </div>
                    <div class="doctor-actions">
                        <a href="#" class="btn btn-outline">View Profile</a>
                        <a href="#" class="btn btn-primary">Book Appointment</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    doctorResults.innerHTML = html;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDoctorAvailability();
});