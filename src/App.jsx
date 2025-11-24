import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

const setGlobalSession = (value) => {
  if (typeof window !== "undefined") {
    window.supabaseSession = value;
  }
};
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PostProject from "./components/PostProject.jsx";
import StudentProfile from "./components/StudentProfile.jsx";
import ForStudents from "./components/ForStudents.jsx";
import BrowseProjects from "./components/BrowseProjects.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import About from "./components/About.jsx";
import HowItWorksPage from "./components/HowItWorksPage.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 On mount, check for active session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setGlobalSession(data.session);
      setLoading(false);
    };
    getSession();

    // 🔹 Watch for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("🔁 Auth event:", event, "New session:", !!newSession);

      setSession(newSession);
      setGlobalSession(newSession);

      // 🚫 Ignore initial session (prevents dashboard loop)
      if (event === "INITIAL_SESSION") return;

      if (event === "SIGNED_IN" && newSession) {
        console.log("✅ User just logged in");
        // Redirect to dashboard from login/signup pages, or if user is on home page
        if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/") {
          navigate(`/dashboard/${newSession.user.id}`, { replace: true });
        }
      }

      if (event === "SIGNED_OUT") {
        setGlobalSession(null);
        console.log("🚪 User logged out");
        if (
          location.pathname.startsWith("/dashboard") ||
          location.pathname.startsWith("/post-project") ||
          location.pathname.startsWith("/profile")
        ) {
          navigate("/login");
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // 🔹 Prevent access to protected routes if not logged in
  useEffect(() => {
    if (!loading && !session) {
      const protectedRoutes = ["/dashboard", "/post-project", "/profile"];
      if (protectedRoutes.some((path) => location.pathname.startsWith(path))) {
        navigate("/login");
      }
    }
  }, [loading, session, location.pathname, navigate]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/profile/:id" element={<StudentProfile />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse-projects" element={<BrowseProjects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        
      </Routes>
    </div>
  );
}

export default App;