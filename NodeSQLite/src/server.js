import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js";
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5003;
dotenv.config();

const limiter = ({
    window: 15 * 30 * 1000,
    max: 100,
    message: "Too many requests, please request later."
});

app.use(limiter)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Routes
app.use('/auth', authRoutes)

app.use('/todos', authMiddleware, todoRoutes)



app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})