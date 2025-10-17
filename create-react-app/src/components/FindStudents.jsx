import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FindStudents.css';

const FindStudents = () => {
  const [filters, setFilters] = useState({
    experienceLevel: [],
    academicYear: [],
    major: [],
    skills: [],
    availability: []
  });

  const [activeFilters, setActiveFilters] = useState(['React']);

  const students = [
    {
      id: 1,
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      location: "Stanford, CA",
      rating: 4.9,
      reviewCount: 12,
      description: "Full-stack developer with experience in modern web technologies. Passionate about creating user-friendly applications and solving complex problems.",
      skills: ["React", "Python", "UI/UX Design", "Machine Learning"],
      availability: "20 hrs/week",
      projectsCompleted: 8,
      profileImage: "SC"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      major: "Business Administration",
      year: "Senior",
      location: "Boston, MA",
      rating: 4.8,
      reviewCount: 15,
      description: "Marketing specialist with a focus on digital strategies and brand development. Experienced in content creation and social media management.",
      skills: ["Marketing", "Content Writing", "Social Media", "Analytics"],
      availability: "15 hrs/week",
      projectsCompleted: 12,
      
      profileImage: "MJ"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      major: "Graphic Design",
      year: "Sophomore",
      location: "Austin, TX",
      rating: 4.7,
      reviewCount: 8,
      description: "Creative designer focused on brand identity and user experience. Looking to gain experience in startup environments.",
      skills: ["Figma", "Adobe Creative Suite", "Branding", "Web Design"],
      availability: "25 hrs/week",
      projectsCompleted: 5,
     
      profileImage: "ER"
    },
    {
      id: 4,
      name: "David Kim",
      major: "Data Science",
      year: "Graduate",
      location: "Seattle, WA",
      rating: 5.0,
      reviewCount: 20,
      description: "Data scientist with expertise in predictive modeling and analytics. Published research in ML conferences.",
      skills: ["Python", "R", "Machine Learning", "Data Visualization"],
      availability: "30 hrs/week",
      projectsCompleted: 15,
      
      profileImage: "DK"
    },
    {
      id: 5,
      name: "Galathara Kahanda",
      major: "Computer Science",
      year: "Graduate",
      location: "Newark, NJ",
      rating: 5.0,
      reviewCount: 3,
      description: " My research lies at the intersection of AI, ML, and cybersecurity, with the overarching goal of developing intelligent, adaptive, and robust systems that can operate securely in adversarial environments.",
      skills: ["React", "Python", "UI/UX Design", "Machine Learning"],
      availability: "20 hrs/week",
      projectsCompleted: 3,
      
      profileImage: "GK"
    }
  ];

  const majors = ["Computer Science", "Business", "Design", "Engineering", "Marketing", "Data Science"];
  const skills = ["React", "Python", "JavaScript", "UI/UX Design", "Node.js", "Figma", "Machine Learning"];
  const availabilityOptions = ["Available now", "Within 1 week", "Within 1 month", "Flexible"];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      };
      
      // Update active filters display
      const allActiveFilters = [];
      Object.entries(newFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          allActiveFilters.push(...values);
        }
      });
      setActiveFilters(allActiveFilters);
      
      return newFilters;
    });
  };

  const removeActiveFilter = (filter) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setFilters({
      experienceLevel: [],
      academicYear: [],
      major: [],
      skills: [],
      availability: []
    });
    setActiveFilters([]);
  };

  // Filter students based on current filter state
  const getFilteredStudents = () => {
    return students.filter(student => {
      // Check experience level
      if (filters.experienceLevel.length > 0) {
        const studentExperience = getStudentExperienceLevel(student);
        if (!filters.experienceLevel.includes(studentExperience)) {
          return false;
        }
      }

      // Check academic year
      if (filters.academicYear.length > 0) {
        if (!filters.academicYear.includes(student.year)) {
          return false;
        }
      }

      // Check major
      if (filters.major.length > 0) {
        if (!filters.major.includes(student.major)) {
          return false;
        }
      }

      // Check skills (at least one skill must match)
      if (filters.skills.length > 0) {
        if (!filters.skills.some(skill => student.skills.includes(skill))) {
          return false;
        }
      }

      // Check availability
      if (filters.availability.length > 0) {
        const studentAvailability = getStudentAvailability(student);
        if (!filters.availability.includes(studentAvailability)) {
          return false;
        }
      }

      return true;
    });
  };

  // Helper function to determine experience level based on projects completed
  const getStudentExperienceLevel = (student) => {
    if (student.projectsCompleted >= 10) return "Advanced";
    if (student.projectsCompleted >= 5) return "Intermediate";
    return "Beginner";
  };

  // Helper function to determine availability status
  const getStudentAvailability = (student) => {
    const hours = parseInt(student.availability);
    if (hours >= 25) return "Available now";
    if (hours >= 15) return "Within 1 week";
    if (hours >= 10) return "Within 1 month";
    return "Flexible";
  };

  return (
    <section id="find-students" className="find-students">
      <div className="find-students-container">
        <div className="find-students-header">
          <h2 className="find-students-title">Find Talented Students</h2>
          <p className="find-students-description">
            Connect with skilled students ready to collaborate on your projects
          </p>
        </div>

        <div className="find-students-content">
          {/* Left Sidebar - Filters */}
          <div className="filters-sidebar">
            <h3 className="sidebar-title">Available Students</h3>
            <div className="filters-card">
              <h4 className="filters-title">Filters</h4>
              
              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="active-filters">
                  {activeFilters.map((filter, index) => (
                    <button
                      key={index}
                      className="active-filter-pill"
                      onClick={() => removeActiveFilter(filter)}
                    >
                      {filter}
                      <span className="remove-filter">×</span>
                    </button>
                  ))}
                </div>
              )}


              {/* Experience Level */}
              <div className="filter-section">
                <h5 className="filter-label">Experience Level</h5>
                {["Beginner", "Intermediate", "Advanced"].map(level => (
                  <label key={level} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.experienceLevel.includes(level)}
                      onChange={() => handleFilterChange('experienceLevel', level)}
                    />
                    <span className="checkbox-text">{level}</span>
                  </label>
                ))}
              </div>

              {/* Academic Year */}
              <div className="filter-section">
                <h5 className="filter-label">Academic Year</h5>
                {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(year => (
                  <label key={year} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.academicYear.includes(year)}
                      onChange={() => handleFilterChange('academicYear', year)}
                    />
                    <span className="checkbox-text">{year}</span>
                  </label>
                ))}
              </div>

              {/* Major */}
              <div className="filter-section">
                <h5 className="filter-label">Major</h5>
                <div className="filter-options">
                  {majors.map(major => (
                    <label key={major} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.major.includes(major)}
                        onChange={() => handleFilterChange('major', major)}
                      />
                      <span className="checkbox-text">{major}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="filter-section">
                <h5 className="filter-label">Skills</h5>
                <div className="filter-options">
                  {skills.map(skill => (
                    <label key={skill} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(skill)}
                        onChange={() => handleFilterChange('skills', skill)}
                      />
                      <span className="checkbox-text">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="filter-section">
                <h5 className="filter-label">Availability</h5>
                {availabilityOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(option)}
                      onChange={() => handleFilterChange('availability', option)}
                    />
                    <span className="checkbox-text">{option}</span>
                  </label>
                ))}
              </div>

              {/* Filter Buttons */}
              <div className="filter-buttons">
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
                <button className="apply-filters-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Student Profiles */}
          <div className="students-grid">
            {getFilteredStudents().length > 0 ? (
              getFilteredStudents().map(student => (
              <div key={student.id} className="student-card">
                <div className="student-header">
                  <div className="student-avatar">
                    {student.profileImage}
                  </div>
                  <div className="student-info">
                    <h4 className="student-name">{student.name}</h4>
                    <p className="student-details">
                      {student.major} • {student.year}
                    </p>
                    <p className="student-location">
                      {student.location}
                      <span className="student-rating">
                        ⭐ {student.rating} ({student.reviewCount})
                      </span>
                    </p>
                  </div>
                  
                </div>

                <p className="student-description">{student.description}</p>

                <div className="student-skills">
                  {student.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>

                <div className="student-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🕒</span>
                    <span>{student.availability}</span>
                  </div>
                  <div className="stat-item">
                    <span>{student.projectsCompleted} projects completed</span>
                  </div>
                </div>

                <div className="student-actions">
                  <Link to={`/profile/${student.id}`} className="view-profile-btn">View Profile</Link>
                </div>
              </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-content">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="no-results-icon">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  <h3 className="no-results-title">No students found</h3>
                  <p className="no-results-description">
                    No students match your current filter criteria. Try adjusting your filters to see more results.
                  </p>
                  <button className="clear-filters-btn-large" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindStudents;
