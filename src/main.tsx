import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/prompt/latin-400.css';
import '@fontsource/prompt/latin-500.css';
import '@fontsource/prompt/latin-600.css';
import '@fontsource/prompt/latin-700.css';
import '@fontsource/prompt/latin-ext-400.css';
import '@fontsource/prompt/latin-ext-500.css';
import '@fontsource/prompt/latin-ext-600.css';
import '@fontsource/prompt/latin-ext-700.css';
import '@fontsource/prompt/thai-400.css';
import '@fontsource/prompt/thai-500.css';
import '@fontsource/prompt/thai-600.css';
import '@fontsource/prompt/thai-700.css';
import './app/i18n';
import { App } from './app/App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
