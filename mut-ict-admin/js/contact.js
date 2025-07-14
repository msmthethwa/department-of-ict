document.addEventListener('DOMContentLoaded', () => {
    // Initialize data arrays (in real app, fetch from backend)
    let keyContacts = [];
    let emergencyContacts = [];
    let departments = [];

    // Elements
    const keyContactsTableBody = document.querySelector('#keyContactsTable tbody');
    const emergencyContactsTableBody = document.querySelector('#emergencyContactsTable tbody');
    const departmentsTableBody = document.querySelector('#departmentsTable tbody');

    // Cards count elements
    const totalKeyContactsCount = document.getElementById('totalKeyContactsCount');
    const totalEmergencyContactsCount = document.getElementById('totalEmergencyContactsCount');
    const totalDepartmentsCount = document.getElementById('totalDepartmentsCount');

    // Functions to render tables and counts
    function renderKeyContacts() {
        keyContactsTableBody.innerHTML = '';
        keyContacts.forEach((contact, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${contact.photo || ''}" alt="Photo" class="avatar-preview"></td>
                <td>${contact.name}</td>
                <td>${contact.role}</td>
                <td>${contact.email || ''}</td>
                <td>${contact.phone || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-key-contact" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-key-contact" data-index="${index}">Delete</button>
                </td>
            `;
            keyContactsTableBody.appendChild(tr);
        });
        totalKeyContactsCount.textContent = keyContacts.length;
    }

    function renderEmergencyContacts() {
        emergencyContactsTableBody.innerHTML = '';
        emergencyContacts.forEach((contact, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.role || ''}</td>
                <td>${contact.phone}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-emergency-contact" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-emergency-contact" data-index="${index}">Delete</button>
                </td>
            `;
            emergencyContactsTableBody.appendChild(tr);
        });
        totalEmergencyContactsCount.textContent = emergencyContacts.length;
    }

    function renderDepartments() {
        departmentsTableBody.innerHTML = '';
        departments.forEach((dept, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dept.name}</td>
                <td>${dept.head || ''}</td>
                <td>${dept.staffCount || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-department" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-department" data-index="${index}">Delete</button>
                </td>
            `;
            departmentsTableBody.appendChild(tr);
        });
        totalDepartmentsCount.textContent = departments.length;
    }

    // Initial render
    renderKeyContacts();
    renderEmergencyContacts();
    renderDepartments();

    // TODO: Add event listeners for add/edit/delete buttons and modal handling
});
