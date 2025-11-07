import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { supabase } from '../supabaseClient';

const Header = () => {
  const location = useLocation();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const s = window.supabaseSession;
      if (!s?.user?.id) { setFullName(''); return; }
      const { data, error } = await supabase.from('users').select('full_name').eq('id', s.user.id).maybeSingle();
      if (!error && data?.full_name) setFullName(data.full_name);
    };
    loadProfile();
  }, [location.pathname]);
  
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    window.location.href = '/#how-it-works';
  };

  // Hide header on login page, signup page, and landing page (they have their own headers)
  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/src/assets/logo.svg" alt="JoinUp Logo" className="logo-svg" />
          
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <a href="/" className="nav-link" onClick={handleHomeClick}>Home</a>
          <Link to="/for-students" className="nav-link">Find Students</Link>
          <Link to="/browse-projects" className="nav-link">Browse Projects</Link>
          <Link to="/about" className="nav-link">Our Story</Link>
          <a href="./how-it-works" className="nav-link" onClick={handleHowItWorksClick}>How it Works</a>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search skills, projects, or students..." 
              className="search-input"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          {fullName ? (
            <span className="btn-login" style={{ cursor: 'default' }}>{fullName}</span>
          ) : (
            <>
              <a href="/dashboard/5" className="btn-dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </a>
              <Link to="/login">
              
              <button className="btn-login">Log In</button>
              </Link>
              <Link to="/signup">
              <button className="btn-signup">Sign Up</button>
              </Link>
            </>
          )}
          
        </div>
      </div>
        </header>
  );
};

export default Header;
