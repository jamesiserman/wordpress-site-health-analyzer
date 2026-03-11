import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleApp from './components/SimpleApp';
import { PricingPage } from './components/PricingPage';
import { InformationPages } from './components/InformationPages';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleApp />} />
        <Route path="/pricing" element={<PageShell><PricingPage /></PageShell>} />
        <Route path="/security" element={<PageShell><InformationPages pageType="security" /></PageShell>} />
        <Route path="/privacy" element={<PageShell><InformationPages pageType="privacy" /></PageShell>} />
        <Route path="/accessibility" element={<PageShell><InformationPages pageType="accessibility" /></PageShell>} />
        <Route path="/docs" element={<PageShell><InformationPages pageType="docs" /></PageShell>} />
      </Routes>
    </BrowserRouter>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="tessera-app">
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default App;
