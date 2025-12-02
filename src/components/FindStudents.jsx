import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './FindStudents.css';

// Majors grouped by category (from EditProfile.jsx)
const MAJORS_BY_CATEGORY = [
  {
    category: 'Arts & Humanities',
    majors: [
      'English',
      'History',
      'Philosophy',
      'Linguistics',
      'Communications',
      'Visual Arts / Fine Arts'
    ]
  },
  {
    category: 'Social Sciences',
    majors: [
      'Psychology',
      'Sociology',
      'Political Science',
      'Anthropology',
      'Economics',
      'Criminal Justice',
      'Education'
    ]
  },
  {
    category: 'Business',
    majors: [
      'Business Administration',
      'Finance',
      'Accounting',
      'Marketing',
      'Management',
      'Entrepreneurship'
    ]
  },
  {
    category: 'STEM',
    majors: [
      'Computer Science',
      'Information Technology',
      'Software Engineering',
      'Data Science',
      'Cybersecurity',
      'Mathematics',
      'Statistics',
      'Biology',
      'Chemistry',
      'Physics',
      'Environmental Science'
    ]
  },
  {
    category: 'Engineering',
    majors: [
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Biomedical Engineering',
      'Chemical Engineering'
    ]
  },
  {
    category: 'Health & Public Service',
    majors: [
      'Nursing',
      'Public Health',
      'Social Work',
      'Health Sciences',
      'Pre-Medicine / Pre-Health'
    ]
  }
];

// Skills grouped by category (from EditProfile.jsx)
const SKILLS_BY_CATEGORY = [
  {
    category: 'Technology & Software',
    skills: [
      'JavaScript',
      'Python',
      'Java',
      'C++',
      'HTML/CSS',
      'React',
      'Node.js',
      'SQL / Databases',
      'Mobile App Development',
      'UI/UX Design',
      'Graphic Design (Photoshop/Illustrator)',
      'Figma',
      'Data Analysis',
      'Machine Learning',
      'Cybersecurity',
      'Cloud Computing (AWS, Azure, GCP)'
    ]
  },
  {
    category: 'Business, Marketing & Management',
    skills: [
      'Project Management',
      'Business Strategy',
      'Entrepreneurship',
      'Marketing',
      'Social Media Management',
      'Financial Analysis',
      'Customer Service'
    ]
  },
  {
    category: 'Creative & Communication',
    skills: [
      'Creative Writing',
      'Writing / Editing',
      'Video Editing',
      'Photography',
      'Animation',
      'Content Creation',
      'Branding',
      'Copywriting',
      'Presentation Design'
    ]
  },
  {
    category: 'Science & Research',
    skills: [
      'Research Methods',
      'Lab Skills',
      'Statistical Analysis',
      'Scientific Writing',
      'Data Collection',
      'Critical Thinking'
    ]
  },
  {
    category: 'Interpersonal Skills',
    skills: [
      'Collaboration',
      'Communication',
      'Teamwork',
      'Problem-Solving',
      'Adaptability',
      'Time Management',
      'Leadership',
      'Empathy',
      'Active Listening',
      'Conflict Resolution',
      'Creativity',
      'Accountability',
      'Reliability',
      'Decision-Making',
      'Organization'
    ]
  },
  {
    category: 'Hands-On / Practical Skills',
    skills: [
      'CAD / 3D Modeling',
      'Mechanical Skills',
      'Electrical Systems',
      'Robotics',
      'First Aid / CPR',
      'Fitness Training'
    ]
  }
];

const FindStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    experienceLevel: [],
    academicYear: [],
    major: [],
    skills: [],
    availability: []
  });

  const [activeFilters, setActiveFilters] = useState([]);

  // Fetch students from database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: studentsData, error } = await supabase
          .from('users')
          .select('id, full_name, email, major, academic_year, location, rating, review_count, bio, skills, availability, projects_completed, profile_image, experience_level, university')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform database data to match component format
        const formattedStudents = (studentsData || []).map(student => {
          // Parse skills from array or comma-separated string
          let skillsArray = [];
          if (Array.isArray(student.skills)) {
            // Skills is already an array (from PostgreSQL ARRAY type)
            skillsArray = student.skills.filter(s => s && s.trim());
          } else if (typeof student.skills === 'string' && student.skills) {
            // Fallback: if somehow stored as string, parse it
            skillsArray = student.skills.split(',').map(s => s.trim()).filter(Boolean);
          }

          // Calculate experience level if not set
          const experienceLevel = student.experience_level || 
            (student.projects_completed >= 10 ? 'Advanced' :
             student.projects_completed >= 5 ? 'Intermediate' : 'Beginner');

          return {
            id: student.id,
            name: student.full_name || student.email?.split('@')[0] || 'Unknown',
            major: student.major || 'Not specified',
            year: student.academic_year || 'Not specified',
            location: student.location || 'Not specified',
            rating: student.rating || 0,
            reviewCount: student.review_count || 0,
            description: student.bio || 'No description available',
            skills: skillsArray,
            availability: student.availability || 'Not specified',
            projectsCompleted: student.projects_completed || 0,
            profileImageUrl: student.profile_image && 
              (student.profile_image.startsWith('http://') || student.profile_image.startsWith('https://'))
              ? student.profile_image 
              : null,
            profileImageInitials: student.profile_image && 
              (student.profile_image.startsWith('http://') || student.profile_image.startsWith('https://'))
              ? null
              : (student.full_name ? student.full_name.substring(0, 2).toUpperCase() : 'U'),
            experienceLevel: experienceLevel,
            university: student.university || 'Not specified'
          };
        });

        setStudents(formattedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const availabilityOptions = [
    "Not currently available",
    "Up to 5 hours/week",
    "5–10 hours/week",
    "10–15 hours/week",
    "15–20 hours/week",
    "20+ hours/week",
    "Flexible"
  ];
  
  // Flatten majors and skills from categories for easy access
  const allMajors = MAJORS_BY_CATEGORY.flatMap(cat => cat.majors);
  const allSkills = SKILLS_BY_CATEGORY.flatMap(cat => cat.skills);

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
    // Find which filter type this belongs to and remove it
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key].includes(filter)) {
          newFilters[key] = newFilters[key].filter(item => item !== filter);
        }
      });
      
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
        const studentExperience = student.experienceLevel || getStudentExperienceLevel(student);
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
  // Now availability is stored directly as one of the dropdown options
  const getStudentAvailability = (student) => {
    if (!student.availability || student.availability === 'Not specified') {
      return "Flexible";
    }
    // If the availability matches one of our options, return it directly
    if (availabilityOptions.includes(student.availability)) {
      return student.availability;
    }
    // Fallback for old data format - try to map to new options
    const hoursMatch = student.availability.match(/(\d+)/);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      if (hours >= 20) return "20+ hours/week";
      if (hours >= 15) return "15–20 hours/week";
      if (hours >= 10) return "10–15 hours/week";
      if (hours >= 5) return "5–10 hours/week";
      if (hours > 0) return "Up to 5 hours/week";
    }
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
                  {MAJORS_BY_CATEGORY.map((categoryGroup) => (
                    <div key={categoryGroup.category}>
                      <div className="filter-category-header">{categoryGroup.category}</div>
                      {categoryGroup.majors.map(major => (
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
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="filter-section">
                <h5 className="filter-label">Skills</h5>
                <div className="filter-options">
                  {SKILLS_BY_CATEGORY.map((categoryGroup) => (
                    <div key={categoryGroup.category}>
                      <div className="filter-category-header">{categoryGroup.category}</div>
                      {categoryGroup.skills.map(skill => (
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
            {loading ? (
              <div className="no-results">
                <div className="no-results-content">
                  <p>Loading students...</p>
                </div>
              </div>
            ) : getFilteredStudents().length > 0 ? (
              getFilteredStudents().map(student => (
              <div key={student.id} className="student-card">
                <div className="student-header">
                  <div className="student-avatar">
                    {student.profileImageUrl ? (
                      <img 
                        src={student.profileImageUrl} 
                        alt={student.name}
                        className="student-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const initialsSpan = e.target.parentElement.querySelector('.student-avatar-initials');
                          if (initialsSpan) {
                            initialsSpan.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <span 
                      className="student-avatar-initials"
                      style={{ display: student.profileImageUrl ? 'none' : 'flex' }}
                    >
                      {student.profileImageInitials}
                    </span>
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
