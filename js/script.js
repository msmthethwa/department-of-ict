// Activate tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Simple event calendar (would be replaced with real implementation)
document.addEventListener('DOMContentLoaded', function() {
    // This would be replaced with actual event fetching code
    console.log('Page loaded - event calendar would be initialized here');
    
    // Program modal enhancement
    const programModals = document.querySelectorAll('.program-card .btn-mut');
    programModals.forEach(button => {
        button.addEventListener('click', function() {
            // Track program interest (analytics would go here)
            console.log('User interested in program: ' + this.closest('.program-card').querySelector('.card-header h5').textContent);
        });
    });
});