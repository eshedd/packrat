// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'; // You can add some global styles here if needed
import App from './App';

// Render the main App component into the root div in index.html
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);