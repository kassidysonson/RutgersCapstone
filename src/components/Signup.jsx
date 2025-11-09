import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Signup.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }

    setMessage("🔄 Sending magic link to your email...");

    try {
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? "https://rutgers-app-b05a48dc4dbb.herokuapp.com/login"
          : "http://localhost:3000/login";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });


      if (error) {
        throw error;
      }

      setMessage("✅ Check your email for a magic link to sign in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup (magic link) error:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="signup-page">
      {/* Header */}
      <header className="signup-header">
        <div className="signup-header-container">
          <Link to="/" className="signup-logo">JoinUp</Link>
        </div>
        <div className="signup-header-separator"></div>
      </header>

      {/* Main Content */}
      <main className="signup-main">
        <div className="signup-form-container">
          <h1 className="signup-heading">Join JoinUp.</h1>
          <p className="signup-subtitle">Create your account to start connecting</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form-group">
              <label htmlFor="firstName" className="signup-label">First Name</label>
              <input
                type="text"
                id="firstName"
                className="signup-input"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="lastName" className="signup-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="signup-input"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="email" className="signup-label">Email</label>
              <input
                type="email"
                id="email"
                className="signup-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="password" className="signup-label">Password</label>
              <input
                type="password"
                id="password"
                className="signup-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="heardFrom" className="signup-label">How Did You Hear About Us?</label>
              <select
                id="heardFrom"
                className="signup-input signup-select"
                value={heardFrom}
                onChange={(e) => setHeardFrom(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Community Event / Fair">Community Event / Fair</option>
                <option value="Friend">Friend</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>

            {message && <p className="signup-message">{message}</p>}

            <button type="submit" className="signup-button">Create account</button>

            <p className="signup-account-link">
              Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
            </p>

            <p className="signup-legal">
              By creating an account, you agree to our <a href="#" className="signup-legal-link">Terms of Service</a> and <a href="#" className="signup-legal-link">Privacy Policy</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
