import React from 'react';
import Hero from './Hero.jsx';
import HowItWorks from './HowItWorks.jsx';
import FindStudents from './FindStudents.jsx';
import PerfectForStudents from './PerfectForStudents.jsx';
import BottomSection from './BottomSection.jsx';

const Home = () => {
  return (
    <div className="App">
      <Hero />
      <HowItWorks />
      <FindStudents />
      <PerfectForStudents />
      <BottomSection />
    </div>
  );
};

export default Home;


