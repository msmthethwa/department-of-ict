// News data (in a real app, this would come from a database)
const newsItems = {
    1: {
        id: 1,
        title: "ICT Students Win National Coding Competition",
        category: "Achievement",
        date: "10 February 2025",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        content: `
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" class="news-modal-image" alt="ICT Students Win Hackathon">
            
            <div class="news-meta">
                <span class="news-category category-achievement">Achievement</span>
                <span class="news-date ms-2"><i class="far fa-calendar me-1"></i> 10 February 2025</span>
            </div>
            
            <h3>ICT Students Win National Coding Competition</h3>
            
            <div class="news-content">
                <p>A team of third-year ICT students from Mangosuthu University of Technology has won first place in the prestigious National Hackathon Competition held in Johannesburg last weekend. The team, consisting of Sipho Dlamini, Thandi Nkosi, and James Mbeki, impressed the judges with their innovative mobile application designed to improve healthcare access in rural areas.</p>
                
                <h4>The Winning Solution</h4>
                <p>Their application, called "RuralHealth Connect," uses AI-powered diagnostics and offline functionality to help community healthcare workers in areas with limited internet connectivity. The app includes features for:</p>
                <ul>
                    <li>Symptom checking with basic diagnostic suggestions</li>
                    <li>Offline medical reference library</li>
                    <li>Appointment scheduling that syncs when connectivity is available</li>
                    <li>Multilingual support for local languages</li>
                </ul>
                
                <img src="https://i.postimg.cc/G3swVP4z/Team-celebrating.png" alt="Team celebrating">
                <p class="text-muted text-center"><small>The winning team celebrating with their award</small></p>
                
                <h4>Competition Details</h4>
                <p>The competition, sponsored by major tech companies including Microsoft and MTN, saw participation from 32 universities across South Africa. Teams had 48 hours to develop a solution addressing one of several social challenges.</p>
                
                <p>"We're incredibly proud of our students," said Dr. Vikash Jugoo, Head of the ICT Department. "This win demonstrates the quality of education and practical skills our students gain at MUT."</p>
                
                <p>The team received a R50,000 cash prize and internship offers from several sponsoring companies. They will also represent South Africa at the African Innovation Challenge in Nairobi later this year.</p>
            </div>
        `,
        tags: ["Student Success", "Competition", "Mobile Development"]
    },
    2: {
        id: 2,
        title: "New Computer Lab Opening",
        category: "Announcement",
        date: "5 February 2025",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        content: `
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" class="news-modal-image" alt="New Computer Lab">
            
            <div class="news-meta">
                <span class="news-category category-announcement">Announcement</span>
                <span class="news-date ms-2"><i class="far fa-calendar me-1"></i> 5 February 2025</span>
            </div>
            
            <h3>New Computer Lab Opening</h3>
            
            <div class="news-content">
                <p>The Department of Information and Communication Technology is proud to announce the opening of our new state-of-the-art computer laboratory in the ICT Building. The lab was officially opened on 3 February 2025 by the Vice-Chancellor, Prof. Nomsa Khumalo.</p>
                
                <h4>Lab Features</h4>
                <p>The new facility includes:</p>
                <ul>
                    <li>40 high-performance workstations with dual monitors</li>
                    <li>Specialized software for programming, networking, and data analysis</li>
                    <li>Virtual reality development stations</li>
                    <li>Dedicated server room for networking practicals</li>
                    <li>Collaborative workspaces with interactive whiteboards</li>
                </ul>
                
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Lab interior">
                <p class="text-muted text-center"><small>The new lab features modern workstations and collaborative spaces</small></p>
                
                <h4>Access Information</h4>
                <p>The lab (Room ICT-205) will be available for:</p>
                <ul>
                    <li><strong>Teaching:</strong> Monday-Friday, 8am-4pm (scheduled classes)</li>
                    <li><strong>Open Access:</strong> Weekdays 4pm-8pm, Saturdays 9am-1pm</li>
                </ul>
                
                <p>Students must use their university ID cards for access. The lab will be staffed by senior students during open access hours.</p>
                
                <h4>Future Plans</h4>
                <p>This is the first of three planned lab upgrades this year, made possible by a partnership with Cisco Systems and the Department of Higher Education.</p>
            </div>
        `,
        tags: ["Facilities", "Upgrade"]
    },
    3: {
        id: 3,
        title: "Department Secures Major Research Grant",
        category: "Research",
        date: "25 January 2025",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        content: `
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" class="news-modal-image" alt="Research Grant">
            
            <div class="news-meta">
                <span class="news-category category-research">Research</span>
                <span class="news-date ms-2"><i class="far fa-calendar me-1"></i> 25 January 2025</span>
            </div>
            
            <h3>Department Secures R2.5 Million Research Grant</h3>
            
            <div class="news-content">
                <p>The ICT Department has been awarded a R2.5 million grant from the National Research Foundation for a three-year project titled "AI Applications in Rural Healthcare Diagnostics." This is the largest single research grant received by the department to date.</p>
                
                <h4>Project Overview</h4>
                <p>The research will focus on developing AI-powered diagnostic tools that can operate with limited internet connectivity and on low-cost mobile devices. Key objectives include:</p>
                <ul>
                    <li>Developing lightweight machine learning models for common diseases</li>
                    <li>Creating offline-capable diagnostic assistants</li>
                    <li>Training community healthcare workers in using the technology</li>
                    <li>Establishing a pilot program in rural KwaZulu-Natal</li>
                </ul>
                
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="AI in healthcare">
                <p class="text-muted text-center"><small>AI applications in healthcare will be the focus of the research</small></p>
                
                <h4>Research Team</h4>
                <p>The project will be led by Dr. Bethel Mutanga, with co-investigators from both the ICT and Health Sciences faculties. The team will include:</p>
                <ul>
                    <li>3 postdoctoral researchers</li>
                    <li>5 PhD students</li>
                    <li>8 MSc students</li>
                    <li>2 research assistants</li>
                </ul>
                
                <p>"This grant will allow us to make meaningful contributions to both AI research and healthcare accessibility," said Dr. Mutanga. "We're particularly excited about the opportunities it creates for our postgraduate students."</p>
                
                <h4>Partnerships</h4>
                <p>The project will collaborate with the KwaZulu-Natal Department of Health and several rural clinics. Industry partners include IBM South Africa and Telkom's innovation lab.</p>
            </div>
        `,
        tags: ["Research", "Funding", "AI"]
    },
    4: {
        id: 4,
        title: "Student Project Wins Innovation Award",
        category: "Achievement",
        date: "5 January 2025",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        content: `
            <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" class="news-modal-image" alt="Student Project">
            
            <div class="news-meta">
                <span class="news-category category-achievement">Achievement</span>
                <span class="news-date ms-2"><i class="far fa-calendar me-1"></i> 5 January 2025</span>
            </div>
            
            <h3>Student Project Wins Provincial Innovation Award</h3>
            
            <div class="news-content">
                <p>Final-year ICT student Lerato Molefe has won the KwaZulu-Natal Innovation Award in the Technology category for her project "VisionAssist," a wearable device that helps visually impaired individuals navigate indoor spaces.</p>
                
                <h4>The Innovation</h4>
                <p>VisionAssist combines several technologies to create an affordable navigation aid:</p>
                <ul>
                    <li>Ultrasonic sensors for obstacle detection</li>
                    <li>Haptic feedback for directional cues</li>
                    <li>Voice recognition for commands</li>
                    <li>Machine learning to identify common objects</li>
                </ul>
                
                <img src="https://i.postimg.cc/gJKdJ8Z1/Vision-Assist-prototype.png" alt="VisionAssist prototype">
                <p class="text-muted text-center"><small>The VisionAssist prototype being demonstrated</small></p>
                
                <h4>The Competition</h4>
                <p>The provincial innovation awards recognize outstanding technological solutions developed in KwaZulu-Natal. Lerato competed against 45 other entrants in the technology category.</p>
                
                <p>"What impressed the judges was how Lerato combined existing technologies in a novel way to address a real social need," said her supervisor, Dr. Liile Lekena-Bayaga. "Her solution costs less than 10% of comparable commercial devices."</p>
                
                <h4>Future Development</h4>
                <p>Lerato has received offers of support from several organizations to further develop VisionAssist, including:</p>
                <ul>
                    <li>R100,000 development grant from the Technology Innovation Agency</li>
                    <li>Incubation space at the Durban Innovation Hub</li>
                    <li>Mentorship from IBM's accessibility team</li>
                </ul>
                
                <p>"I'm excited to continue improving VisionAssist after graduation," said Lerato. "My goal is to make it available to as many people as possible at an affordable price."</p>
            </div>
        `,
        tags: ["Student Success", "Innovation"]
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up news modal triggers
    const newsModal = document.getElementById('newsModal');
    if (newsModal) {
        newsModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const newsId = button.getAttribute('data-news-id');
            loadNewsDetails(newsId);
        });
    }

    // Newsletter subscription
    document.getElementById('subscribeBtn').addEventListener('click', function() {
        const email = document.getElementById('newsletterEmail').value;
        const consented = document.getElementById('newsletterConsent').checked;
        
        if (email && consented) {
            alert('Thank you for subscribing to our newsletter!');
            document.getElementById('newsletterEmail').value = '';
            document.getElementById('newsletterConsent').checked = false;
        } else if (!email) {
            alert('Please enter your email address');
        } else {
            alert('Please agree to receive email updates');
        }
    });

    // Set up share buttons (would be properly implemented with real URLs)
    document.getElementById('shareFacebook').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would share on Facebook');
    });

    document.getElementById('shareTwitter').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would share on Twitter');
    });

    document.getElementById('shareLinkedIn').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would share on LinkedIn');
    });

    document.getElementById('shareWhatsApp').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would share via WhatsApp');
    });

    document.getElementById('shareEmail').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would share via email');
    });
});

// Load news details into modal
function loadNewsDetails(newsId) {
    const news = newsItems[newsId];
    const modalContent = document.getElementById('newsModalContent');
    
    if (news) {
        // Set modal title
        document.getElementById('newsModalLabel').textContent = news.title;
        
        // Build news details HTML
        modalContent.innerHTML = news.content;
        
        // Set up share buttons with current URL (in a real app)
        const currentUrl = window.location.href.split('?')[0] + '?news=' + newsId;
        const shareText = `Check out this news from MUT ICT Department: ${news.title}`;
        
        document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        document.getElementById('shareLinkedIn').href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(news.title)}`;
        document.getElementById('shareWhatsApp').href = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
        document.getElementById('shareEmail').href = `mailto:?subject=${encodeURIComponent(news.title)}&body=${encodeURIComponent(shareText + '\n\nRead more: ' + currentUrl)}`;
    } else {
        modalContent.innerHTML = '<div class="alert alert-danger">News item not found</div>';
    }
}