const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

const PORT = 3000;


const usersFile = path.join(__dirname, 'users.json');
const adsFile = path.join(__dirname, 'ads.json');

// Create empty ads.json if not found
if (!fs.existsSync(adsFile)) {
  fs.writeFileSync(adsFile, '[]');
}


// Middleware
app.use(express.json());
app.use(express.static('public'));

// Load users or initialize file
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');

// Sign Up Endpoint
app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  let users = JSON.parse(fs.readFileSync(usersFile));
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  users.push({ name, email, password, role });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ message: 'Signup successful' });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  let users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});
app.post("/ads", (req, res) => {
  const newAd = req.body;
  const ads = JSON.parse(fs.readFileSync(adsFile));
  ads.push(newAd);
  fs.writeFileSync(adsFile, JSON.stringify(ads, null, 2));
  res.json({ message: "Ad submitted successfully" });
});

app.get("/", (req, res) => {
  res.send("JustAdd backend is alive.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
