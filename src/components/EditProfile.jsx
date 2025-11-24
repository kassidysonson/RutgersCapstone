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
        // First get email from auth
        const { data: sessionData } = await supabase.auth.getSession();
        const userEmail = sessionData?.session?.user?.email || '';

        // Try to fetch from users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        // Set form data with existing values or defaults
        setFormData({
          full_name: data?.full_name || '',
          email: data?.email || userEmail,
          university: data?.university || '',
          bio: data?.bio || '',
          major: data?.major || '',
          academic_year: data?.academic_year || '',
          location: data?.location || '',
          skills: data?.skills || '',
          availability: data?.availability || '',
          profile_image: data?.profile_image || ''
        });
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        // Get email from auth as fallback
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
      // Get email from auth if not in formData
      let userEmail = formData.email;
      if (!userEmail) {
        const { data: sessionData } = await supabase.auth.getSession();
        userEmail = sessionData?.session?.user?.email || '';
      }

      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, projects_completed, experience_level')
        .eq('id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const projectsCompleted = existingUser?.projects_completed || 0;
      let experienceLevel = existingUser?.experience_level;
      if (!experienceLevel) {
        if (projectsCompleted >= 10) experienceLevel = 'Advanced';
        else if (projectsCompleted >= 5) experienceLevel = 'Intermediate';
        else experienceLevel = 'Beginner';
      }

      // Get full existing user data to preserve fields we're not updating
      let existingFullUser = null;
      if (existingUser) {
        const { data: fullUserData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        existingFullUser = fullUserData;
      }

      // Prepare user data - only include fields we want to update
      // Don't include password or other sensitive fields
      // Convert empty strings to null to avoid issues
      const updateData = {
        full_name: formData.full_name?.trim() || null,
        university: formData.university?.trim() || null,
        bio: formData.bio?.trim() || null,
        major: formData.major?.trim() || null,
        academic_year: formData.academic_year?.trim() || null,
        location: formData.location?.trim() || null,
        skills: formData.skills?.trim() || null,
        availability: formData.availability?.trim() || null,
        profile_image: formData.profile_image?.trim() || null,
        experience_level: experienceLevel
      };

      // Debug: log what we're trying to save
      console.log('Saving profile data:', updateData);
      console.log('Form data:', formData);

      let result;

      if (existingUser) {
        // User exists - update
        const { data, error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select();

        if (updateError) {
          console.error('Update error:', updateError);
          console.error('Update data:', updateData);
          console.error('User ID:', userId);
          throw updateError;
        }
        console.log('Update successful, returned data:', data);
        result = data;
      } else {
        // User doesn't exist - insert
        if (!userEmail) {
          throw new Error('Email is required to create user profile');
        }

        const insertData = {
          id: userId,
          email: userEmail,
          ...updateData,
          // Set defaults for new users
          projects_completed: 0,
          rating: 0,
          review_count: 0
        };

        const { data, error: insertError } = await supabase
          .from('users')
          .insert(insertData)
          .select();

        if (insertError) {
          console.error('Insert error:', insertError);
          console.error('Insert data:', insertData);
          console.error('User ID:', userId);
          throw insertError;
        }
        console.log('Insert successful, returned data:', data);
        result = data;
      }

      if (!result || result.length === 0) {
        throw new Error('Failed to save profile - no data returned');
      }

      console.log('Profile saved successfully:', result);

      alert('Profile saved successfully!');
      onClose();
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error.message || 'Please try again.'));
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

