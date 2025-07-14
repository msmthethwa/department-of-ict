// DOM elements
const loginPage = document.getElementById('loginPage');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const adminEmailDisplay = document.getElementById('adminEmailDisplay');
const pageTitle = document.getElementById('pageTitle');
const pageContent = document.getElementById('pageContent');
const toggleRegister = document.getElementById('toggleRegister');
const registerFormContainer = document.getElementById('registerFormContainer');
const registerForm = document.getElementById('registerForm');
const cancelRegister = document.getElementById('cancelRegister');
const staffSidebarBtn = document.getElementById('staffSidebarBtn');
const eventsSidebarBtn = document.querySelector('a[href="events.html"]');
const newsSidebarBtn = document.getElementById('newsSidebarBtn');
const timetableSidebarBtn = document.getElementById('timetableSidebarBtn');
const partnershipsSidebarBtn = document.getElementById('partnershipsSidebarBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            // Check if user is an admin
            db.collection('adminUsers').doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        // User is signed in and is an admin
                        loginPage.style.display = 'none';
                        adminDashboard.style.display = 'block';
                        adminEmailDisplay.textContent = user.email;
                        updatePageTitle();
                        initializeDashboardCharts();
                    } else {
                        // User is not an admin
                        auth.signOut();
                        showToast('You do not have admin privileges', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Error checking admin status:', error);
                    auth.signOut();
                    showToast('Error verifying admin status', 'danger');
                });
        } else {
            // User is signed out
            loginPage.style.display = 'block';
            adminDashboard.style.display = 'none';
            registerFormContainer.style.display = 'none';
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                // Success - handled by auth state listener
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    });

    // Logout button
    logoutBtn.addEventListener('click', function() {
        auth.signOut();
    });

    // Dropdown logout button
    dropdownLogoutBtn.addEventListener('click', function() {
        auth.signOut();
    });

    // Sidebar toggle for mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });

    // Toggle between login and register forms
    toggleRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginPage.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    cancelRegister.addEventListener('click', function() {
        registerFormContainer.style.display = 'none';
        loginPage.style.display = 'block';
    });

    // Staff sidebar button
    if (staffSidebarBtn) {
        staffSidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadStaffContent();
        });
    }

    // Events sidebar button
    if (eventsSidebarBtn) {
        eventsSidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadEventsContent();
        });
    }

    // News sidebar button
    if (newsSidebarBtn) {
        newsSidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadNewsContent();
        });
    }

    // Timetable sidebar button
    if (timetableSidebarBtn) {
        timetableSidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadTimetableContent();
        });
    }

// Partnerships sidebar button
if (partnershipsSidebarBtn) {
    partnershipsSidebarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loadPartnershipsContent();
    });
}

// Contact sidebar button
const contactSidebarBtn = document.getElementById('contactSidebarBtn');
    if (contactSidebarBtn) {
        contactSidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContactContent();
        });
    }
});

// Function to load contact content dynamically
function loadContactContent() {
    fetch('contact-content.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load contact content');
            }
            return response.text();
        })
        .then(html => {
            // Extract content inside <body> tag
            const bodyContentMatch = html.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im);
            const bodyContent = bodyContentMatch ? bodyContentMatch[1] : html;

            // Inject contact content into pageContent div
            pageContent.innerHTML = bodyContent;

            // Update page title and icon
            pageTitle.innerHTML = '<i class="fas fa-envelope me-2"></i> Contact';

            // Initialize contact admin functionality
            if (typeof initializeContactAdmin === 'function') {
                initializeContactAdmin();
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Error loading contact content', 'danger');
        });
    }

    // Update page title based on current page
    function updatePageTitle() {
    const path = window.location.pathname;
    const page = path.split("/").pop().replace('.html', '');

    let title = 'Dashboard';
    let icon = 'fa-tachometer-alt';

    switch(page) {
        case 'staff':
            title = 'Staff Management';
            icon = 'fa-users';
            break;
        case 'timetable':
            title = 'Timetable';
            icon = 'fa-calendar-alt';
            break;
        case 'news':
            title = 'News';
            icon = 'fa-newspaper';
            break;
        case 'events':
            title = 'Events';
            icon = 'fa-calendar-day';
            break;
        case 'partnerships':
            title = 'Partnerships';
            icon = 'fa-handshake';
            break;
        case 'contact':
            title = 'Contact';
            icon = 'fa-envelope';
            break;
    }

    pageTitle.innerHTML = `<i class="fas ${icon} me-2"></i> ${title}`;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        // In a real implementation, you would use a toast library or create your own
        alert(`${type.toUpperCase()}: ${message}`);
    }

    // Function to load staff content dynamically
    function loadStaffContent() {
    fetch('staff-content.html')
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load staff content');
        }
        return response.text();
    })
    .then(html => {
    // Inject staff content into pageContent div
    pageContent.innerHTML = html;
    console.log('Staff content loaded and injected into pageContent');

    // Update page title and icon
    pageTitle.innerHTML = '<i class="fas fa-users me-2"></i> Staff Management';

    // Initialize staff management functionality after DOM update
    if (typeof initializeAdminDashboard === 'function') {
        console.log('Calling initializeAdminDashboard() after DOM update');
        setTimeout(() => {
            initializeAdminDashboard();
        }, 0);
    }
    })
    .catch(error => {
    console.error(error);
    showToast('Error loading staff content', 'danger');
    });
}

// Function to load events content dynamically
function loadEventsContent() {
    fetch('events-content.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load events content');
            }
            return response.text();
        })
        .then(html => {
            // Inject events content into pageContent div
            pageContent.innerHTML = html;
            
            // Update page title and icon
            pageTitle.innerHTML = '<i class="fas fa-calendar-day me-2"></i> Events';

            // Initialize events management functionality
            if (typeof initializeAdminDashboard === 'function') {
                initializeAdminDashboard();
                console.log('initializeAdminDashboard called after loading events-content.html');
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Error loading events content', 'danger');
        });
}

// Function to load news content dynamically
function loadNewsContent() {
    fetch('news-content.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load news content');
            }
            return response.text();
        })
        .then(html => {
            // Inject news content into pageContent div
            pageContent.innerHTML = html;

            // Update page title and icon
            pageTitle.innerHTML = '<i class="fas fa-newspaper me-2"></i> News';

            // Initialize news management functionality
            if (typeof initializeNewsDashboard === 'function') {
                initializeNewsDashboard();
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Error loading news content', 'danger');
        });
}

// Function to load timetable content dynamically
function loadTimetableContent() {
    fetch('timetable-content.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load timetable content');
            }
            return response.text();
        })
        .then(html => {
            // Inject timetable content into pageContent div
            pageContent.innerHTML = html;

            // Update page title and icon
            pageTitle.innerHTML = '<i class="fas fa-calendar-alt me-2"></i> Timetable';

            // Initialize timetable management functionality
            if (typeof initializeTimetableDashboard === 'function') {
                initializeTimetableDashboard();
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Error loading timetable content', 'danger');
        });
}

// Function to load partnerships content dynamically
function loadPartnershipsContent() {
    fetch('partnerships-content-partial.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load partnerships content');
            }
            return response.text();
        })
        .then(html => {
            // Inject partnerships content into pageContent div
            pageContent.innerHTML = html;

            // Update page title and icon
            pageTitle.innerHTML = '<i class="fas fa-handshake me-2"></i> Partnerships';

            // Initialize partnerships management functionality
            if (typeof initializePartnershipsDashboard === 'function') {
                initializePartnershipsDashboard();
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Error loading partnerships content', 'danger');
        });
}
// Initialize charts
function initializeDashboardCharts() {
    const lineChartEl = document.getElementById('lineChart');
    const barChartEl = document.getElementById('barChart');
    const pieChartEl = document.getElementById('pieChart');

    if (lineChartEl) {
        const ctxLine = lineChartEl.getContext('2d');
        const lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'User Signups',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'User Signups Over Time'
                    }
                }
            }
        });
    }

    if (barChartEl) {
        const ctxBar = barChartEl.getContext('2d');
        const barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['IT', 'HR', 'Finance', 'Marketing', 'Support'],
                datasets: [{
                    label: 'Department Tickets',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Tickets by Department'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (pieChartEl) {
        const ctxPie = pieChartEl.getContext('2d');
        const pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Completed', 'In Progress', 'Pending'],
                datasets: [{
                    label: 'Task Status',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Status Distribution'
                    }
                }
            }
        });
    }
}
