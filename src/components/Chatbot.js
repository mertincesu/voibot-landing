import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, Zap, Brain, Globe, Code, Mic, PaperclipIcon, BarChart, Settings, X, ChevronDown } from 'lucide-react';

const ChatbotInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeBot, setActiveBot] = useState('assistant');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBotOptions, setShowBotOptions] = useState(false);
  const messagesEndRef = useRef(null);

  const botTypes = {
    assistant: { icon: <Brain className="w-6 h-6" />, name: "AI Assistant", color: "from-indigo-500 to-purple-600" },
    translator: { icon: <Globe className="w-6 h-6" />, name: "Translator", color: "from-indigo-500 to-purple-600" },
    coder: { icon: <Code className="w-6 h-6" />, name: "Code Helper", color: "from-indigo-500 to-purple-600" },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "This is a simulated response from the chatbot.";
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row h-[80vh]">
            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col">
              {/* Bot Type Selector */}
              <div className="bg-gray-100 p-4">
                <div className="md:hidden">
                  <button
                    onClick={() => setShowBotOptions(!showBotOptions)}
                    className="w-full px-4 py-2 bg-white rounded-lg shadow text-left flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      {botTypes[activeBot].icon}
                      <span className="ml-2">{botTypes[activeBot].name}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 transform transition-transform ${showBotOptions ? 'rotate-180' : ''}`} />
                  </button>
                  {showBotOptions && (
                    <div className="mt-2 space-y-2">
                      {Object.entries(botTypes).map(([key, bot]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setActiveBot(key);
                            setShowBotOptions(false);
                          }}
                          className={`w-full px-4 py-2 rounded-lg transition-colors ${
                            activeBot === key 
                              ? `bg-gradient-to-r ${bot.color} text-white`
                              : 'bg-white text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            {bot.icon}
                            <span className="ml-2">{bot.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex justify-center space-x-4">
                  {Object.entries(botTypes).map(([key, bot]) => (
                    <button
                      key={key}
                      onClick={() => setActiveBot(key)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        activeBot === key 
                          ? `bg-gradient-to-r ${bot.color} text-white`
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {bot.icon}
                        <span className="ml-2">{bot.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow p-6 overflow-y-auto">
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
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-indigo-100 text-indigo-900' 
                          : `bg-gradient-to-r ${botTypes[activeBot].color} text-white`
                      }`}>
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`bg-gradient-to-r ${botTypes[activeBot].color} text-white p-3 rounded-lg animate-pulse`}>
                      VoiBot is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="bg-gray-100 p-4">
                <div className="flex items-center space-x-2">
                  <button type="button" className="text-gray-400 hover:text-indigo-600">
                    <Mic className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="button" className="text-gray-400 hover:text-indigo-600">
                    <PaperclipIcon className="w-6 h-6" />
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "300px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-gray-100 p-4 border-l border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Chat Info</h2>
                    <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="font-semibold mb-2">Chat Statistics</h3>
                      <BarChart className="w-full h-32 text-indigo-600" />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="font-semibold mb-2">Settings</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                          <span>Customize Responses</span>
                        </li>
                        <li className="flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                          <span>Notification Preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          <BarChart className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatbotInterface;