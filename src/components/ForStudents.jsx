import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForStudents.css';
import FindStudents from './FindStudents';

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

      <div className="find-students-wrapper">
        <FindStudents />
      </div>
    </div>
  );
};

export default ForStudents;