// URL -> http://localhost:8383
const express = require('express');
const app = express();
const PORT = 8383;

let data = ['James'];

// middelware
app.use(express.json());

// website endpoints (sending HTML elements)
app.get('/', (req, res) => {
    res.send(`
        <body style="background: pink; color:blue">
            <h1>Data:</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
    `);
})

app.get('/dashboard', (req, res) => {
    res.send(`
        <body style="background: pink; color:blue">
            <h1>Dashboard:</h1>
            <a href="/">Home</a>
        </body>
    `);
})

// API endpoints (non-visual)

app.get('/api/data', (req, res) => {
    console.log("This is for the website");
    res.status(201).send(data);
})

app.post('/api/data', (req, res) => {
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);
})

app.delete('/api/data', (req, res) => {
    data.pop();
    console.log("We deleted the data of the array");
    res.sendStatus(203);
})

app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`);
})