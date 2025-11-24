import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to play video when component mounts
    video.play().catch(err => {
      console.log('Video autoplay prevented:', err);
    });
  }, []);

  return (
    <div className="how-it-works-page">
      <div className="how-it-works-page-container">
        {/* Header Section */}
        <div className="how-it-works-header">
          <Link to="/" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
          <h1 className="page-title">How JoinUp Works</h1>
          <p className="page-subtitle">
            Learn how to get started and make the most of JoinUp
          </p>
        </div>

        {/* Tutorial Video Section */}
        <div className="tutorial-video-section">
          <h2 className="section-title">Tutorial Video</h2>
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="tutorial-video"
              src="/tutorial-video.mp4"
              controls
              playsInline
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <p className="video-note">
              📹 Place your tutorial video file named <strong>tutorial-video.mp4</strong> in the <strong>public</strong> folder
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="steps-section">
          <h2 className="section-title">Getting Started</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Account</h3>
              <p className="step-description">
                Sign up with your email to get started. No password needed - we'll send you a magic link!
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Complete Your Profile</h3>
              <p className="step-description">
                Add your skills, university, major, and availability to help others find you.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Browse or Post Projects</h3>
              <p className="step-description">
                Explore available projects or post your own project to find collaborators.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Connect & Collaborate</h3>
              <p className="step-description">
                Message students, discuss project details, and start working together.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="feature-title">Discover Opportunities</h3>
              <p className="feature-description">
                Browse projects and talented students based on skills, experience level, and availability.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 21-3-3m0 0a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83Z"/>
                </svg>
              </div>
              <h3 className="feature-title">Connect & Collaborate</h3>
              <p className="feature-description">
                Message directly, discuss project details, and agree on terms that work for everyone.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Build & Grow</h3>
              <p className="feature-description">
                Work together, learn new skills, and create amazing projects that boost your portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join JoinUp today and start connecting with talented students and exciting projects.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary-large">
              Sign Up Now
            </Link>
            <Link to="/browse-projects" className="btn-secondary-large">
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

