import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteContentProvider } from './contexts/SiteContentContext';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import './App.css';

function App() {
  return (
    <SiteContentProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLogin />} />
          </Routes>
        </div>
      </Router>
    </SiteContentProvider>
  );
}

export default App;