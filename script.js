const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const progressText = document.getElementById('progressText');

downloadBtn.addEventListener('click', async () => {
    const videoUrl = videoUrlInput.value;
    if (!videoUrl) {
        alert('Please enter a video URL');
        return;
    }

    progressText.textContent = 'Requesting video from server...';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),
        });

        if (response.ok) {
            // If response is OK, server is streaming the video
            progressText.textContent = 'Video stream received, preparing download...';
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
            progressText.textContent = 'Download started!';
            alert('Download should start shortly.');
        } else {
            // If server sends an error (e.g., not a YouTube URL, or other server error)
            const result = await response.json(); // Expect JSON error message
            progressText.textContent = `Error: ${result.error}`;
            alert(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Error during download request:', error);
        progressText.textContent = 'Download request failed. See console for details.';
        alert('Download request failed. Check the console for more information.');
    }
});
