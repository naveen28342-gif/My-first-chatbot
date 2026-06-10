// Session management
let sessionId = localStorage.getItem("chatSessionId");
if (!sessionId) {
  sessionId = `session_${Date.now()}`;
  localStorage.setItem("chatSessionId", sessionId);
}

// API base URL for the local server
const API_BASE = "http://localhost:3000";

// DOM Elements
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const status = document.getElementById("status");
const messageCount = document.getElementById("messageCount");

// Check API connection on page load
window.addEventListener("load", async () => {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    if (response.ok) {
      updateStatus("Ready", "normal");
    } else {
      updateStatus("Server error", "error");
    }
  } catch (error) {
    updateStatus("Connection failed", "error");
  }
});

/**
 * Send message to chatbot
 */
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Get selected mode
  const mode = document.querySelector('input[name="mode"]:checked').value;

  // Disable input while sending
  userInput.disabled = true;
  sendBtn.disabled = true;
  updateStatus("Sending...", "loading");

  // Remove welcome message on first message
  const welcome = chatBox.querySelector(".welcome-message");
  if (welcome) {
    welcome.remove();
  }

  // Display user message
  displayMessage(message, "user");
  userInput.value = "";

  try {
    // Call backend API
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
        mode,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorText = data?.details || data?.error || response.statusText;
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (data.error) {
      displayMessage(
        `❌ Error: ${data.error}\n\n${data.details || ""}`,
        "assistant"
      );
      updateStatus("Error", "error");
    } else {
      // Display assistant response
      displayMessage(data.reply, "assistant");
      updateStatus("Ready", "normal");
      updateMessageCount(data.messageCount);
    }
  } catch (error) {
    console.error("Error:", error);
    displayMessage(
      `❌ Failed to connect to server.\n\nError: ${error.message}\n\nMake sure the server is running and the Gemini API key is set in the .env file.`,
      "assistant"
    );
    updateStatus("Error", "error");
  }

  // Re-enable input
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
}

/**
 * Display a message in the chat box
 */
function displayMessage(text, role) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  if (role === "assistant" && typeof marked !== "undefined") {
    contentDiv.innerHTML = marked.parse(text);
  } else {
    contentDiv.textContent = text;
  }

  messageDiv.appendChild(contentDiv);

  // Add timestamp
  const timeDiv = document.createElement("div");
  timeDiv.className = "message-time";
  timeDiv.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  messageDiv.appendChild(timeDiv);

  chatBox.appendChild(messageDiv);

  // Auto-scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Clear conversation
 */
async function clearConversation() {
  if (!confirm("Clear all messages? This cannot be undone.")) return;

  try {
    const response = await fetch(`${API_BASE}/api/clear/${sessionId}`, {
      method: "POST",
    });

    if (response.ok) {
      // Clear chat box
      chatBox.innerHTML = `
        <div class="welcome-message">
          <h2>Fresh Start! 🌟</h2>
          <p>Conversation cleared. Ready for a new chat!</p>
        </div>
      `;
      updateStatus("Ready", "normal");
      updateMessageCount(0);
      sessionId = `session_${Date.now()}`;
      localStorage.setItem("chatSessionId", sessionId);
    }
  } catch (error) {
    console.error("Error clearing conversation:", error);
    updateStatus("Error", "error");
  }
}

/**
 * Update status display
 */
function updateStatus(text, type = "normal") {
  status.textContent = text;
  status.className = `status ${type}`;
}

/**
 * Update message count display
 */
function updateMessageCount(count) {
  messageCount.textContent = `Messages: ${count}`;
}

/**
 * Event Listeners
 */
sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearConversation);

// Send message on Enter key
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Focus input on load
userInput.focus();
