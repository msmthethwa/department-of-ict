(function() {
    // Global variables
    let staffDataTable = null;
    let departmentsDataTable = null;
    let currentStaffId = null;
    let currentDepartmentId = null;
    let actionCallback = null;
    let expertiseTags = [];

    // DOM elements references
    let totalStaffCount, academicStaffCount, adminStaffCount, departmentCount;
    let addStaffBtn, addDepartmentBtn, staffModal, departmentModal, confirmationModal;
    let staffModalTitle, staffForm, departmentForm, saveStaffBtn, saveDepartmentBtn;
    let confirmActionBtn, imageUploadContainer, staffImageUpload, staffImagePreview;
    let staffImageUrl, uploadProgress, expertiseContainer, expertiseInput, staffExpertise;
    let removeImageBtn;

    // Helper function to load HTML content into #pageContent
    function loadPageContent(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load content');
                }
                return response.text();
            })
            .then(html => {
                const pageContent = document.getElementById('pageContent');
                if (pageContent) {
                    pageContent.innerHTML = html;
                }
            })
            .catch(error => {
                console.error('Error loading page content:', error);
            });
    }

    // Initialize DataTables
    function initializeDataTables() {
        if (staffDataTable) {
            staffDataTable.destroy();
            $('#staffTable').empty();
        }
        if (departmentsDataTable) {
            departmentsDataTable.destroy();
            $('#departmentsTable').empty();
        }

        staffDataTable = $('#staffTable').DataTable({
            responsive: true,
            data: [],
            columns: [
                { 
                    data: 'image',
                    render: function(data) {
                        return `<img src="${data || 'https://via.placeholder.com/100'}" class="staff-avatar" alt="Staff photo">`;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.title} ${data.firstName} ${data.lastName}`;
                    }
                },
                { data: 'position' },
                { data: 'department' },
                { data: 'email' },
                { 
                    data: null,
                    render: function(data) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary edit-staff-btn" data-id="${data.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-staff-btn" data-id="${data.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    },
                    orderable: false
                }
            ]
        });

        departmentsDataTable = $('#departmentsTable').DataTable({
            responsive: true,
            data: [],
            columns: [
                { data: 'name' },
                { 
                    data: 'head',
                    render: function(data) {
                        return data ? `${data.title} ${data.firstName} ${data.lastName}` : 'Not assigned';
                    }
                },
                { 
                    data: 'staffCount',
                    render: function(data) {
                        return data || 0;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary edit-department-btn" data-id="${data.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-department-btn" data-id="${data.id}">
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

    function setupTableEventDelegation() {
        $('#staffTable').off('click', '.edit-staff-btn').on('click', '.edit-staff-btn', function() {
            const staffId = $(this).data('id');
            openStaffModal(staffId);
        });

        $('#staffTable').off('click', '.delete-staff-btn').on('click', '.delete-staff-btn', function() {
            const staffId = $(this).data('id');
            deleteStaff(staffId);
        });

        $('#departmentsTable').off('click', '.edit-department-btn').on('click', '.edit-department-btn', function() {
            const deptId = $(this).data('id');
            openDepartmentModal(deptId);
        });

        $('#departmentsTable').off('click', '.delete-department-btn').on('click', '.delete-department-btn', function() {
            const deptId = $(this).data('id');
            deleteDepartment(deptId);
        });
    }

    function initializeAdminDashboard() {
        console.log('initializeAdminDashboard called');
        initializeDOMReferences();
        loadStaffCount();
        loadDepartmentCount();
        initializeDataTables();
        loadStaffData();
        loadDepartmentsData();
        setupButtonEventListeners();
    }

    function initializeDOMReferences() {
        totalStaffCount = document.getElementById('totalStaffCount');
        academicStaffCount = document.getElementById('academicStaffCount');
        adminStaffCount = document.getElementById('adminStaffCount');
        departmentCount = document.getElementById('departmentCount');
        addStaffBtn = document.getElementById('addStaffBtn');
        addDepartmentBtn = document.getElementById('addDepartmentBtn');
        
        const staffModalEl = document.getElementById('staffModal');
        if (staffModalEl) staffModal = new bootstrap.Modal(staffModalEl);
        
        const departmentModalEl = document.getElementById('departmentModal');
        if (departmentModalEl) departmentModal = new bootstrap.Modal(departmentModalEl);
        
        const confirmationModalEl = document.getElementById('confirmationModal');
        if (confirmationModalEl) confirmationModal = new bootstrap.Modal(confirmationModalEl);
        
        staffModalTitle = document.getElementById('staffModalTitle');
        staffForm = document.getElementById('staffForm');
        departmentForm = document.getElementById('departmentForm');
        saveStaffBtn = document.getElementById('saveStaffBtn');
        saveDepartmentBtn = document.getElementById('saveDepartmentBtn');
        confirmActionBtn = document.getElementById('confirmActionBtn');
        imageUploadContainer = document.getElementById('imageUploadContainer');
        staffImageUpload = document.getElementById('staffImageUpload');
        staffImagePreview = document.getElementById('staffImagePreview');
        staffImageUrl = document.getElementById('staffImageUrl');
        uploadProgress = document.getElementById('uploadProgress');
        expertiseContainer = document.getElementById('expertiseContainer');
        expertiseInput = document.getElementById('expertiseInput');
        staffExpertise = document.getElementById('staffExpertise');
        removeImageBtn = document.getElementById('removeImageBtn');
    }

    function loadStaffCount() {
        if (!totalStaffCount || !academicStaffCount || !adminStaffCount) return;
        
        db.collection('staff').get().then(snapshot => {
            totalStaffCount.textContent = snapshot.size;
            
            let academicCount = 0;
            snapshot.forEach(doc => {
                if (doc.data().type === 'academic') {
                    academicCount++;
                }
            });
            
            academicStaffCount.textContent = academicCount;
            adminStaffCount.textContent = snapshot.size - academicCount;
        });
    }

    function loadDepartmentCount() {
        if (!departmentCount) return;
        
        db.collection('departments').get().then(snapshot => {
            departmentCount.textContent = snapshot.size;
        });
    }

    function setupButtonEventListeners() {
        console.log('setupButtonEventListeners called');
        if (addStaffBtn) {
            addStaffBtn.addEventListener('click', () => {
                console.log('Add Staff button clicked');
                openStaffModal();
            });
        }
        if (addDepartmentBtn) {
            addDepartmentBtn.addEventListener('click', () => {
                console.log('Add Department button clicked');
                openDepartmentModal();
            });
        }

        if (saveStaffBtn) {
            saveStaffBtn.addEventListener('click', () => saveStaff());
        }

        if (saveDepartmentBtn) {
            saveDepartmentBtn.addEventListener('click', () => saveDepartment());
        }

        if (confirmActionBtn) {
            confirmActionBtn.addEventListener('click', () => {
                if (actionCallback) actionCallback();
                if (confirmationModal) confirmationModal.hide();
            });
        }

        if (imageUploadContainer) {
            imageUploadContainer.addEventListener('click', () => {
                if (staffImageUpload) staffImageUpload.click();
            });
        }

        if (staffImageUpload) {
            staffImageUpload.addEventListener('change', handleImageUpload);
        }

        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                if (staffImagePreview) {
                    staffImagePreview.src = '';
                    staffImagePreview.style.display = 'none';
                }
                removeImageBtn.style.display = 'none';
                if (imageUploadContainer) imageUploadContainer.style.display = 'block';
                if (staffImageUrl) staffImageUrl.value = '';
            });
        }

        const staffTypeSelect = document.getElementById('staffType');
        if (staffTypeSelect) {
            staffTypeSelect.addEventListener('change', toggleStaffFieldsByType);
        }
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'danger');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            if (staffImagePreview) {
                staffImagePreview.src = e.target.result;
                staffImagePreview.style.display = 'block';
            }
            if (imageUploadContainer) imageUploadContainer.style.display = 'none';
            if (removeImageBtn) removeImageBtn.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);

        // Upload to imgBB
        uploadImageToImgBB(file);
    }

    function uploadImageToImgBB(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', IMGBB_API_KEY);
        
        if (uploadProgress) {
            uploadProgress.style.display = 'block';
            const progressBar = uploadProgress.querySelector('.progress-bar');
            if (progressBar) progressBar.style.width = '0%';
        }

        fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (staffImageUrl) staffImageUrl.value = data.data.url;
                //showToast('Image uploaded successfully', 'success');
            } else {
                showToast('Image upload failed', 'danger');
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            showToast('Error uploading image', 'danger');
        })
        .finally(() => {
            if (uploadProgress) uploadProgress.style.display = 'none';
        });
    }

    function loadStaffData() {
        db.collection('departments').get().then(deptSnapshot => {
            const deptMap = {};
            deptSnapshot.forEach(deptDoc => {
                const deptData = deptDoc.data();
                deptMap[deptDoc.id] = deptData.name;
            });

            db.collection('staff').get().then(snapshot => {
                const staffData = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    if (data.department && deptMap[data.department]) {
                        data.department = deptMap[data.department];
                    }
                    staffData.push(data);
                });
                
                if (staffDataTable) {
                    staffDataTable.clear().rows.add(staffData).draw();
                }
            });
        });
    }

    function loadDepartmentsData() {
        db.collection('departments').get().then(snapshot => {
            const departmentsData = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                departmentsData.push(data);
            });
            
            if (departmentsDataTable) {
                departmentsDataTable.clear().rows.add(departmentsData).draw();
            }
        });
    }

    function loadDepartmentsForStaffDropdown() {
        const staffDepartmentSelect = document.getElementById('staffDepartment');
        if (!staffDepartmentSelect) return Promise.resolve();
        
        staffDepartmentSelect.innerHTML = '<option value="">Select department</option>';
        
        return db.collection('departments').get().then(snapshot => {
            snapshot.forEach(doc => {
                const department = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = department.name;
                staffDepartmentSelect.appendChild(option);
            });
        });
    }

    function openStaffModal(id = null) {
        currentStaffId = id;
        
        if (!staffForm || !staffModal) return;

        staffForm.reset();
        if (staffImagePreview) {
            staffImagePreview.style.display = 'none';
        }
        if (imageUploadContainer) {
            imageUploadContainer.style.display = 'block';
        }
        if (staffImageUrl) {
            staffImageUrl.value = '';
        }
        expertiseTags = [];
        updateExpertiseTags();
        
        loadDepartmentsForStaffDropdown().then(() => {
            if (id) {
                if (staffModalTitle) staffModalTitle.textContent = 'Edit Staff Member';
                
                db.collection('staff').doc(id).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        
                        document.getElementById('staffId').value = doc.id;
                        document.getElementById('staffTitle').value = data.title || 'Mr.';
                        document.getElementById('staffFirstName').value = data.firstName;
                        document.getElementById('staffLastName').value = data.lastName;
                        document.getElementById('staffPosition').value = data.position;
                        document.getElementById('staffDepartment').value = data.department;
                        document.getElementById('staffEmail').value = data.email;
                        document.getElementById('staffPhone').value = data.phone || '';
                        document.getElementById('staffOffice').value = data.office || '';
                        document.getElementById('staffType').value = data.type || 'academic';
                        document.getElementById('staffBio').value = data.bio || '';
                        
                        if (data.expertise) {
                            expertiseTags = data.expertise;
                            updateExpertiseTags();
                        }
                        
                        if (data.education) {
                            document.getElementById('staffEducation').value = data.education.join('\n');
                        }
                        
                        if (data.courses) {
                            document.getElementById('staffCourses').value = data.courses.join('\n');
                        }
                        
                        if (data.publications) {
                            document.getElementById('staffPublications').value = data.publications.join('\n');
                        }

                        if (data.keyResponsibilities) {
                            document.getElementById('staffKeyResponsibilities').value = data.keyResponsibilities.join('\n');
                        }
                        
                        if (data.social) {
                            document.getElementById('staffLinkedin').value = data.social.linkedin || '';
                            document.getElementById('staffTwitter').value = data.social.twitter || '';
                            document.getElementById('staffResearchgate').value = data.social.researchgate || '';
                            document.getElementById('staffGoogleScholar').value = data.social.googleScholar || '';
                        }
                        
                        if (data.image && staffImagePreview) {
                            staffImagePreview.src = data.image;
                            staffImagePreview.style.display = 'block';
                            if (imageUploadContainer) imageUploadContainer.style.display = 'none';
                            if (staffImageUrl) staffImageUrl.value = data.image;
                            if (removeImageBtn) removeImageBtn.style.display = 'inline-block';
                        }

                        toggleStaffFieldsByType();
                    }
                });
            } else {
                if (staffModalTitle) staffModalTitle.textContent = 'Add New Staff Member';
            }
            if (staffModal) staffModal.show();
        });
    }

    function saveStaff() {
        if (!staffForm || !staffForm.checkValidity()) {
            if (staffForm) staffForm.classList.add('was-validated');
            return;
        }
        
        const staffData = {
            title: document.getElementById('staffTitle').value,
            firstName: document.getElementById('staffFirstName').value,
            lastName: document.getElementById('staffLastName').value,
            position: document.getElementById('staffPosition').value,
            department: document.getElementById('staffDepartment').value,
            email: document.getElementById('staffEmail').value,
            phone: document.getElementById('staffPhone').value,
            office: document.getElementById('staffOffice').value,
            type: document.getElementById('staffType').value,
            bio: document.getElementById('staffBio').value,
            expertise: expertiseTags,
            education: document.getElementById('staffEducation').value.split('\n').filter(line => line.trim()),
            social: {
                linkedin: document.getElementById('staffLinkedin').value,
                twitter: document.getElementById('staffTwitter').value,
                researchgate: document.getElementById('staffResearchgate').value,
                googleScholar: document.getElementById('staffGoogleScholar').value
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const staffType = document.getElementById('staffType').value;
        if (staffType === 'admin') {
            staffData.keyResponsibilities = document.getElementById('staffKeyResponsibilities').value.split('\n').filter(line => line.trim());
        } else {
            staffData.courses = document.getElementById('staffCourses').value.split('\n').filter(line => line.trim());
            staffData.publications = document.getElementById('staffPublications').value.split('\n').filter(line => line.trim());
        }
        
        if (staffImageUrl && staffImageUrl.value) {
            staffData.image = staffImageUrl.value;
        }
        
        if (currentStaffId) {
            const staffRef = db.collection('staff').doc(currentStaffId);
            staffRef.get().then(doc => {
                if (doc.exists) {
                    const oldData = doc.data();
                    const oldDepartmentId = oldData.department;
                    const newDepartmentId = staffData.department;
                    
                    staffRef.update(staffData)
                        .then(() => {
                            if (oldDepartmentId !== newDepartmentId) {
                                const batch = db.batch();
                                if (oldDepartmentId) {
                                    const oldDeptRef = db.collection('departments').doc(oldDepartmentId);
                                    batch.update(oldDeptRef, { staffCount: firebase.firestore.FieldValue.increment(-1) });
                                }
                                if (newDepartmentId) {
                                    const newDeptRef = db.collection('departments').doc(newDepartmentId);
                                    batch.update(newDeptRef, { staffCount: firebase.firestore.FieldValue.increment(1) });
                                }
                                batch.commit().then(() => {
                                    if (staffModal) staffModal.hide();
                                    loadStaffData();
                                    loadDepartmentsData();
                                    loadStaffCount();
                                    //showToast('Staff member updated successfully', 'success');
                                });
                            } else {
                                if (staffModal) staffModal.hide();
                                loadStaffData();
                                loadDepartmentsData();
                                //('Staff member updated successfully', 'success');
                            }
                        })
                        .catch(error => {
                            console.error('Error updating staff:', error);
                            showToast('Error updating staff member', 'danger');
                        });
                }
            });
        } else {
            staffData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            
            db.collection('staff').add(staffData)
                .then(docRef => {
                    if (staffData.department) {
                        const deptRef = db.collection('departments').doc(staffData.department);
                        deptRef.update({ staffCount: firebase.firestore.FieldValue.increment(1) });
                    }
                    if (staffModal) staffModal.hide();
                    loadStaffData();
                    loadDepartmentsData();
                    loadStaffCount();
                    //showToast('Staff member added successfully', 'success');
                })
                .catch(error => {
                    console.error('Error adding staff:', error);
                    showToast('Error adding staff member', 'danger');
                });
        }
    }

    function saveDepartment() {
        if (!departmentForm || !departmentForm.checkValidity()) {
            if (departmentForm) departmentForm.classList.add('was-validated');
            return;
        }
        
        const departmentData = {
            name: document.getElementById('departmentName').value,
            description: document.getElementById('departmentDescription').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const headId = document.getElementById('departmentHead').value;
        if (headId) {
            departmentData.headId = headId;
            
            db.collection('staff').doc(headId).get().then(doc => {
                if (doc.exists) {
                    const headData = doc.data();
                    departmentData.head = {
                        id: doc.id,
                        title: headData.title,
                        firstName: headData.firstName,
                        lastName: headData.lastName
                    };
                    
                    saveDepartmentData(departmentData);
                }
            });
        } else {
            saveDepartmentData(departmentData);
        }
    }

    function openDepartmentModal(id = null) {
        currentDepartmentId = id;
        
        if (!departmentForm) return;

        departmentForm.reset();
        
        const departmentHeadSelect = document.getElementById('departmentHead');
        if (!departmentHeadSelect) return;
        
        departmentHeadSelect.innerHTML = '<option value="">Select department head</option>';
        
        db.collection('staff').get().then(snapshot => {
            snapshot.forEach(doc => {
                const staff = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${staff.title} ${staff.firstName} ${staff.lastName}`;
                departmentHeadSelect.appendChild(option);
            });
            
            if (id) {
                const modalTitle = departmentModal._element.querySelector('.modal-title');
                if (modalTitle) modalTitle.textContent = 'Edit Department';
                
                db.collection('departments').doc(id).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        document.getElementById('departmentId').value = doc.id;
                        document.getElementById('departmentName').value = data.name || '';
                        document.getElementById('departmentDescription').value = data.description || '';
                        if (data.headId) {
                            departmentHeadSelect.value = data.headId;
                        }
                        if (departmentModal) departmentModal.show();
                    }
                });
            } else {
                const modalTitle = departmentModal._element.querySelector('.modal-title');
                if (modalTitle) modalTitle.textContent = 'Add New Department';
                if (departmentModal) departmentModal.show();
            }
        });
    }

    function saveDepartmentData(departmentData) {
        if (currentDepartmentId) {
            db.collection('departments').doc(currentDepartmentId).update(departmentData)
                .then(() => {
                    if (departmentModal) departmentModal.hide();
                    loadDepartmentsData();
                    loadStaffData();
                    loadDepartmentCount();
                    //showToast('Department updated successfully', 'success');
                })
                .catch(error => {
                    console.error('Error updating department:', error);
                    showToast('Error updating department', 'danger');
                });
        } else {
            departmentData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            departmentData.staffCount = 0;
            
            db.collection('departments').add(departmentData)
                .then(() => {
                    if (departmentModal) departmentModal.hide();
                    loadDepartmentsData();
                    loadStaffData();
                    loadDepartmentCount();
                    //showToast('Department added successfully', 'success');
                })
                .catch(error => {
                    console.error('Error adding department:', error);
                    showToast('Error adding department', 'danger');
                });
        }
    }

    function deleteStaff(id) {
        db.collection('departments').where('headId', '==', id).get().then(deptSnapshot => {
            if (!deptSnapshot.empty) {
                showErrorModal('Cannot delete staff member assigned as head of a department.');
            } else {
                showConfirmation('Are you sure you want to delete this staff member?', () => {
                    db.collection('staff').doc(id).get().then(doc => {
                        if (doc.exists) {
                            const staffData = doc.data();
                            const departmentId = staffData.department;
                            db.collection('staff').doc(id).delete()
                                .then(() => {
                                    if (departmentId) {
                                        const deptRef = db.collection('departments').doc(departmentId);
                                        deptRef.update({ staffCount: firebase.firestore.FieldValue.increment(-1) });
                                    }
                                    loadStaffData();
                                    loadDepartmentsData();
                                    loadStaffCount();
                                    //showToast('Staff member deleted successfully', 'success');
                                })
                                .catch(error => {
                                    console.error('Error deleting staff:', error);
                                    showErrorModal('Error deleting staff member.');
                                });
                        }
                    });
                });
            }
        });
    }

    function deleteDepartment(id) {
        db.collection('departments').doc(id).get().then(doc => {
            if (doc.exists) {
                const department = doc.data();
                if (department.staffCount && department.staffCount > 0) {
                    showErrorModal('Cannot delete department with staff members assigned.');
                } else {
                    showConfirmation('Are you sure you want to delete this department?', () => {
                        db.collection('departments').doc(id).delete()
                            .then(() => {
                                db.collection('staff').where('department', '==', id).get().then(snapshot => {
                                    const batch = db.batch();
                                    snapshot.forEach(doc => {
                                        batch.update(doc.ref, { department: null });
                                    });
                                    batch.commit().then(() => {
                                        loadDepartmentsData();
                                        loadStaffData();
                                        loadDepartmentCount();
                                        //showToast('Department deleted successfully', 'success');
                                    });
                                });
                            })
                            .catch(error => {
                                console.error('Error deleting department:', error);
                                showErrorModal('Error deleting department.');
                            });
                    });
                }
            }
        });
    }

    function showConfirmation(message, callback) {
        const confirmationMessage = document.getElementById('confirmationMessage');
        const confirmActionBtn = document.getElementById('confirmActionBtn');
        const cancelActionBtn = document.getElementById('cancelActionBtn');
        const errorOkBtn = document.getElementById('errorOkBtn');

        if (!confirmationMessage || !confirmActionBtn || !cancelActionBtn || !errorOkBtn) return;

        confirmationMessage.textContent = message;
        actionCallback = callback;

        confirmActionBtn.style.display = 'inline-block';
        cancelActionBtn.style.display = 'inline-block';
        errorOkBtn.style.display = 'none';

        if (confirmationModal) confirmationModal.show();
    }

    function showErrorModal(message) {
        const confirmationMessage = document.getElementById('confirmationMessage');
        const confirmActionBtn = document.getElementById('confirmActionBtn');
        const cancelActionBtn = document.getElementById('cancelActionBtn');
        const errorOkBtn = document.getElementById('errorOkBtn');

        if (!confirmationMessage || !confirmActionBtn || !cancelActionBtn || !errorOkBtn) return;

        confirmationMessage.textContent = message;

        confirmActionBtn.style.display = 'none';
        cancelActionBtn.style.display = 'none';
        errorOkBtn.style.display = 'inline-block';

        if (confirmationModal) confirmationModal.show();
    }

    function updateExpertiseTags() {
        if (!expertiseContainer) return;
        
        expertiseContainer.innerHTML = '';
        
        expertiseTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-tag="${tag}">&times;</span>
            `;
            expertiseContainer.appendChild(tagElement);
        });
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'expertiseInput';
        input.placeholder = expertiseTags.length ? '' : 'Add expertise';
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const tag = this.value.trim();
                if (tag && !expertiseTags.includes(tag)) {
                    expertiseTags.push(tag);
                    updateExpertiseTags();
                    this.value = '';
                }
            }
        });
        
        expertiseContainer.appendChild(input);
        if (staffExpertise) {
            staffExpertise.value = expertiseTags.join(',');
        }
        
        document.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', function() {
                const tagToRemove = this.dataset.tag;
                expertiseTags = expertiseTags.filter(tag => tag !== tagToRemove);
                updateExpertiseTags();
            });
        });
    }

    function toggleStaffFieldsByType() {
        const staffTypeSelect = document.getElementById('staffType');
        if (!staffTypeSelect) return;
        
        const staffType = staffTypeSelect.value;
        const coursesContainer = document.getElementById('coursesTaughtContainer');
        const publicationsContainer = document.getElementById('publicationsContainer');
        const keyResponsibilitiesContainer = document.getElementById('keyResponsibilitiesContainer');
        const educationContainer = document.querySelector('#staffEducation').parentElement;

        if (!coursesContainer || !publicationsContainer || !keyResponsibilitiesContainer || !educationContainer) return;

        if (staffType === 'admin') {
            coursesContainer.style.display = 'none';
            publicationsContainer.style.display = 'none';
            keyResponsibilitiesContainer.style.display = 'block';
            educationContainer.classList.remove('col-md-6');
            educationContainer.style.width = '100%';
        } else {
            coursesContainer.style.display = 'block';
            publicationsContainer.style.display = 'block';
            keyResponsibilitiesContainer.style.display = 'none';
            educationContainer.classList.add('col-md-6');
            educationContainer.style.width = '';
        }
    }

    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast show align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '1100';
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Load staff content by default on page load
        loadPageContent('staff-content.html').then(() => {
            initializeAdminDashboard();
        });

        // Add event listener for Staff sidebar button
        const staffSidebarBtn = document.getElementById('staffSidebarBtn');
        if (staffSidebarBtn) {
            staffSidebarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadPageContent('staff-content.html').then(() => {
                    initializeAdminDashboard();
                    const pageTitle = document.getElementById('pageTitle');
                    if (pageTitle) pageTitle.textContent = 'Staff Management';
                });
            });
        }
    });
})();
