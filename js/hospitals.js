// Hospitals Page Functionality
function initHospitalsPage() {
    // Check if we're on a specific hospital details page
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('id');
    
    if (hospitalId) {
        loadHospitalDetails(hospitalId);
    }
    
    // Initialize hospital locator if on the main hospitals page
    const locateMeBtn = document.getElementById('hospital-locate-me');
    const hospitalList = document.getElementById('hospital-list');
    
    if (locateMeBtn && hospitalList) {
        locateMeBtn.addEventListener('click', function() {
            // Show loading state
            hospitalList.innerHTML = '<div class="loading">Finding nearby hospitals...</div>';
            
            // In a real app, this would use the Geolocation API
            // For demo purposes, we'll use sample data
            setTimeout(() => {
                const hospitals = getNearbyHospitals();
                displayHospitals(hospitals);
                
                // Update map marker (in a real app, this would be a proper map)
                const mapMarker = document.querySelector('#hospital-map-container .location-picker');
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
    
    // Sort functionality
    const hospitalSort = document.getElementById('hospital-sort');
    if (hospitalSort) {
        hospitalSort.addEventListener('change', function() {
            const hospitals = Array.from(document.querySelectorAll('.hospital-card'));
            
            hospitals.sort((a, b) => {
                const aValue = getHospitalSortValue(a, this.value);
                const bValue = getHospitalSortValue(b, this.value);
                
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
            
            const hospitalList = document.getElementById('hospital-list');
            hospitalList.innerHTML = '';
            hospitals.forEach(hospital => {
                hospitalList.appendChild(hospital);
            });
        });
    }
    
    // Doctor filter functionality
    const doctorSpecialtyFilter = document.getElementById('doctor-specialty');
    const doctorAvailabilityFilter = document.getElementById('doctor-availability');
    
    if (doctorSpecialtyFilter && doctorAvailabilityFilter) {
        const filterDoctors = () => {
            const specialty = doctorSpecialtyFilter.value;
            const availability = doctorAvailabilityFilter.value;
            
            const doctorCards = document.querySelectorAll('.doctor-card');
            
            doctorCards.forEach(card => {
                const cardSpecialty = card.querySelector('.specialty').textContent.toLowerCase();
                const cardAvailability = card.querySelector('.badge').textContent.toLowerCase();
                
                let showCard = true;
                
                if (specialty !== 'all' && !cardSpecialty.includes(specialty.toLowerCase())) {
                    showCard = false;
                }
                
                if (availability !== 'all') {
                    if (availability === 'today' && !cardAvailability.includes('today')) {
                        showCard = false;
                    } else if (availability === 'week' && cardAvailability.includes('next')) {
                        showCard = false;
                    } else if (availability === 'weekend' && !(cardAvailability.includes('sat') || cardAvailability.includes('sun'))) {
                        showCard = false;
                    }
                }
                
                card.style.display = showCard ? 'grid' : 'none';
            });
        };
        
        doctorSpecialtyFilter.addEventListener('change', filterDoctors);
        doctorAvailabilityFilter.addEventListener('change', filterDoctors);
    }
}

function getHospitalSortValue(hospitalCard, sortBy) {
    switch (sortBy) {
        case 'distance':
            const distanceText = hospitalCard.querySelector('.distance').textContent;
            return parseFloat(distanceText.split(' ')[0]);
        case 'rating':
            const ratingText = hospitalCard.querySelector('.rating').textContent;
            return parseFloat(ratingText.split(' ')[1]);
        case 'wait-time':
            const waitTimeText = hospitalCard.querySelector('.wait-time').textContent;
            return parseFloat(waitTimeText.split(' ')[2]);
        case 'name':
            return hospitalCard.querySelector('h5').textContent;
        default:
            return 0;
    }
}

function loadHospitalDetails(hospitalId) {
    // In a real app, this would fetch from an API
    // For demo, we'll use sample data
    const hospital = getHospitalById(hospitalId);
    
    if (!hospital) {
        // Redirect to hospitals page if ID is invalid
        window.location.href = 'hospitals.html';
        return;
    }
    
    // Update the page with hospital details
    document.querySelector('.hospital-header h3').textContent = hospital.name;
    document.querySelector('.hospital-rating .stars').innerHTML = getStarRating(hospital.rating);
    document.querySelector('.hospital-rating .stars span').textContent = `(${hospital.reviews})`;
    document.querySelector('.hospital-address').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${hospital.address}`;
    document.querySelector('.hospital-phone').innerHTML = `<i class="fas fa-phone-alt"></i> ${hospital.phone}`;
    
    // Update main image
    document.querySelector('.main-image img').src = hospital.images[0];
    
    // Update thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    thumbnailContainer.innerHTML = '';
    
    hospital.images.forEach((image, index) => {
        thumbnailContainer.innerHTML += `<img src="${image}" alt="Hospital ${index + 1}">`;
    });
    
    // Update description
    document.querySelector('.hospital-description').innerHTML = `
        <h4>About ${hospital.name}</h4>
        ${hospital.description.map(para => `<p>${para}</p>`).join('')}
    `;
    
    // Update quick facts
    const factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    
    hospital.facts.forEach(fact => {
        factsList.innerHTML += `
            <li>
                <span class="fact-label">${fact.label}</span>
                <span class="fact-value">${fact.value}</span>
            </li>
        `;
    });
    
    // Update services
    const servicesList = document.querySelector('.services-list');
    servicesList.innerHTML = '';
    
    hospital.services.forEach(service => {
        servicesList.innerHTML += `
            <li><i class="fas fa-check-circle"></i> ${service}</li>
        `;
    });
    
    // Update visiting hours
    const hoursList = document.querySelector('.hours-list');
    hoursList.innerHTML = '';
    
    hospital.hours.forEach(hours => {
        hoursList.innerHTML += `
            <li>
                <span class="hours-label">${hours.label}</span>
                <span class="hours-value">${hours.value}</span>
            </li>
        `;
    });
    
    // Update doctors
    const doctorsGrid = document.querySelector('.doctors-grid');
    doctorsGrid.innerHTML = '';
    
    hospital.doctors.forEach(doctor => {
        doctorsGrid.innerHTML += `
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
                            ${doctor.available ? 'Available Today' : 'Limited Availability'}
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
    
    // Update reviews
    const reviewsSummary = document.querySelector('.reviews-summary');
    reviewsSummary.innerHTML = `
        <div class="overall-rating">
            <div class="rating-number">${hospital.rating}</div>
            <div class="rating-stars">
                ${getStarRating(hospital.rating)}
                <span>${hospital.reviews} reviews</span>
            </div>
        </div>
        <div class="rating-bars">
            ${[5, 4, 3, 2, 1].map(stars => `
                <div class="rating-bar">
                    <span class="star-count">${stars} stars</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${hospital.ratingDistribution[stars - 1]}%;"></div>
                    </div>
                    <span class="percentage">${hospital.ratingDistribution[stars - 1]}%</span>
                </div>
            `).join('')}
        </div>
    `;
    
    const reviewsList = document.querySelector('.reviews-list');
    reviewsList.innerHTML = '';
    
    hospital.reviews.forEach(review => {
        reviewsList.innerHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer">
                        <img src="${review.image}" alt="${review.name}">
                        <div class="reviewer-info">
                            <h5>${review.name}</h5>
                            <div class="review-rating">
                                ${getStarRating(review.rating)}
                            </div>
                        </div>
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-content">
                    <h4>${review.title}</h4>
                    <p>${review.content}</p>
                </div>
            </div>
        `;
    });
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function getHospitalById(id) {
    // Sample hospital data - in a real app, this would come from an API
    const hospitals = [
        {
            id: '1',
            name: 'City General Hospital',
            rating: 5.0,
            reviews: 342,
            address: '123 Medical Center Drive, Medical City, MC 12345',
            phone: '(123) 456-7890',
            images: [
                'images/hospital1.jpg',
                'images/hospital1-thumb1.jpg',
                'images/hospital1-thumb2.jpg',
                'images/hospital1-thumb3.jpg'
            ],
            description: [
                'City General Hospital is a 450-bed acute care facility serving the Medical City area since 1952. We are a Level I Trauma Center and regional referral center for complex cases. Our hospital features state-of-the-art technology and a team of highly skilled physicians and nurses dedicated to providing exceptional patient care.',
                'We offer comprehensive services including emergency care, cardiac surgery, cancer treatment, women\'s services, pediatrics, orthopedics, and rehabilitation. Our hospital is consistently ranked among the top hospitals in the state for patient outcomes and satisfaction.'
            ],
            facts: [
                { label: 'Beds:', value: '450' },
                { label: 'ER Wait Time:', value: '25 minutes' },
                { label: 'Trauma Level:', value: 'Level I' },
                { label: 'Teaching Hospital:', value: 'Yes' },
                { label: 'Parking:', value: 'Free valet' }
            ],
            services: [
                '24/7 Emergency Department',
                'Level I Trauma Center',
                'Stroke Center',
                'Cardiac Emergency',
                'Pediatric Emergency'
            ],
            hours: [
                { label: 'General:', value: '8:00 AM - 8:00 PM' },
                { label: 'ICU:', value: '9:00 AM - 6:00 PM' },
                { label: 'Maternity:', value: '24 hours' }
            ],
            doctors: [
                {
                    name: 'Dr. Sarah Johnson',
                    specialty: 'Cardiology',
                    image: 'images/doctor1.jpg',
                    experience: '15 years',
                    rating: 4.9,
                    reviews: 127,
                    available: true
                },
                {
                    name: 'Dr. Michael Chen',
                    specialty: 'Emergency Medicine',
                    image: 'images/doctor2.jpg',
                    experience: '10 years',
                    rating: 4.8,
                    reviews: 94,
                    available: true
                },
                {
                    name: 'Dr. Lisa Rodriguez',
                    specialty: 'Pediatrics',
                    image: 'images/doctor3.jpg',
                    experience: '12 years',
                    rating: 4.9,
                    reviews: 156,
                    available: false
                }
            ],
            ratingDistribution: [85, 10, 3, 1, 1],
            reviews: [
                {
                    name: 'Robert Johnson',
                    image: 'images/testimonial1.jpg',
                    rating: 5,
                    date: '2 weeks ago',
                    title: 'Exceptional Emergency Care',
                    content: 'I was brought to City General after a car accident. The trauma team was waiting for me when I arrived and provided immediate, excellent care. The nurses were attentive and kind during my recovery. The facilities are modern and clean. I can\'t thank them enough for saving my life.'
                },
                {
                    name: 'Maria Garcia',
                    image: 'images/testimonial2.jpg',
                    rating: 5,
                    date: '1 month ago',
                    title: 'Wonderful Maternity Experience',
                    content: 'Delivered my baby here and couldn\'t have asked for a better experience. The maternity ward is beautiful and comfortable. The nurses were incredibly supportive during labor and postpartum. The lactation consultant was especially helpful. Highly recommend for expecting mothers!'
                },
                {
                    name: 'James Wilson',
                    image: 'images/testimonial3.jpg',
                    rating: 4.5,
                    date: '2 months ago',
                    title: 'Great Cardiac Care',
                    content: 'Had a heart attack and was rushed to City General. The cardiac team acted quickly and saved my life. The follow-up care has been excellent. My only complaint is that parking can be difficult during peak hours, but that\'s minor compared to the quality of care.'
                }
            ]
        },
        {
            id: '2',
            name: 'Children\'s Medical Center',
            rating: 4.7,
            reviews: 215,
            address: '456 Pediatric Way, Medical City, MC 12345',
            phone: '(123) 456-7891',
            images: [
                'images/hospital2.jpg',
                'images/hospital2-thumb1.jpg',
                'images/hospital2-thumb2.jpg',
                'images/hospital2-thumb3.jpg'
            ],
            description: [
                'Children\'s Medical Center is the region\'s premier pediatric hospital, providing comprehensive care for infants, children, and adolescents. Our child-friendly environment and specialized pediatric staff ensure that our young patients receive the best possible care in a comfortable setting.',
                'We offer a full range of pediatric services, including a Level II Pediatric Trauma Center, neonatal intensive care unit (NICU), pediatric intensive care unit (PICU), and specialized programs for children with chronic conditions.'
            ],
            facts: [
                { label: 'Beds:', value: '200' },
                { label: 'ER Wait Time:', value: '40 minutes' },
                { label: 'Trauma Level:', value: 'Level II Pediatric' },
                { label: 'Teaching Hospital:', value: 'Yes' },
                { label: 'Parking:', value: 'Validated parking' }
            ],
            services: [
                'Pediatric Emergency Department',
                'Level II Pediatric Trauma Center',
                'NICU',
                'PICU',
                'Child Life Specialists'
            ],
            hours: [
                { label: 'General:', value: '9:00 AM - 9:00 PM' },
                { label: 'ICU/NICU:', value: 'Parents 24 hours' },
                { label: 'Siblings:', value: '3:00 PM - 8:00 PM' }
            ],
            doctors: [
                {
                    name: 'Dr. Emily Parker',
                    specialty: 'Pediatric Cardiology',
                    image: 'images/doctor4.jpg',
                    experience: '9 years',
                    rating: 4.8,
                    reviews: 87,
                    available: true
                },
                {
                    name: 'Dr. David Kim',
                    specialty: 'Pediatric Surgery',
                    image: 'images/doctor5.jpg',
                    experience: '12 years',
                    rating: 4.7,
                    reviews: 92,
                    available: false
                }
            ],
            ratingDistribution: [75, 15, 5, 3, 2],
            reviews: [
                {
                    name: 'Jennifer Lee',
                    image: 'images/testimonial4.jpg',
                    rating: 5,
                    date: '3 weeks ago',
                    title: 'Amazing Care for My Son',
                    content: 'My 5-year-old son was hospitalized for pneumonia. The staff went above and beyond to make him comfortable. The child life specialists were incredible at explaining procedures in ways he could understand. The facilities are bright and welcoming for children.'
                },
                {
                    name: 'Thomas Brown',
                    image: 'images/testimonial5.jpg',
                    rating: 4,
                    date: '1 month ago',
                    title: 'Great NICU Experience',
                    content: 'Our premature baby spent 3 weeks in the NICU. The nurses and doctors were incredibly knowledgeable and compassionate. They made a difficult time much easier with their support and expertise. The only reason I\'m not giving 5 stars is because the parent sleeping accommodations could be more comfortable.'
                }
            ]
        }
    ];
    
    return hospitals.find(hospital => hospital.id === id);
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
            <div class="hospital-card">
                <div class="hospital-info">
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
    initHospitalsPage();
});