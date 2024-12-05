// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import App from './App';
import './styles.css';
import 'reactflow/dist/style.css';

const root = createRoot(document.getElementById('root'));
root.render(
    <ReactFlowProvider>
        <App />
    </ReactFlowProvider>
);