import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <span className="logo-s">S</span>
          </div>
          <span className="logo-text">JoinUp</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="#perfect-for-students" className="nav-link">For Students</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="/dashboard/5" className="nav-link">Dashboard</a>
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
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
        </header>
  );
};

export default Header;
