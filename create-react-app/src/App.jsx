import React from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import BottomSection from './components/BottomSection.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <BottomSection />
    </div>
  );
}

export default App;
