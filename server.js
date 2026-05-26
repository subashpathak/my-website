const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static files from the current directory
// We're specifically allowing access to HTML, CSS, JS, and image directories.
app.use(express.static(__dirname, {
    index: ['index.html']
}));

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
