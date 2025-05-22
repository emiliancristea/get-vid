const express = require('express');
const path = require('path'); // Added for path manipulation
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
app.post('/download', (req, res) => {
  const { videoUrl } = req.body;
  console.log('Received download request for:', videoUrl);

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  // Placeholder for actual download logic
  // This will be replaced with calls to video download libraries
  console.log(`Simulating download for ${videoUrl}`);
  // Simulate a successful response
  res.json({ message: `Download started for ${videoUrl}. (Simulated)` });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
