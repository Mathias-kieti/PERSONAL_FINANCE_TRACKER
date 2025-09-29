// src/index.js

import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
