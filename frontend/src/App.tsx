import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleApp from './components/SimpleApp';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<SimpleApp />} />
      </Routes>
    </Router>
  );
}

export default App;
