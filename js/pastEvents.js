// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Year filter buttons
    const yearButtons = document.querySelectorAll('.year-btn');
    yearButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            yearButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real application, this would filter the events
            console.log('Filtering by year:', this.textContent);
        });
    });
    
    // Event type filter
    document.getElementById('eventType').addEventListener('change', function() {
        console.log('Filtering by event type:', this.value);
    });
    
    // Keyword search
    document.getElementById('keywordSearch').addEventListener('input', function() {
        console.log('Searching for:', this.value);
    });
    
    // Apply filters button
    document.querySelector('.event-filter button[type="submit"]').addEventListener('click', function(e) {
        e.preventDefault();
        const year = document.querySelector('.year-btn.active').textContent;
        const type = document.getElementById('eventType').value;
        const keyword = document.getElementById('keywordSearch').value;
        
        console.log('Applying filters:', { year, type, keyword });
        // In a real application, this would make an API call or filter the displayed events
    });
    
    // Reset filters button
    document.querySelector('.event-filter button[type="reset"]').addEventListener('click', function() {
        // Reset year filter to "All Years"
        yearButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.year-btn:first-child').classList.add('active');
        
        // Reset other filters
        document.getElementById('eventType').value = '';
        document.getElementById('keywordSearch').value = '';
        
        console.log('Filters reset');
        // In a real application, this would reset the displayed events
    });
});