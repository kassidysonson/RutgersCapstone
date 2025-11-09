import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import PostProject from './components/PostProject.jsx';
import StudentProfile from './components/StudentProfile.jsx';
import ForStudents from './components/ForStudents.jsx';
import BrowseProjects from './components/BrowseProjects.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import About from './components/About.jsx';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);

      if (data.session) {
        // ✅ User is logged in — go to their dashboard
        navigate(`/dashboard/${data.session.user.id}`);
      }
    };

    checkSession();

    // 👂 Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate(`/dashboard/${session.user.id}`);
      } else {
        navigate("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  
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
      </Routes>
    </div>
  );
}

export default App;