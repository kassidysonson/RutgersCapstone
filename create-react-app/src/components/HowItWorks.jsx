import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">How JoinUp Works</h2>
        <p className="how-it-works-description">
          A simple platform designed to connect students and create opportunities for everyone
        </p>
        
        <div className="how-it-works-cards">
          <div className="how-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className="card-title">Discover Opportunities</h3>
            <p className="card-description">
              Browse projects and talented students based on skills, experience level, and availability.
            </p>
          </div>
          
          <div className="how-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3m0 0a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83Z"/>
              </svg>
            </div>
            <h3 className="card-title">Connect & Collaborate</h3>
            <p className="card-description">
              Message directly, discuss project details, and agree on terms that work for everyone.
            </p>
          </div>
          
          <div className="how-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
            </div>
            <h3 className="card-title">Build & Grow</h3>
            <p className="card-description">
              Work together, learn new skills, and create amazing projects that boost your portfolio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
