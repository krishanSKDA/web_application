import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Text */}
        <p className="footer-text">
          We're ready to lead you into the future:
        </p>

        {/* Partner Logos */}
        <div className="footer-logos">
          {/* Deloitte Logo */}
          <img 
            src="assets/image-1.png" 
            alt="Deloitte" 
            className="footer-logo"
            
          />

          {/* Belfast City Council Logo */}
          <img 
            src="/assets/image-2.png" 
            alt="Belfast City Council" 
            className="footer-logo"
            
          />

          {/* Octopus Energy Logo */}
          <img 
            src="/assets/image-3.png" 
            alt="Octopus Energy" 
            className="footer-logo"
            
          />

          {/* NHS Logo */}
          <img 
            src="/assets/image-4.png" 
            alt="NHS" 
            className="footer-logo"
            
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;