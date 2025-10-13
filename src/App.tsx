import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import Login from './pages/LoginPage';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;