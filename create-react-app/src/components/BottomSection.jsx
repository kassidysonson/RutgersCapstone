import React from 'react';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <section className="bottom-section">
      <div className="bottom-container">
        <h2 className="bottom-title">Ready to Get Started?</h2>
        <p className="bottom-description">
          Join thousands of students who are already building amazing projects together
        </p>
        <div className="bottom-actions">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default BottomSection;