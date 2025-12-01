import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const doesTableExistError = (error) => {
  if (!error) return false;
  const message = (error.message || '').toLowerCase();
  const details = (error.details || '').toLowerCase();
  const code = (error.code || '').toLowerCase();
  
  return (
    message.includes('does not exist') ||
    message.includes('could not find the table') ||
    message.includes('relation') && message.includes('does not exist') ||
    details.includes('does not exist') ||
    details.includes('could not find the table') ||
    code === '42p01' // PostgreSQL error code for "undefined table"
  );
};

const splitSkills = (value) =>
  value
    ? value
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

const formatDate = (value) => {
  if (!value) return 'Not specified';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  } catch (_err) {
    return value;
  }
};

const buildInitials = (name = '') => {
  if (!name) return 'US';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const normalizePostedProjects = (rows = []) =>
  rows.map((row) => ({
    id: row.id,
    title: row.title || 'Untitled Project',
    description: row.description || 'No description yet.',
    expectations: row.expectations || '',
    location: row.location || 'Remote',
    compensation: row.compensation || 'Not provided',
    created_at: row.created_at,
  }));

const Dashboard = () => {
  const { id: routeUserId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applied');
  const [sessionUser, setSessionUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [postedProjects, setPostedProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchOptional = async (queryBuilder, transform = (rows) => rows ?? []) => {
      try {
        const { data, error: queryError } = await queryBuilder;
        if (queryError) {
          if (doesTableExistError(queryError)) {
            console.warn('[Dashboard] Optional table missing:', queryError.message);
            return [];
          }
          // For other errors, log but don't throw - return empty array
          console.warn('[Dashboard] Query error (non-fatal):', queryError.message);
          return [];
        }
        return transform(data ?? []);
      } catch (err) {
        // Catch any unexpected errors
        if (doesTableExistError(err)) {
          console.warn('[Dashboard] Optional table missing (caught):', err.message);
          return [];
        }
        console.warn('[Dashboard] Unexpected error (non-fatal):', err.message);
        return [];
      }
    };

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        const currentUser = data.session?.user;
        if (!currentUser) {
          console.warn('No user session found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Loading dashboard for user:', currentUser.id);
        setSessionUser(currentUser);

        if (routeUserId && routeUserId !== currentUser.id) {
          navigate(`/dashboard/${currentUser.id}`, { replace: true });
          return;
        }

        const profilePromise = supabase
          .from('users')
          .select('id, full_name, avatar_url')
          .eq('id', currentUser.id)
          .maybeSingle();

        const postedPromise = supabase
          .from('projects')
          .select('id, title, description, expectations, location, compensation, created_at')
          .eq('owner_id', currentUser.id)
          .order('created_at', { ascending: false });

        const appliedPromise = supabase
          .from('applications')
          .select(
            `*, project:project_id (
              id,
              title,
              description,
              expectations,
              location,
              compensation,
              owner_id
            )`
          )
          .eq('applicant_id', currentUser.id);

        const savedPromise = supabase
          .from('saved_projects')
          .select(
            `*, project:project_id (
              id,
              title,
              description,
              expectations,
              location,
              compensation
            )`
          )
          .eq('user_id', currentUser.id);

        // Use Promise.allSettled to handle errors gracefully
        const results = await Promise.allSettled([
          fetchOptional(profilePromise, (data) => data || null),
          fetchOptional(postedPromise, normalizePostedProjects),
          fetchOptional(appliedPromise, (rows) =>
            rows.map((row) => ({
              id: row.id ?? row.project?.id ?? `application-${row.project_id}`,
              status: 'Applied',
              progress: 0,
              updated_at: row.created_at,
              project: row.project || null,
            }))
          ),
          fetchOptional(savedPromise, (rows) =>
            rows.map((row) => ({
              id: row.id ?? row.project_id,
              saved_at: row.created_at,
              project: row.project || null,
            }))
          ),
        ]);
        
        // Log any rejected promises for debugging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const names = ['profile', 'posted projects', 'applied projects', 'saved projects'];
            console.warn(`[Dashboard] ${names[index]} query rejected:`, result.reason);
          }
        });
        
        const profileResult = results[0].status === 'fulfilled' ? results[0].value : null;
        const postedRows = results[1].status === 'fulfilled' ? results[1].value : [];
        const appliedRows = results[2].status === 'fulfilled' ? results[2].value : [];
        const savedRows = results[3].status === 'fulfilled' ? results[3].value : [];

        if (ignore) {
          return;
        }

        console.log('Dashboard data loaded:', {
          profile: profileResult,
          postedCount: postedRows.length,
          appliedCount: appliedRows.length,
          savedCount: savedRows.length,
        });

        setProfile(profileResult);
        setPostedProjects(postedRows);
        setAppliedProjects(appliedRows);
        setSavedProjects(savedRows);
      } catch (err) {
        if (ignore) return;
        console.error('Dashboard load error:', err);
        setError(err.message || 'Unable to load dashboard data. Please try again.');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [routeUserId, navigate]);

  const displayName = useMemo(() => {
    if (profile?.full_name) return profile.full_name;
    if (sessionUser?.user_metadata?.full_name) return sessionUser.user_metadata.full_name;
    if (sessionUser?.email) return sessionUser.email;
    return 'Student';
  }, [profile, sessionUser]);

  const initials = useMemo(() => {
    if (profile?.avatar_url) {
      return null;
    }
    return buildInitials(displayName);
  }, [profile, displayName]);

  const stats = useMemo(() => {
    return {
      applied: appliedProjects.length,
      saved: savedProjects.length,
      posted: postedProjects.length,
      active: postedProjects.length,
    };
  }, [appliedProjects, savedProjects, postedProjects]);

  // Delete project handler
  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Remove the project from the local state
      setPostedProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Show success message
      alert('Project deleted successfully!');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project: ' + (err.message || 'Please try again.'));
    }
  };

  // View applicants handler
  const handleViewApplicants = async (projectId) => {
    setSelectedProjectId(projectId);
    setLoadingApplications(true);
    setApplications([]);

    try {
      // Fetch applications for this project with applicant details
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          applicant:applicant_id (
            id,
            full_name,
            email,
            university,
            bio,
            major,
            academic_year,
            location,
            skills,
            availability,
            profile_image,
            rating,
            review_count,
            projects_completed,
            experience_level
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setApplications(applicationsData || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      alert('Error loading applications: ' + (err.message || 'Please try again.'));
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleCloseApplicantsModal = () => {
    setSelectedProjectId(null);
    setApplications([]);
  };

  // Helper function to get initials
  const getInitials = (name = '') => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <section id="dashboard" className="dashboard">
        <div className="dashboard-container">
          <p>Loading your dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="dashboard" className="dashboard">
        <div className="dashboard-container">
          <div className="empty-state">
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="user-chip">
            {initials ? (
              <div className="avatar">{initials}</div>
            ) : (
              profile?.avatar_url && <img src={profile.avatar_url} alt={displayName} className="avatar" />
            )}
            <div className="user-meta">
              <h2 className="dashboard-title">Welcome back, {displayName}</h2>
              <p className="dashboard-subtitle">Here’s a quick look at your activity</p>
            </div>
          </div>
          <a href="/post-project" className="btn-post-new">
            Post New Project
          </a>
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-title">Applied Projects</div>
            <div className="stat-value">{stats.applied}</div>
            <div className="stat-hint">Projects you've applied to</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Saved Projects</div>
            <div className="stat-value">{stats.saved}</div>
            <div className="stat-hint">Projects saved for later</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Active Projects</div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-hint">Currently working</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'applied' ? 'active' : ''}`} onClick={() => setActiveTab('applied')}>
            Applied ({stats.applied})
          </button>
          <button className={`tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            Saved ({stats.saved})
          </button>
          <button className={`tab ${activeTab === 'posted' ? 'active' : ''}`} onClick={() => setActiveTab('posted')}>
            Posted ({stats.posted})
          </button>
        </div>

        <div className="project-list">
          {activeTab === 'applied' && (
            <>
              {appliedProjects.length === 0 ? (
                <div className="empty-state">
                  <p>You haven’t applied to any projects yet.</p>
                  <a className="btn-primary" href="/browse-projects">
                    Browse projects
                  </a>
                </div>
              ) : (
                appliedProjects.map((entry) => {
                  const project = entry.project;
                  return (
                    <div key={entry.id} className="project-card">
                      <div className="project-top">
                        <div className="project-main">
                          <h3 className="project-title">{project?.title || 'Untitled Project'}</h3>
                          <div className="project-sub">
                            <span className="company">{project?.location || 'Remote'}</span>
                            <span className="dot">•</span>
                            <span className="applied">{formatDate(entry.updated_at)}</span>
                          </div>
                        </div>
                        <div className={`status-badge ${entry.status === 'Completed' ? 'completed' : 'inprogress'}`}>
                          {entry.status}
                        </div>
                      </div>

                      <div className="project-meta">
                        <div className="meta-group skills">
                          <span className="meta-label">Skills Required</span>
                          <div className="skill-tags">
                            {splitSkills(project?.expectations).length > 0 ? (
                              splitSkills(project?.expectations).map((skill) => (
                                <span key={skill} className="skill-tag">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="no-students">No skills listed</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="progress-row">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${entry.progress}%` }} />
                        </div>
                        <div className="progress-value">{entry.progress}%</div>
                      </div>

                      <div className="project-actions">
                        <button className="btn-secondary small">View Details</button>
                        <button className="btn-primary small">Update Progress</button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <>
              {savedProjects.length === 0 ? (
                <div className="empty-state">
                  <p>No saved projects yet.</p>
                  <a className="btn-primary" href="/browse-projects">
                    Explore projects
                  </a>
                </div>
              ) : (
                savedProjects.map((entry) => {
                  const project = entry.project;
                  return (
                    <div key={entry.id} className="project-card">
                      <div className="project-top">
                        <div className="project-main">
                          <h3 className="project-title">{project?.title || 'Untitled Project'}</h3>
                          <div className="project-sub">
                            <span className="company">{project?.location || 'Remote'}</span>
                            <span className="dot">•</span>
                            <span className="applied">Saved {formatDate(entry.saved_at)}</span>
                          </div>
                        </div>
                        <div className="status-badge saved">Saved</div>
                      </div>

                      <div className="project-description">{project?.description || 'No description provided.'}</div>
                      <div className="project-actions">
                        <button className="btn-secondary small">View Details</button>
                        <button className="btn-primary small">Apply Now</button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'posted' && (
            <>
              {postedProjects.length === 0 ? (
                <div className="empty-state">
                  <p>You haven’t posted any projects yet.</p>
                  <a className="btn-primary" href="/post-project">
                    Post your first project
                  </a>
                </div>
              ) : (
                postedProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-top">
                      <div className="project-main">
                        <h3 className="project-title">{project.title}</h3>
                        <div className="project-sub">
                          <span className="posted-date">Posted {formatDate(project.created_at)}</span>
                          <span className="dot">•</span>
                          <span className="applicants">{project.location || 'Remote'}</span>
                        </div>
                      </div>
                      <div className="status-badge active">
                        Active
                      </div>
                    </div>

                    <div className="project-description">{project.description || 'No description yet.'}</div>

                    <div className="project-meta">
                      <div className="meta-group">
                        <div className="meta-item">
                          <span className="meta-label">Location:</span>
                          <span className="meta-value">{project.location || 'Remote'}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Compensation:</span>
                          <span className="meta-value">{project.compensation || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="meta-group skills">
                        <span className="meta-label">Skills Required</span>
                        <div className="skill-tags">
                          {splitSkills(project.expectations).length > 0 ? (
                            splitSkills(project.expectations).map((skill) => (
                              <span key={skill} className="skill-tag">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="no-students">No skills listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="project-actions">
                      <button 
                        className="btn-secondary small" 
                        onClick={() => handleViewApplicants(project.id)}
                      >
                        View Applicants
                      </button>
                      <button className="btn-primary small">Manage Project</button>
                      <button 
                        className="btn-secondary small" 
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Applicants Modal */}
      {selectedProjectId && (
        <div className="applicants-modal-overlay" onClick={handleCloseApplicantsModal}>
          <div className="applicants-modal" onClick={(e) => e.stopPropagation()}>
            <div className="applicants-modal-header">
              <h2>Applications</h2>
              <button className="close-button" onClick={handleCloseApplicantsModal}>×</button>
            </div>

            <div className="applicants-modal-content">
              {loadingApplications ? (
                <div className="loading-state">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="empty-state">
                  <p>No applications yet for this project.</p>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map((application) => {
                    const applicant = application.applicant || {};
                    const applicantName = applicant?.full_name || applicant?.email?.split('@')[0] || 'Unknown Applicant';
                    const applicantImageUrl = applicant?.profile_image && 
                      (applicant.profile_image.startsWith('http://') || applicant.profile_image.startsWith('https://'))
                      ? applicant.profile_image 
                      : null;
                    const applicantInitials = applicantImageUrl ? null : getInitials(applicantName);
                    const skills = applicant?.skills ? applicant.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

                    return (
                      <div key={application.id} className="application-card">
                        <div className="application-header">
                          <div className="applicant-avatar">
                            {applicantImageUrl ? (
                              <img 
                                src={applicantImageUrl} 
                                alt={applicantName}
                                className="applicant-avatar-img"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const initialsSpan = e.target.parentElement.querySelector('.applicant-avatar-initials');
                                  if (initialsSpan) {
                                    initialsSpan.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <span 
                              className="applicant-avatar-initials"
                              style={{ display: applicantImageUrl ? 'none' : 'flex' }}
                            >
                              {applicantInitials}
                            </span>
                          </div>
                          <div className="applicant-info">
                            <h3 className="applicant-name">{applicantName}</h3>
                            <div className="applicant-meta">
                              {applicant?.major && <span>{applicant.major}</span>}
                              {applicant?.academic_year && (
                                <>
                                  <span className="dot">•</span>
                                  <span>{applicant.academic_year}</span>
                                </>
                              )}
                              {applicant?.location && (
                                <>
                                  <span className="dot">•</span>
                                  <span>{applicant.location}</span>
                                </>
                              )}
                            </div>
                            {applicant?.rating && applicant.rating > 0 && (
                              <div className="applicant-rating">
                                ⭐ {applicant.rating.toFixed(1)} ({applicant.review_count || 0} reviews)
                              </div>
                            )}
                          </div>
                          <div className="application-status">
                            <span className={`status-badge ${application.status || 'pending'}`}>
                              {(application.status || 'pending').charAt(0).toUpperCase() + (application.status || 'pending').slice(1)}
                            </span>
                          </div>
                        </div>

                        {applicant?.bio && (
                          <div className="applicant-bio">
                            <p>{applicant.bio}</p>
                          </div>
                        )}

                        {skills.length > 0 && (
                          <div className="applicant-skills">
                            <span className="skills-label">Skills:</span>
                            <div className="skills-tags">
                              {skills.map((skill, idx) => (
                                <span key={idx} className="skill-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="application-details">
                          <h4>Application Details</h4>
                          
                          {application.cover_letter || application.message ? (
                            <div className="detail-section">
                              <strong>Cover Letter:</strong>
                              <p>{application.cover_letter || application.message}</p>
                            </div>
                          ) : null}

                          {application.relevant_experience && (
                            <div className="detail-section">
                              <strong>Relevant Experience:</strong>
                              <p>{application.relevant_experience}</p>
                            </div>
                          )}

                          {application.why_interested && (
                            <div className="detail-section">
                              <strong>Why Interested:</strong>
                              <p>{application.why_interested}</p>
                            </div>
                          )}

                          {application.availability && (
                            <div className="detail-section">
                              <strong>Availability:</strong>
                              <p>{application.availability}</p>
                            </div>
                          )}

                          {application.resume_link && (
                            <div className="detail-section">
                              <strong>Resume:</strong>
                              <a href={application.resume_link} target="_blank" rel="noopener noreferrer" className="link">
                                View Resume
                              </a>
                            </div>
                          )}

                          {application.portfolio_link && (
                            <div className="detail-section">
                              <strong>Portfolio:</strong>
                              <a href={application.portfolio_link} target="_blank" rel="noopener noreferrer" className="link">
                                View Portfolio
                              </a>
                            </div>
                          )}

                          <div className="detail-section">
                            <strong>Applied:</strong>
                            <p>{formatDate(application.created_at)}</p>
                          </div>
                        </div>

                        <div className="application-actions">
                          {applicant?.id ? (
                            <Link 
                              to={`/profile/${applicant.id}`} 
                              className="btn-primary small"
                              onClick={handleCloseApplicantsModal}
                            >
                              View Full Profile
                            </Link>
                          ) : null}
                          {applicant?.email && (
                            <a 
                              href={`mailto:${applicant.email}`} 
                              className="btn-secondary small"
                            >
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
