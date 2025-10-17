import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔹 stops page refresh

    if (!firstName || !lastName || !email || !password || !heardFrom) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    const user = { firstName, lastName, email, password, heardFrom };

    try {
      localStorage.setItem("joinupUser", JSON.stringify(user));
      console.log("✅ Saved user:", user);
      setMessage(`✅ Welcome, ${firstName}! Your JoinUP account has been created.`);

      // redirect to login
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error saving user:", error);
      setMessage("⚠️ Could not save user. Check console for details.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Join JoinUP</h1>
        <p className="subtitle">Connect with motivated students and innovative ideas</p>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <select value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)}>
            <option value="">How did you hear about us?</option>
            <option>Community Event / Fair</option>
            <option>Friend</option>
            <option>Social Media</option>
          </select>

          <button type="submit" className="solid-button">Continue</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="footer-text">
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;