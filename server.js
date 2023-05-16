const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Database Initialization
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'hyokito',
        port: 5432,
        password: '',
        database: 'face-framez'
    }
});

const app = express();

app.use(express.json())
app.use(cors())

// --- ENDPOINT --- //

// GET ALL USER DATA
app.get('/', (req, res) => {
    db.select('*').from('users')
        .then(data => res.json(data));
});

// POST USER SIGN IN
app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db, bcrypt));

// POST USER REGISTER
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt, saltRounds));

// GET USER PROFILE
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

// PUT UPDATE ENTRIES COUNT
app.put('/image', (req, res) => image.handleImage(req, res, db))

// APP LISTENER
app.listen(3000, () => {
    console.log("Port 3000 is working!");
});