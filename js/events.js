// Event data (in a real app, this would come from a database)
const events = {
    1: {
        id: 1,
        title: "Annual ICT Career Fair 2025",
        type: "Career Fair",
        date: "15 August 2025",
        time: "09:00 - 16:00",
        location: "MUT Conference Center",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Meet top employers in the ICT industry and explore career opportunities. Over 30 companies will be recruiting for internships and full-time positions. This is your chance to network with industry professionals and learn about career paths in ICT.",
        speakers: [
            {
                name: "Dr. Vikash Jugoo",
                title: "Head of Department, ICT",
                bio: "Dr. Jugoo will open the career fair with insights about the current ICT job market.",
                image: "https://i.postimg.cc/nVN53vRx/Upscale-Image-3-20250709.png"
            },
            {
                name: "Dr. Nomsa Khumalo",
                title: "HR Director, MTN South Africa",
                bio: "Ms. Khumalo will share what MTN looks for in ICT graduates and interns.",
                image: "https://images.pexels.com/photos/14001756/pexels-photo-14001756.jpeg"
            }
        ],
        requiresRegistration: true,
        registrationDeadline: "13 August 2025",
        maxAttendees: 300,
        currentAttendees: 215,
        action: "register"
    },
    2: {
        id: 2,
        title: "Tech Innovation Workshop",
        type: "Workshop",
        date: "22 August 2025",
        time: "10:00 - 14:00",
        location: "ICT Building, Lab 3",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Hands-on workshop on emerging technologies in ICT including AI, blockchain and IoT applications. Participants will get practical experience with these technologies through guided exercises and real-world case studies.",
        speakers: [
            {
                name: "Dr. Bethel Mutanga",
                title: "Senior Lecturer, ICT Department",
                bio: "Expert in artificial intelligence and machine learning applications.",
                image: "https://i.postimg.cc/3wK6WqHB/Upscale-Image-5-20250709.png"
            },
            {
                name: "Mr. Sipho Dlamini",
                title: "Solutions Architect, Microsoft SA",
                bio: "Specializes in cloud computing and blockchain solutions.",
                image: "https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg"
            }
        ],
        requiresRegistration: true,
        registrationDeadline: "20 August 2025",
        maxAttendees: 30,
        currentAttendees: 25,
        action: "register"
    },
    3: {
        id: 3,
        title: "Guest Lecture: AI in Business",
        type: "Seminar",
        date: "5 September 2025",
        time: "13:00 - 15:00",
        location: "Lecture Hall B",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Industry expert discusses practical applications of AI in South African business contexts. Learn how local companies are implementing AI solutions to improve operations, customer service, and decision-making.",
        speakers: [
            {
                name: "Dr. Liile Lerato Lekena-Bayaga",
                title: "CTO, AI Solutions Africa",
                bio: "Pioneer in implementing AI solutions for African businesses.",
                image: "https://i.postimg.cc/xTG3qy3j/Upscale-Image-6-20250709.png"
            }
        ],
        requiresRegistration: false,
        action: "details"
    },
    4: {
        id: 4,
        title: "MUT Annual Hackathon",
        type: "Competition",
        date: "12-14 September 2025",
        time: "09:00 Saturday - 17:00 Sunday",
        location: "ICT Innovation Hub",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "48-hour coding competition with prizes for the most innovative solutions to real-world problems. Teams will work to create solutions addressing challenges provided by our industry partners. Food and drinks will be provided throughout the event.",
        speakers: [],
        requiresRegistration: true,
        registrationDeadline: "5 September 2025",
        maxTeams: 15,
        currentTeams: 10,
        teamSize: "3-5 members",
        prizes: "1st Prize: R15,000 | 2nd Prize: R10,000 | 3rd Prize: R5,000",
        action: "register"
    },
    5: {
        id: 5,
        title: "ICT Alumni Networking Mixer",
        type: "Networking",
        date: "20 September 2025",
        time: "17:00 - 20:00",
        location: "University Club",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Connect with successful ICT alumni and expand your professional network. This informal gathering is a great opportunity to meet graduates who are now working in various ICT roles across different industries.",
        speakers: [],
        requiresRegistration: true,
        registrationDeadline: "18 September 2025",
        maxAttendees: 100,
        currentAttendees: 65,
        action: "rsvp"
    },
    6: {
        id: 6,
        title: "Digital Transformation Conference",
        type: "Conference",
        date: "5-7 October 2025",
        time: "08:30 - 17:00 daily",
        location: "Durban International Convention Center",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Three-day conference featuring industry leaders discussing digital transformation strategies. This event will cover topics including cloud migration, data analytics, cybersecurity in the digital age, and building agile organizations.",
        speakers: [
            {
                name: "Mr. James Mbeki",
                title: "Digital Transformation Dlamini, Deloitte Africa",
                bio: "Helping organizations navigate their digital transformation journeys.",
                image: "https://images.pexels.com/photos/13346200/pexels-photo-13346200.jpeg"
            },
            {
                name: "Ms. Thandi Nkosi",
                title: "CIO, Standard Bank SA",
                bio: "Leading one of Africa's largest digital banking transformations.",
                image: "https://images.pexels.com/photos/32772987/pexels-photo-32772987.jpeg"
            }
        ],
        requiresRegistration: true,
        registrationDeadline: "25 September 2025",
        earlyBirdDeadline: "15 September 2025",
        earlyBirdPrice: "R1,200",
        standardPrice: "R1,800",
        studentPrice: "R600",
        action: "register"
    },
    7: {
        id: 7,
        title: "Cloud Computing Workshop",
        type: "Workshop",
        date: "15 October 2025",
        time: "09:00 - 13:00",
        location: "ICT Building, Lab 2",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Hands-on training on AWS and Azure cloud platforms with practical case studies. Participants will learn how to deploy applications, configure cloud services, and implement basic security measures in both platforms.",
        speakers: [
            {
                name: "Mr. Sipho Dlamini",
                title: "Solutions Architect, Microsoft SA",
                bio: "Specializes in cloud computing and blockchain solutions.",
                image: "https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg"
            },
            {
                name: "Ms. Priya Singh",
                title: "Cloud Engineer, Amazon Web Services",
                bio: "Focuses on helping startups leverage AWS services.",
                image: "https://images.pexels.com/photos/23859402/pexels-photo-23859402.jpeg"
            }
        ],
        requiresRegistration: true,
        registrationDeadline: "13 October 2025",
        maxAttendees: 25,
        currentAttendees: 18,
        prerequisites: "Basic understanding of networking and web applications",
        action: "register"
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up event modal triggers
    const eventModal = document.getElementById('eventModal');
    if (eventModal) {
        eventModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const eventId = button.getAttribute('data-event-id');
            loadEventDetails(eventId);
        });
    }

    // Set up dietary requirements toggle
    document.getElementById('dietary').addEventListener('change', function() {
        const otherInput = document.getElementById('dietaryOther');
        if (this.value === 'other') {
            otherInput.classList.remove('d-none');
        } else {
            otherInput.classList.add('d-none');
        }
    });

    // Set up registration form submission
    document.getElementById('submitRegistration').addEventListener('click', function() {
        submitRegistrationForm();
    });

    // Set up RSVP form submission
    document.getElementById('submitRSVP').addEventListener('click', function() {
        submitRSVPForm();
    });

    // Set up event action button in modal
    document.getElementById('eventActionButton').addEventListener('click', function() {
        const eventId = this.getAttribute('data-event-id');
        const event = events[eventId];
        
        if (event.action === 'register') {
            showRegistrationModal(event);
        } else if (event.action === 'rsvp') {
            showRSVPModal(event);
        } else {
            // For events that just show details
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        }
    });
});

// Load event details into modal
function loadEventDetails(eventId) {
    const event = events[eventId];
    const modalContent = document.getElementById('eventModalContent');
    const actionButton = document.getElementById('eventActionButton');
    
    // Set action button text and data attribute
    actionButton.setAttribute('data-event-id', eventId);
    
    if (event.action === 'register') {
        actionButton.textContent = 'Register Now';
        if (event.currentAttendees >= event.maxAttendees) {
            actionButton.textContent = 'Waitlist';
        }
    } else if (event.action === 'rsvp') {
        actionButton.textContent = 'RSVP Now';
    } else {
        actionButton.textContent = 'Close';
    }
    
    // Build event details HTML
    let html = `
        <img src="${event.image}" class="event-modal-image" alt="${event.title}">
        <h4>${event.title}</h4>
        <ul class="event-details-list">
            <li><i class="far fa-calendar"></i> <strong>Date:</strong> ${event.date}</li>
            <li><i class="far fa-clock"></i> <strong>Time:</strong> ${event.time}</li>
            <li><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${event.location}</li>
            <li><i class="fas fa-tag"></i> <strong>Type:</strong> <span class="event-category ${getCategoryClass(event.type)}">${event.type}</span></li>
        </ul>
        
        <h5 class="mt-4">Event Description</h5>
        <p>${event.description}</p>
    `;
    
    // Add registration info if required
    if (event.requiresRegistration) {
        html += `
            <div class="alert ${event.currentAttendees < event.maxAttendees ? 'alert-success' : 'alert-warning'} mt-4">
                <i class="fas fa-users"></i> <strong>Registration:</strong> 
                ${event.currentAttendees < event.maxAttendees ? 
                    `${event.maxAttendees - event.currentAttendees} spots remaining` : 
                    'Event is full - join waitlist'}
            </div>
        `;
        
        if (event.registrationDeadline) {
            html += `
                <p><i class="far fa-calendar-times"></i> <strong>Registration deadline:</strong> ${event.registrationDeadline}</p>
            `;
        }
        
        if (event.earlyBirdPrice) {
            html += `
                <div class="alert alert-info mt-3">
                    <i class="fas fa-tag"></i> <strong>Pricing:</strong><br>
                    Early Bird (before ${event.earlyBirdDeadline}): R${event.earlyBirdPrice}<br>
                    Standard: R${event.standardPrice}<br>
                    Student: R${event.studentPrice}
                </div>
            `;
        }
    }
    
    // Add speakers if available
    if (event.speakers && event.speakers.length > 0) {
        html += `<h5 class="mt-4">Featured Speakers</h5>`;
        
        event.speakers.forEach(speaker => {
            html += `
                <div class="speaker-card d-flex mt-3">
                    <img src="${speaker.image}" alt="${speaker.name}" class="speaker-image">
                    <div>
                        <h6>${speaker.name}</h6>
                        <p class="text-muted">${speaker.title}</p>
                        <p>${speaker.bio}</p>
                    </div>
                </div>
            `;
        });
    }
    
    // Add additional event-specific information
    if (event.teamSize) {
        html += `<p><i class="fas fa-users"></i> <strong>Team size:</strong> ${event.teamSize}</p>`;
    }
    
    if (event.prizes) {
        html += `<p><i class="fas fa-trophy"></i> <strong>Prizes:</strong> ${event.prizes}</p>`;
    }
    
    if (event.prerequisites) {
        html += `
            <div class="alert alert-secondary mt-3">
                <i class="fas fa-info-circle"></i> <strong>Prerequisites:</strong> ${event.prerequisites}
            </div>
        `;
    }
    
    modalContent.innerHTML = html;
}

// Show registration modal
function showRegistrationModal(event) {
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    document.getElementById('registrationEventTitle').textContent = event.title;
    document.getElementById('registrationEventDate').textContent = `${event.date} | ${event.time}`;
    
    // Reset form
    document.getElementById('registrationForm').reset();
    document.getElementById('dietaryOther').classList.add('d-none');
    
    modal.show();
}

// Show RSVP modal
function showRSVPModal(event) {
    const modal = new bootstrap.Modal(document.getElementById('rsvpModal'));
    document.getElementById('rsvpEventTitle').textContent = event.title;
    document.getElementById('rsvpEventDate').textContent = `${event.date} | ${event.time}`;
    
    // Reset form
    document.getElementById('rsvpForm').reset();
    
    modal.show();
}

// Submit registration form
function submitRegistrationForm() {
    // In a real application, this would send data to a server
    // Here we just show a confirmation
    
    const eventTitle = document.getElementById('registrationEventTitle').textContent;
    
    // Hide registration modal
    bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
    
    // Show confirmation
    document.getElementById('confirmationMessage').textContent = 'Your registration has been received!';
    document.getElementById('confirmationDetails').textContent = `You are registered for "${eventTitle}". You will receive a confirmation email shortly with event details.`;
    
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
}

// Submit RSVP form
function submitRSVPForm() {
    // In a real application, this would send data to a server
    // Here we just show a confirmation
    
    const eventTitle = document.getElementById('rsvpEventTitle').textContent;
    const attending = document.querySelector('input[name="attendance"]:checked').value;
    
    // Hide RSVP modal
    bootstrap.Modal.getInstance(document.getElementById('rsvpModal')).hide();
    
    // Show appropriate confirmation message
    if (attending === 'yes') {
        document.getElementById('confirmationMessage').textContent = 'Thank you for your RSVP!';
        document.getElementById('confirmationDetails').textContent = `We look forward to seeing you at "${eventTitle}".`;
    } else {
        document.getElementById('confirmationMessage').textContent = 'We\'ll miss you!';
        document.getElementById('confirmationDetails').textContent = `Your response has been recorded for "${eventTitle}".`;
    }
    
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
}

// Helper function to get category CSS class
function getCategoryClass(type) {
    switch(type.toLowerCase()) {
        case 'workshop': return 'category-workshop';
        case 'seminar': return 'category-seminar';
        case 'conference': return 'category-conference';
        case 'career fair': return 'category-social';
        case 'networking': return 'category-social';
        default: return '';
    }
}