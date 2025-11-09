import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
  console.log("🔁 Auth event:", event, "New session:", !!newSession);

  setSession(newSession);

  if (newSession) {
    console.log("✅ User is signed in");
    if (location.pathname === "/login" || location.pathname === "/signup") {
      console.log("➡️ Redirecting to dashboard...");
      navigate(`/dashboard/${newSession.user.id}`);
    }
  } else {
    console.log("🚪 User is signed out");
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/post-project")
    ) {
      console.log("➡️ Redirecting to login...");
      navigate("/login");
    }
  }
});


  // 🔹 Check session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // 🔹 Watch for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        // Only redirect to dashboard if user is on login/signup
        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate(`/dashboard/${newSession.user.id}`);
        }
      } else {
        // If logged out, redirect only if currently in protected route
        if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/post-project")) {
          navigate("/login");
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // 🔹 Block access to protected routes
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
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/profile/:id" element={<StudentProfile />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse-projects" element={<BrowseProjects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
