import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Minimize2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ChatMessage } from '../types/type';
import knowledgeRaw from '../constants/knowledge.txt';

const ChatAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý NutriJour. Tôi có thể giúp bạn tìm bữa ăn đêm lành mạnh hoàn hảo, tư vấn dinh dưỡng, hoặc hỗ trợ đặt hàng. Bạn cần hỗ trợ gì hôm nay?",
      sender: 'bot'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_KEY = (import.meta as any).env.VITE_CHATBOT_API;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    setKnowledge(knowledgeRaw);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    // If no API key is configured, use fallback response
    if (!API_KEY) {
      setTimeout(() => {
        const fallbackResponse: ChatMessage = {
          id: Date.now() + 1,
          text: "Cảm ơn bạn đã quan tâm đến NutriJour! Hiện tại tôi đang trong quá trình cập nhật để phục vụ bạn tốt hơn. Bạn có thể xem thực đơn của chúng tôi hoặc liên hệ hotline 1900-NUTRI để được hỗ trợ trực tiếp.",
          sender: 'bot'
        };
        setChatMessages(prev => [...prev, fallbackResponse]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      // Create conversation history for API
      const historyParts = [
        {
          text: "Bạn là trợ lý tư vấn của NutriJour - dịch vụ giao đồ ăn đêm lành mạnh. Hãy trả lời ngắn gọn, thân thiện và chỉ dựa trên thông tin sau đây. Luôn khuyến khích khách hàng đặt hàng và trải nghiệm dịch vụ:",
        },
        { text: knowledge },
        { text: "Dưới đây là cuộc hội thoại với khách hàng:" },
      ];

      // Only send the last 6 messages to avoid overly long requests
      const recentMessages = [...chatMessages, userMessage].slice(-6);
      recentMessages.forEach((msg) => {
        historyParts.push({
          text: `${msg.sender === "user" ? "Khách hàng" : "Trợ lý NutriJour"}: ${msg.text}`,
        });
      });

      const response = await axios.post(
        URL,
        {
          contents: [
            {
              parts: historyParts,
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau hoặc liên hệ hotline 1900-NUTRI.";

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot'
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, có lỗi xảy ra khi kết nối. Vui lòng thử lại sau hoặc liên hệ hotline 1900-NUTRI để được hỗ trợ trực tiếp.",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen ? (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-110 animate-pulse"
          aria-label="Mở chat hỗ trợ"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý NutriJour</h3>
                <p className="text-xs text-lime-100">
                  {loading ? 'Đang trả lời...' : 'Trực tuyến • Sẵn sàng hỗ trợ'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Đóng chat"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 px-4 py-2 rounded-2xl text-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-lime-500" />
                  <span className="text-gray-500">Đang trả lời...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Hỏi về thực đơn, dinh dưỡng, đặt hàng..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm resize-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !currentMessage.trim()}
                className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white p-2 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                aria-label="Gửi tin nhắn"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Nhấn Enter để gửi • Shift+Enter để xuống dòng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;