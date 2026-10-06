import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              🧭 Local<span>Guide</span>
            </div>
            <p className="footer-desc">
              Connecting travelers directly with verified local experts for authentic cultural tours, culinary discoveries, and outdoor adventures.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-success">✓ 100% Local Guides</span>
              <span className="badge badge-warning">✓ Pay at Venue</span>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Explore Experiences</h4>
            <ul className="footer-links">
              <li><Link to="/experiences?category=Culture%20%26%20Heritage">Culture & Heritage</Link></li>
              <li><Link to="/experiences?category=Food%20%26%20Culinary">Food & Culinary</Link></li>
              <li><Link to="/experiences?category=Nature%20%26%20Adventure">Nature & Adventure</Link></li>
              <li><Link to="/experiences?category=Art%20%26%20Craft">Art & Craft</Link></li>
              <li><Link to="/experiences?category=Wellness%20%26%20Yoga">Wellness & Yoga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Platform Information</h4>
            <ul className="footer-links">
              <li><Link to="/experiences">Browse All Tours</Link></li>
              <li><Link to="/register">Become a Local Guide</Link></li>
              <li><Link to="/login">Account Access</Link></li>
              <li style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Local storage & MongoDB Compass verified
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LocalGuide MERN Platform. All rights reserved.</p>
          <p style={{ color: '#64748B' }}>Built with Node.js, Express, MongoDB & React</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
