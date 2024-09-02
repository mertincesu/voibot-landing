import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import JoinUs from './components/JoinUs';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/joinus" element={<JoinUs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
