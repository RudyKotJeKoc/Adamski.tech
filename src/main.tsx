import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fontsource-variable/inter';
import '@fontsource/chakra-petch/500.css';
import '@fontsource/chakra-petch/600.css';
import '@fontsource/chakra-petch/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import App from './App';
import QRBiz from './routes/QRBiz';
import Hans from './routes/Hans';
import { PageFallback } from './components/ui/PageFallback';
import './index.css';

const ProjectPage = lazy(() => import('./routes/ProjectPage'));

const projectRoute = (
  <Suspense fallback={<PageFallback />}>
    <ProjectPage />
  </Suspense>
);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/portfolio/:slug" element={projectRoute} />
      <Route path="/case-studies/:slug" element={projectRoute} />
      <Route path="/qr/biz" element={<QRBiz />} />
      <Route path="/hans" element={<Hans />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
