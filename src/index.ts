import express, { Request, Response, NextFunction } from 'express';
import bp from 'body-parser';
import sqlite3 from 'sqlite3';
import path from "path";
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';



// connect to db
const db = new sqlite3.Database(path.resolve('db.sqlite'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
// for the sql statements
let sql;
const saltRounds = 10;

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true}));


export const SECRET_KEY: Secret = 'secret-key';
export interface CustomRequest extends Request {
 token: string | JwtPayload;
}



// Authorization token middleware
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, SECRET_KEY);
      (req as CustomRequest).token = decoded;
   
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
};



// GET all users
app.get('/', (req: Request, res: Response) => {
    try{

        sql = 'SELECT id, username FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            return res.status(200).json(rows);
        })

    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

// GET user by ID
app.get('/:user_id', (req: Request, res: Response) => {
    try{

        sql = 'SELECT id, username FROM users WHERE id=?';
        db.get(sql, [req.params.user_id], (err, rows) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            return res.status(200).json(rows);
        })
        
    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

// POST register a user unless USERNAME already in use
app.post('/signup', (req: Request, res: Response) => {
    try {
            
        const {username, password} = req.body;
        sql = 'SELECT id FROM users WHERE username = ?';
        db.get(sql, username, (err, row) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            if (row) return res.json({ status: 300, success: false, error: "Username already exists"})

            
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) return res.json({ status: 300, success: false, error: err})

                    sql = 'INSERT INTO users(username,password) VALUES (?,?)'
                    db.run(sql, [username, hash], (err) => {
                        if (err) return res.json({ status: 300, success: false, error: err})

                        
                        return res.json({ status: 200, success: true})
                    })
                })
            })
        })

    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

// POST log in a user through jsontokens
app.post('/login', (req: Request, res: Response) => {
    try {
            
        const {username, password} = req.body;
        sql = 'SELECT id,password FROM users WHERE username = ?';
        db.get(sql, username, (err, row) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            if (!row) return res.json({ status: 400, success: false, error: "user not found"})
            bcrypt.compare(password, row.password, function (err, response) {
                if (err) return res.json({ status: 300, success: false, error: err});
                
                if(!response){

                    return res.json({ status: 400, success: false});
                }else{
                    const id = row.id.toString;
                    const token = jwt.sign({ _id: id, name: username }, SECRET_KEY, {
                        expiresIn: '2 days',
                    });
                 
                    return res.status(200).send({ user: { id, username }, token: token });
                }
            })
        })
        
    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

// PUT change a user's USERNAME given it's ID
app.put('/:user_id', auth, (req: Request, res: Response) => {
    try {
        
        const {username} = req.body;
        sql = 'UPDATE users SET username = ? WHERE id = ?';
        db.run(sql, [username, req.params.user_id], (err) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            return res.json({ status: 200, success: true})
        })
        
    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

// DELETE a user given it's ID
app.delete('/:user_id', auth, (req: Request, res: Response) => {
    try{

        sql = 'DELETE FROM users WHERE id = ?';
        db.run(sql, [req.params.user_id], (err) => {
            if (err) return res.json({ status: 300, success: false, error: err})
            return res.json({ status: 200, success: true})
        })
        
    } catch (error) {
        return res.json({ status: 400, success: false})
    }
})

app.listen(1234, () => {
    console.log('Running on 1234');
})