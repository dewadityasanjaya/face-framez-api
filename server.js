const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credential')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
});

// POST USER REGISTER
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))
})

// GET USER PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

// PUT UPDATE ENTRIES COUNT
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
})

// APP LISTENER
app.listen(3000, () => {
    console.log("Port 3000 is working!");
});