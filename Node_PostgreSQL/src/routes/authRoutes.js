import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import prisma from "../prismaclient.js";

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        const defaultTodo = "Hello Add your todo first";
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log(process.env.JWT_SECRET);
        return res.json({ token }); 

    } catch (err) {
        console.log(err.message);
        return res.status(503).json({ message: "Service unavailable, please try again later" });
    }
});

router.post('/login', async (req, res) => {

    const {username, password} = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

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