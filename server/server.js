
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require("./keys");
const express = require("express");
const cors =require("cors");
const body_parser =require("body-parser");

const app=express();
app.use(cors());
app.use(express.json()); 
app.use(body_parser.json());
const {Pool} = require("pg")
const fs = require('fs');
const connectionString = keys.DATABASE_URL;

const pgconnect = new Pool({
  connectionString: connectionString,
  ssl: {
      rejectUnauthorized: true ,// Depending on your SSL requirements
      ca: fs.readFileSync('./ca.pem').toString(),
    }
});


// const pgconnect = new Pool ({
//     user: keys.pguser,
//     host: keys.pghost,
//     port: keys.pgPort,
//     database: keys.pgDatabase,
//     password: keys.pgpass
// });

pgconnect.on("connect",client=> {

    //queries
   CREATE_user = ("CREATE TABLE IF NOT EXISTS appuser (uid SERIAL PRIMARY KEY,uname TEXT,password TEXT);")
    client.query(CREATE_user).catch(err => console.log("PG ERROR", err))

});



// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
}
  const hashedPassword = await bcrypt.hash(password, 10);
  pgconnect.query('INSERT INTO appuser (uname, password) VALUES ($1, $2)', [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error registering user' });
    }
    res.status(201).send({ message: 'User registered' });
  });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  pgconnect.query('SELECT * FROM appuser WHERE uname = $1', [username], async (err, result) => {
    if (err || result.rows.length === 0) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ uid: user.uid }, keys.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  });
});

// Protected route example
app.get('/profile', authenticateToken, (req, res) => {
  res.send({ message: 'This is a protected route', user: req.user });
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, keys.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000,'0.0.0.0' ,err => {
    console.log("listening on port 5000");
});
