// Upload image to imgBB
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
        if (uploadProgress) uploadProgress.style.display = 'none';
    });
}

// Image upload event listeners
document.addEventListener('DOMContentLoaded', function() {
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    const staffImageUpload = document.getElementById('staffImageUpload');
    const staffImagePreview = document.getElementById('staffImagePreview');
    const uploadProgress = document.getElementById('uploadProgress');

    if (imageUploadContainer && staffImageUpload) {
        imageUploadContainer.addEventListener('click', function() {
            staffImageUpload.click();
        });

        staffImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
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
                const removeImageBtn = document.getElementById('removeImageBtn');
                if (removeImageBtn) removeImageBtn.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);

            // Upload to imgBB
            uploadImageToImgBB(file);
        });
    }
});