(function() {
    console.log('window.firebase:', window.firebase);
    console.log('window.firebase.firestore:', window.firebase?.firestore);
    console.log('window.firebase.firestore.FieldValue:', window.firebase?.firestore?.FieldValue);

    function getServerTimestamp() {
        if (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue) {
            return window.firebase.firestore.FieldValue.serverTimestamp();
        }
        if (firebase && firebase.firestore && firebase.firestore.FieldValue) {
            return firebase.firestore.FieldValue.serverTimestamp();
        }
        console.error('Firestore FieldValue.serverTimestamp is not available');
        return null;
    }

    // Global variables
    let timetablesDataTable = null;
    let currentTimetableId = null;

    // DOM elements references
    let filterProgram, filterLevel, filterSemester;
    let addTimetableBtn, refreshTimetablesBtn;
    let addTimetableModal, editTimetableModal, viewTimetableModal, deleteConfirmationModal;
    let addTimetableForm, editTimetableForm;
    let saveTimetableBtn, updateTimetableBtn, confirmDeleteBtn;

    // Initialize DataTable
    function initializeDataTable() {
        if (timetablesDataTable) {
            timetablesDataTable.destroy();
            $('#timetablesTable').empty();
        }

        timetablesDataTable = $('#timetablesTable').DataTable({
            responsive: true,
            columns: [
                { data: 'program' },
                { data: 'level' },
                { data: 'semester' },
                { data: 'academicYear' },
                { data: 'lastUpdated' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary view-timetable-btn" data-id="${data.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-primary edit-timetable-btn" data-id="${data.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-timetable-btn" data-id="${data.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    },
                    orderable: false
                }
            ]
        });

        setupTableEventDelegation();
    }

    // Setup event delegation for table buttons
    function setupTableEventDelegation() {
        $('#timetablesTable').on('click', '.view-timetable-btn', function() {
            const id = $(this).data('id');
            openViewTimetableModal(id);
        });

        $('#timetablesTable').on('click', '.edit-timetable-btn', function() {
            const id = $(this).data('id');
            openEditTimetableModal(id);
        });

        $('#timetablesTable').on('click', '.delete-timetable-btn', function() {
            const id = $(this).data('id');
            openDeleteConfirmationModal(id);
        });
    }

    // Initialize DOM references
    function initializeDOMReferences() {
        filterProgram = document.getElementById('filterProgram');
        filterLevel = document.getElementById('filterLevel');
        filterSemester = document.getElementById('filterSemester');
        addTimetableBtn = document.querySelector('button[data-bs-target="#addTimetableModal"]');
        refreshTimetablesBtn = document.getElementById('refreshTimetablesBtn');

        const addModalEl = document.getElementById('addTimetableModal');
        if (addModalEl) addTimetableModal = new bootstrap.Modal(addModalEl);

        const editModalEl = document.getElementById('editTimetableModal');
        if (editModalEl) editTimetableModal = new bootstrap.Modal(editModalEl);

        const viewModalEl = document.getElementById('viewTimetableModal');
        if (viewModalEl) viewTimetableModal = new bootstrap.Modal(viewModalEl);

        const deleteModalEl = document.getElementById('deleteConfirmationModal');
        if (deleteModalEl) deleteConfirmationModal = new bootstrap.Modal(deleteModalEl);

        addTimetableForm = document.getElementById('addTimetableForm');
        editTimetableForm = document.getElementById('editTimetableForm');
        saveTimetableBtn = document.getElementById('saveTimetableBtn');
        updateTimetableBtn = document.getElementById('updateTimetableBtn');
        confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    }

    // Load timetables data from Firestore
    function loadTimetablesData() {
        db.collection('timetables').get().then(snapshot => {
            const timetables = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                timetables.push({
                    id: doc.id,
                    program: data.program || '',
                    level: data.level || '',
                    semester: data.semester || '',
                    academicYear: data.academicYear || '',
                    lastUpdated: data.updatedAt ? data.updatedAt.toDate().toISOString().split('T')[0] : ''
                });
            });
            if (timetablesDataTable) {
                timetablesDataTable.clear().rows.add(timetables).draw();
            }
            validateTimetablesAgainstStaff(timetables);
        }).catch(error => {
            console.error('Error loading timetables:', error);
        });
    }

    // Validate timetable entries against staff data
    function validateTimetablesAgainstStaff(timetables) {
        db.collection('staff').get().then(snapshot => {
            const staffList = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                staffList.push({
                    id: doc.id,
                    name: `${data.title} ${data.firstName} ${data.lastName}`,
                    department: data.department || ''
                });
            });

            // Example validation: Check if timetable program matches any staff department
            const invalidTimetables = timetables.filter(tt => {
                return !staffList.some(staff => staff.department === tt.program);
            });

            if (invalidTimetables.length > 0) {
                console.warn('Some timetables do not match any staff department:', invalidTimetables);
                showToast('Warning: Some timetables do not match any staff department.', 'danger');
            }
        }).catch(error => {
            console.error('Error validating timetables against staff:', error);
        });
    }

    // Setup event listeners for buttons and forms
    function setupEventListeners() {
        if (filterProgram) {
            filterProgram.addEventListener('change', filterTimetables);
        }
        if (filterLevel) {
            filterLevel.addEventListener('change', filterTimetables);
        }
        if (filterSemester) {
            filterSemester.addEventListener('change', filterTimetables);
        }
        if (refreshTimetablesBtn) {
            refreshTimetablesBtn.addEventListener('click', loadTimetablesData);
        }
        if (addTimetableForm) {
            addTimetableForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveTimetable();
            });
        }
        if (editTimetableForm) {
            editTimetableForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updateTimetable();
            });
        }
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', confirmDeleteTimetable);
        }

        // Add event listener for Add Time Slot button in Add Timetable modal
        const addTimeSlotBtn = document.getElementById('addTimeSlotBtn');
        if (addTimeSlotBtn) {
            addTimeSlotBtn.addEventListener('click', addTimeSlot);
        }

        // Add event listener for Add Time Slot button in Edit Timetable modal
        const editAddTimeSlotBtn = document.getElementById('editAddTimeSlotBtn');
        if (editAddTimeSlotBtn) {
            editAddTimeSlotBtn.addEventListener('click', editAddTimeSlot);
        }
    }

    // Function to add a new time slot row in Add Timetable modal
    function addTimeSlot() {
        const tbody = document.getElementById('timetableEntriesBody');
        if (!tbody) return;

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td contenteditable="true" class="time-cell"></td>
            <td contenteditable="true" class="monday-cell"></td>
            <td contenteditable="true" class="tuesday-cell"></td>
            <td contenteditable="true" class="wednesday-cell"></td>
            <td contenteditable="true" class="thursday-cell"></td>
            <td contenteditable="true" class="friday-cell"></td>
            <td>
                <button type="button" class="btn btn-sm btn-danger remove-time-slot-btn" title="Remove Time Slot">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(newRow);

        // Add event listener to the remove button
        const removeBtn = newRow.querySelector('.remove-time-slot-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                newRow.remove();
            });
        }
    }

    // Function to add a new time slot row in Edit Timetable modal
    function editAddTimeSlot() {
        const tbody = document.getElementById('editTimetableEntriesBody');
        if (!tbody) return;

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td contenteditable="true" class="time-cell"></td>
            <td contenteditable="true" class="monday-cell"></td>
            <td contenteditable="true" class="tuesday-cell"></td>
            <td contenteditable="true" class="wednesday-cell"></td>
            <td contenteditable="true" class="thursday-cell"></td>
            <td contenteditable="true" class="friday-cell"></td>
            <td>
                <button type="button" class="btn btn-sm btn-danger remove-time-slot-btn" title="Remove Time Slot">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(newRow);

        // Add event listener to the remove button
        const removeBtn = newRow.querySelector('.remove-time-slot-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                newRow.remove();
            });
        }
    }

    // Filter timetables based on selected filters (mock implementation)
    function filterTimetables() {
        // TODO: Implement filtering logic with Firestore queries
        loadTimetablesData();
    }

    // Open add timetable modal
    function openAddTimetableModal() {
        if (addTimetableForm) addTimetableForm.reset();
        if (addTimetableModal) addTimetableModal.show();
    }

    // Open edit timetable modal and populate data
    function openEditTimetableModal(id) {
        currentTimetableId = id;
        if (editTimetableForm) editTimetableForm.reset();

        db.collection('timetables').doc(id).get().then(doc => {
            if (!doc.exists) {
                showToast('Timetable not found', 'danger');
                return;
            }
            const data = doc.data();

            // Populate form fields
            document.getElementById('editTimetableId').value = id;
            document.getElementById('editTimetableProgram').value = data.program || '';
            document.getElementById('editTimetableLevel').value = data.level || '';
            document.getElementById('editTimetableSemester').value = data.semester || '';
            document.getElementById('editTimetableYear').value = data.academicYear || '';
            document.getElementById('editTimetableStatus').value = data.status || 'draft';
            document.getElementById('editTimetableNotes').value = data.notes || '';

            // Populate timetable entries table
            const tbody = document.getElementById('editTimetableEntriesBody');
            tbody.innerHTML = '';
            if (Array.isArray(data.entries)) {
                data.entries.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td contenteditable="true" class="time-cell">${entry.time || ''}</td>
                        <td contenteditable="true" class="monday-cell">${entry.monday || ''}</td>
                        <td contenteditable="true" class="tuesday-cell">${entry.tuesday || ''}</td>
                        <td contenteditable="true" class="wednesday-cell">${entry.wednesday || ''}</td>
                        <td contenteditable="true" class="thursday-cell">${entry.thursday || ''}</td>
                        <td contenteditable="true" class="friday-cell">${entry.friday || ''}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-danger remove-time-slot-btn" title="Remove Time Slot">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);

                    // Add event listener to remove button
                    const removeBtn = row.querySelector('.remove-time-slot-btn');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            row.remove();
                        });
                    }
                });
            }

            if (editTimetableModal) editTimetableModal.show();
        }).catch(error => {
            console.error('Error fetching timetable:', error);
            showToast('Failed to load timetable data', 'danger');
        });
    }

    // Open view timetable modal and populate data
    function openViewTimetableModal(id) {
        db.collection('timetables').doc(id).get().then(doc => {
            if (!doc.exists) {
                showToast('Timetable not found', 'danger');
                return;
            }
            const data = doc.data();

            // Populate display spans
            document.getElementById('viewTimetableProgram').textContent = data.program || '';
            document.getElementById('viewTimetableLevel').textContent = data.level || '';
            document.getElementById('viewTimetableSemester').textContent = data.semester || '';
            document.getElementById('viewTimetableYear').textContent = data.academicYear || '';
            document.getElementById('viewTimetableStatus').textContent = data.status || '';

            // Populate timetable entries table in view modal
            const tbody = document.getElementById('viewTimetableEntriesBody');
            if (tbody) {
                tbody.innerHTML = '';
                if (Array.isArray(data.entries)) {
                    data.entries.forEach(entry => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${entry.time || ''}</td>
                            <td>${entry.monday || ''}</td>
                            <td>${entry.tuesday || ''}</td>
                            <td>${entry.wednesday || ''}</td>
                            <td>${entry.thursday || ''}</td>
                            <td>${entry.friday || ''}</td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            }

            if (viewTimetableModal) viewTimetableModal.show();
        }).catch(error => {
            console.error('Error fetching timetable:', error);
            showToast('Failed to load timetable data', 'danger');
        });
    }

    // Open delete confirmation modal
    function openDeleteConfirmationModal(id) {
        currentTimetableId = id;
        const deleteIdInput = document.getElementById('deleteTimetableId');
        if (deleteIdInput) deleteIdInput.value = id;
        if (deleteConfirmationModal) deleteConfirmationModal.show();
    }

    function extractTimetableEntries(tableBodyId) {
        const entries = [];
        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return entries;

        for (const row of tbody.rows) {
            const time = row.cells[0]?.textContent.trim() || '';
            const monday = row.cells[1]?.textContent.trim() || '';
            const tuesday = row.cells[2]?.textContent.trim() || '';
            const wednesday = row.cells[3]?.textContent.trim() || '';
            const thursday = row.cells[4]?.textContent.trim() || '';
            const friday = row.cells[5]?.textContent.trim() || '';

            entries.push({
                time,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday
            });
        }
        return entries;
    }

    // Save new timetable
    function saveTimetable() {
        if (!addTimetableForm) return;

        const program = document.getElementById('timetableProgram').value.trim();
        const level = document.getElementById('timetableLevel').value.trim();
        const semester = document.getElementById('timetableSemester').value.trim();
        const academicYear = document.getElementById('timetableYear').value.trim();
        const status = document.getElementById('timetableStatus').value.trim();
        const notes = document.getElementById('timetableNotes').value.trim();
        const entries = extractTimetableEntries('timetableEntriesBody');

        if (!program || !level || !semester || !academicYear || !status) {
            showToast('Please fill in all required fields.', 'danger');
            return;
        }

        const newTimetable = {
            program,
            level,
            semester,
            academicYear,
            status,
            notes,
            entries,
            createdAt: getServerTimestamp(),
            updatedAt: getServerTimestamp()
        };

        db.collection('timetables').add(newTimetable)
            .then(() => {
                if (addTimetableModal) addTimetableModal.hide();
                loadTimetablesData();
                showToast('Timetable saved successfully', 'success');
                if (addTimetableForm) addTimetableForm.reset();
            })
            .catch(error => {
                console.error('Error saving timetable:', error);
                showToast('Failed to save timetable. Please try again.', 'danger');
            });
    }

    // Update existing timetable
    function updateTimetable() {
        if (!editTimetableForm || !currentTimetableId) return;

        const program = document.getElementById('editTimetableProgram').value.trim();
        const level = document.getElementById('editTimetableLevel').value.trim();
        const semester = document.getElementById('editTimetableSemester').value.trim();
        const academicYear = document.getElementById('editTimetableYear').value.trim();
        const status = document.getElementById('editTimetableStatus').value.trim();
        const notes = document.getElementById('editTimetableNotes').value.trim();
        const entries = extractTimetableEntries('editTimetableEntriesBody');

        if (!program || !level || !semester || !academicYear || !status) {
            showToast('Please fill in all required fields.', 'danger');
            return;
        }

        const updatedTimetable = {
            program,
            level,
            semester,
            academicYear,
            status,
            notes,
            entries,
            updatedAt: getServerTimestamp()
        };

        db.collection('timetables').doc(currentTimetableId).update(updatedTimetable)
            .then(() => {
                if (editTimetableModal) editTimetableModal.hide();
                loadTimetablesData();
                showToast('Timetable updated successfully', 'success');
            })
            .catch(error => {
                console.error('Error updating timetable:', error);
                showToast('Failed to update timetable. Please try again.', 'danger');
            });
    }

    // Confirm delete timetable
    function confirmDeleteTimetable() {
        const id = currentTimetableId;
        if (!id) return;

        db.collection('timetables').doc(id).delete()
            .then(() => {
                if (deleteConfirmationModal) deleteConfirmationModal.hide();
                loadTimetablesData();
                showToast('Timetable deleted successfully', 'success');
            })
            .catch(error => {
                console.error('Error deleting timetable:', error);
                showToast('Failed to delete timetable. Please try again.', 'danger');
            });
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('toastNotification');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        if (!toastEl || !toastTitle || !toastMessage) return;

        toastTitle.textContent = type === 'success' ? 'Success' : 'Error';
        toastMessage.textContent = message;

        const bsToast = new bootstrap.Toast(toastEl);
        bsToast.show();
    }

    // Initialize timetable dashboard
    function initializeTimetableDashboard() {
        initializeDOMReferences();
        initializeDataTable();
        loadTimetablesData();
        setupEventListeners();

        if (addTimetableBtn) {
            addTimetableBtn.addEventListener('click', openAddTimetableModal);
        }
    }

    // Export initialize function for dynamic loading
    window.initializeTimetableDashboard = initializeTimetableDashboard;

    // Initialize on DOMContentLoaded if loaded standalone
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('timetablesTable')) {
            initializeTimetableDashboard();
        }
    });
})();
