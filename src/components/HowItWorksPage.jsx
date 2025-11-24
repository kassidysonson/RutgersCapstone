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
         
          <h1 className="page-title">How JoinUp Works</h1>
          
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
      </div>
    </div>
  );
};

export default HowItWorksPage;

