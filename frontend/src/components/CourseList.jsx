import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import CategoryTabs from '../components/CatergoryTabs';
import { getCourses } from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Business & Management');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    category: 'Business & Management',
    level: '',
    published: true
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses(filters);
      setCourses(response.items || []);
      setTotalPages(response.total_pages || 1);
      setCurrentPage(response.page || 1);
      setError(null);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilters(prev => ({
      ...prev,
      category: category,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseAll = () => {
    setFilters(prev => ({
      ...prev,
      limit: 100,
      category: '',
      page: 1
    }));
  };

  return (
    <section className="category-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-title-container">
          <h2 className="section-title">
            Explore Popular <span className="highlight">Career Paths</span>
          </h2>
        </div>

        {/* Category Tabs */}
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange} 
        />

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #FF7B0F',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '40px auto'
            }}></div>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
              Loading courses...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error" style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#d32f2f' 
          }}>
            <p>{error}</p>
            <button 
              onClick={fetchCourses} 
              className="btn-browse-all"
              style={{ marginTop: '20px' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {courses.length > 0 ? (
              <>
                <div className="course-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '30px',
                  marginBottom: '40px'
                }}>
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    margin: '40px 0'
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn-contact"
                      style={{
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    
                    <span style={{ 
                      fontSize: '16px', 
                      color: '#2B180A',
                      fontWeight: '500'
                    }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn-contact"
                      style={{
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Browse All Button */}
                <div className="browse-all-container">
                  <button 
                    className="btn-browse-all"
                    onClick={handleBrowseAll}
                  >
                    Browse all courses
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                  No courses found for "{selectedCategory}"
                </p>
                <button 
                  onClick={() => handleCategoryChange('Business & Management')}
                  className="btn-contact"
                >
                  View All Categories
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default CourseList;