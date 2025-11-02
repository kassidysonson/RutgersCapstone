import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    senderEmail: '',
    senderName: ''
  });

  // Student data (same as in FindStudents)
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
      profileImage: "SC",
      email: "sarah.chen@stanford.edu",
      phone: "(650) 555-0123",
      linkedin: "linkedin.com/in/sarahchen",
      github: "github.com/sarahchen",
      portfolio: "sarahchen.dev",
      experience: "3 years",
      languages: ["English", "Mandarin"],
      timezone: "PST"
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
      profileImage: "MJ",
      email: "marcus.johnson@bu.edu",
      phone: "(617) 555-0456",
      linkedin: "linkedin.com/in/marcusjohnson",
      twitter: "@marcusj_marketing",
      portfolio: "marcusjohnson.com",
      experience: "4 years",
      languages: ["English", "Spanish"],
      timezone: "EST"
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
      profileImage: "ER",
      email: "emma.rodriguez@utexas.edu",
      phone: "(512) 555-0789",
      linkedin: "linkedin.com/in/emmarodriguez",
      behance: "behance.net/emmarodriguez",
      portfolio: "emmarodriguez.design",
      experience: "2 years",
      languages: ["English", "Spanish"],
      timezone: "CST"
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
      profileImage: "DK",
      email: "david.kim@uw.edu",
      phone: "(206) 555-0321",
      linkedin: "linkedin.com/in/davidkim",
      github: "github.com/davidkim",
      portfolio: "davidkim.ai",
      experience: "5 years",
      languages: ["English", "Korean"],
      timezone: "PST"
    },
    {
      id: 5,
      name: "Galathara Kahanda",
      major: "Computer Science",
      year: "Graduate",
      location: "Newark, NJ",
      rating: 5.0,
      reviewCount: 3,
      description: "My research lies at the intersection of AI, ML, and cybersecurity, with the overarching goal of developing intelligent, adaptive, and robust systems that can operate securely in adversarial environments.",
      skills: ["React", "Python", "UI/UX Design", "Machine Learning"],
      availability: "20 hrs/week",
      projectsCompleted: 3,
      profileImage: "GK",
      email: "galathara.kahanda@rutgers.edu",
      phone: "(973) 555-0654",
      linkedin: "linkedin.com/in/galatharakahanda",
      github: "github.com/galathara",
      portfolio: "kahanda.dev",
      experience: "2 years",
      languages: ["English", "Creole"],
      timezone: "EST"
    }
  ];

  const student = students.find(s => s.id === parseInt(id));

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

  if (!student) {
    return (
      <div className="profile-not-found">
        <h2>Student not found</h2>
        <Link to="/#find-students">← Back to Find Students</Link>
      </div>
    );
  }

  return (
    <div className="student-profile-page">
      <div className="profile-header">
        <Link to="/#find-students" className="back-link">
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
              {student.profileImage}
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
                  {student.skills.map(skill => (
                    <span key={skill} className="skill-tag-large">{skill}</span>
                  ))}
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
                <div className="contact-item">
                  <span className="contact-label">Phone</span>
                  <a href={`tel:${student.phone}`} className="contact-link">{student.phone}</a>
                </div>
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
