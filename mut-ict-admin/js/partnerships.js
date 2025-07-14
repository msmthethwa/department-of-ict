(function() {
    // Global variables
    let partnershipsDataTable = null;
    let currentPartnershipId = null;
    let actionCallback = null;

    // DOM elements references
    let addPartnershipBtn, addPartnershipModal, addPartnershipForm;
    let editPartnershipModal, editPartnershipForm;
    let deleteConfirmationModal, confirmDeleteBtn;
    let logoUploadContainer, partnerLogoInput, logoPreview, logoUrlInput, uploadProgress;
    let editLogoUploadContainer, editPartnerLogoInput, editLogoPreview, editLogoUrlInput, editUploadProgress;
    let filterDropdown, filterOptions;

    function initializePartnershipsDashboard() {
        initializeDOMReferences();
        initializeDataTable();
        loadPartnershipsData();
        setupEventListeners();
    }

    function initializeDOMReferences() {
        addPartnershipBtn = document.querySelector('[data-bs-target="#addPartnershipModal"]');
        addPartnershipModal = new bootstrap.Modal(document.getElementById('addPartnershipModal'));
        addPartnershipForm = document.getElementById('addPartnershipForm');

        editPartnershipModal = new bootstrap.Modal(document.getElementById('editPartnershipModal'));
        editPartnershipForm = document.getElementById('editPartnershipForm');

        deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        logoUploadContainer = document.getElementById('logoUploadContainer');
        partnerLogoInput = document.getElementById('partnerLogo');
        logoPreview = document.getElementById('logoPreview');
        logoUrlInput = document.getElementById('logoUrl');
        uploadProgress = document.getElementById('uploadProgress');

        editLogoUploadContainer = document.getElementById('editLogoUploadContainer');
        editPartnerLogoInput = document.getElementById('editPartnerLogo');
        editLogoPreview = document.getElementById('editLogoPreview');
        editLogoUrlInput = document.getElementById('editLogoUrl');
        editUploadProgress = document.getElementById('editUploadProgress');

        filterDropdown = document.getElementById('filterDropdown');
        filterOptions = document.querySelectorAll('.filter-option');
    }

    function initializeDataTable() {
        if (partnershipsDataTable) {
            partnershipsDataTable.destroy();
            $('#partnershipsTable').empty();
        }

        partnershipsDataTable = $('#partnershipsTable').DataTable({
            responsive: true,
            data: [],
            columns: [
                {
                    data: 'logo',
                    render: function(data) {
                        return `<img src="${data || 'https://via.placeholder.com/100'}" class="partner-logo" alt="Partner logo" style="max-width: 100px;">`;
                    }
                },
                { data: 'name' },
                { data: 'type' },
                { data: 'category' },
                { data: 'description' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary edit-partnership-btn" data-id="${data.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-partnership-btn" data-id="${data.id}">
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
        $('#partnershipsTable').on('click', '.edit-partnership-btn', function() {
            const partnershipId = $(this).data('id');
            openEditPartnershipModal(partnershipId);
        });

        $('#partnershipsTable').on('click', '.delete-partnership-btn', function() {
            const partnershipId = $(this).data('id');
            openDeleteConfirmation(partnershipId);
        });
    }

    function loadPartnershipsData() {
        db.collection('partnerships').get().then(snapshot => {
            const partnerships = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                partnerships.push(data);
            });

            if (partnershipsDataTable) {
                partnershipsDataTable.clear().rows.add(partnerships).draw();
            }
        });
    }

    function setupEventListeners() {
        if (addPartnershipForm) {
            addPartnershipForm.addEventListener('submit', function(e) {
                e.preventDefault();
                savePartnership();
            });
        }

        if (editPartnershipForm) {
            editPartnershipForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updatePartnership();
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                if (actionCallback) actionCallback();
                if (deleteConfirmationModal) deleteConfirmationModal.hide();
            });
        }

        if (logoUploadContainer) {
            logoUploadContainer.addEventListener('click', () => {
                if (partnerLogoInput) partnerLogoInput.click();
            });
        }

        if (partnerLogoInput) {
            partnerLogoInput.addEventListener('change', handleLogoUpload);
        }

        if (editLogoUploadContainer) {
            editLogoUploadContainer.addEventListener('click', () => {
                if (editPartnerLogoInput) editPartnerLogoInput.click();
            });
        }

        if (editPartnerLogoInput) {
            editPartnerLogoInput.addEventListener('change', handleEditLogoUpload);
        }

        filterOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.dataset.filter;
                filterPartnerships(filter);
            });
        });
    }

    function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (logoPreview) {
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
            }
            if (logoUploadContainer) logoUploadContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);

        uploadImageToImgBB(file, logoUrlInput, uploadProgress);
    }

    function handleEditLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (editLogoPreview) {
                editLogoPreview.src = e.target.result;
                editLogoPreview.style.display = 'block';
            }
            if (editLogoUploadContainer) editLogoUploadContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);

        uploadImageToImgBB(file, editLogoUrlInput, editUploadProgress);
    }

    function uploadImageToImgBB(file, urlInput, progressElement) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', IMGBB_API_KEY);

        if (progressElement) {
            progressElement.style.display = 'block';
            const progressBar = progressElement.querySelector('.progress-bar');
            if (progressBar) progressBar.style.width = '0%';
        }

        fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (urlInput) urlInput.value = data.data.url;
                showToast('Image uploaded successfully', 'success');
            } else {
                showToast('Image upload failed', 'danger');
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            showToast('Error uploading image', 'danger');
        })
        .finally(() => {
            if (progressElement) progressElement.style.display = 'none';
        });
    }

    function savePartnership() {
        if (!addPartnershipForm.checkValidity()) {
            addPartnershipForm.classList.add('was-validated');
            return;
        }

        const partnershipData = {
            name: document.getElementById('partnerName').value,
            type: document.getElementById('partnerType').value,
            category: document.getElementById('partnerCategory').value,
            description: document.getElementById('partnerDescription').value,
            logo: logoUrlInput.value || '',
            tags: getSelectedTags('add'),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('partnerships').add(partnershipData)
            .then(() => {
                if (addPartnershipModal) addPartnershipModal.hide();
                loadPartnershipsData();
                showToast('Partnership added successfully', 'success');
                addPartnershipForm.reset();
                resetLogoUpload();
            })
            .catch(error => {
                console.error('Error adding partnership:', error);
                showToast('Error adding partnership', 'danger');
            });
    }

    function openEditPartnershipModal(id) {
        currentPartnershipId = id;

        db.collection('partnerships').doc(id).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('editPartnerId').value = id;
                document.getElementById('editPartnerName').value = data.name || '';
                document.getElementById('editPartnerType').value = data.type || '';
                document.getElementById('editPartnerCategory').value = data.category || '';
                document.getElementById('editPartnerDescription').value = data.description || '';
                editLogoUrlInput.value = data.logo || '';
                if (editLogoPreview) {
                    editLogoPreview.src = data.logo || '';
                    editLogoPreview.style.display = data.logo ? 'block' : 'none';
                }
                if (editLogoUploadContainer) {
                    editLogoUploadContainer.style.display = data.logo ? 'none' : 'block';
                }
                setSelectedTags('edit', data.tags || []);
                if (editPartnershipModal) editPartnershipModal.show();
            }
        });
    }

    function updatePartnership() {
        if (!editPartnershipForm.checkValidity()) {
            editPartnershipForm.classList.add('was-validated');
            return;
        }

        const id = document.getElementById('editPartnerId').value;
        const partnershipData = {
            name: document.getElementById('editPartnerName').value,
            type: document.getElementById('editPartnerType').value,
            category: document.getElementById('editPartnerCategory').value,
            description: document.getElementById('editPartnerDescription').value,
            logo: editLogoUrlInput.value || '',
            tags: getSelectedTags('edit'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('partnerships').doc(id).update(partnershipData)
            .then(() => {
                if (editPartnershipModal) editPartnershipModal.hide();
                loadPartnershipsData();
                showToast('Partnership updated successfully', 'success');
            })
            .catch(error => {
                console.error('Error updating partnership:', error);
                showToast('Error updating partnership', 'danger');
            });
    }

    function openDeleteConfirmation(id) {
        currentPartnershipId = id;
        if (deleteConfirmationModal) deleteConfirmationModal.show();
    }

    function deletePartnership() {
        if (!currentPartnershipId) return;

        db.collection('partnerships').doc(currentPartnershipId).delete()
            .then(() => {
                if (deleteConfirmationModal) deleteConfirmationModal.hide();
                loadPartnershipsData();
                showToast('Partnership deleted successfully', 'success');
            })
            .catch(error => {
                console.error('Error deleting partnership:', error);
                showToast('Error deleting partnership', 'danger');
            });
    }

    function getSelectedTags(prefix) {
        const container = document.querySelectorAll(`#${prefix}PartnershipForm .form-check-input`);
        const selectedTags = [];
        container.forEach(input => {
            if (input.checked) {
                selectedTags.push(input.value);
            }
        });
        return selectedTags;
    }

    function setSelectedTags(prefix, tags) {
        const container = document.querySelectorAll(`#${prefix}PartnershipForm .form-check-input`);
        container.forEach(input => {
            input.checked = tags.includes(input.value);
        });
    }

    function resetLogoUpload() {
        if (logoPreview) {
            logoPreview.src = '';
            logoPreview.style.display = 'none';
        }
        if (logoUploadContainer) {
            logoUploadContainer.style.display = 'block';
        }
        if (partnerLogoInput) {
            partnerLogoInput.value = '';
        }
        if (logoUrlInput) {
            logoUrlInput.value = '';
        }
    }

    function filterPartnerships(filter) {
        if (!partnershipsDataTable) return;

        if (filter === 'all') {
            partnershipsDataTable.column(2).search('').draw();
        } else {
            partnershipsDataTable.column(2).search('^' + filter + '$', true, false).draw();
        }
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // No automatic initialization here; initialized when content is loaded dynamically
    });
})();
