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
          <span className="logo-text">StudyCollab</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="#find-students" className="nav-link">Find Students</a>
          <a href="#browse-projects" className="nav-link">Browse Projects</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
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
          <button className="btn-post-project">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Post Project
          </button>
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
