import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { supabase } from "../supabaseClient";
import EditProfile from "./EditProfile";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userId, setUserId] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileInitials, setProfileInitials] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // 🔹 Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login"); // ✅ use navigate instead of window.location
  };

  // 🔹 Load user's profile (full name or email)
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user) {
        setDisplayName("");
        setFirstName("");
        setUserId(null);
        setProfileImageUrl(null);
        setProfileInitials(null);
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      // Try to get full_name and profile_image from your users table
      const { data: profile, error } = await supabase
        .from("users")
        .select("full_name, profile_image")
        .eq("id", userId)
        .maybeSingle();

      // Helper function to get initials
      const getInitials = (name = '') => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      };

      if (!error && profile?.full_name) {
        setDisplayName(profile.full_name);
        // Extract first name
        const first = profile.full_name.split(' ')[0];
        setFirstName(first);
      } else {
        // Fallback: show email if no full_name found
        setDisplayName(userEmail);
        setFirstName(userEmail);
      }

      // Set profile image
      const imageUrl = profile?.profile_image && 
        (profile.profile_image.startsWith('http://') || profile.profile_image.startsWith('https://'))
        ? profile.profile_image 
        : null;
      setProfileImageUrl(imageUrl);
      setProfileInitials(imageUrl ? null : getInitials(profile?.full_name || userEmail));

      setUserId(userId);
    };

    loadProfile();

    // Re-run when auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => listener.subscription.unsubscribe();
  }, [location.pathname]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    navigate("/how-it-works");
  };

  // Hide header on login/signup/landing and root (landing page)
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/landing" ||
    location.pathname === "/"
  ) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/assets/logo.svg" alt="JoinUp Logo" className="logo-svg" />
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <a href="/" className="nav-link" onClick={handleHomeClick}>
            Home
          </a>
          <Link to="/for-students" className="nav-link">
            Find Students
          </Link>
          <Link to="/browse-projects" className="nav-link">
            Browse Projects
          </Link>
          <Link to="/about" className="nav-link">
            Our Story
          </Link>
          <Link
            to="/how-it-works"
            className="nav-link"
          >
            How it Works
          </Link>
        </nav>

        {/* Empty space where search bar used to be */}
        <div className="search-container"></div>

        {/* Dashboard Link */}
        {userId && (
          <Link to={userId ? `/dashboard/${userId}` : "/dashboard"} className="nav-link dashboard-link">
            Dashboard
          </Link>
        )}

        {/* Actions */}
        <div className="header-actions">
          {displayName ? (
            <>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="header-profile-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <div className="header-profile">
                  <div className="header-profile-icon">
                    {profileImageUrl ? (
                      <img 
                        src={profileImageUrl} 
                        alt={displayName}
                        className="header-profile-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const initialsSpan = e.target.parentElement.querySelector('.header-profile-initials');
                          if (initialsSpan) {
                            initialsSpan.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <span 
                      className="header-profile-initials"
                      style={{ display: profileImageUrl ? 'none' : 'flex' }}
                    >
                      {profileInitials || 'U'}
                    </span>
                  </div>
                  <span className="header-profile-name">
                    {firstName ? `Hi, ${firstName}` : displayName}
                  </span>
                </div>
              </button>
              <button className="btn-signup" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-login">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="btn-signup">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {userId && (
        <EditProfile 
          isOpen={showEditProfile} 
          onClose={() => setShowEditProfile(false)} 
          userId={userId}
        />
      )}
    </header>
  );
};

export default Header;