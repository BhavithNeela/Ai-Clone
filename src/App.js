import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const result = await model.generateContent(userText);
      const aiText = result.response.text();

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠️ Error getting response" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-app">
      {/* Header */}
      <div className="header">AI Chat Assistant</div>

      {/* Chat Messages */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="role-label">
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <div className="role-label">AI</div>
            <div className="message-text typing">Typing...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
