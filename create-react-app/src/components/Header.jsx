import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on other pages, navigate to homepage
      window.location.href = '/';
    }
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    // Always navigate to homepage with hash to scroll to HowItWorks section
    window.location.href = '/#how-it-works';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src="/src/assets/logo.svg" alt="JoinUp Logo" className="logo-svg" />
          
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="/" className="nav-link" onClick={handleHomeClick}>Home</a>
          <Link to="/for-students" className="nav-link">Find Students</Link>
          <Link to="/browse-projects" className="nav-link">Browse Projects</Link>
          <a href="/#how-it-works" className="nav-link" onClick={handleHowItWorksClick}>How it Works</a>
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
          <a href="/dashboard/5" className="btn-dashboard">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
        </header>
  );
};

export default Header;
