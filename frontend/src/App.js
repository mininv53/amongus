import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import Enterprise from './pages/Enterprise';
import SharedResult from './pages/SharedResult';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={<Analyzer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/r/:id" element={<SharedResult />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
