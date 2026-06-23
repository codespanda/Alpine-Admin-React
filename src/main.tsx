import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/providers';
import App from './App';
import '@/app/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
