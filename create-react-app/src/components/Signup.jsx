import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";
import "./Form.css";

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

    if (!firstName || !lastName || !email || !password || !heardFrom) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    setMessage("🔄 Creating your account...");

    try {
      // Hash password client-side to match existing PHP bcrypt usage
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert directly into users table (no Supabase Auth)
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          // id omitted -> default gen_random_uuid() will populate
          email: email,
          password: hashedPassword,
          full_name: `${firstName} ${lastName}`,
          university: null,
          bio: null,
          // created_at omitted -> default now()
        });

      if (insertError) {
        console.error("User insert error:", insertError);
        setMessage(`❌ Could not create user: ${insertError.message}`);
        return;
      }

      setMessage(`✅ Welcome, ${firstName}! Your JoinUP account has been created.`);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(`❌ Error creating account: ${error.message}`);
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