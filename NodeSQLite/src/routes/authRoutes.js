import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const checkUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const existingUser = checkUser.get(username);

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?,?)`);
        const result = insertUser.run(username, hashedPassword);

        const defaultTodo = "Hello Add your first todo";
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?,?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log(process.env.JWT_SECRET);
        return res.json({ token }); 
    } catch (err) {
        console.log(err.message);
        return res.status(503).json({ message: "Service unavailable, please try again later" });
    }
});

router.post('/login', (req, res) => {

    const {username, password} = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try{
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ? `);
        const user = getUser.get(username);

        if(!user){return res.status(404).send({ message: "User Not Found"})};

        const passwordInvaild = bcrypt.compareSync(password, user.password)

        if(!passwordInvaild) {return res.status(401).send({ message: "Invalid Password"})}

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token })
    }catch(err){
        console.log(err.message)
        return res.sendStatus(503);
    }
})

export default router