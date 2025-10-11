import React from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import FindStudents from './components/FindStudents.jsx';
import PerfectForStudents from './components/PerfectForStudents.jsx';
import BottomSection from './components/BottomSection.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <HowItWorks />
      <PerfectForStudents />
      <FindStudents />
      <BottomSection />
    </div>
  );
}

export default App;