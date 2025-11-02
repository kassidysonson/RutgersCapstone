import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BrowseProjects.css';

const BrowseProjects = () => {
  const [filters, setFilters] = useState({
    category: [],
    skills: [],
    duration: [],
  });

  const [activeFilters, setActiveFilters] = useState([]);

  // Mock project data
  const projects = [
    {
      id: 1,
      title: "E-commerce Mobile App Development",
      company: "ShopFlow Startup",
      description: "Looking for a skilled developer to build a modern e-commerce mobile application with React Native. The app should include user authentication, product catalog, shopping cart, and payment integration.",
      skills: ["React Native", "JavaScript", "API Integration", "UI/UX Design"],
      duration: "3-6 months",
      postedDate: "Posted 2 days ago",
      applicants: 12,
      location: "Remote",
      category: "Mobile Development"
    },
    {
      id: 2,
      title: "Brand Identity Design Package",
      company: "TechVision",
      description: "Need a creative designer to develop a complete brand identity for our tech startup. This includes logo design, color palette, typography, and brand guidelines.",
      skills: ["Logo Design", "Branding", "Adobe Illustrator", "Creative Suite"],
      duration: "1-2 months",
      postedDate: "Posted 1 week ago",
      applicants: 8,
      location: "Remote",
      category: "Design"
    },
    {
      id: 3,
      title: "Data Analytics Dashboard",
      company: "DataCorp",
      description: "Seeking a data scientist to create an interactive dashboard for business analytics. Must have experience with Python, SQL, and data visualization tools.",
      skills: ["Python", "SQL", "Data Visualization", "Machine Learning"],
      duration: "2-4 months",
      postedDate: "Posted 3 days ago",
      applicants: 15,
      location: "Hybrid",
      category: "Data Science"
    },
    {
      id: 4,
      title: "Social Media Management Tool",
      company: "SocialBoost",
      description: "Looking for a full-stack developer to build a social media scheduling and analytics platform. Should include content calendar, post scheduling, and performance analytics.",
      skills: ["React", "Node.js", "MongoDB", "API Integration"],
      duration: "4-6 months",
      postedDate: "Posted 5 days ago",
      applicants: 20,
      location: "Remote",
      category: "Web Development"
    },
    {
      id: 5,
      title: "Mobile App UI/UX Design",
      company: "FitnessApp",
      description: "Need a UI/UX designer to create wireframes and high-fidelity designs for a fitness tracking mobile application. Focus on user experience and modern design principles.",
      skills: ["Figma", "Mobile Design", "User Research", "Prototyping"],
      duration: "2-3 months",
      postedDate: "Posted 1 week ago",
      applicants: 6,
      location: "Remote",
      category: "Design"
    }
  ];

  const categories = ["Web Development", "Mobile Development", "Design", "Data Science", "Marketing"];
  const skills = ["React", "Python", "JavaScript", "UI/UX Design", "Machine Learning", "Node.js", "Figma", "SQL"];
  const durations = ["1-2 months", "2-3 months", "3-6 months", "6+ months"];

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
      category: [],
      skills: [],
      duration: [],
    });
    setActiveFilters([]);
  };

  // Filter projects based on current filter state
  const getFilteredProjects = () => {
    return projects.filter(project => {
      // Check category
      if (filters.category.length > 0) {
        if (!filters.category.includes(project.category)) {
          return false;
        }
      }

      // Check skills (at least one skill must match)
      if (filters.skills.length > 0) {
        if (!filters.skills.some(skill => project.skills.includes(skill))) {
          return false;
        }
      }

      // Check duration
      if (filters.duration.length > 0) {
        if (!filters.duration.includes(project.duration)) {
          return false;
        }
      }


      return true;
    });
  };

  return (
    <div className="browse-projects-page">
      <div className="browse-projects-header">
        <h1 className="page-title">Browse Projects</h1>
      </div>

      <div className="browse-projects-content">
        <div className="filters-sidebar">
          <h2 className="sidebar-title">Filters</h2>
          
          <div className="filters-card">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="active-filters">
                {activeFilters.map(filter => (
                  <button
                    key={filter}
                    className="active-filter-pill"
                    onClick={() => removeActiveFilter(filter)}
                  >
                    {filter}
                    <span className="remove-filter">×</span>
                  </button>
                ))}
                <button className="clear-all-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="filter-section">
              <h3 className="filter-label">Category</h3>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleFilterChange('category', category)}
                    />
                    <span className="checkbox-text">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div className="filter-section">
              <h3 className="filter-label">Skills Required</h3>
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

            {/* Duration Filter */}
            <div className="filter-section">
              <h3 className="filter-label">Duration</h3>
              <div className="filter-options">
                {durations.map(duration => (
                  <label key={duration} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(duration)}
                      onChange={() => handleFilterChange('duration', duration)}
                    />
                    <span className="checkbox-text">{duration}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="projects-main">
          <div className="projects-header">
            <h2 className="projects-title">Available Projects</h2>
            <p className="projects-description">
              Discover exciting projects and opportunities to showcase your skills
            </p>
          </div>

          <div className="projects-grid">
            {getFilteredProjects().length > 0 ? (
              getFilteredProjects().map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-meta">
                      <span className="company">{project.company}</span>
                      <span className="dot">•</span>
                      <span className="location">{project.location}</span>
                    </div>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-skills">
                    {project.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="project-details">
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{project.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applicants:</span>
                      <span className="detail-value">{project.applicants}</span>
                    </div>
                  </div>

                  <div className="project-footer">
                    <span className="posted-date">{project.postedDate}</span>
                    <div className="project-actions">
                      <button className="btn-apply">Apply Now</button>
                      <button className="btn-save">Save</button>
                    </div>
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
                  <h3 className="no-results-title">No projects found</h3>
                  <p className="no-results-description">
                    No projects match your current filter criteria. Try adjusting your filters to see more results.
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
    </div>
  );
};

export default BrowseProjects;
