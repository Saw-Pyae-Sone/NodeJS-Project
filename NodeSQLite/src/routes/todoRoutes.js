import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    const getTodo = db.prepare("SELECT * FROM todos WHERE user_Id = ?");
    const todos = getTodo.all(req.userId);
    res.json(todos);
})

router.post('/', (req, res) => {
    const { task } = req.body;
    const insertTodo = db.prepare("INSERT INTO todos(user_id, task) VALUES(?,?)");
    insertTodo.run(req.userId, task)
    res.json({id: insertTodo.lastInsertRowid, task, completed: 0})
})

router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params

    const updateTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    updateTodo.run(completed, id)
    res.json({message: "To do completed"})
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deletetodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deletetodo.run(id, userId)
    res.send({message: "Todo Deleted"})
})

export default router