import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostProject.css';
import { supabase } from '../supabaseClient';

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

// Duration options (monthly)
const DURATION_OPTIONS = [
  "1-2 months",
  "2-3 months",
  "3-6 months",
  "6+ months"
];

// Availability options (from FindStudents.jsx)
const AVAILABILITY_OPTIONS = [
  "Not currently available",
  "Up to 5 hours/week",
  "5–10 hours/week",
  "10–15 hours/week",
  "15–20 hours/week",
  "20+ hours/week",
  "Flexible"
];

const PostProject = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    budget: '',
    duration: '',
    experienceLevel: 'Beginner',
    skills: '',
    academicYear: 'Any year',
    major: '',
    availability: '',
    isUrgent: false,
    category: '',
    location: 'Remote'
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [customMajorInput, setCustomMajorInput] = useState('');
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };
    getUserId();
  }, []);

  // Close skills dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSkillsDropdown && !event.target.closest('.skills-dropdown-container')) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSkillsDropdown]);

  // Close majors dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMajorsDropdown && !event.target.closest('.majors-dropdown-container')) {
        setShowMajorsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMajorsDropdown]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        skills: newSkills.join(',')
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    setFormData(prev => ({
      ...prev,
      skills: newSkills.join(',')
    }));
  };

  const handleCustomSkillSubmit = (e) => {
    e.preventDefault();
    if (customSkillInput.trim()) {
      handleAddSkill(customSkillInput.trim());
      setCustomSkillInput('');
    }
  };

  const handleAddMajor = (major) => {
    if (major && !selectedMajors.includes(major)) {
      const newMajors = [...selectedMajors, major];
      setSelectedMajors(newMajors);
      setFormData(prev => ({
        ...prev,
        major: newMajors.join(',')
      }));
    }
  };

  const handleRemoveMajor = (majorToRemove) => {
    const newMajors = selectedMajors.filter(major => major !== majorToRemove);
    setSelectedMajors(newMajors);
    setFormData(prev => ({
      ...prev,
      major: newMajors.join(',')
    }));
  };

  const handleCustomMajorSubmit = (e) => {
    e.preventDefault();
    if (customMajorInput.trim()) {
      handleAddMajor(customMajorInput.trim());
      setCustomMajorInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Please log in to post a project');
      navigate('/login');
      return;
    }

    if (selectedSkills.length === 0) {
      alert('Please select at least one required skill');
      return;
    }

    setLoading(true);
    
    try {
      // Map form data to database columns
      const projectData = {
        owner_id: userId,
        title: formData.title,
        description: formData.description,
        company: formData.company,
        budget: formData.budget,
        duration: formData.duration,
        experience_level: formData.experienceLevel,
        skills: selectedSkills.length > 0 ? selectedSkills : [],
        academic_year: formData.academicYear === 'Any year' ? null : formData.academicYear,
        major: selectedMajors.length > 0 ? selectedMajors : null,
        availability: formData.availability || null,
        is_urgent: formData.isUrgent,
        category: formData.category || null,
        location: formData.location || 'Remote',
        compensation: formData.budget, // Keep for backward compatibility
        expectations: formData.skills // Keep for backward compatibility
      };

      const { error } = await supabase
        .from('projects')
        .insert(projectData);

      if (error) {
        console.error('Error posting project:', error);
        alert('Error posting project: ' + error.message);
        setLoading(false);
        return;
      }

      alert('Project posted successfully!');
      // Navigate back to dashboard
      if (userId) {
        navigate(`/dashboard/${userId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error posting project:', error);
      alert('Error posting project: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="post-project-page">
      <div className="post-project-header">
        <Link to={userId ? `/dashboard/${userId}` : "/dashboard"} className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </Link>
        <h1 className="page-title">JoinUp</h1>
      </div>

      <div className="post-project-container">
        <div className="post-project-card">
          <div className="post-project-header-content">
            <h2 className="post-project-title">Post a Project</h2>
            <p className="post-project-subtitle">
              Share your project details and find talented students to collaborate with.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
              <h3 className="section-title">Project Details</h3>
              <p className="section-subtitle">Fill in the information about your project.</p>

              <div className="form-group">
                <label className="form-label">
                  Project Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., E-commerce Mobile App Development"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Company/Organization <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., TechStartup Inc."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Project Description <span className="required">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project, what you're building, and what kind of help you need..."
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">
                    Budget <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $1,000 - $2,000"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group half">
                  <label className="form-label">
                    Duration <span className="required">*</span>
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select duration</option>
                    {DURATION_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Research & Academic Projects">Research & Academic Projects</option>
                  <option value="Creative Media & Content Creation">Creative Media & Content Creation</option>
                  <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
                  <option value="Education & Tutoring">Education & Tutoring</option>
                  <option value="Engineering & Robotics">Engineering & Robotics</option>
                  <option value="Natural Sciences & Lab Work">Natural Sciences & Lab Work</option>
                  <option value="Health & Public Service">Health & Public Service</option>
                  <option value="UX/UI & Product Design">UX/UI & Product Design</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Communications & Media Production">Communications & Media Production</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, New York, NY"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Experience Level Required <span className="required">*</span>
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Required Skills <span className="required">*</span>
                </label>
                
                {/* Selected Skills Chips */}
                <div className="skills-chips-container">
                  {selectedSkills.map((skill) => (
                    <div key={skill} className="skill-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="skill-chip-remove"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Skills Dropdown */}
                <div className="skills-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="skills-dropdown-toggle"
                  >
                    {showSkillsDropdown ? 'Hide Skills' : 'Add Skills'}
                  </button>
                  
                  {showSkillsDropdown && (
                    <div className="skills-dropdown">
                      {SKILLS_BY_CATEGORY.map((categoryGroup) => (
                        <div key={categoryGroup.category} className="skills-category">
                          <div className="skills-category-header">{categoryGroup.category}</div>
                          <div className="skills-options">
                            {categoryGroup.skills.map((skill) => {
                              const isSelected = selectedSkills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => !isSelected && handleAddSkill(skill)}
                                  className={`skill-option ${isSelected ? 'selected' : ''}`}
                                  disabled={isSelected}
                                >
                                  {skill}
                                  {isSelected && <span className="checkmark">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Skill Input */}
                <form onSubmit={handleCustomSkillSubmit} className="custom-skill-form">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    className="form-input"
                    placeholder="Type a custom skill and press Enter"
                    style={{ marginTop: '8px' }}
                  />
                </form>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Academic Year (Optional)</label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Any year">Any year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Major (Optional)</label>
                
                {/* Selected Majors Chips */}
                <div className="skills-chips-container">
                  {selectedMajors.map((major) => (
                    <div key={major} className="skill-chip">
                      <span>{major}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMajor(major)}
                        className="skill-chip-remove"
                        aria-label={`Remove ${major}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Majors Dropdown */}
                <div className="skills-dropdown-container majors-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setShowMajorsDropdown(!showMajorsDropdown)}
                    className="skills-dropdown-toggle"
                  >
                    {showMajorsDropdown ? 'Hide Majors' : 'Add Majors'}
                  </button>
                  
                  {showMajorsDropdown && (
                    <div className="skills-dropdown">
                      {MAJORS_BY_CATEGORY.map((categoryGroup) => (
                        <div key={categoryGroup.category} className="skills-category">
                          <div className="skills-category-header">{categoryGroup.category}</div>
                          <div className="skills-options">
                            {categoryGroup.majors.map((major) => {
                              const isSelected = selectedMajors.includes(major);
                              return (
                                <button
                                  key={major}
                                  type="button"
                                  onClick={() => !isSelected && handleAddMajor(major)}
                                  className={`skill-option ${isSelected ? 'selected' : ''}`}
                                  disabled={isSelected}
                                >
                                  {major}
                                  {isSelected && <span className="checkmark">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Major Input */}
                <form onSubmit={handleCustomMajorSubmit} className="custom-skill-form">
                  <input
                    type="text"
                    value={customMajorInput}
                    onChange={(e) => setCustomMajorInput(e.target.value)}
                    className="form-input"
                    placeholder="Type a custom major and press Enter"
                    style={{ marginTop: '8px' }}
                  />
                </form>
              </div>

              <div className="form-group">
                <label className="form-label">Availability Needed (Optional)</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="urgent-toggle">
                <div className="toggle-content">
                  <label className="toggle-label">Mark as Urgent</label>
                  <p className="toggle-description">Urgent projects get highlighted in search results.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Link to={userId ? `/dashboard/${userId}` : "/dashboard"} className="btn-cancel">Cancel</Link>
              <button type="submit" className="btn-post" disabled={loading}>
                {loading ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
