const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());

app.get('/items', async (req, res) => {
    try {
        const items = await db.getItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const item = await db.getItem(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'todo-read-service' });
});

db.init().then(() => {
    app.listen(3001, () => console.log('Todo Read Service listening on port 3001'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
