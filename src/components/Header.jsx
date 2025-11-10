import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session when Header loads
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, newSession) => setSession(newSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="header">
      <div className="nav-left">
        <a href="/" className="logo">CollabConnect</a>
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
              Logout
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
