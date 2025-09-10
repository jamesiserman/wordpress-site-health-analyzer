import React from 'react';
import SimpleApp from './components/SimpleApp';
import AdminPanel from './components/AdminPanel';

function App() {
  // Check if we're on the admin route
  const isAdminRoute = window.location.pathname === '/admin';
  
  return isAdminRoute ? <AdminPanel /> : <SimpleApp />;
}

export default App;
