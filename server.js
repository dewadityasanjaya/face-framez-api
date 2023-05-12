const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'Aditya',
            email: 'aditya@email.com',
            password: 'adit1234',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Krisna',
            email: 'krisna@email.com',
            password: '4321krisna',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users.slice(-1)[0]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('User not Found!');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('User not Found!');
    }
})

app.listen(3000, () => {
    console.log("Port 3000 is working!");
});