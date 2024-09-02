import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import JoinUs from './components/JoinUs';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/joinus" element={<JoinUs />} />
      </Routes>
    </div>
  );
}

export default App;