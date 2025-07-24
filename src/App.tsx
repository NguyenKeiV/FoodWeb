import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import FullMenu from './pages/FullMenu';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<FullMenu />} />
      </Routes>
    </div>
  );
}

export default App;