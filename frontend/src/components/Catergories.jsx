import React, { useState, useEffect } from 'react';
import CourseForm from './CourseForm';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';

const Categories = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch courses on component mount and when filters change
  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, page]);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: 10,
        published: true
      };
      
      // Add category filter if not "All"
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await getCourses(params);
      
      setCourses(response.items);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add New Course
  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await createCourse(courseData);
      
      // Refresh the course list
      fetchCourses();
      
      // Close form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.detail || 'Failed to add course';
      throw new Error(errorMessage);
    }
  };

  // Handle Edit Course
  const handleEditCourse = async (courseData) => {
    try {
      const updatedCourse = await updateCourse(editingCourse.id, courseData);
      
      // Update the course in the list
      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id ? updatedCourse : course
      ));
      
      // Close form and reset editing
      setIsFormOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      
      // Extract error message from response
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
      
      // Remove from list
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to delete course';
      alert(errorMessage);
    }
  };

  // Open form for adding new course
  const openAddForm = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing course
  const openEditForm = (course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  // Category list
  const categories = [
    'All',
    'Business & Management',
    'Health & Social Care',
    'Information Technology',
    'Teaching & Education',
    'Accounting & Finance'
  ];

  if (loading && courses.length === 0) {
    return (
      <section className="category-section">
        <div className="container">
          <div className="loading-courses">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="category-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-title-container">
          <h2 className="section-title">
            Explore Popular <span className="highlight">Career Paths</span>
          </h2>
        </div>

        {/* Add Course Button + Category Tabs */}
        <div className="category-controls">
          {/* Add Course Button */}
          <button className="btn-add-course" onClick={openAddForm}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add New Course
          </button>

          {/* Category Tabs */}
          <div className="category-tabs-container">
            <div className="category-tabs-wrapper">
              <div className="category-tabs">
                {categories.map((category) => (
                  <button 
                    key={category}
                    className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setPage(1); // Reset to first page when changing category
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14L12 19L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No courses found</h3>
            <p>Start by adding your first course!</p>
            <button className="btn-add-course" onClick={openAddForm} style={{ marginTop: '20px' }}>
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
                {/* Course Image */}
                <div className="course-card-image-wrapper">
                  <img 
                    src={course.image_url || '/assets/card-image.png'} 
                    alt={course.title}
                    className="course-card-image"
                  />
                </div>

                {/* Course Content */}
                <div className="course-card-content-figma">
                  <h3 className="course-card-title-figma">{course.title}</h3>

                  {/* Course Meta */}
                  <div className="course-card-meta-figma">
                    <div className="course-meta-item-figma">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7L7 1L13 7" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="course-meta-text">{course.rating} ★</span>
                    </div>
                    <div className="course-meta-item-figma">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v6l4 2" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="7" cy="7" r="6" stroke="#666" strokeWidth="1.5"/>
                      </svg>
                      <span className="course-meta-text">{course.duration_text}</span>
                    </div>
                    <div className="course-meta-item-figma">
                      <span className="course-meta-text">{course.credits} Credits</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="course-card-actions">
                    <button 
                      className="course-card-button-figma"
                      onClick={() => openEditForm(course)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="btn-pagination"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button 
              className="btn-pagination"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Browse All Button */}
        <div className="browse-all-container">
          <button className="btn-browse-all">
            Browse all courses
          </button>
        </div>
      </div>

      {/* Course Form Modal */}
      <CourseForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingCourse ? handleEditCourse : handleAddCourse}
        editingCourse={editingCourse}
      />
    </section>
  );
};

export default Categories;