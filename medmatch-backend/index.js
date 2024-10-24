const express = require('express');
const app = express();
const port = 5000;

// Define your /api route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the MedMatch API' });
});

// Example: Adding another API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the MedMatch API!' });
  console.log(`Backend is running on port ${port}`);
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Doctor A' }, { id: 2, name: 'Doctor B' }]);
});

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
