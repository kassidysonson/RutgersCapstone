import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import PostProject from './components/PostProject.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/post-project" element={<PostProject />} />
      </Routes>
    </div>
  );
}

export default App;