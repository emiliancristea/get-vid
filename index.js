const express = require('express');
const path = require('path'); // Added path module
const app = express();
const port = 3000;

// Serve static files from the 'public' directory (or root in this case)
app.use(express.static(path.join(__dirname))); // Serve files from the root directory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html as the main page
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
