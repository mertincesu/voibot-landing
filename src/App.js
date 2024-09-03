import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import JoinUs from './components/JoinUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/joinus" element={<JoinUs />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;