import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import logo from './components/images/logo.png'; 

// Dynamically set the favicon
const link = document.createElement('link');
link.rel = 'icon';
link.href = logo;
document.head.appendChild(link);

// Ensure the root element exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found!");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);