import express from 'express';
import sqlite3 from 'sqlite3';
import path from "path";


const db = new sqlite3.Database(path.resolve('db.sqlite'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})

//let sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, username, password)';
//db.run(sql);

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({success: true});
})

app.listen(1234, () => {
    console.log('Running on 1234');
})