import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import About from './About.jsx';
import './LandingPage.css';
import './About.css';

const LandingPage = () => {
  const videoRef = useRef(null);
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session;
      setSession(currentSession);

      if (currentSession?.user) {
        const userId = currentSession.user.id;
        const userEmail = currentSession.user.email;
        setUserId(userId);

        // Try to get full_name from users table
        const { data: profile, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .maybeSingle();

        if (!error && profile?.full_name) {
          setDisplayName(profile.full_name);
          const first = profile.full_name.split(' ')[0];
          setFirstName(first);
        } else {
          setDisplayName(userEmail);
          setFirstName(userEmail);
        }
      } else {
        setDisplayName('');
        setFirstName('');
        setUserId(null);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        checkSession();
      } else {
        setDisplayName('');
        setFirstName('');
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Video handling
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

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setSession(null);
    setDisplayName('');
    setFirstName('');
    setUserId(null);
  };

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
            <Link to="/" className="landing-logo">
              <img 
                src="/assets/Rutgers Capstone Logo.png" 
                alt="JoinUp Logo" 
                className="landing-logo-img"
              />
            </Link>
            <div className="landing-header-actions">
              {!loading && session && userId ? (
                <>
                  <Link to={`/dashboard/${userId}`} className="landing-btn-login">
                    Dashboard
                  </Link>
                  <button className="landing-btn-get-started" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="landing-btn-login">Log In</button>
                  </Link>
                  <Link to="/signup">
                    <button className="landing-btn-get-started">Sign Up</button>
                  </Link>
                </>
              )}
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
              {!loading && session && userId ? (
                <Link to={`/dashboard/${userId}`}>
                  <button className="landing-btn-start-connecting">Go to Dashboard</button>
                </Link>
              ) : (
                <Link to="/signup">
                  <button className="landing-btn-start-connecting">Get Started</button>
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* Scroll Down Arrow */}
        <button 
          className="scroll-down-arrow"
          onClick={() => {
            const aboutSection = document.querySelector('.about-page, .about-section, #about');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Scroll to About section"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* About Section */}
      <About />
    </div>
  );
};

export default LandingPage;

