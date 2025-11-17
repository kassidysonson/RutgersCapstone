import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const doesTableExistError = (error) => {
  if (!error) return false;
  const message = (error.message || '').toLowerCase();
  const details = (error.details || '').toLowerCase();
  return message.includes('does not exist') || details.includes('does not exist');
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

  useEffect(() => {
    let ignore = false;

    const fetchOptional = async (queryBuilder, transform = (rows) => rows ?? []) => {
      const { data, error: queryError } = await queryBuilder;
      if (queryError) {
        if (doesTableExistError(queryError)) {
          console.warn('[Dashboard] Optional table missing:', queryError.message);
          return [];
        }
        throw queryError;
      }
      return transform(data ?? []);
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

        const [profileResult, postedRows, appliedRows, savedRows] = await Promise.all([
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
                      <button className="btn-secondary small">View Applicants</button>
                      <button className="btn-primary small">Manage Project</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
