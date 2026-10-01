import React from 'react';
import {
  Info,
  ListChecks,
  Code2,
  Tag,
  UserCircle,
  Mail,
  Server,
  Database,
  Layout,
} from 'lucide-react';

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <h1 className="page-hero-title">About SecureApp</h1>
        <p className="page-hero-subtitle">
          A modern, secure web application built with React, Vite, and a
          Node.js + MySQL backend.
        </p>
      </section>

      {/* About the application */}
      <section className="section-block">
        <h2 className="section-title">
          <Info size={18} /> About the Application
        </h2>
        <div className="card about-card">
          <p>
            SecureApp is a professional dashboard application designed to help
            users manage their account, profile, and application preferences
            in one place. It provides a clean, modern interface with secure
            authentication and a scalable architecture.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-block">
        <h2 className="section-title">
          <ListChecks size={18} /> Features
        </h2>
        <div className="card about-card">
          <ul className="feature-list">
            <li>Secure login and signup with session-based authentication</li>
            <li>Personal dashboard with account overview and quick actions</li>
            <li>Profile management with editable information</li>
            <li>Comprehensive settings for notifications, appearance, and privacy</li>
            <li>Responsive design for desktop, tablet, and mobile</li>
            <li>Clean, modern UI with Lucide icons and smooth transitions</li>
          </ul>
        </div>
      </section>

      {/* Technology */}
      <section className="section-block">
        <h2 className="section-title">
          <Code2 size={18} /> Technology Used
        </h2>
        <div className="card-grid card-grid-3">
          <div className="tech-card">
            <Layout size={22} />
            <h3>Frontend</h3>
            <ul>
              <li>React</li>
              <li>Vite</li>
              <li>React Router</li>
              <li>Lucide React</li>
            </ul>
          </div>
          <div className="tech-card">
            <Server size={22} />
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express</li>
            </ul>
          </div>
          <div className="tech-card">
            <Database size={22} />
            <h3>Database</h3>
            <ul>
              <li>MySQL</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Version */}
      <section className="section-block">
        <h2 className="section-title">
          <Tag size={18} /> Version Information
        </h2>
        <div className="card about-card">
          <div className="info-row">
            <span className="info-row-label">Application Version</span>
            <span className="info-row-value">1.0.0</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Release Status</span>
            <span className="info-row-value">Stable</span>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="section-block">
        <h2 className="section-title">
          <UserCircle size={18} /> Developer Information
        </h2>
        <div className="card about-card">
          <div className="info-row">
            <span className="info-row-label">Developer</span>
            <span className="info-row-value">Shaik.John Shaida</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Contact</span>
            <span className="info-row-value">
              <Mail size={14} /> johnshaida786shaik@gmail.com
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;