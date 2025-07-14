// Global variables
let upcomingEventsDataTable = null;
let pastEventsDataTable = null;
let currentEventId = null;
let currentSpeakerId = null;
let eventsActionCallback = null;

// DOM elements
const sidebarCollapse = document.getElementById('sidebarCollapse');
const requiresRegistration = document.getElementById('requiresRegistration');
const registrationSettings = document.getElementById('registrationSettings');
const addSpeakerBtn = document.getElementById('addSpeakerBtn');
const saveEventBtn = document.getElementById('saveEventBtn');
const saveSpeakerBtn = document.getElementById('saveSpeakerBtn');
const imageUploadContainer = document.getElementById('imageUploadContainer');
const eventImageUpload = document.getElementById('eventImageUpload');
const imagePreview = document.getElementById('imagePreview');
const uploadProgress = document.querySelector('.upload-progress');
const progressBar = document.querySelector('.progress-bar');
const speakerImageUploadContainer = document.getElementById('speakerImageUploadContainer');
const speakerImageUpload = document.getElementById('speakerImageUpload');
const speakerImagePreview = document.getElementById('speakerImagePreview');

// Initialize DataTables
function initializeDataTables() {
    if (upcomingEventsDataTable) {
        upcomingEventsDataTable.destroy();
        document.querySelector('#upcomingEventsTable tbody').innerHTML = '';
    }
    if (pastEventsDataTable) {
        pastEventsDataTable.destroy();
        document.querySelector('#pastEventsTable tbody').innerHTML = '';
    }

    upcomingEventsDataTable = $('#upcomingEventsTable').DataTable({
        responsive: true,
        data: [],
        columns: [
            { data: 'title' },
            { data: 'dateTime' },
            { data: 'type', render: function(data) {
                return `<span class="event-category ${getCategoryClass(data)}">${data}</span>`;
            }},
            { data: 'registrations' },
            { data: 'status', render: function(data) {
                return `<span class="badge bg-success">${data}</span>`;
            }},
            { data: null, orderable: false, render: function(data) {
                return `
                    <button class="btn btn-sm btn-outline-primary me-1 edit-event-btn" data-id="${data.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-event-btn" data-id="${data.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }}
        ]
    });

    pastEventsDataTable = $('#pastEventsTable').DataTable({
        responsive: true,
        data: [],
        columns: [
            { data: 'title' },
            { data: 'date' },
            { data: 'type', render: function(data) {
                return `<span class="event-category ${getCategoryClass(data)}">${data}</span>`;
            }},
            { data: 'attendees' },
            { data: null, orderable: false, render: function(data) {
                return `
                    <button class="btn btn-sm btn-outline-primary me-1 edit-event-btn" data-id="${data.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-event-btn" data-id="${data.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }}
        ]
    });

    setupTableEventDelegation();
}

function setupTableEventDelegation() {
    $('#upcomingEventsTable').on('click', '.edit-event-btn', function() {
        const eventId = $(this).data('id');
        openEventModal(eventId);
    });

    $('#upcomingEventsTable').on('click', '.delete-event-btn', function() {
        const eventId = $(this).data('id');
        deleteEvent(eventId);
    });

    $('#pastEventsTable').on('click', '.edit-event-btn', function() {
        const eventId = $(this).data('id');
        openEventModal(eventId);
    });

    $('#pastEventsTable').on('click', '.delete-event-btn', function() {
        const eventId = $(this).data('id');
        deleteEvent(eventId);
    });
}

function initializeAdminDashboard() {
    initializeDOMReferences();
    initializeDataTables();
    loadDashboardStats();
    loadEventsData();
    loadRecentRegistrations();
    setupButtonEventListeners();
}

function initializeDOMReferences() {
    // Already initialized globally
}

function loadDashboardStats() {
    db.collection('events').where('startDate', '>=', new Date()).get().then(snapshot => {
        document.getElementById('upcomingEventsCount').textContent = snapshot.size;
    });
    db.collection('registrations').get().then(snapshot => {
        document.getElementById('totalRegistrationsCount').textContent = snapshot.size;
    });
    db.collection('speakers').get().then(snapshot => {
        document.getElementById('speakersCount').textContent = snapshot.size;
    });
    db.collection('events').where('startDate', '<', new Date()).get().then(snapshot => {
        document.getElementById('pastEventsCount').textContent = snapshot.size;
    });
}

function loadEventsData() {
    const now = new Date();
    db.collection('events').get().then(snapshot => {
        const upcomingEvents = [];
        const pastEvents = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            const startDate = data.startDate.toDate ? data.startDate.toDate() : new Date(data.startDate);
            const endDate = data.endDate ? (data.endDate.toDate ? data.endDate.toDate() : new Date(data.endDate)) : startDate;
            const dateTimeStr = startDate.toLocaleDateString() + ' ' + (data.startTime || '') + ' - ' + (data.endTime || '');
            if (startDate >= now) {
                upcomingEvents.push({
                    id: data.id,
                    title: data.title,
                    dateTime: dateTimeStr,
                    type: data.type,
                    registrations: data.registrationsCount || '0',
                    status: data.status || 'Active'
                });
            } else {
                pastEvents.push({
                    id: data.id,
                    title: data.title,
                    date: startDate.toLocaleDateString(),
                    type: data.type,
                    attendees: data.attendeesCount || '0'
                });
            }
        });
        if (upcomingEventsDataTable) {
            upcomingEventsDataTable.clear().rows.add(upcomingEvents).draw();
        }
        if (pastEventsDataTable) {
            pastEventsDataTable.clear().rows.add(pastEvents).draw();
        }
    });
}

function setupButtonEventListeners() {
    console.log('setupButtonEventListeners called');
    requiresRegistration.addEventListener('change', function() {
        registrationSettings.style.display = this.checked ? 'block' : 'none';
    });

    addSpeakerBtn.addEventListener('click', function() {
        resetSpeakerForm();
        const speakerModal = new bootstrap.Modal(document.getElementById('speakerModal'));
        speakerModal.show();
    });

    saveSpeakerBtn.addEventListener('click', saveSpeaker);

    saveEventBtn.addEventListener('click', saveEvent);

    // Use event delegation for Add Event button click
    document.body.addEventListener('click', function(event) {
        const addEventBtn = event.target.closest('#addEventBtn');
        if (addEventBtn) {
            console.log('addEventBtn clicked via delegation');
            openEventModal();
        } else {
            console.log('Clicked element is not addEventBtn:', event.target);
        }
    });

    imageUploadContainer.addEventListener('click', () => eventImageUpload.click());

    eventImageUpload.addEventListener('change', e => handleImageUpload(e.target.files[0], 'event'));

    speakerImageUploadContainer.addEventListener('click', () => speakerImageUpload.click());

    speakerImageUpload.addEventListener('change', e => handleImageUpload(e.target.files[0], 'speaker'));
}

function resetSpeakerForm() {
    document.getElementById('speakerForm').reset();
    document.getElementById('speakerImageUrl').value = '';
    speakerImagePreview.style.display = 'none';
}

function openEventModal(eventId = null) {
    currentEventId = eventId;
    const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
    const form = document.getElementById('eventForm');
    form.reset();
    document.getElementById('eventImagePreview').style.display = 'none';
    document.getElementById('removeEventImageBtn').style.display = 'none';
    document.getElementById('eventImageUrl').value = '';

    if (eventId) {
        db.collection('events').doc(eventId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('eventModalTitle').textContent = 'Edit Event';
                document.getElementById('eventId').value = doc.id;
                document.getElementById('eventTitle').value = data.title || '';
                document.getElementById('eventType').value = data.type || '';
                document.getElementById('eventStartDate').value = data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '';
                document.getElementById('eventEndDate').value = data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '';
                document.getElementById('eventStartTime').value = data.startTime || '';
                document.getElementById('eventEndTime').value = data.endTime || '';
                document.getElementById('eventLocation').value = data.location || '';
                document.getElementById('eventDescription').value = data.description || '';
                document.getElementById('requiresRegistration').checked = data.requiresRegistration || false;
                registrationSettings.style.display = data.requiresRegistration ? 'block' : 'none';
                document.getElementById('isFeaturedEvent').checked = data.isFeatured || false;
                document.getElementById('registrationDeadline').value = data.registrationSettings ? data.registrationSettings.registrationDeadline : '';
                document.getElementById('maxAttendees').value = data.registrationSettings ? data.registrationSettings.maxAttendees : '';
                document.getElementById('earlyBirdPrice').value = data.registrationSettings ? data.registrationSettings.earlyBirdPrice : '';
                document.getElementById('standardPrice').value = data.registrationSettings ? data.registrationSettings.standardPrice : '';
                document.getElementById('studentPrice').value = data.registrationSettings ? data.registrationSettings.studentPrice : '';
                document.getElementById('earlyBirdDeadline').value = data.registrationSettings ? data.registrationSettings.earlyBirdDeadline : '';
                document.getElementById('eventPrerequisites').value = data.prerequisites || '';
                if (data.imageUrl) {
                    document.getElementById('eventImagePreview').src = data.imageUrl;
                    document.getElementById('eventImagePreview').style.display = 'block';
                    document.getElementById('removeEventImageBtn').style.display = 'inline-block';
                    document.getElementById('eventImageUrl').value = data.imageUrl;
                }
                // Load speakers
                const speakersContainer = document.getElementById('speakersContainer');
                speakersContainer.innerHTML = '';
                if (data.speakers && data.speakers.length) {
                    data.speakers.forEach(speaker => {
                        addSpeakerToEvent(speaker.name, speaker.title, speaker.bio, speaker.image);
                    });
                }
                eventModal.show();
            }
        });
    } else {
        document.getElementById('eventModalTitle').textContent = 'Add New Event';
        eventModal.show();
    }
}

function saveEvent() {
    const form = document.getElementById('eventForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const eventId = currentEventId;
    const eventData = {
        title: document.getElementById('eventTitle').value,
        type: document.getElementById('eventType').value,
        startDate: new Date(document.getElementById('eventStartDate').value),
        endDate: document.getElementById('eventEndDate').value ? new Date(document.getElementById('eventEndDate').value) : new Date(document.getElementById('eventStartDate').value),
        startTime: document.getElementById('eventStartTime').value,
        endTime: document.getElementById('eventEndTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        imageUrl: document.getElementById('eventImageUrl').value,
        requiresRegistration: document.getElementById('requiresRegistration').checked,
        isFeatured: document.getElementById('isFeaturedEvent').checked,
        prerequisites: document.getElementById('eventPrerequisites').value,
        registrationSettings: document.getElementById('requiresRegistration').checked ? {
            registrationDeadline: document.getElementById('registrationDeadline').value,
            maxAttendees: parseInt(document.getElementById('maxAttendees').value) || 0,
            earlyBirdPrice: parseFloat(document.getElementById('earlyBirdPrice').value) || 0,
            standardPrice: parseFloat(document.getElementById('standardPrice').value) || 0,
            studentPrice: parseFloat(document.getElementById('studentPrice').value) || 0,
            earlyBirdDeadline: document.getElementById('earlyBirdDeadline').value
        } : null,
        speakers: []
    };

    // Gather speakers
    const speakerCards = document.querySelectorAll('#speakersContainer .speaker-card');
    speakerCards.forEach(card => {
        eventData.speakers.push({
            name: card.querySelector('input[name="speakerName"]').value,
            title: card.querySelector('input[name="speakerTitle"]').value,
            bio: card.querySelector('input[name="speakerBio"]').value,
            image: card.querySelector('input[name="speakerImage"]').value
        });
    });

    if (eventId) {
        db.collection('events').doc(eventId).update({
            ...eventData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Event updated successfully');
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
            loadEventsData();
            loadDashboardStats();
        }).catch(error => {
            console.error('Error updating event:', error);
            alert('Error updating event');
        });
    } else {
        db.collection('events').add({
            ...eventData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Event added successfully');
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
            loadEventsData();
            loadDashboardStats();
        }).catch(error => {
            console.error('Error adding event:', error);
            alert('Error adding event');
        });
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        db.collection('events').doc(eventId).delete().then(() => {
            alert('Event deleted successfully');
            loadEventsData();
            loadDashboardStats();
        }).catch(error => {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        });
    }
}

function addSpeakerToEvent(name, title, bio, imageUrl) {
    const speakersContainer = document.getElementById('speakersContainer');
    const speakerId = 'speaker-' + Date.now();

    const speakerCard = document.createElement('div');
    speakerCard.className = 'speaker-card d-flex';
    speakerCard.id = speakerId;
    speakerCard.innerHTML = `
        <img src="${imageUrl || 'https://via.placeholder.com/80'}" class="speaker-image-preview">
        <div class="flex-grow-1">
            <h6>${name}</h6>
            <p class="text-muted">${title}</p>
            <p class="small">${bio.substring(0, 100)}${bio.length > 100 ? '...' : ''}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger align-self-start" onclick="removeSpeaker('${speakerId}')">
            <i class="fas fa-times"></i>
        </button>
        <input type="hidden" name="speakerName" value="${name}">
        <input type="hidden" name="speakerTitle" value="${title}">
        <input type="hidden" name="speakerBio" value="${bio}">
        <input type="hidden" name="speakerImage" value="${imageUrl}">
    `;

    speakersContainer.appendChild(speakerCard);
}

function removeSpeaker(speakerId) {
    const speakerElement = document.getElementById(speakerId);
    if (speakerElement) {
        speakerElement.remove();
    }
}

function handleImageUpload(file, type) {
    if (!file) return;

    const reader = new FileReader();
    const previewElement = type === 'event' ? imagePreview : speakerImagePreview;
    const progressElement = type === 'event' ? uploadProgress : document.querySelector('#speakerModal .upload-progress');
    const progressBarElement = type === 'event' ? progressBar : document.querySelector('#speakerModal .progress-bar');

    // Show preview
    reader.onload = function(e) {
        previewElement.src = e.target.result;
        previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Show progress bar
    progressElement.style.display = 'block';
    progressBarElement.style.width = '0%';

    // Upload to imgBB
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', imgbbApiKey);

    fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the image URL in the appropriate hidden field
            if (type === 'event') {
                document.getElementById('eventImageUrl').value = data.data.url;
            } else {
                document.getElementById('speakerImageUrl').value = data.data.url;
            }

            // Update progress bar
            progressBarElement.style.width = '100%';
            setTimeout(() => {
                progressElement.style.display = 'none';
            }, 1000);
        } else {
            alert('Image upload failed: ' + data.error.message);
            progressElement.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
        progressElement.style.display = 'none';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});
