import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout, isAuthenticated } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and fetch user data
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
          // Token might be expired
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [location]); // Re-fetch when location changes (after login/navigation)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Navbar Content */}
      <div className="navbar-content">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="Aspirex Logo"
              width="164"
              height="42"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li className="browse-dropdown">
            <Link to="/courses">Browse all courses</Link>
            <span>›</span>
          </li>
          <li>
            <Link to="/webinar">Webinar</Link>
          </li>
          <li>
            <Link to="/contact">Contact us</Link>
          </li>
        </ul>
      </div>

      {/* Navbar Actions */}
      <div className="navbar-actions">
        {/* Search Icon */}
        <div className="search-icon">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="7.5"
              cy="7.5"
              r="6.5"
              stroke="#252525"
              strokeWidth="2"
            />
            <line
              x1="12.7071"
              y1="12.2929"
              x2="16.7071"
              y2="16.2929"
              stroke="#252525"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Book a Call Button */}
        <button className="btn-contact">
          <img
            src="/assets/call-icon.png"
            alt="Call Icon"
            width="16"
            height="16"
          />
          Book a call
        </button>

        {/* Login/Profile */}
        {!loading && (
          <>
            {user ? (
              <div className="user-menu">
                <button 
                  className="btn-profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{user.username}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-username">{user.username}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/my-courses" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      My Courses
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-login">
                <img
                  src="/assets/logout.png"
                  alt="Login Icon"
                  width="16"
                  height="16"
                />
                Login
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;