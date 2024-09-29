import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Settings, Linkedin, BookOpen } from 'lucide-react';
import { ReactTyped } from 'react-typed';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* New Top Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-2xl text-gray-800">Voi<span className="text-indigo-600">Bot</span></span>
            </div>
            <div className="flex-grow flex justify-center items-center space-x-8">
            </div>
            <button onClick={() => navigate('/joinus')} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">
              Join Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-gray-50 to-gray-150 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Create AI Chatbots for{' '}
              <span className="text-indigo-600">
                <ReactTyped
                  strings={['Customer Support', 'FAQ Automation', 'E-commerce', 'HR Support', 'Educational Resources' ]}
                  typeSpeed={80}
                  backSpeed={50}
                  backDelay={2000}
                  loop
                />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Ready to transform your customer interactions? Design, deploy, and manage intelligent conversational AI assistants in minutes.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition duration-300 cursor-not-allowed opacity-50"
                disabled
              >
              Coming Soon
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="bg-white text-gray-800 border-2 border-gray-800 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300"
                >
                See Demo
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* New VoiBot Python Library Section */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <BookOpen className="w-24 h-24 text-indigo-600 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Harness the Power of VoiBot with Our Python Library
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock the full potential of AI-driven conversations in your Python projects. Our comprehensive library puts the power of VoiBot at your fingertips, enabling seamless integration and limitless possibilities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/library-documentation')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Explore Documentation
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features for Your AI Assistants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Bot className="w-10 h-10 text-indigo-600" />}
              title="Intuitive Bot Creation"
              description="Build custom chatbots with our easy-to-use interface. No coding required."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-indigo-600" />}
              title="Instant Deployment"
              description="Integrate your chatbots instantly to web, mobile, or messaging platforms using our API."
            />
            <FeatureCard
              icon={<Settings className="w-10 h-10 text-indigo-600" />}
              title="Advanced Customization"
              description="Fine-tune your bot's responses, personality, and knowledge base."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How VoiBot Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            <StepCard number={1} title="Define Your Bot" description="Set your bot's purpose, personality, and knowledge base." />
            <StepCard number={2} title="Train & Test" description="Use our intuitive interface to train and refine your bot's responses." />
            <StepCard number={3} title="Deploy & Monitor" description="Launch your bot and gain insights from user interactions." />
          </div>
        </div>
      </section>

      {/* Join the Team Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Team of AI Innovators</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
            Are you passionate about AI and chatbots? We're always looking for talented individuals to help shape the future of conversational AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
                onClick={() => navigate('/joinus')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
                Join Us
            </button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">VoiBot</div>
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com" className="hover:text-indigo-400 transition duration-300">About</a>
              <a href="https://www.linkedin.com" className="hover:text-indigo-400 transition duration-300">Features</a>
              <a href="https://www.linkedin.com" className="hover:text-indigo-400 transition duration-300">Contact</a>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="https://www.linkedin.com/company/voiai/" className="flex items-center hover:text-indigo-400 transition duration-300">
                <Linkedin className="w-5 h-5 mr-2" />
                Linkedin
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2024 Voi AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full">
    <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;