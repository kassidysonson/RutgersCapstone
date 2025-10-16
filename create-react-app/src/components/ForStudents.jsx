import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForStudents.css';

const ForStudents = () => {
  return (
    <div className="for-students-page">
      <div className="for-students-header">
        <Link to="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Home
        </Link>
        <h1 className="page-title">For Students</h1>
      </div>

      <div className="for-students-content">
        <h2>Opportunities for Students</h2>
        <p>
          Explore projects, collaborate with teams, and gain real-world experience.
        </p>
        <p>
          This page will later include student profiles, available projects, and filters by skill or major.
        </p>
      </div>
    </div>
  );
};

export default ForStudents;