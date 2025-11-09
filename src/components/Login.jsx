import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          ? "https://rutgers-app-b05a48dc4dbb.herokuapp.com/dashboard/5"
          : "http://localhost:3000/dashboard/5";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setMessage("✅ Check your email for a magic link to sign in.");
    } catch (error) {
      console.error("Login (magic link) error:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };


  
  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="login-header-container">
          <Link to="/" className="login-logo">JoinUp</Link>
        </div>
        <div className="login-header-separator"></div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-form-container">
          <h1 className="login-heading">Welcome back.</h1>
          <p className="login-subtitle">Sign in to continue to JoinUp</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">Email</label>
              <input
                type="email"
                id="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && <p className="login-message">{message}</p>}

            <button type="submit" className="login-button">Sign in</button>

            <p className="login-account-link">
              Don't have an account? <Link to="/signup" className="login-link">Create one</Link>
            </p>

            <p className="login-legal">
              By signing in, you agree to our <a href="#" className="login-legal-link">Terms of Service</a> and <a href="#" className="login-legal-link">Privacy Policy</a>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-help-icon">?</div>
      </footer>
    </div>
  );
}

export default Login;
