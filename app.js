const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3001;

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'DATABASE_HOST',
    database: 'DATABASE_NAME',
    port: '3306',
    user: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware to parse JSON requests
app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(userQuery, [username], async (err, results) => {
      if (err) {
        console.error('Error querying user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const user = results[0];
  
      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        return res.json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user into the database
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserQuery, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json({ message: 'User registered successfully' });
    });
  });
  
// Routes for CRUD operations
// GET endpoint
app.get('/update', (req, res) => {
    db.query('SELECT * FROM sensor_data', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// PUT endpoint
app.put('/update/:id', (req, res) => {
    console.log('Received data:', req.body);
    const { id } = req.params;
    const { date, ph, vol } = req.body;

    db.query(
        'UPDATE sensor_data SET date = ?, ph = ?, vol = ? WHERE id = ?',
        [date, ph, vol, id],
        (err, results) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json({ message: 'Data updated successfully' });
        }
    );
});

// POST endpoint
app.post('/update', (req, res) => {
  const { date, ph, vol} = req.body;
  console.log('Received data:', req.body);
  const { phValue, tinggi } = req.body;

  db.query(
    'INSERT INTO sensor_data (date, ph, vol) VALUES (?, ?, ?)',
    [date, ph, vol],
    (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Data inserted successfully' });
    }
  );
});

// DELETE endpoint
app.delete('/update/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM sensor_data WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Data deleted successfully' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
