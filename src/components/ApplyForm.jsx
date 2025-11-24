import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ApplyForm.css';

const ApplyForm = ({ isOpen, onClose, projectId, projectTitle }) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    cover_letter: '',
    resume_link: '',
    portfolio_link: '',
    availability: '',
    relevant_experience: '',
    why_interested: ''
  });

  useEffect(() => {
    const getUserId = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
      }
    };
    getUserId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Please log in to apply for this project');
      onClose();
      return;
    }

    if (!projectId) {
      alert('Project ID is missing');
      return;
    }

    setLoading(true);

    try {
      // Check if user already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId)
        .eq('applicant_id', userId)
        .maybeSingle();

      if (existingApplication) {
        alert('You have already applied for this project!');
        setLoading(false);
        return;
      }

      // Prepare application data
      // Use cover_letter for message field (backward compatibility) and also store in cover_letter
      const coverLetterText = formData.cover_letter?.trim() || '';
      
      const applicationData = {
        project_id: projectId,
        applicant_id: userId,
        message: coverLetterText || null, // Store in message for backward compatibility
        cover_letter: coverLetterText || null,
        resume_link: formData.resume_link?.trim() || null,
        portfolio_link: formData.portfolio_link?.trim() || null,
        availability: formData.availability?.trim() || null,
        relevant_experience: formData.relevant_experience?.trim() || null,
        why_interested: formData.why_interested?.trim() || null,
        status: 'pending' // Default status
      };

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) {
        console.error('Application error:', error);
        throw error;
      }

      alert('Application submitted successfully!');
      onClose();
      // Reset form
      setFormData({
        message: '',
        cover_letter: '',
        resume_link: '',
        portfolio_link: '',
        availability: '',
        relevant_experience: '',
        why_interested: ''
      });
      
      // Refresh the page to update application count
      window.location.reload();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application: ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="apply-form-overlay" onClick={onClose}>
      <div className="apply-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="apply-form-header">
          <h2>Apply for Project</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="apply-form-project-info">
          <h3>{projectTitle || 'Project Application'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-group">
            <label className="form-label">
              Cover Letter / Message <span className="required">*</span>
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              className="form-textarea"
              rows="6"
              placeholder="Tell the project owner why you're interested and what makes you a good fit..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Resume Link (Optional)</label>
            <input
              type="url"
              name="resume_link"
              value={formData.resume_link}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://your-resume-link.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Portfolio Link (Optional)</label>
            <input
              type="url"
              name="portfolio_link"
              value={formData.portfolio_link}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://your-portfolio.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Availability (Optional)</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 15-20 hrs/week, Available immediately"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relevant Experience (Optional)</label>
            <textarea
              name="relevant_experience"
              value={formData.relevant_experience}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Describe your relevant experience for this project..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why are you interested? (Optional)</label>
            <textarea
              name="why_interested"
              value={formData.why_interested}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="What interests you about this project?"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;

