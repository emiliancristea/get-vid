const videoUrlInput = document.getElementById('videoUrl');
const checkUrlBtn = document.getElementById('checkUrl');
const downloadBtn = document.getElementById('downloadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressText = document.getElementById('progressText');
const videoInfoContainer = document.getElementById('videoInfoContainer');
const videoTitle = document.getElementById('videoTitle');
const videoThumbnail = document.getElementById('videoThumbnail');
const qualitySelect = document.getElementById('qualitySelect');

let videoDetails = null;

// Helper function to validate URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Show the progress container with a message
function showProgress(message) {
    progressText.textContent = message;
    progressContainer.classList.remove('hidden');
}

// Hide the progress container
function hideProgress() {
    progressContainer.classList.add('hidden');
}

// Show video info container
function showVideoInfo() {
    videoInfoContainer.classList.remove('hidden');
}

// Hide video info container
function hideVideoInfo() {
    videoInfoContainer.classList.add('hidden');
}

// Check URL button click handler
checkUrlBtn.addEventListener('click', async () => {
    const videoUrl = videoUrlInput.value.trim();
    
    // Validate URL input
    if (!videoUrl) {
        alert('Please enter a video URL');
        return;
    }
    
    if (!isValidUrl(videoUrl)) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Show progress
    showProgress('Retrieving video information...');
    hideVideoInfo();
    
    // Disable button during check
    checkUrlBtn.disabled = true;
    checkUrlBtn.innerHTML = 'Checking... <i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/video-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),
        });

        if (response.ok) {
            // If response is OK, show video info
            videoDetails = await response.json();
            
            // Update UI with video details
            videoTitle.textContent = videoDetails.title || 'Video';
            
            // Set thumbnail if available (YouTube only)
            if (videoDetails.thumbnail) {
                videoThumbnail.src = videoDetails.thumbnail;
                videoThumbnail.style.display = 'block';
            } else {
                videoThumbnail.style.display = 'none';
            }
            
            // Clear previous quality options
            qualitySelect.innerHTML = '';
            
            // Add quality options
            videoDetails.formats.forEach(format => {
                const option = document.createElement('option');
                option.value = format.itag;
                option.textContent = `${format.qualityLabel} (${format.mimeType})`;
                qualitySelect.appendChild(option);
            });
            
            hideProgress();
            showVideoInfo();
            
        } else {
            // If server sends an error
            const result = await response.json();
            showProgress(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Error during video info request:', error);
        showProgress('Failed to retrieve video information. See console for details.');
    } finally {
        // Reset the check button
        checkUrlBtn.disabled = false;
        checkUrlBtn.innerHTML = 'Check <i class="fas fa-search"></i>';
    }
});

// Download button click handler
downloadBtn.addEventListener('click', async () => {
    if (!videoDetails) {
        alert('Please check a video URL first');
        return;
    }
    
    const videoUrl = videoUrlInput.value.trim();
    const quality = qualitySelect.value;
    
    // Show progress
    showProgress('Requesting video from server...');
    
    // Disable button during download
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl, quality }),
        });

        if (response.ok) {
            // If response is OK, server is streaming the video
            showProgress('Video stream received, preparing download...');
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            
            // Try to get filename from content-disposition header, else default
            const disposition = response.headers.get('content-disposition');
            let filename = 'video.mp4'; // Default filename
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"])(?:\\.|[^\'"])*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
            
            showProgress('Download started!');
            
            // Reset the download button after a short delay
            setTimeout(() => {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Download <i class="fas fa-download"></i>';
                // Optionally hide progress after some time
                setTimeout(hideProgress, 5000);
            }, 1000);
            
        } else {
            // If server sends an error
            try {
                const result = await response.json();
                showProgress(`Error: ${result.error}`);
            } catch (e) {
                showProgress('Download failed. Server returned an error.');
            }
            
            // Reset the download button
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = 'Download <i class="fas fa-download"></i>';
        }

    } catch (error) {
        console.error('Error during download request:', error);
        showProgress('Download request failed. See console for details.');
        
        // Reset the download button
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = 'Download <i class="fas fa-download"></i>';
    }
});
