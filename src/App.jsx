import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import PostProject from './components/PostProject.jsx';
import StudentProfile from './components/StudentProfile.jsx';
import ForStudents from './components/ForStudents.jsx';
import BrowseProjects from './components/BrowseProjects.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/profile/:id" element={<StudentProfile />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/browse-projects" element={<BrowseProjects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;