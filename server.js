// server.js

const express = require('express');
const path = require('path');

// 1. Initialize Express
const app = express();

// 2. Define the Port
// Heroku dynamically sets the PORT environment variable.
const PORT = process.env.PORT || 5000;

// 3. Serve Static Files from the 'dist' folder
// This is the CRITICAL line that connects the server to your built website.
app.use(express.static(path.join(__dirname, 'dist')));

// 4. Handle Client-Side Routing (SPA Fallback)
// For ANY request not matching a static file, send the main index.html file.
// This allows React Router to take over and handle paths like /dashboard.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});