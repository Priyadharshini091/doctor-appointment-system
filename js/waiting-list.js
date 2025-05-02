// Patient Waiting List Functionality
function initWaitingList() {
    const waitingListForm = document.getElementById('waiting-list-check');
    const waitingListResult = document.getElementById('waiting-list-result');
    
    if (waitingListForm && waitingListResult) {
        waitingListForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const appointmentId = document.getElementById('appointment-id').value.trim();
            
            if (!appointmentId) {
                waitingListResult.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Please enter your appointment ID</p>
                    </div>
                `;
                return;
            }
            
            // Show loading state
            waitingListResult.innerHTML = '<div class="loading">Checking your status...</div>';
            
            // Simulate API call
            setTimeout(() => {
                // In a real app, this would check against a database
                const status = getWaitingStatus(appointmentId);
                displayWaitingStatus(status);
            }, 1500);
        });
    }
}

function getWaitingStatus(appointmentId) {
    // Sample data - in a real app, this would come from an API
    // For demo purposes, we'll return different statuses based on the ID
    
    // Check if the ID matches a pattern for different statuses
    if (/123/.test(appointmentId)) {
        return {
            valid: true,
            position: 3,
            estimatedTime: '15-20 minutes',
            doctor: 'Dr. Sarah Johnson',
            appointmentTime: '2:00 PM'
        };
    } else if (/456/.test(appointmentId)) {
        return {
            valid: true,
            position: 1,
            estimatedTime: '5-10 minutes',
            doctor: 'Dr. Michael Chen',
            appointmentTime: '3:30 PM'
        };
    } else if (/789/.test(appointmentId)) {
        return {
            valid: true,
            position: 8,
            estimatedTime: '30-40 minutes',
            doctor: 'Dr. Lisa Rodriguez',
            appointmentTime: '10:00 AM'
        };
    } else {
        return {
            valid: false
        };
    }
}

function displayWaitingStatus(status) {
    const waitingListResult = document.getElementById('waiting-list-result');
    
    if (!status.valid) {
        waitingListResult.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Appointment ID not found. Please check and try again.</p>
            </div>
        `;
        return;
    }
    
    waitingListResult.innerHTML = `
        <div class="waiting-status">
            <div class="position">${status.position}</div>
            <div class="label">Patients ahead of you</div>
            <div class="estimated-time">
                <i class="fas fa-clock"></i> Estimated wait: ${status.estimatedTime}
            </div>
            <div class="doctor-info">
                <p><strong>Doctor:</strong> ${status.doctor}</p>
                <p><strong>Scheduled Time:</strong> ${status.appointmentTime}</p>
            </div>
            <div class="status-actions">
                <button class="btn btn-primary">Check In Remotely</button>
                <button class="btn btn-outline">Get Directions</button>
            </div>
            <div class="status-note">
                <i class="fas fa-info-circle"></i>
                <p>Your position may change based on urgent cases</p>
            </div>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWaitingList();
});