import React from 'react';
import './PerfectForStudents.css';

const PerfectForStudents = () => {
  return (
    <section className="perfect-for-students">
      <div className="perfect-for-students-container">
        <h2 className="perfect-for-students-title">Perfect for Every Student</h2>
        <p className="perfect-for-students-description">
          Whether you're looking to earn, learn, or build, JoinUp has something for you
        </p>
        
        <div className="perfect-for-students-cards">
          <div className="perfect-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3m0 0a2 2 0 1 0-2.83-2.83 2 2 0 0 0 2.83 2.83Z"/>
              </svg>
            </div>
            <h3 className="card-title">For Students Seeking Work</h3>
            <p className="card-description">
              Showcase your skills, find paid projects, and build real-world experience while studying.
            </p>
            <ul className="card-features">
              <li>Flexible schedule</li>
              <li>Skill development</li>
              <li>Portfolio building</li>
              <li>Network growth</li>
            </ul>
          </div>
          
          <div className="perfect-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className="card-title">For Student Founders</h3>
            <p className="card-description">
              Access talented peers at student-friendly rates to bring your startup ideas to life.
            </p>
            <ul className="card-features">
              <li>Cost-effective talent</li>
              <li>Fresh perspectives</li>
              <li>Collaborative culture</li>
              <li>Rapid prototyping</li>
            </ul>
          </div>
          
          <div className="perfect-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55.47.98.97 1.21l1.03.5c.5.23 1.03.23 1.5 0l1.03-.5c.5-.23.97-.66.97-1.21v-2.34"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <h3 className="card-title">For Learning-Focused Students</h3>
            <p className="card-description">
              Gain hands-on experience on real projects, even if you're just starting your journey.
            </p>
            <ul className="card-features">
              <li>Mentorship opportunities</li>
              <li>Real project experience</li>
              <li>Skill validation</li>
              <li>Career preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectForStudents;