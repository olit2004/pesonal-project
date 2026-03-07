import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { AuthProvider } from './service/AuthContext.jsx';
import { DataProvider } from './service/DataContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);