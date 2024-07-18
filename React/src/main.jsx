import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Use BrowserRouter for React Router v6
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from "./router.jsx";
import { ContextProvider } from './contexts/contextProvider.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router}/>

    </ContextProvider>
  </React.StrictMode>
);