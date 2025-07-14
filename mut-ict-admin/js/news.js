// Function to initialize news dashboard after dynamic content load
function initializeNewsDashboard() {
    // DOM elements
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    const newsImageUpload = document.getElementById('newsImageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const uploadProgress = document.querySelector('.upload-progress');
    const progressBar = document.querySelector('.progress-bar');
    const editImageUploadContainer = document.getElementById('editImageUploadContainer');
    const editNewsImageUpload = document.getElementById('editNewsImageUpload');
    const editImagePreview = document.getElementById('editImagePreview');
    const saveNewsBtn = document.getElementById('saveNewsBtn');
    const updateNewsBtn = document.getElementById('updateNewsBtn');
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');
    const editTagInput = document.getElementById('editTagInput');
    const editTagContainer = document.getElementById('editTagContainer');

    // Initialize the dashboard stats
    loadDashboardStats();

    // Sidebar toggle
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            document.querySelector('.main-content').classList.toggle('active');
        });
    }

    // Image upload handling
    if (imageUploadContainer && newsImageUpload) {
        imageUploadContainer.addEventListener('click', function() {
            newsImageUpload.click();
        });
        newsImageUpload.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0], 'news');
        });
    }

    // Edit image upload handling
    if (editImageUploadContainer && editNewsImageUpload) {
        editImageUploadContainer.addEventListener('click', function() {
            editNewsImageUpload.click();
        });
        editNewsImageUpload.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0], 'edit-news');
        });
    }

    // Save news button
    if (saveNewsBtn) {
        saveNewsBtn.addEventListener('click', function() {
            saveNewsItem();
        });
    }

    // Update news button
    if (updateNewsBtn) {
        updateNewsBtn.addEventListener('click', function() {
            updateNewsItem();
        });
    }

    // Tag input handling
    if (tagInput) {
        tagInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag(this.value.trim());
                this.value = '';
            }
        });
    }

    if (editTagInput) {
        editTagInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addEditTag(this.value.trim());
                this.value = '';
            }
        });
    }

    // Remove tag buttons
    if (tagContainer) {
        tagContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag')) {
                e.target.parentElement.remove();
                updateTagsHiddenInput();
            }
        });
    }

    if (editTagContainer) {
        editTagContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag')) {
                e.target.parentElement.remove();
                updateEditTagsHiddenInput();
            }
        });
    }

    // Editor toolbar buttons
    document.querySelectorAll('[data-command]').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            if (command === 'createLink' || command === 'insertImage') {
                const url = prompt('Enter the ' + (command === 'createLink' ? 'link URL' : 'image URL'));
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, null);
            }
        });
    });
}

// Functions (unchanged)
function loadDashboardStats() {
    // In a real app, these would come from Firebase
    document.getElementById('publishedNewsCount').textContent = '24';
    document.getElementById('subscribersCount').textContent = '142';
    document.getElementById('featuredNewsCount').textContent = '5';
    document.getElementById('draftNewsCount').textContent = '3';
}

function handleImageUpload(file, type) {
    if (!file) return;
    
    const reader = new FileReader();
    const previewElement = type === 'news' ? document.getElementById('imagePreview') : document.querySelector('#editNewsModal .image-preview');
    const progressElement = type === 'news' ? document.querySelector('.upload-progress') : document.querySelector('#editNewsModal .upload-progress');
    const progressBarElement = type === 'news' ? document.querySelector('.progress-bar') : document.querySelector('#editNewsModal .progress-bar');
    const hiddenInput = type === 'news' ? document.getElementById('newsImageUrl') : document.getElementById('editNewsImageUrl');
    
    // Show preview
    reader.onload = function(e) {
        if (previewElement) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
    
    // Show progress bar
    if (progressElement && progressBarElement) {
        progressElement.style.display = 'block';
        progressBarElement.style.width = '0%';
    }
    
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
            if (hiddenInput) hiddenInput.value = data.data.url;
            
            // Update progress bar
            if (progressBarElement) {
                progressBarElement.style.width = '100%';
                setTimeout(() => {
                    if (progressElement) progressElement.style.display = 'none';
                }, 1000);
            }
        } else {
            alert('Image upload failed: ' + data.error.message);
            if (progressElement) progressElement.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
        if (progressElement) progressElement.style.display = 'none';
    });
}

// The rest of the functions (addTag, addEditTag, tagExists, editTagExists, updateTagsHiddenInput, updateEditTagsHiddenInput, saveNewsItem, updateNewsItem, getCategoryClass) remain unchanged and are omitted here for brevity.
