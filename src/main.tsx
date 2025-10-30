import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import QRBiz from './routes/QRBiz';
import Hans from './routes/Hans';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/qr/biz" element={<QRBiz />} />
      <Route path="/hans" element={<Hans />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);