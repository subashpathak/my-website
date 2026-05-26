const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Initialize JSON database
async function initDb() {
    try {
        await fs.access(MESSAGES_FILE);
    } catch {
        await fs.writeFile(MESSAGES_FILE, JSON.stringify([]));
    }
}
initDb();

// Serve static files
app.use(express.static(__dirname, {
    index: ['index.html']
}));

app.post('/api/contact', async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
    }

    try {
        const fileData = await fs.readFile(MESSAGES_FILE, 'utf-8');
        const messages = JSON.parse(fileData);
        
        const newMessage = {
            id: Date.now(),
            email,
            message,
            created_at: new Date().toISOString()
        };
        
        messages.push(newMessage);
        await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        
        res.json({ success: true, id: newMessage.id });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// A simple hardcoded admin password for demo purposes
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.get('/api/messages', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const fileData = await fs.readFile(MESSAGES_FILE, 'utf-8');
        let messages = JSON.parse(fileData);
        // Sort descending by created_at
        messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        res.json(messages);
    } catch (err) {
        console.error('Error reading messages:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Call the python script as per project rules for AI logic
    const pyScript = path.join(__dirname, 'scripts', 'chatbot.py');
    const pythonProcess = spawn('python3', [pyScript, userMessage]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}. Error: ${errorString}`);
            return res.status(500).json({ error: 'Failed to process chat message' });
        }
        
        try {
            const result = JSON.parse(dataString);
            res.json({ response: result.response });
        } catch (err) {
            console.error('Failed to parse Python output:', dataString);
            res.status(500).json({ error: 'Invalid response from AI model' });
        }
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
