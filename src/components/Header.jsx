import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { supabase } from "../supabaseClient";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");

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
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      // Try to get full_name from your users table
      const { data: profile, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      if (!error && profile?.full_name) {
        setDisplayName(profile.full_name);
      } else {
        // Fallback: show email if no full_name found
        setDisplayName(userEmail);
      }
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
    navigate("/#how-it-works");
  };

  // Hide header on login/signup/landing
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/landing"
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
          <a
            href="./how-it-works"
            className="nav-link"
            onClick={handleHowItWorksClick}
          >
            How it Works
          </a>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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

        {/* Actions */}
        <div className="header-actions">
          {displayName ? (
            <>
              <span className="btn-login" style={{ cursor: "default" }}>
                {displayName}
              </span>
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
    </header>
  );
};

export default Header;
