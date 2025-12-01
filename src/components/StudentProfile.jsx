import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    senderEmail: '',
    senderName: ''
  });

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Fetch student profile from Supabase
  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!id) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        if (!userData) {
          setError('User profile not found');
          setLoading(false);
          return;
        }

        // Get email from auth if not in userData
        let email = userData.email;
        if (!email) {
          // Try to get from auth.users (this might not work due to RLS, but worth trying)
          const { data: authData } = await supabase.auth.getUser(id);
          email = authData?.user?.email || '';
        }

        // Parse skills from comma-separated string
        const skills = userData.skills
          ? userData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        // Get profile image URL or generate initials
        const profileImageUrl = userData.profile_image && 
          (userData.profile_image.startsWith('http://') || userData.profile_image.startsWith('https://'))
          ? userData.profile_image 
          : null;
        const profileImageInitials = profileImageUrl ? null : getInitials(userData.full_name || email);

        // Map experience_level to experience string
        const experienceMap = {
          'Beginner': '1-2 years',
          'Intermediate': '3-4 years',
          'Advanced': '5+ years'
        };
        const experience = experienceMap[userData.experience_level] || '1-2 years';

        // Format student data
        const formattedStudent = {
          id: userData.id,
          name: userData.full_name || email?.split('@')[0] || 'User',
          major: userData.major || 'Not specified',
          year: userData.academic_year || 'Not specified',
          location: userData.location || 'Not specified',
          rating: userData.rating || 0,
          reviewCount: userData.review_count || 0,
          description: userData.bio || 'No bio available.',
          skills: skills,
          availability: userData.availability || 'Not specified',
          projectsCompleted: userData.projects_completed || 0,
          profileImageUrl: profileImageUrl,
          profileImageInitials: profileImageInitials,
          email: email || 'No email available',
          // Fields not in database - set to null/empty
          phone: null,
          linkedin: null,
          github: null,
          portfolio: null,
          twitter: null,
          behance: null,
          experience: experience,
          languages: ['English'], // Default, not in database
          timezone: 'Not specified' // Not in database
        };

        setStudent(formattedStudent);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  const handleSendMessage = () => {
    setShowMessageModal(true);
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessageData({
      subject: '',
      message: '',
      senderEmail: '',
      senderName: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    
    // Create mailto link with pre-filled content
    const mailtoLink = `mailto:${student.email}?subject=${encodeURIComponent(messageData.subject)}&body=${encodeURIComponent(
      `Hello ${student.name},\n\n${messageData.message}\n\nBest regards,\n${messageData.senderName}\n${messageData.senderEmail}`
    )}`;
    
    // Open the user's default email client
    window.location.href = mailtoLink;
    
    // Close the modal
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="profile-not-found">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="profile-not-found">
        <h2>{error || 'Student not found'}</h2>
        <Link to="/#find-students">← Back to Find Students</Link>
      </div>
    );
  }

  return (
    <div className="student-profile-page">
      <div className="profile-header">
        <Link to="/for-students" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Students
        </Link>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar-large">
              {student.profileImageUrl ? (
                <img 
                  src={student.profileImageUrl} 
                  alt={student.name}
                  className="profile-avatar-img"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    const initialsSpan = e.target.parentElement.querySelector('.profile-avatar-initials');
                    if (initialsSpan) {
                      initialsSpan.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <span 
                className="profile-avatar-initials"
                style={{ display: student.profileImageUrl ? 'none' : 'flex' }}
              >
                {student.profileImageInitials}
              </span>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{student.name}</h1>
              <p className="profile-title">{student.major} • {student.year}</p>
              <p className="profile-location">{student.location}</p>
              <div className="profile-rating">
                <span className="rating-stars">⭐ {student.rating}</span>
                <span className="rating-count">({student.reviewCount} reviews)</span>
              </div>
            </div>
            
          </div>

          <div className="profile-content">
            <div className="profile-main">
              <div className="profile-section">
                <h3 className="section-title">About</h3>
                <p className="profile-description">{student.description}</p>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Skills</h3>
                <div className="skills-grid">
                  {student.skills && student.skills.length > 0 ? (
                    student.skills.map(skill => (
                      <span key={skill} className="skill-tag-large">{skill}</span>
                    ))
                  ) : (
                    <span className="skill-tag-large" style={{ opacity: 0.6 }}>No skills specified</span>
                  )}
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Experience & Availability</h3>
                <div className="experience-grid">
                  <div className="experience-item">
                    <span className="experience-label">Experience</span>
                    <span className="experience-value">{student.experience}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Availability</span>
                    <span className="experience-value">{student.availability}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Projects Completed</span>
                    <span className="experience-value">{student.projectsCompleted}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Timezone</span>
                    <span className="experience-value">{student.timezone}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Languages</h3>
                <div className="languages-list">
                  {student.languages.map(language => (
                    <span key={language} className="language-tag">{language}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-sidebar">
              <div className="contact-card">
                <h3 className="contact-title">Contact Information</h3>
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <a href={`mailto:${student.email}`} className="contact-link">{student.email}</a>
                </div>
                {student.phone && (
                  <div className="contact-item">
                    <span className="contact-label">Phone</span>
                    <a href={`tel:${student.phone}`} className="contact-link">{student.phone}</a>
                  </div>
                )}
                {student.linkedin && (
                  <div className="contact-item">
                    <span className="contact-label">LinkedIn</span>
                    <a href={`https://${student.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-link">{student.linkedin}</a>
                  </div>
                )}
                {student.github && (
                  <div className="contact-item">
                    <span className="contact-label">GitHub</span>
                    <a href={`https://${student.github}`} target="_blank" rel="noopener noreferrer" className="contact-link">{student.github}</a>
                  </div>
                )}
                {student.portfolio && (
                  <div className="contact-item">
                    <span className="contact-label">Portfolio</span>
                    <a href={`https://${student.portfolio}`} target="_blank" rel="noopener noreferrer" className="contact-link">{student.portfolio}</a>
                  </div>
                )}
                {student.twitter && (
                  <div className="contact-item">
                    <span className="contact-label">Twitter</span>
                    <a href={`https://${student.twitter}`} target="_blank" rel="noopener noreferrer" className="contact-link">{student.twitter}</a>
                  </div>
                )}
                {student.behance && (
                  <div className="contact-item">
                    <span className="contact-label">Behance</span>
                    <a href={`https://${student.behance}`} target="_blank" rel="noopener noreferrer" className="contact-link">{student.behance}</a>
                  </div>
                )}
              </div>

              <div className="quick-actions">
                <button className="btn-message" onClick={handleSendMessage}>Send Message</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Message to {student.name}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="message-form">
              <div className="form-group">
                <label htmlFor="senderName">Your Name</label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={messageData.senderName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="senderEmail">Your Email</label>
                <input
                  type="email"
                  id="senderEmail"
                  name="senderEmail"
                  value={messageData.senderEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={messageData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter message subject"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={messageData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Write your message here..."
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-send">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
