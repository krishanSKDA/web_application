import React, { useState, useEffect } from 'react';
import '../styles/CourseForm.css';

const CourseForm = ({ isOpen, onClose, onSubmit, editingCourse = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    credits: 40,
    rating: 4.5,
    duration_text: '1 Year',
    image_url: '/assets/card-image.png',
    published: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || '',
        description: editingCourse.description || '',
        category: editingCourse.category || '',
        level: editingCourse.level || 'Beginner',
        duration: editingCourse.duration || '',
        credits: editingCourse.credits || 40,
        rating: editingCourse.rating || 4.5,
        duration_text: editingCourse.duration_text || '1 Year',
        image_url: editingCourse.image_url || '/assets/card-image.png',
        published: editingCourse.published !== undefined ? editingCourse.published : true
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        duration: '',
        credits: 40,
        rating: 4.5,
        duration_text: '1 Year',
        image_url: '/assets/card-image.png',
        published: true
      });
    }
    setErrors({});
  }, [editingCourse, isOpen]);

  const categories = [
    'Business & Management',
    'Health & Social Care',
    'Information Technology',
    'Teaching & Education',
    'Accounting & Finance',
    'Web Development',
    'Data Science',
    'Design',
    'Marketing'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 100) {
      newErrors.credits = 'Credits must be between 1 and 100';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (!formData.duration_text.trim()) {
      newErrors.duration_text = 'Duration text is required';
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const courseData = {
        ...formData,
        duration: Number(formData.duration),
        credits: Number(formData.credits),
        rating: Number(formData.rating)
      };

      await onSubmit(courseData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        duration: '',
        credits: 40,
        rating: 4.5,
        duration_text: '1 Year',
        image_url: '/assets/card-image.png',
        published: true
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save course' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">
              Course Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to React"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn in this course..."
              rows="4"
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="level">
                Level <span className="required">*</span>
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">
                Duration (hours) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                step="0.5"
                className={errors.duration ? 'input-error' : ''}
              />
              {errors.duration && <span className="field-error">{errors.duration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration_text">
                Duration Text <span className="required">*</span>
              </label>
              <input
                type="text"
                id="duration_text"
                name="duration_text"
                value={formData.duration_text}
                onChange={handleChange}
                placeholder="e.g., 1 Year"
                className={errors.duration_text ? 'input-error' : ''}
              />
              {errors.duration_text && <span className="field-error">{errors.duration_text}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="credits">
                Credits <span className="required">*</span>
              </label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="40"
                min="1"
                max="100"
                className={errors.credits ? 'input-error' : ''}
              />
              {errors.credits && <span className="field-error">{errors.credits}</span>}
              <small className="field-help">Course credits (1-100)</small>
            </div>

            <div className="form-group">
              <label htmlFor="rating">
                Rating <span className="required">*</span>
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                className={errors.rating ? 'input-error' : ''}
              />
              {errors.rating && <span className="field-error">{errors.rating}</span>}
              <small className="field-help">Rating (0-5)</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">
              Image URL <span className="required">*</span>
            </label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="/assets/card-image.png"
              className={errors.image_url ? 'input-error' : ''}
            />
            {errors.image_url && <span className="field-error">{errors.image_url}</span>}
            <small className="field-help">Path to course image</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Published</span>
              </label>
              <small className="field-help">Make this course visible to students</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  <span className="spinner"></span>
                  Saving...
                </span>
              ) : (
                editingCourse ? 'Update Course' : 'Add Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;