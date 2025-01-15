import express from 'express';
import prisma from '../prismaclient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const todo = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })

    res.json(todo);
})

router.post('/', async (req, res) => {
    const { task } = req.body;
    
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json(todo)
})

router.put('/:id', async (req, res) => {
    const { completed } = req.body
    const { id } = req.params

    const updateTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updateTodo)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    res.send({message: "Todo Deleted"})
})

export default router