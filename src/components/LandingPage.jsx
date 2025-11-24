import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import About from './About.jsx';
import './LandingPage.css';
import './About.css';

const LandingPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Play video once when component mounts
    video.play().catch(err => {
      console.log('Video autoplay prevented:', err);
    });

    // When video ends, pause it on the last frame
    const handleEnded = () => {
      video.pause();
      // Seek to the last frame to keep it visible
      video.currentTime = video.duration - 0.1;
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="landing-page-wrapper">
      {/* Landing Hero Section with Video */}
      <div className="landing-page">
        {/* Video Background */}
        <video
          ref={videoRef}
          className="landing-video-bg"
          src="/landingpage.mp4"
          muted
          playsInline
          loop={false}
        />

        {/* Overlay for better text readability */}
        <div className="landing-overlay"></div>

        {/* Header */}
        <header className="landing-header">
          <div className="landing-header-container">
            <Link to="/" className="landing-logo">JoinUp</Link>
            <div className="landing-header-actions">
              <Link to="/login">
                <button className="landing-btn-login">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="landing-btn-get-started">Sign Up</button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="landing-main">
          <div className="landing-content-wrapper">
            <div className="landing-left">
              <h1 className="landing-headline">
                Become a Innovator
              </h1>
              <p className="landing-description">
                Your Journey Starts Here
              </p>
              <Link to="/signup">
                <button className="landing-btn-start-connecting">Get Started</button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* About Section */}
      <About />
    </div>
  );
};

export default LandingPage;

