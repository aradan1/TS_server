import sqlite3 from 'sqlite3';
import path from "path";


const db = new sqlite3.Database(path.resolve('db.sqlite'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})

let sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, username, password)';

// creates table "users" with an index, username and password field
db.run(sql);