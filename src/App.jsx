import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
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

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("🔁 Auth event:", event);

      setSession(newSession);

      if (event === "SIGNED_IN" && newSession) {
        navigate(`/dashboard/${newSession.user.id}`);
      }

      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // ✅ Always render the Header, even when loading
  if (loading) {
    return (
      <div className="App">
        <Header />
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  // ✅ Protect routes only after Supabase has finished loading
  useEffect(() => {
    if (!loading && !session) {
      const protectedRoutes = ["/dashboard", "/post-project", "/profile"];
      if (protectedRoutes.some((path) => location.pathname.startsWith(path))) {
        navigate("/login");
      }
    }
  }, [loading, session, location.pathname, navigate]);

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
