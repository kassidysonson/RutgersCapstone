import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔹 prevent refresh

    const storedData = localStorage.getItem("joinupUser");
    console.log("Stored user data:", storedData);

    if (!storedData) {
      setMessage("⚠️ No user found. Please sign up first.");
      return;
    }

    const user = JSON.parse(storedData);
    console.log("Parsed user:", user);

    if (email === user.email && password === user.password) {
      setMessage(`✅ Welcome back, ${user.firstName}!`);
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard/5');
      }, 1500); // Wait 1.5 seconds to show success message
    } else {
      setMessage("❌ Invalid email or password. Try again.");
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

export default Login;