const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('./database');

const app = express();
app.use(express.json());

app.post('/items', async (req, res) => {
    try {
        const item = {
            id: uuid(),
            name: req.body.name,
            completed: false,
        };
        await db.storeItem(item);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        await db.updateItem(req.params.id, {
            name: req.body.name,
            completed: req.body.completed,
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        await db.removeItem(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'todo-write-service' });
});

db.init().then(() => {
    app.listen(3002, () => console.log('Todo Write Service listening on port 3002'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
