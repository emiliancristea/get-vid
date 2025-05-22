const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const progressText = document.getElementById('progressText');

downloadBtn.addEventListener('click', async () => {
    const videoUrl = videoUrlInput.value;
    if (!videoUrl) {
        alert('Please enter a video URL');
        return;
    }

    progressText.textContent = 'Sending request to server...';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),
        });

        const result = await response.json();

        if (response.ok) {
            progressText.textContent = result.message;
            alert(result.message); // For now, just alert the simulated message
        } else {
            progressText.textContent = `Error: ${result.error}`;
            alert(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Error during download request:', error);
        progressText.textContent = 'Download request failed. See console for details.';
        alert('Download request failed. Check the console for more information.');
    }
});
