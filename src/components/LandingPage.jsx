import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">JoinUp</div>
          <nav className="landing-nav">
            <a href="#" className="landing-nav-link">Our Story</a>
            <a href="#" className="landing-nav-link">Collaborate</a>
            <a href="#" className="landing-nav-link">Sign in</a>
          </nav>
          <button className="landing-btn-get-started">Get started</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <div className="landing-content-wrapper">
          {/* Left Section */}
          <div className="landing-left">
            <h1 className="landing-headline">
              <span className="landing-headline-word">Connect.</span>
              <span className="landing-headline-word">Collaborate.</span>
              <span className="landing-headline-word">Create.</span>
            </h1>
            <p className="landing-description">
              The platform where students hire students, founders find talent, and everyone gains real-world experience.
            </p>
            <button className="landing-btn-start-connecting">Start Connecting</button>
          </div>

          {/* Right Section */}
          <div className="landing-right">
            <img 
              src="/src/assets/getty.jpg" 
              alt="Students collaborating" 
              className="landing-image"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-links">
            <a href="#" className="landing-footer-link">Help</a>
            <a href="#" className="landing-footer-link">Status</a>
            <a href="#" className="landing-footer-link">About</a>
            <a href="#" className="landing-footer-link">Careers</a>
            <a href="#" className="landing-footer-link">Press</a>
            <a href="#" className="landing-footer-link">Blog</a>
            <a href="#" className="landing-footer-link">Privacy</a>
            <a href="#" className="landing-footer-link">Rules</a>
            <a href="#" className="landing-footer-link">Terms</a>
            <a href="#" className="landing-footer-link">Text to speech</a>
          </div>
          <div className="landing-footer-help">
            <div className="landing-help-icon">?</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

