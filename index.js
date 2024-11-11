const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy in-memory data store (simulating a database)
let houseDataStore = {};

// POST endpoint to handle room selection
app.post('/select-room', (req, res) => {
  const { house_id, house_name, session_id, selected_rooms } = req.body;

  // Basic validation to ensure required fields are present
  if (!house_id || !house_name || !session_id || !selected_rooms) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulate saving data into a "database"
  if (!houseDataStore[house_id]) {
    houseDataStore[house_id] = { house_name, session_id, selected_rooms: [] };
  }

  // Add the selected room(s) to the house data
  houseDataStore[house_id].selected_rooms.push(...selected_rooms);

  // Log the selected room(s)
  console.log(`Room(s) selected for house ${house_name}: ${selected_rooms}`);

  // Respond with the updated room selection data
  res.status(200).json({
    message: 'Room selection saved successfully!',
    house_id,
    house_name,
    session_id,
    selected_rooms: houseDataStore[house_id].selected_rooms,
  });
});

// Example route to retrieve house data by ID (for testing)
app.get('/house/:house_id', (req, res) => {
  const houseId = req.params.house_id;
  if (houseDataStore[houseId]) {
    res.json(houseDataStore[houseId]);
  } else {
    res.status(404).json({ error: 'House not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
