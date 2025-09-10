import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SimpleApp from './components/SimpleApp';
import AdminPanel from './components/AdminPanel';

function DebugRouter() {
  const location = useLocation();
  console.log('Current route:', location.pathname);
  
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/" element={<SimpleApp />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <DebugRouter />
    </Router>
  );
}

export default App;
