/*
Filename: Complex_Code.js
Description: This code is a sophisticated and elaborate example of a web application that includes various features such as user authentication, data manipulation, and interactive UI elements.
*/

// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize the Express application
const app = express();

// Middleware
app.use(bodyParser.json());

// Database mockup
const users = [];

// Routes

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if username is already taken
    if (users.some(user => user.username === username)) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };
    
    // Add user to the database
    users.push(user);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = users.find(user => user.username === username);
    
    // Check if user exists
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    
    // Compare hashed passwords
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, 'your_secret_key');
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route
app.get('/protected', (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    
    // Find user by ID
    const user = users.find(user => user.id === decoded.id);
    
    // Check if user exists
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ message: 'Protected resource accessed successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});