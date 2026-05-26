const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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


app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    const systemPrompt = "You are a helpful AI business assistant. You help small business owners understand how AI and automation can save them time and money. Be concise, friendly, and practical. Do not use overly complex jargon.";
    const groqApiKey = process.env.GROQ_API_KEY;

    try {
        if (groqApiKey) {
            // Production: Groq
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${groqApiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Groq API Error:", data);
                return res.status(500).json({ error: "Groq API error: " + (data.error?.message || "Unknown error") });
            }
            res.json({ response: data.choices[0].message.content });
        } else {
            // Development: Local Ollama
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3:latest",
                    prompt: `${systemPrompt}\n\nUser: ${userMessage}\nAI:`,
                    stream: false
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Ollama Error:", data);
                return res.status(500).json({ error: "Local Ollama error" });
            }
            res.json({ response: data.response });
        }
    } catch (err) {
        console.error("Chat API fetch error:", err);
        res.status(500).json({ error: "Failed to communicate with AI model: " + err.message });
    }
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
