import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* Left Column - Text and Buttons */}
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="title-line">Connect.</span>
              <span className="title-line">Collaborate.</span>
              <span className="title-line title-small">Create.</span>
            </h1>
            
            <p className="hero-description">
              The platform where students hire students, founders find talent, and everyone gains real-world experience.
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
              <button className="btn-secondary">
                Browse Talent
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 21-3-3m0 0a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83Z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">2,500+</div>
                  <div className="stat-label">Active Students</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Projects Posted</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                    <path d="M4 22h16"/>
                    <path d="M10 14.66V17c0 .55.47.98.97 1.21l1.03.5c.5.23 1.03.23 1.5 0l1.03-.5c.5-.23.97-.66.97-1.21v-2.34"/>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="hero-right">
            <div className="hero-image">
              <img 
                src="/src/assets/hero-image.png" 
                alt="StudyCollab workspace setup with laptop, coffee, and study materials"
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;