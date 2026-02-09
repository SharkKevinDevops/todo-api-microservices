const express = require('express');
const app = express();

const READ_SERVICE_URL = process.env.READ_SERVICE_URL || 'http://localhost:3001';
const WRITE_SERVICE_URL = process.env.WRITE_SERVICE_URL || 'http://localhost:3002';

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// Proxy GET requests to read service
app.get('/items', async (req, res) => {
    try {
        const response = await fetch(`${READ_SERVICE_URL}/items`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const response = await fetch(`${READ_SERVICE_URL}/items/${req.params.id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy POST requests to write service
app.post('/items', async (req, res) => {
    try {
        const response = await fetch(`${WRITE_SERVICE_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy PUT requests to write service
app.put('/items/:id', async (req, res) => {
    try {
        const response = await fetch(`${WRITE_SERVICE_URL}/items/${req.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        if (response.ok) {
            res.sendStatus(200);
        } else {
            res.status(response.status).json({ error: 'Update failed' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy DELETE requests to write service
app.delete('/items/:id', async (req, res) => {
    try {
        const response = await fetch(`${WRITE_SERVICE_URL}/items/${req.params.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            res.sendStatus(200);
        } else {
            res.status(response.status).json({ error: 'Delete failed' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Frontend Service listening on port 3000'));
