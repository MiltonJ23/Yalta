// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Le monde part en couille');
});

// Let's create route to our dashboard
app.use('/dashboard',require('./routes/dashboard'));

// Let's create a Register route that will allow users to register and login wheter applicant or Admin Staff 
app.use('/auth', require('./routes/jwAuth'));

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000");
  });

