import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Form.css";

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
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/5`
        }
      });

      if (error) throw error;

      setMessage("✅ Check your email for a magic link to sign in.");
    } catch (error) {
      console.error("Login (magic link) error:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your JoinUP account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (unused for magic link)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="solid-button">Continue</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="footer-text">
          <a href="#">Forgot your password?</a>
          <p>Don’t have an account? <a href="/">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}

//export default Login;
export default Login;