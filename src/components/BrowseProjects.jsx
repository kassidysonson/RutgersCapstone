import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ApplyForm from './ApplyForm';
import './BrowseProjects.css';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());
  const [filters, setFilters] = useState({
    category: [],
    skills: [],
    duration: [],
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects with all new columns
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, description, expectations, location, compensation, created_at, owner_id, company, budget, duration, experience_level, skills, category, is_urgent')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        // Fetch owner information for all projects
        const ownerIds = [...new Set((projectsData || []).map(p => p.owner_id).filter(Boolean))];
        let ownersData = {};
        if (ownerIds.length > 0) {
          const { data: owners } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', ownerIds);
          
          (owners || []).forEach(owner => {
            ownersData[owner.id] = owner;
          });
        }

        // Fetch application counts for each project
        const projectIds = projectsData?.map(p => p.id) || [];
        let applicationsData = [];
        if (projectIds.length > 0) {
          const { data } = await supabase
            .from('applications')
            .select('project_id')
            .in('project_id', projectIds);
          applicationsData = data || [];
        }

        // Count applications per project
        const applicationCounts = {};
        applicationsData?.forEach(app => {
          applicationCounts[app.project_id] = (applicationCounts[app.project_id] || 0) + 1;
        });

        // Transform data to match the display format
        const formattedProjects = (projectsData || []).map(project => {
          // Parse skills from skills column (comma-separated string), fallback to expectations
          const skills = project.skills
            ? project.skills.split(',').map(s => s.trim()).filter(Boolean)
            : (project.expectations
                ? project.expectations.split(',').map(s => s.trim()).filter(Boolean)
                : []);

          // Format date as "Posted X days ago"
          const formatPostedDate = (dateString) => {
            if (!dateString) return 'Posted recently';
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Posted today';
            if (diffDays === 1) return 'Posted 1 day ago';
            if (diffDays < 7) return `Posted ${diffDays} days ago`;
            if (diffDays < 14) return 'Posted 1 week ago';
            if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 60) return 'Posted 1 month ago';
            return `Posted ${Math.floor(diffDays / 30)} months ago`;
          };

          // Get company/owner name - prefer company field, fallback to owner name
          const owner = ownersData[project.owner_id];
          const company = project.company || owner?.full_name || owner?.email?.split('@')[0] || 'Unknown';

          return {
            id: project.id,
            title: project.title,
            company: company,
            description: project.description,
            skills: skills,
            duration: project.duration || 'Flexible',
            postedDate: formatPostedDate(project.created_at),
            applicants: applicationCounts[project.id] || 0,
            location: project.location || 'Remote',
            category: project.category || 'General',
            owner_id: project.owner_id,
            is_urgent: project.is_urgent || false,
          };
        });

        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch saved projects for current user
  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) return;

        const userId = sessionData.session.user.id;
        
        // Try to fetch saved projects (table might not exist)
        const { data, error } = await supabase
          .from('saved_projects')
          .select('project_id')
          .eq('user_id', userId);

        if (error) {
          // If table doesn't exist, that's okay - just log and continue
          if (error.message?.toLowerCase().includes('does not exist') || 
              error.message?.toLowerCase().includes('could not find the table')) {
            console.log('saved_projects table does not exist');
            return;
          }
          throw error;
        }

        // Create a Set of saved project IDs
        const savedIds = new Set((data || []).map(item => item.project_id));
        setSavedProjectIds(savedIds);
      } catch (error) {
        console.error('Error fetching saved projects:', error);
      }
    };

    fetchSavedProjects();
  }, []);

  // Handle save/unsave project
  const handleSaveProject = async (projectId) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        alert('Please log in to save projects');
        return;
      }

      const userId = sessionData.session.user.id;
      const isSaved = savedProjectIds.has(projectId);

      if (isSaved) {
        // Unsave: Delete from saved_projects
        const { error } = await supabase
          .from('saved_projects')
          .delete()
          .eq('user_id', userId)
          .eq('project_id', projectId);

        if (error) {
          // If table doesn't exist, just update local state
          if (error.message?.toLowerCase().includes('does not exist') || 
              error.message?.toLowerCase().includes('could not find the table')) {
            const newSavedIds = new Set(savedProjectIds);
            newSavedIds.delete(projectId);
            setSavedProjectIds(newSavedIds);
            return;
          }
          throw error;
        }

        // Update local state
        const newSavedIds = new Set(savedProjectIds);
        newSavedIds.delete(projectId);
        setSavedProjectIds(newSavedIds);
      } else {
        // Save: Insert into saved_projects
        const { error } = await supabase
          .from('saved_projects')
          .insert({
            user_id: userId,
            project_id: projectId,
          });

        if (error) {
          // If table doesn't exist, just update local state (for demo purposes)
          if (error.message?.toLowerCase().includes('does not exist') || 
              error.message?.toLowerCase().includes('could not find the table')) {
            const newSavedIds = new Set(savedProjectIds);
            newSavedIds.add(projectId);
            setSavedProjectIds(newSavedIds);
            alert('Project saved! (Note: saved_projects table does not exist in database)');
            return;
          }
          throw error;
        }

        // Update local state
        const newSavedIds = new Set(savedProjectIds);
        newSavedIds.add(projectId);
        setSavedProjectIds(newSavedIds);
      }
    } catch (error) {
      console.error('Error saving/unsaving project:', error);
      alert('Error saving project: ' + (error.message || 'Please try again.'));
    }
  };

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
            {loading ? (
              <div className="no-results">
                <div className="no-results-content">
                  <p>Loading projects...</p>
                </div>
              </div>
            ) : getFilteredProjects().length > 0 ? (
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
                    {project.skills && project.skills.length > 0 ? (
                      project.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag">No skills specified</span>
                    )}
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
                      <button 
                        className="btn-apply"
                        onClick={() => {
                          setSelectedProject({ id: project.id, title: project.title });
                          setShowApplyForm(true);
                        }}
                      >
                        Apply Now
                      </button>
                      <button 
                        className="btn-save" 
                        onClick={() => handleSaveProject(project.id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={savedProjectIds.has(project.id) ? 'Unsave project' : 'Save project'}
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill={savedProjectIds.has(project.id) ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          strokeWidth="2"
                          style={{ color: savedProjectIds.has(project.id) ? '#3b82f6' : '#6b7280' }}
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
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
      
      {showApplyForm && selectedProject && (
        <ApplyForm
          isOpen={showApplyForm}
          onClose={() => {
            setShowApplyForm(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
};

export default BrowseProjects;
