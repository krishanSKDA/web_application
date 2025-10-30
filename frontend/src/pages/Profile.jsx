import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../components/CourseForm';
import { getCurrentUser, getMyCourses, createCourse, updateCourse, deleteCourse, updateProfile } from '../services/api';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setProfileData({
        full_name: userData.full_name || '',
        email: userData.email || ''
      });

      const userCourses = await getMyCourses();
      setCourses(userCourses);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Course
  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await createCourse(courseData);
      setCourses(prev => [newCourse, ...prev]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to add course';
      throw new Error(errorMessage);
    }
  };

  // Handle Edit Course
  const handleEditCourse = async (courseData) => {
    try {
      const updatedCourse = await updateCourse(editingCourse.id, courseData);
      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id ? updatedCourse : course
      ));
      setIsFormOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update course';
      throw new Error(errorMessage);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.detail || 'Failed to delete course');
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(profileData);
      setUser(updated);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  // Handle Back Navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Back Button */}
        <button className="btn-back" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#FF7B0F" strokeWidth="2"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#FF7B0F" strokeWidth="2"/>
            </svg>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.full_name || user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-username">@{user.username}</p>
          </div>
          <button className="btn-add-course" onClick={() => setIsFormOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add New Course
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses ({courses.length})
          </button>
          <button 
            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'courses' ? (
            <div className="courses-tab">
              {courses.length === 0 ? (
                <div className="empty-state">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="#666" strokeWidth="2"/>
                    <path d="M3 14L12 19L21 14" stroke="#666" strokeWidth="2"/>
                  </svg>
                  <h3>No courses yet</h3>
                  <p>Start by creating your first course!</p>
                  <button className="btn-add-course" onClick={() => setIsFormOpen(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add New Course
                  </button>
                </div>
              ) : (
                <div className="course-grid">
                  {courses.map((course) => (
                    <div key={course.id} className="course-card-figma">
                      <div className="course-card-image-wrapper">
                        <img 
                          src={course.image_url || '/assets/card-image.png'} 
                          alt={course.title}
                          className="course-card-image"
                        />
                      </div>
                      <div className="course-card-content-figma">
                        <h3 className="course-card-title-figma">{course.title}</h3>
                        <div className="course-card-meta-figma">
                          <div className="course-meta-item-figma">
                            <span className="course-meta-text">{course.rating} ★</span>
                          </div>
                          <div className="course-meta-item-figma">
                            <span className="course-meta-text">{course.duration_text}</span>
                          </div>
                          <div className="course-meta-item-figma">
                            <span className="course-meta-text">{course.credits} Credits</span>
                          </div>
                        </div>
                        <div className="course-card-actions">
                          <button 
                            className="course-card-button-figma"
                            onClick={() => {
                              setEditingCourse(course);
                              setIsFormOpen(true);
                            }}
                          >
                            Edit Course
                          </button>
                          <button 
                            className="btn-delete-course"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="settings-tab">
              <div className="settings-box">
                <h2>Profile Settings</h2>
                
                {!isEditingProfile ? (
                  <div className="profile-details">
                    <div className="detail-item">
                      <label>Full Name</label>
                      <p>{user.full_name || 'Not set'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Username</label>
                      <p>{user.username}</p>
                    </div>
                    <button 
                      className="btn-edit-profile"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            full_name: user.full_name || '',
                            email: user.email || ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-submit">
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Form Modal */}
      <CourseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={editingCourse ? handleEditCourse : handleAddCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
};

export default Profile;