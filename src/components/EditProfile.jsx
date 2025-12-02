import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './EditProfile.css';

// List of universities - Add more universities here
const UNIVERSITIES = [
  'Rutgers University',
  'Princeton University',
  'Stevens Institute of Technology',
  'New Jersey Institute of Technology (NJIT)',
  'Seton Hall University',
  'Montclair State University',
  'Rowan University',
  'The College of New Jersey (TCNJ)',
  'Rider University',
  'Fairleigh Dickinson University',
  'Drew University',
  'Stockton University',
  'Kean University',
  'William Paterson University',
  'Ramapo College',
  'Other'
];

// Majors grouped by category
const MAJORS_BY_CATEGORY = [
  {
    category: 'Arts & Humanities',
    majors: [
      'English',
      'History',
      'Philosophy',
      'Linguistics',
      'Communications',
      'Visual Arts / Fine Arts'
    ]
  },
  {
    category: 'Social Sciences',
    majors: [
      'Psychology',
      'Sociology',
      'Political Science',
      'Anthropology',
      'Economics',
      'Criminal Justice',
      'Education'
    ]
  },
  {
    category: 'Business',
    majors: [
      'Business Administration',
      'Finance',
      'Accounting',
      'Marketing',
      'Management',
      'Entrepreneurship'
    ]
  },
  {
    category: 'STEM',
    majors: [
      'Computer Science',
      'Information Technology',
      'Software Engineering',
      'Data Science',
      'Cybersecurity',
      'Mathematics',
      'Statistics',
      'Biology',
      'Chemistry',
      'Physics',
      'Environmental Science'
    ]
  },
  {
    category: 'Engineering',
    majors: [
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Biomedical Engineering',
      'Chemical Engineering'
    ]
  },
  {
    category: 'Health & Public Service',
    majors: [
      'Nursing',
      'Public Health',
      'Social Work',
      'Health Sciences',
      'Pre-Medicine / Pre-Health'
    ]
  }
];

const EditProfile = ({ isOpen, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    university: '',
    bio: '',
    major: '',
    otherMajor: '',
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
        const profileImage = data?.profile_image || '';
        const storedMajor = data?.major || '';
        
        // Check if the stored major is in our predefined list
        const allMajors = MAJORS_BY_CATEGORY.flatMap(cat => cat.majors);
        const isOtherMajor = storedMajor && !allMajors.includes(storedMajor);
        
        setFormData({
          full_name: data?.full_name || '',
          email: data?.email || userEmail,
          university: data?.university || '',
          bio: data?.bio || '',
          major: isOtherMajor ? 'Other (please specify)' : storedMajor,
          otherMajor: isOtherMajor ? storedMajor : '',
          academic_year: data?.academic_year || '',
          location: data?.location || '',
          skills: data?.skills || '',
          availability: data?.availability || '',
          profile_image: profileImage
        });
        // Set preview if profile_image is a URL
        if (profileImage && (profileImage.startsWith('http://') || profileImage.startsWith('https://'))) {
          setImagePreview(profileImage);
        } else {
          setImagePreview(null);
        }
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
    
    // Handle major dropdown change
    if (name === 'major') {
      setFormData(prev => ({
        ...prev,
        major: value,
        // Clear otherMajor if switching to a regular major
        otherMajor: value === 'Other (please specify)' ? prev.otherMajor : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB - reasonable for profile images)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB. Please compress your image or choose a smaller file.');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !userId) return;

    setUploadingImage(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage (bucket is public)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Handle specific error cases
        if (uploadError.message?.includes('already exists')) {
          // If file exists, try with a new timestamp
          const newFileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const retryUpload = await supabase.storage
            .from('profile-images')
            .upload(newFileName, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (retryUpload.error) throw retryUpload.error;
          
          // Get public URL for retried upload
          const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(newFileName);
          
          if (urlData?.publicUrl) {
            setFormData(prev => ({
              ...prev,
              profile_image: urlData.publicUrl
            }));
            alert('Image uploaded successfully!');
            return;
          }
        }
        throw uploadError;
      }

      // Get public URL (bucket is public, so this should work)
      const uploadedPath = uploadData?.path || filePath;
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(uploadedPath);

      if (urlData?.publicUrl) {
        setFormData(prev => ({
          ...prev,
          profile_image: urlData.publicUrl
        }));
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Failed to get public URL');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error.message || 'Please try again.'));
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profile_image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      // Get current session to ensure we have the authenticated user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user) {
        alert('Please log in to save your profile');
        setLoading(false);
        return;
      }

      const authUserId = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email || formData.email || '';

      // Use the authenticated user's ID, not the prop (for security)
      const currentUserId = authUserId || userId;
      
      if (!currentUserId) {
        alert('User not authenticated');
        setLoading(false);
        return;
      }

      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, projects_completed, experience_level')
        .eq('id', currentUserId)
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
          .eq('id', currentUserId)
          .single();
        existingFullUser = fullUserData;
      }

      // Prepare user data - only include fields we want to update
      // Don't include password or other sensitive fields
      // Convert empty strings to null to avoid issues
      // Use otherMajor if "Other (please specify)" is selected
      const majorValue = formData.major === 'Other (please specify)' 
        ? (formData.otherMajor?.trim() || null)
        : (formData.major?.trim() || null);
      
      const updateData = {
        full_name: formData.full_name?.trim() || null,
        university: formData.university?.trim() || null,
        bio: formData.bio?.trim() || null,
        major: majorValue,
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
          .eq('id', currentUserId)
          .select();

        if (updateError) {
          console.error('Update error:', updateError);
          console.error('Update data:', updateData);
          console.error('User ID:', currentUserId);
          console.error('Auth UID:', authUserId);
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
          id: currentUserId, // Must match auth.uid() for RLS policy
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
          console.error('User ID:', currentUserId);
          console.error('Auth UID:', authUserId);
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
            <select
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select university</option>
              {UNIVERSITIES.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
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
              <select
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select major</option>
                {MAJORS_BY_CATEGORY.map((categoryGroup) => (
                  <optgroup key={categoryGroup.category} label={categoryGroup.category}>
                    {categoryGroup.majors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="Other (please specify)">Other (please specify)</option>
              </select>
              {formData.major === 'Other (please specify)' && (
                <input
                  type="text"
                  name="otherMajor"
                  value={formData.otherMajor}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Please specify your major"
                  style={{ marginTop: '8px' }}
                />
              )}
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
            <label className="form-label">Profile Image</label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="image-preview"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-image"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            {/* File Input */}
            <div className="file-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="profile-image-upload"
              />
              <label htmlFor="profile-image-upload" className="file-input-label">
                {selectedFile ? selectedFile.name : 'Choose Image'}
              </label>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploadingImage}
                  className="btn-upload-image"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
              )}
            </div>

            {/* Or use URL option */}
            <div className="image-url-option">
              <span className="url-divider">OR</span>
              <input
                type="text"
                name="profile_image"
                value={formData.profile_image}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter image URL"
              />
            </div>
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

