import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Home from './pages/Home/Home';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;