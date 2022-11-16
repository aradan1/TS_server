import express from 'express';
import bp from 'body-parser';
import sqlite3 from 'sqlite3';
import path from "path";

import bcrypt from 'bcrypt';

// connect to db
const db = new sqlite3.Database(path.resolve('db.sqlite'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
// for the sql statements
let sql

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true}));


// get all users
app.get('/', (req, res) => {
    console.log(`GET ALL`)

    sql = 'SELECT id, username FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err})
        return res.status(200).json(rows);
    })
})

// get user by ID
app.get('/:user_id', (req, res) => {
    console.log(`GET ${req.params.user_id}`)

    sql = 'SELECT id, username FROM users WHERE id=?';
    db.all(sql, [req.params.user_id], (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err})
        return res.status(200).json(rows);
    })
})

// register a user unless USERNAME already in use
app.post('/signup', (req, res) => {
    const {username, password} = req.body;
    sql = 'SELECT id FROM users WHERE username = ?';
    db.all(sql, username, (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err})

        if (rows.length) return res.json({ status: 300, success: false, error: "Username already exists"})

        const saltRounds = 10
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return res.json({ status: 300, success: false, error: err})

                sql = 'INSERT INTO users(username,password) VALUES (?,?)'
                db.run(sql, [username, hash], (err) => {
                    if (err) return res.json({ status: 300, success: false, error: err})
                })
                return res.json({ status: 200, success: true})
            })
        })
    })
})

app.listen(1234, () => {
    console.log('Running on 1234');
})