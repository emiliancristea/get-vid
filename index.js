const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core'); // Added ytdl-core
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  // Serve index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for video download
app.post('/download', async (req, res) => { // Made async
  const { videoUrl } = req.body;
  console.log('Received download request for:', videoUrl);

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    if (ytdl.validateURL(videoUrl)) {
      console.log('Valid YouTube URL, attempting to download...');
      // Set headers for video download
      res.header('Content-Disposition', 'attachment; filename="video.mp4"'); 
      ytdl(videoUrl, {
        format: 'mp4'
      }).pipe(res);
      // Note: Error handling for ytdl stream should be added here
    } else {
      // Placeholder for other services (TikTok, X)
      console.log(`URL is not a YouTube URL: ${videoUrl}. Other services not yet implemented.`);
      return res.status(400).json({ error: 'Currently only YouTube URLs are supported. (Simulated for others)' });
    }
  } catch (error) {
    console.error('Error during download process:', error);
    res.status(500).json({ error: 'Failed to download video.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
