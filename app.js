const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/save-user-sequence', (req, res) => {
    const sequenceData = req.body; // This should be an array of objects

    sequenceData.forEach(data => {
        const insertQuery = `INSERT INTO user_sequences (x_position, y_position, user_id, width, height, time) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertQuery, [data.x, data.y, data.user_id, data.width, data.height, data.time], function(err) {
            if (err) {
                return console.error(err.message);
            }
        });
    });

    res.status(200).send('Sequence data saved successfully');
});


app.post('/save-results', (req, res) => {
    const { type, user_id, score, time, sequence } = req.body;
    const insertQuery = `INSERT INTO results (type, user_id, score, time, sequence) VALUES (?, ?, ?, ?, ?)`;
    console.log(req.body);
    db.run(insertQuery, [type, user_id, score, time, sequence], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(`Result saved with ID: ${this.lastID}`);
        }
    });
});



const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./myDatabase.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});
db.run(`CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT,
  score INTEGER,
  time REAL,
  sequence TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});
db.run(`CREATE TABLE IF NOT EXISTS block_sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  sequence_index INTEGER,
  x_position REAL,
  y_position REAL,
  width REAL,
  height REAL,
  timestamp INTEGER
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});
db.run(`CREATE TABLE IF NOT EXISTS user_sequences  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x_position REAL,
    y_position REAL,
    user_id INTEGER,
    width REAL,
    height REAL,
    time REAL
)`,(err)=> {
    if (err) {
    console.error(err.message);
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/password.html');
});
