# TrialsAndStats Website with AI Chatbot

A professional website for TrialsAndStats with integrated Google Gemini chatbot functionality.

## Features

- **Main Website** (`index.html`): Professional landing page for biostatistical services
- **AI Chatbot** (`chatbot.html`): Interactive AI assistant powered by Google Gemini API
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Professional Styling**: Glass morphism effects and modern UI

## AI Chatbot Setup

### Prerequisites

1. Get a Google AI Studio API key from [Google AI Studio](https://aistudio.google.com/)
2. Have a modern web browser with JavaScript enabled

### Configuration

1. Open `js/chatbot.js`
2. Replace `'your-gemini-api-key-here'` with your actual Google AI Studio API key:
   ```javascript
   this.apiKey = 'your-gemini-api-key-here';
   ```

### Security Considerations

**⚠️ Important**: For production use, never expose your API key in client-side code. Instead:

1. **Backend Proxy**: Create a backend service that handles Google Gemini API calls
2. **Environment Variables**: Use server-side environment variables
3. **API Gateway**: Implement authentication and rate limiting

### Example Backend Implementation

Here's a simple Node.js backend example for Google Gemini:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
            parts: [{
                text: req.body.message
            }]
        }],
        system_instruction: {
            parts: [{
                text: "Your system prompt here"
            }]
        }
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## File Structure

```
my-website/
├── index.html          # Main landing page
├── chatbot.html        # AI chatbot interface
├── js/
│   ├── chatbot.js      # Chatbot functionality
│   └── script.js       # Main site scripts
├── css/
│   └── style.css       # Additional styles
├── static/
│   ├── css/
│   │   └── main.css    # Compiled styles
│   └── js/
│       └── main.js     # React bundle (if applicable)
└── README.md           # This file
```

## Usage

1. Open `index.html` in a web browser to view the main site
2. Click "AI Assistant" in the navigation to access the chatbot
3. Ask questions about clinical trials, biostatistics, or automation tools

## Chatbot Capabilities

The AI assistant is specialized in:
- Clinical trial design and methodology
- Biostatistics and statistical analysis
- Regulatory compliance (FDA, EMA, ICH guidelines)
- SDTM mapping and clinical data automation
- Audit-ready documentation

## Development

To modify the chatbot:

1. **Styling**: Edit styles in `chatbot.html` or create separate CSS file
2. **Functionality**: Modify `js/chatbot.js` for new features
3. **Prompts**: Update the `systemPrompt` in `chatbot.js` to change AI behavior

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private project for TrialsAndStats.

---

**Note**: This implementation provides a starting point for Google Gemini integration. For production deployment, implement proper security measures and backend infrastructure.