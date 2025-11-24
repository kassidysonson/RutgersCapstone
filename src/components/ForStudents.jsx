import React from 'react';
import './ForStudents.css';
import FindStudents from './FindStudents';

const ForStudents = () => {
  return (
    <div className="for-students-page">
      <div className="for-students-header">
        <h1 className="page-title">For Students</h1>
      </div>

      <div className="find-students-wrapper">
        <FindStudents />
      </div>
    </div>
  );
};

export default ForStudents;