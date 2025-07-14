// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
    });
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    this.reset();
});

// Simple animation for contact cards
document.addEventListener('DOMContentLoaded', function() {
    const contactCards = document.querySelectorAll('.contact-person-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
    });
});