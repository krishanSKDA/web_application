import React from 'react';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    category,
    level,
    credits,
    rating,
    duration_text,
    image_url
  } = course;

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  return (
    <div className="course-card-figma">
      {/* Course Image */}
      <div className="course-card-image-wrapper">
        <img 
          src={`${API_BASE_URL}${image_url}`}
          alt={title}
          className="course-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/380x220/F7F0E8/2B180A?text=Course+Image';
          }}
        />
      </div>

      {/* Course Content */}
      <div className="course-card-content-figma">
        {/* Course Title */}
        <h3 className="course-card-title-figma">{title}</h3>

        {/* Course Meta Info */}
        <div className="course-card-meta-figma">
          {/* Rating */}
          <div className="course-meta-item-figma">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0L8.5716 5.0778H13.6574L9.5429 8.2444L11.1145 13.3222L7 10.1556L2.8855 13.3222L4.4571 8.2444L0.3426 5.0778H5.4284L7 0Z" fill="#FFA500"/>
            </svg>
            <span className="course-meta-text">{rating} (star)</span>
          </div>

          {/* Duration */}
          <div className="course-meta-item-figma">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z" stroke="#666" strokeWidth="1.2"/>
              <path d="M7 3.5V7L9.5 9.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="course-meta-text">{duration_text}</span>
          </div>

          {/* Credits */}
          <div className="course-meta-item-figma">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L8.854 4.764L13 5.382L10 8.382L10.708 12.618L7 10.764L3.292 12.618L4 8.382L1 5.382L5.146 4.764L7 1Z" stroke="#666" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span className="course-meta-text">{credits} Credits</span>
          </div>
        </div>

        {/* Learn More Button */}
        <button className="course-card-button-figma">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default CourseCard;