const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let idCounter = 1;

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = {
        id: idCounter++,
        title,
        description: description || "",
        status: "pending",
        createdAt: new Date()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
    let result = [...tasks];

    const { status, sort } = req.query;

    if (status) {
        result = result.filter(task => task.status === status);
    }

    if (sort === 'createdAt') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.json(result);
});

app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({ message: 'Nothing to update' });
    }

    if (title) task.title = title;
    if (description) task.description = description;

    res.json(task);
});

app.patch('/tasks/:id/done', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    task.status = "done";
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(index, 1);
    res.json({ message: 'Task deleted successfully' });
});

app.use((req, res) => {
    res.status(405).json({ message: 'Method Not Allowed' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
