import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    "ERROR: GEMINI_API_KEY is missing. Create a .env file with GEMINI_API_KEY=your_key_here"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Store conversation history (in production, use a database)
const conversationHistories = {};

// System prompt - personality and behavior
const SYSTEM_PROMPT = `You are a friendly, helpful AI assistant. Your personality:
- Warm and approachable, like a supportive friend
- Explain things clearly and simply
- Honest about what you don't know
- Practical and solution-focused
- Use casual, conversational language
- Add a touch of personality (you can be lighthearted when appropriate)
- If asked about current information or recent events, search the internet for accurate data
- When users share long text or articles, offer to summarize them clearly
- Ask follow-up questions if you need clarification`;

/**
 * Chat endpoint - handle user messages
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId, mode = "chat" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create session ID if not provided
    const id = sessionId || `session_${Date.now()}`;

    // Initialize conversation history if new session
    if (!conversationHistories[id]) {
      conversationHistories[id] = [];
    }

    // Add user message to history
    conversationHistories[id].push({
      role: "user",
      content: message,
    });

    const messageToSend =
      mode === "summarize"
        ? `Please summarize the following text clearly and concisely:\n\n${message}`
        : message;

    // Format conversation history for Gemini
    const contents = [
      ...conversationHistories[id].slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: messageToSend }] },
    ];

    // Initialize Gemini model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent({
      contents,
    });

    // Extract text from the Gemini response
    let responseText = "";
    try {
      responseText = result.response.text();
      if (!responseText) {
        responseText = "No response from Gemini API.";
      }
    } catch (parseErr) {
      console.error("Gemini response extraction error:", parseErr, result);
      responseText = "Sorry, I couldn't parse the Gemini response.";
    }

    // Add assistant response to history
    conversationHistories[id].push({
      role: "assistant",
      content: responseText,
    });

    // Send response with session ID
    res.json({
      reply: responseText,
      sessionId: id,
      messageCount: conversationHistories[id].length,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

/**
 * Get conversation history
 */
app.get("/api/history/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const history = conversationHistories[sessionId] || [];
  res.json({ history });
});

/**
 * Clear conversation history
 */
app.post("/api/clear/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  if (conversationHistories[sessionId]) {
    delete conversationHistories[sessionId];
  }
  res.json({ success: true, message: "Conversation cleared" });
});

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Chatbot server is running",
  });
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Chatbot server running at http://localhost:${PORT}`);
  console.log(`💡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(
    `📝 Make sure you have set GEMINI_API_KEY in .env file (copy from .env.example)`
  );
});
