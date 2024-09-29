import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import JoinUs from './components/JoinUs';
import Chatbot from './components/Chatbot';
import LibDocumentation from './components/LibDocumentation';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/demo" element={<Chatbot />} />
        <Route path="/library-documentation" element={<LibDocumentation />} />
      </Routes>
    </div>
  );
}

export default App;