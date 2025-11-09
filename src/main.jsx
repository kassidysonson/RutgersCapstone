import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Simple global session store 
window.supabaseSession = null;
supabase.auth.getSession().then(({ data }) => { window.supabaseSession = data.session || null; });
supabase.auth.onAuthStateChange((_event, session) => {
  window.supabaseSession = session || null;
  const path = window.location.pathname;
  if (session && (path === '/login' || path === '/signup')) {
    window.location.replace('/dashboard/5');
  }
}); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

