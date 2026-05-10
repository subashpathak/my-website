class ChatBot {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.isTyping = false;
        
        // You'll need to get your Google AI Studio API key from https://aistudio.google.com/
        // For security, consider using environment variables or a backend proxy
        this.apiKey = 'your-gemini-api-key-here';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        this.systemPrompt = `You are an AI assistant for TrialsAndStats, a company specializing in biostatistical services and clinical automation tools. 

Key areas of expertise:
- Clinical trial design and methodology
- Biostatistics and statistical analysis
- Regulatory compliance (FDA, EMA, ICH guidelines)
- SDTM (Study Data Tabulation Model) mapping
- Clinical data management and automation
- Audit-ready documentation and traceability

Company focus:
- Providing 100% audit-ready biostatistical services
- Transparent, traceable AI solutions for clinical data
- Raw-to-SDTM variable mapping automation
- 'Glass-Box' audit logs for regulatory compliance

Respond professionally and knowledgeably about these topics. If asked about other topics, politely redirect to your areas of expertise while being helpful.`;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.currentTarget.querySelector('h3').textContent;
                this.handleSuggestionClick(title);
            });
        });
    }

    handleSuggestionClick(suggestion) {
        const suggestions = {
            'Clinical Trial Design': 'Can you help me understand best practices for clinical trial design and statistical planning?',
            'Statistical Analysis': 'What are the key biostatistical methods I should consider for my clinical data analysis?',
            'Automation Tools': 'Tell me about your SDTM mapping automation tools and how they ensure audit readiness.'
        };
        
        const message = suggestions[suggestion];
        if (message) {
            this.messageInput.value = message;
            this.handleSendMessage();
        }
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setTyping(true);

        try {
            // Show typing indicator
            this.showTypingIndicator();
            
            const response = await this.sendToGeminiAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble connecting right now. Please check your API configuration or try again later.', 'assistant', true);
            console.error('Chat error:', error);
        }

        this.setTyping(false);
    }

    async sendToGeminiAPI(message) {
        // Check if API key is configured
        if (this.apiKey === 'your-gemini-api-key-here') {
            return `I'd be happy to help with questions about clinical trials and biostatistics! 

However, to enable full AI responses, you'll need to:
1. Get your Google AI Studio API key from https://aistudio.google.com/
2. Replace 'your-gemini-api-key-here' in the chatbot.js file with your actual API key
3. For production use, implement a secure backend to handle API calls

For now, I can provide some general guidance:
- **Clinical Trial Design**: Focus on clearly defined endpoints, appropriate sample sizes, and robust randomization strategies
- **Biostatistics**: Consider your data distribution, choose appropriate statistical tests, and plan for missing data
- **Our Tools**: We offer automated SDTM mapping with full audit trails for regulatory compliance

What specific aspect would you like to know more about?`;
        }

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                system_instruction: {
                    parts: [{
                        text: this.systemPrompt
                    }]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message flex items-start gap-3';
        
        if (sender === 'user') {
            messageDiv.className += ' flex-row-reverse';
        }

        const avatar = document.createElement('div');
        avatar.className = `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            sender === 'user' ? 'bg-blue-600' : isError ? 'bg-red-500' : 'bg-teal-600'
        }`;
        
        const icon = document.createElement('i');
        icon.className = `fas ${
            sender === 'user' ? 'fa-user' : 'fa-robot'
        } text-white text-sm`;
        avatar.appendChild(icon);

        const bubble = document.createElement('div');
        bubble.className = `rounded-lg p-4 shadow-sm border max-w-md ${
            sender === 'user' 
                ? 'bg-blue-600 text-white ml-auto' 
                : isError 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-white'
        }`;

        const messageContent = document.createElement('div');
        messageContent.className = sender === 'user' ? 'text-white' : 'text-slate-700';
        
        // Format message content (basic markdown support)
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;

        bubble.appendChild(messageContent);
        messageDiv.appendChild(sender === 'user' ? bubble : avatar);
        messageDiv.appendChild(sender === 'user' ? avatar : bubble);

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message flex items-start gap-3';
        
        const avatar = document.createElement('div');
        avatar.className = 'w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0';
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot text-white text-sm';
        avatar.appendChild(icon);

        const bubble = document.createElement('div');
        bubble.className = 'bg-white rounded-lg p-4 shadow-sm border';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        bubble.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(bubble);
        
        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        this.sendButton.disabled = isTyping;
        this.messageInput.disabled = isTyping;
        
        if (isTyping) {
            this.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending';
            this.sendButton.className = this.sendButton.className.replace('hover:bg-teal-700', 'opacity-50 cursor-not-allowed');
        } else {
            this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
            this.sendButton.className = this.sendButton.className.replace('opacity-50 cursor-not-allowed', 'hover:bg-teal-700');
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});