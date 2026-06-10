# Friendly AI Assistant Chatbot 🤖

A modern, friendly AI chatbot built with Node.js, Express, and Google Gemini. Chat with your helpful AI assistant with conversation memory, summarization, and a beautiful UI.

## ✨ Features

- **💬 Chat Interface**: Beautiful, responsive chat UI with real-time messaging
- **🤖 AI Powered**: Uses Google Gemini for intelligent responses
- **📝 Conversation Memory**: Stores chat history during your session
- **📋 Summarizer**: Summarize long text or articles quickly
- **🎯 Friendly Personality**: AI responds like a supportive, helpful friend
- **⚡ Fast & Lightweight**: Built with Express.js and vanilla JavaScript
- **📱 Responsive Design**: Works great on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- A Gemini API key (set `GEMINI_API_KEY` in `.env`)

### Installation

1. **Clone or navigate to the project folder**

```bash
cd "my first chat bot"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

> **Get your API Key**: Add your Gemini API key to `.env` and use the `.env.example` template.

4. **Start the server**

```bash
# Development (with auto-reload)
npm run dev

# Or regular start
npm start
```

5. **Open in browser**

Navigate to: `http://localhost:3000`

## 🎯 How to Use

### Chat Mode
- Type any question or topic
- The AI responds like a friendly assistant
- Your conversation is remembered in this session

### Summarize Mode
- Select "📋 Summarize" mode
- Paste long text or article content
- Get a clear, concise summary

### Clear Conversation
- Click "🗑️ Clear" to start a fresh chat
- All messages will be cleared

## 🔧 How It Works

### Architecture

```
Frontend (HTML/CSS/JS)
        ↓
Express Server
        ↓
Google Gemini API
        ↓
Response → Stored in Session Memory
```

### System Prompt

The AI follows this personality:
- Warm and friendly, like a supportive friend
- Explains things clearly and simply
- Honest about limitations
- Practical and solution-focused
- Conversational tone with personality

## 📚 API Endpoints

### `POST /api/chat`
Send a message and get a response.

**Request:**
```json
{
  "message": "What is JavaScript?",
  "sessionId": "session_123456",
  "mode": "chat"
}
```

**Response:**
```json
{
  "reply": "JavaScript is...",
  "sessionId": "session_123456",
  "messageCount": 2
}
```

### `GET /api/history/:sessionId`
Get conversation history for a session.

### `POST /api/clear/:sessionId`
Clear conversation history.

### `GET /api/health`
Check if the server is running.

## 🌍 Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `GEMINI_API_KEY` | Your Gemini API key | `AIzaSy...` |
| `PORT` | Server port (default: 3000) | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## 📂 Project Structure

```
my first chat bot/
├── public/
│   ├── index.html        # Chat UI
│   ├── style.css         # Styling
│   └── chat.js           # Frontend logic
├── src/
│   └── server.js         # Express server & Gemini integration
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .env                  # Your secrets (git ignored)
├── README.md             # This file
└── .gitignore            # Git ignore rules
```

## 🚀 Next Steps (Optional Enhancements)

### Add Internet Search
Currently, the AI uses Gemini. For real-time info:

```javascript
// You can add a custom search function
async function searchWeb(query) {
  // Use Google Search API or other service
  // Return results to Gemini
}
```

### Add Database Storage
Replace in-memory history with MongoDB or PostgreSQL:

```javascript
// Store conversations in database instead of conversationHistories
```

### Add User Authentication
- Implement login/signup
- Save per-user conversation history
- Use JWT tokens

### Add File Upload
- Allow users to upload documents
- Extract text and summarize
- Store file content

## 🐛 Troubleshooting

### "Failed to connect to server"
- Make sure the server is running (`npm start`)
- Check if port 3000 is available

### "Connection failed" or "Server error"
- Verify your internet connection
- Check `.env` file has the API key set

### API Key errors
- Add a Gemini API key to `.env`
- Make sure it's in the `.env` file (not in quotes)
- Restart the server after changing `.env`

### Messages not showing
- Check browser console for errors (F12)
- Check server console for API errors
- Make sure Gemini API key is valid

## 💡 Tips

- **Longer responses?** The summarize mode is great for extracting key points
- **Remember context?** Each session remembers your conversation
- **Want to share?** Copy and paste messages, or export chat history
- **Customize personality?** Edit the `SYSTEM_PROMPT` in `server.js`

## 📄 License

ISC

## 🤝 Contributing

Feel free to modify and improve this chatbot! Some ideas:

- Add voice input/output
- Implement real database
- Add user login system
- Integrate web search
- Add more AI models
- Create mobile app version

---

**Enjoy chatting with your friendly AI assistant! 🌟**
