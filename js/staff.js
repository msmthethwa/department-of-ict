// Global variable to hold staff data fetched from Firestore
let staffData = [];

// Fetch staff data from Firestore
async function fetchStaffData() {
    try {
        // Fetch departments to map IDs to names
        const departmentsCol = window.db.collection("departments");
        const departmentsSnapshot = await departmentsCol.get();
        const departmentMap = {};
        departmentsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            departmentMap[doc.id] = data.name || "";
        });

        const staffCol = window.db.collection("staff");
        const staffSnapshot = await staffCol.get();
        const staffList = staffSnapshot.docs.map(doc => {
            const data = doc.data();
        return {
            id: doc.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            title: data.title || "",
            position: data.position || "",
            // Replace department ID with department name
            department: departmentMap[data.department] || data.department || "",
            email: data.email || "",
            phone: data.phone || "",
            office: data.office || "",
            image: data.image || "",
            expertise: data.expertise || [],
            bio: data.bio || "",
            education: data.education || [],
            publications: data.publications || [],
            courses: data.courses || [],
            social: data.social || {},
            responsibilities: data.keyResponsibilities || [],
            staffType: data.type || ""
        };
        });
        staffData = staffList;
        displayStaff(staffData);
        setupPagination(staffData);
    } catch (error) {
        console.error("Error fetching staff data:", error);
        const staffContainer = document.getElementById('staffContainer');
        staffContainer.innerHTML = '<p class="text-danger">Failed to load staff data. Please try again later.</p>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetchStaffData();
    setupEventListeners();
});

// Display staff members
function displayStaff(staffList) {
    const staffContainer = document.getElementById('staffContainer');
    staffContainer.innerHTML = '';
    
    // Group by position type
    const academicStaff = staffList.filter(staff => 
        staff.position.includes('Professor') || 
        staff.position.includes('Lecturer') || 
        staff.position.includes('Head of Department')
    );
    
    const adminStaff = staffList.filter(staff => 
        staff.position.includes('Administrator') || 
        staff.position.includes('Technician') || 
        staff.position.includes('Secretary')
    );
    
    // Display academic staff first
        if (academicStaff.length > 0) {
            const academicHeader = document.createElement('div');
            academicHeader.className = 'col-12';
            academicHeader.innerHTML = '<h3 class="mb-4"><i class="fas fa-graduation-cap text-custom me-2"></i> Academic Staff</h3>';
            staffContainer.appendChild(academicHeader);
            
            academicStaff.forEach(staff => {
                staffContainer.appendChild(createStaffCard(staff));
            });
        }
        
        // Then display admin staff
        if (adminStaff.length > 0) {
            const adminHeader = document.createElement('div');
            adminHeader.className = 'col-12 mt-5';
            adminHeader.innerHTML = '<h3 class="mb-4"><i class="fas fa-user-tie text-custom me-2"></i> Administrative & Technical Staff</h3>';
            staffContainer.appendChild(adminHeader);
            
            adminStaff.forEach(staff => {
                staffContainer.appendChild(createStaffCard(staff));
            });
        }
}

// Create a staff card element
function createStaffCard(staff) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card staff-card';
    card.dataset.staffId = staff.id;
    
    const img = document.createElement('img');
    img.src = staff.image;
    img.className = 'card-img-top mx-auto mt-3';
    img.alt = `${staff.title} ${staff.firstName} ${staff.lastName}`;
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-center';
    
    const name = document.createElement('h5');
    name.className = 'card-title';
    name.textContent = `${staff.title} ${staff.firstName} ${staff.lastName}`;
    
    const position = document.createElement('p');
    position.className = 'staff-position';
    position.textContent = staff.position;
    
    const department = document.createElement('p');
    department.className = 'staff-department';
    department.textContent = staff.department;
    
    const contact = document.createElement('div');
    contact.className = 'staff-contact';
    contact.innerHTML = `
        <p><i class="fas fa-envelope me-2"></i> ${staff.email}</p>
        <p><i class="fas fa-phone me-2"></i> ${staff.phone}</p>
        <p><i class="fas fa-building me-2"></i> ${staff.office}</p>
    `;
    
    const expertise = document.createElement('div');
    expertise.className = 'staff-expertise';
    staff.expertise.forEach(exp => {
        const badge = document.createElement('span');
        badge.className = 'expertise-badge';
        badge.textContent = exp;
        expertise.appendChild(badge);
    });
    
    const viewProfileBtn = document.createElement('a');
    viewProfileBtn.href = '#';
    viewProfileBtn.className = 'btn btn-mut mt-3 view-profile-btn';
    viewProfileBtn.textContent = 'View Profile';
    viewProfileBtn.dataset.staffId = staff.id;
    
    cardBody.appendChild(img);
    cardBody.appendChild(name);
    cardBody.appendChild(position);
    cardBody.appendChild(department);
    cardBody.appendChild(contact);
    cardBody.appendChild(expertise);
    cardBody.appendChild(viewProfileBtn);
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

// Set up pagination
function setupPagination(staffList) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';
    
    // In a real app, you would calculate pages based on total staff count
    // For this demo, we'll just show a simple pagination
    const paginationHTML = `
        <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
            <a class="page-link" href="#">Next</a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Set up event listeners
function setupEventListeners() {
    // Alphabet filter
    document.querySelectorAll('.alphabet-filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const letter = this.dataset.letter;
            
            // Update active state
            document.querySelectorAll('.alphabet-filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter staff
            if (letter === 'all') {
                displayStaff(staffData);
            } else {
                const filteredStaff = staffData.filter(staff => 
                    staff.lastName.toLowerCase().startsWith(letter)
                );
                displayStaff(filteredStaff);
            }
        });
    });
    
    // Position filter
    document.getElementById('positionFilter').addEventListener('change', function() {
        const position = this.value;
        
        if (position === 'all') {
            displayStaff(staffData);
        } else {
            let filteredStaff = [];
            
            switch(position) {
                case 'hod':
                    filteredStaff = staffData.filter(staff => 
                        staff.position.includes('Head of Department')
                    );
                    break;
                case 'senior':
                    filteredStaff = staffData.filter(staff => 
                        staff.position.includes('Senior Lecturer') || 
                        staff.position.includes('Associate Professor')
                    );
                    break;
                case 'lecturer':
                    filteredStaff = staffData.filter(staff => 
                        staff.position.includes('Lecturer') && 
                        !staff.position.includes('Senior')
                    );
                    break;
                case 'admin':
                    filteredStaff = staffData.filter(staff => 
                        staff.position.includes('Administrator') || 
                        staff.position.includes('Secretary')
                    );
                    break;
                case 'technical':
                    filteredStaff = staffData.filter(staff => 
                        staff.position.includes('Technician')
                    );
                    break;
            }
            
            displayStaff(filteredStaff);
        }
    });
    
    // Search functionality
    document.getElementById('staffSearchBtn').addEventListener('click', performSearch);
    document.getElementById('staffSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // View profile buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-profile-btn')) {
            e.preventDefault();
            const staffId = e.target.dataset.staffId;
            const staffMember = staffData.find(staff => staff.id === staffId);
            showProfileModal(staffMember);
        }
    });
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('staffSearchInput').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayStaff(staffData);
        return;
    }
    
    const filteredStaff = staffData.filter(staff => 
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm) ||
        staff.position.toLowerCase().includes(searchTerm) ||
        staff.expertise.some(exp => exp.toLowerCase().includes(searchTerm))
    );
    
    displayStaff(filteredStaff);
}

// Show profile in modal
function showProfileModal(staff) {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    const modalBody = document.getElementById('profileModalBody');
    const fullProfileLink = document.getElementById('fullProfileLink');
    
    // Set modal title
    document.getElementById('profileModalLabel').textContent = 
        `${staff.title} ${staff.firstName} ${staff.lastName}`;
    
    // Build modal content
    let modalContent = `
        <div class="text-center">
            <img src="${staff.image}" class="profile-modal-img" alt="${staff.title} ${staff.firstName} ${staff.lastName}">
            <h4>${staff.title} ${staff.firstName} ${staff.lastName}</h4>
            <p class="text-mut-secondary fw-bold">${staff.position}</p>
            <p>${staff.department}</p>
            
            <div class="profile-social-links">
    `;
    
    // Add social links if available
    if (staff.social) {
        if (staff.social.linkedin) {
            modalContent += `<a href="${staff.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>`;
        }
        if (staff.social.twitter) {
            modalContent += `<a href="${staff.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`;
        }
        if (staff.social.researchgate) {
            modalContent += `<a href="${staff.social.researchgate}" target="_blank"><i class="fab fa-researchgate"></i></a>`;
        }
        if (staff.social.googleScholar) {
            modalContent += `<a href="${staff.social.googleScholar}" target="_blank"><i class="fas fa-graduation-cap"></i></a>`;
        }
    }
    
    modalContent += `</div></div>`;
    
    // Bio section
    modalContent += `
        <div class="profile-section">
            <h5 class="profile-section-title">Biography</h5>
            <p class="profile-bio">${staff.bio}</p>
        </div>
    `;
    
    // Contact info
    modalContent += `
        <div class="row">
            <div class="col-md-6">
                <div class="profile-section">
                    <h5 class="profile-section-title">Contact Information</h5>
                    <p><i class="fas fa-envelope me-2"></i> ${staff.email}</p>
                    <p><i class="fas fa-phone me-2"></i> ${staff.phone}</p>
                    <p><i class="fas fa-building me-2"></i> ${staff.office}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="profile-section">
                    <h5 class="profile-section-title">Areas of Expertise</h5>
                    <div>
    `;
    
    staff.expertise.forEach(exp => {
        modalContent += `<span class="expertise-badge">${exp}</span> `;
    });
    
    modalContent += `</div></div></div></div>`;
    
    // Education section (for academic staff)
    if (staff.education) {
        modalContent += `
            <div class="profile-section">
                <h5 class="profile-section-title">Education</h5>
                <ul>
        `;
        
        staff.education.forEach(edu => {
            modalContent += `<li>${edu}</li>`;
        });
        
        modalContent += `</ul></div>`;
    }
    
    // Responsibilities section (for admin staff)
    if (staff.staffType === 'admin' && staff.responsibilities) {
        modalContent += `
            <div class="profile-section">
                <h5 class="profile-section-title">Key Responsibilities</h5>
                <ul>
        `;
        
        staff.responsibilities.forEach(resp => {
            modalContent += `<li>${resp}</li>`;
        });
        
        modalContent += `</ul></div>`;
    }
    
    // Courses section (for academic and technical staff)
    if ((staff.staffType === 'academic' || staff.staffType === 'technical') && staff.courses) {
        modalContent += `
            <div class="profile-section">
                <h5 class="profile-section-title">Courses Taught</h5>
                <ul>
        `;
        
        staff.courses.forEach(course => {
            modalContent += `<li>${course}</li>`;
        });
        
        modalContent += `</ul></div>`;
    }
    
    // Publications section (for academic and technical staff)
    if ((staff.staffType === 'academic' || staff.staffType === 'technical') && staff.publications) {
        modalContent += `
            <div class="profile-section">
                <h5 class="profile-section-title">Selected Publications</h5>
                <ul>
        `;
        
        staff.publications.forEach(pub => {
            modalContent += `<li>${pub}</li>`;
        });
        
        modalContent += `</ul></div>`;
    }
    
    modalBody.innerHTML = modalContent;
    // fullProfileLink.href = `staff-profile.html?id=${staff.id}`;
    modal.show();
}
