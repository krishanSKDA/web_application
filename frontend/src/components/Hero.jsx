import React, { useState } from 'react';
import CourseForm from '../components/CourseForm';
import { createCourse } from '../services/api';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Handle Add New Course
  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await createCourse(courseData);
      console.log('Course created:', newCourse);
      
      // You can add a success message here or redirect
      alert('Course created successfully!');
      
      // Close form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.detail || 'Failed to add course';
      throw new Error(errorMessage);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            {/* Left Side */}
            <div className="hero-text">
              {/* Top small image */}
              <div className="hero-top-img">
                <img
                  src="/assets/top-img.png"
                  alt="Happy learners"
                  width="180"
                  height="40"
                />
              </div>

              {/* Title */}
              <h1 className="hero-title">
                <span className="transform">Transform Your Career with </span>
                <span className="ofqual">Ofqual-Regulated Qualifications!</span>
              </h1>

              {/* Description */}
              <p className="hero-description">
                Join 120,000+ learners and earn accredited diplomas trusted by top
                employers like Deloitte and NHS. Study online, at your pace.
              </p>

              {/* Search Bar + Add Course Button Container */}
              <div className="hero-actions">
                {/* Search Bar */}
                <div className="search-bar" onClick={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search for a course or a subject"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <img
                    src="/assets/search-icon.png"
                    alt="Search Icon"
                    width="22"
                    height="22"
                    className="search-icon-img"
                  />
                </div>

                {/* Add Course Button */}
                <button className="btn-add-course-hero" onClick={() => setIsFormOpen(true)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Course
                </button>
              </div>
            </div>

            {/* Right Side - Image + Category Badges */}
            <div className="hero-right">
              <div className="hero-image">
                <img
                  src="/assets/right-img.png"
                  alt="Professional learners"
                  width="500"
                  height="400"
                />
              </div>
              
              {/* Category Badges - Now below the image */}
              <div className="hero-badges">
                <div className="badge badge-yellow">Business & Management</div>
                <div className="badge">Health & Social Care</div>
                <div className="badge">Information Technology</div>
                <div className="badge">Teaching & Education</div>
                <div className="badge">Accounting & Finance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Form Modal */}
      <CourseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddCourse}
        editingCourse={null}
      />
    </>
  );
};

export default Hero;