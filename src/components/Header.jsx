import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Get current session on load
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // 🔹 Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Optional: show minimal header while loading session
  if (loading) {
    return (
      <header className="header">
        <div className="nav-left">
          <a href="/" className="logo">JoinUp</a>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="nav-left">
        <a href="/" className="logo">JoinUp</a>
      </div>

      <div className="nav-right">
        {session ? (
          <>
            <button
              className="btn-dashboard"
              onClick={() => navigate(`/dashboard/${session.user.id}`)}
            >
              My Dashboard
            </button>
            <button
              className="btn-logout"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
