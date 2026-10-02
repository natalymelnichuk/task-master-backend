

require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./config/db');
// const routes = require('./routes');

 
const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// app.use(routes);

// Testing the API endpoint
app.get('/', (req, res) => {
  res.send('TaskMaster API is running...');
});
 
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});

