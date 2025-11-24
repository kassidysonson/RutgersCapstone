import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostProject.css';
import { supabase } from '../supabaseClient';

const PostProject = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };
    getUserId();
  }, []);

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
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Please log in to post a project');
      navigate('/login');
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
        skills: formData.skills,
        academic_year: formData.academicYear === 'Any year' ? null : formData.academicYear,
        major: formData.major || null,
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
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4-6 weeks"
                    className="form-input"
                    required
                  />
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
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Marketing">Marketing</option>
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
                <div className="skills-input-container">
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Python, UI/UX"
                    className="form-input"
                    required
                  />
                  <button type="button" className="add-skill-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
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
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Business, Design"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability Needed (Optional)</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., 15-20 hrs/week"
                  className="form-input"
                />
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
