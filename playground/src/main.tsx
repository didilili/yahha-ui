import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app.css';
import './site/docs-shell.css';
import './site/docs-cartoon.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
