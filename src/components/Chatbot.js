import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, Zap, Brain, Loader } from 'lucide-react';
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

const ChatbotInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);
  const messagesEndRef = useRef(null);

  const botType = {
    assistant: { icon: <Brain className="w-6 h-6" />, name: "Voi AI Assistant", color: "from-indigo-500 to-purple-600" },
  };

  useEffect(() => {
    axios.get('https://voibot-landing-48974dd599d3.herokuapp.com/initialize')
      .then(response => {
        console.log(response.data.message);
        setIsInitialized(true);
        setInitError(null);
      })
      .catch(error => {
        console.error('Error initializing Voi AI Assistant:', error);
        setInitError('Failed to initialize Voi AI Assistant. Please try refreshing the page.');
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (text) => {
    // Remove <strong> tags
    let formattedText = text.replace(/<\/?strong>/g, '');
    
    // Remove asterisks used for bold
    formattedText = formattedText.replace(/\*\*/g, '');
    
    return formattedText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isInitialized) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('https://voibot-landing-48974dd599d3.herokuapp.com/chat', { query: input });
      const formattedText = formatMessage(response.data.response);
      setMessages(prev => [...prev, { text: formattedText, sender: 'bot', typing: true }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = formatMessage('Sorry, there was an error processing your request. Please try again.');
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot', typing: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600 mr-2"/>
              <span className="font-bold text-2xl text-gray-800">Voi<span className="text-indigo-600">Bot</span></span>
            </div>
            <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              Exit Chat
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-7xl h-[80vh] flex flex-col"
        >
          {/* Bot Type Indicator */}
          <div className="bg-gray-100 p-4">
            <div className="flex justify-center">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${botType.assistant.color} text-white`}>
                <div className="flex items-center">
                  {botType.assistant.icon}
                  <span className="ml-2">{botType.assistant.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-6">
            {!isInitialized && !initError ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : initError ? (
              <div className="text-red-500 text-center mb-4">{initError}</div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`max-w-[60%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-indigo-100 text-indigo-900' 
                        : `bg-gradient-to-r ${botType.assistant.color} text-white`
                    } text-left`}>
                      {message.sender === 'bot' && message.typing ? (
                        <TypeAnimation
                          sequence={[message.text]}
                          wrapper="span"
                          speed={80}
                          style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
                          repeat={1}
                          cursor={false}
                        />
                      ) : (
                        <span>{message.text}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`bg-gradient-to-r ${botType.assistant.color} text-white p-3 rounded-lg flex items-center`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce opacity-50"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="bg-gray-100 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask an HR-related question..."
                className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!isInitialized || isTyping}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isInitialized || isTyping}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotInterface;