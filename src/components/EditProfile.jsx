import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './EditProfile.css';

const EditProfile = ({ isOpen, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    university: '',
    bio: '',
    major: '',
    academic_year: '',
    location: '',
    skills: '',
    availability: '',
    profile_image: ''
  });

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !isOpen) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            university: data.university || '',
            bio: data.bio || '',
            major: data.major || '',
            academic_year: data.academic_year || '',
            location: data.location || '',
            skills: data.skills || '',
            availability: data.availability || '',
            profile_image: data.profile_image || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If user doesn't exist in users table, get email from auth
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          setFormData(prev => ({
            ...prev,
            email: sessionData.session.user.email || ''
          }));
        }
      }
    };

    fetchProfile();
  }, [userId, isOpen]);

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
      alert('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      // Calculate experience level based on projects_completed if not set
      const { data: currentUser } = await supabase
        .from('users')
        .select('projects_completed')
        .eq('id', userId)
        .single();

      const projectsCompleted = currentUser?.projects_completed || 0;
      let experienceLevel = formData.experience_level;
      if (!experienceLevel) {
        if (projectsCompleted >= 10) experienceLevel = 'Advanced';
        else if (projectsCompleted >= 5) experienceLevel = 'Intermediate';
        else experienceLevel = 'Beginner';
      }

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          university: formData.university,
          bio: formData.bio,
          major: formData.major,
          academic_year: formData.academic_year,
          location: formData.location,
          skills: formData.skills,
          availability: formData.availability,
          profile_image: formData.profile_image,
          experience_level: experienceLevel
        })
        .eq('id', userId);

      if (error) throw error;

      alert('Profile updated successfully!');
      onClose();
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="form-input disabled"
              placeholder="Email (cannot be changed)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your university"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="form-group half">
              <label className="form-label">Academic Year</label>
              <select
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., React, Python, UI/UX Design"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 20 hrs/week"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image (Initials or URL)</label>
            <input
              type="text"
              name="profile_image"
              value={formData.profile_image}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., JD or https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

