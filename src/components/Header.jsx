import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { supabase } from "../supabaseClient";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  // ✅ Proper logout — clears session everywhere
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.supabaseSession = null; // clear global session reference
    navigate("/login"); // use React Router instead of window.location
  };

  // ✅ Load user’s name from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user?.id) {
        setFullName("");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!error && profile?.full_name) setFullName(profile.full_name);
    };

    loadProfile();

    // 🔁 Update header when auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => listener.subscription.unsubscribe();
  }, [location.pathname]);

  // ✅ Use navigate() instead of reloading the page
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/"); // ← use React Router navigation
    }
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    navigate("/#how-it-works"); // same: client-side navigation
  };

  // 🧩 Hide header on login/signup/landing pages
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
        {/* 🔹 Logo */}
        <Link to="/" className="logo" onClick={handleHomeClick}>
          <img src="/assets/logo.svg" alt="JoinUp Logo" className="logo-svg" />
        </Link>

        {/* 🔹 Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/for-students" className="nav-link">
            Find Students
          </Link>
          <Link to="/browse-projects" className="nav-link">
            Browse Projects
          </Link>
          <Link to="/about" className="nav-link">
            Our Story
          </Link>
          <a href="#how-it-works" className="nav-link" onClick={handleHowItWorksClick}>
            How it Works
          </a>
        </nav>

        {/* 🔹 Search Bar */}
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

        {/* 🔹 Actions */}
        <div className="header-actions">
          {fullName ? (
            <>
              <span className="btn-login" style={{ cursor: "default" }}>
                {fullName}
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
