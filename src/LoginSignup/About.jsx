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
  ShieldCheck,
  Users,
  CheckCircle2
} from 'lucide-react';

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <h1 className="page-hero-title">About SecureApp</h1>
        <p className="page-hero-subtitle">
          A robust, full-stack enterprise dashboard built with React, Vite, and a 
          Node.js + MySQL backend, featuring Advanced Role-Based Access Control (RBAC).
        </p>
      </section>

      {/* About the application */}
      <section className="section-block">
        <h2 className="section-title">
          <Info size={18} /> About the Application
        </h2>
        <div className="card about-card">
          <p>
            SecureApp is a professional management platform designed to give users 
            complete control over their personal profiles, security settings, and daily 
            tasks. With a modern, responsive interface and high-performance backend, it 
            provides a seamless experience for both standard users and system administrators.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-block">
        <h2 className="section-title">
          <ListChecks size={18} /> Core Features
        </h2>
        <div className="card about-card">
          <ul className="feature-list">
            <li className="hover-feature">
              <ShieldCheck size={16} className="feature-icon" /> 
              Secure JWT Authentication & Role-Based Access (Admin vs. User)
            </li>
            <li className="hover-feature">
              <Users size={16} className="feature-icon" /> 
              Admin Control Panel with User Promotion & Status Management
            </li>
            <li className="hover-feature">
              <CheckCircle2 size={16} className="feature-icon" /> 
              Interactive To-Do List with Drag-and-Drop Reordering
            </li>
            <li className="hover-feature">
              <UserCircle size={16} className="feature-icon" /> 
              Dynamic Profile Management with Photo Upload & Completion Tracking
            </li>
            <li className="hover-feature">
              <Layout size={16} className="feature-icon" /> 
              Modern, Responsive UI with Light/Dark Mode Support
            </li>
            <li className="hover-feature">
              <Database size={16} className="feature-icon" /> 
              Real-time Dashboard Analytics & Account Statistics
            </li>
          </ul>
        </div>
      </section>

      {/* Technology */}
      <section className="section-block">
        <h2 className="section-title">
          <Code2 size={18} /> Technology Stack
        </h2>
        <div className="card-grid card-grid-3">
          <div className="tech-card hover-card">
            <Layout size={22} />
            <h3>Frontend</h3>
            <ul>
              <li>React & Vite</li>
              <li>React Router DOM</li>
              <li>Lucide Icons</li>
              <li>Custom CSS3 Animations</li>
            </ul>
          </div>
          <div className="tech-card hover-card">
            <Server size={22} />
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>JSON Web Tokens (JWT)</li>
              <li>Multer (File Uploads)</li>
            </ul>
          </div>
          <div className="tech-card hover-card">
            <Database size={22} />
            <h3>Database</h3>
            <ul>
              <li>MySQL</li>
              <li>Relational Schema</li>
              <li>bcrypt (Password Hashing)</li>
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
            <span className="info-row-value">2.0.0 (RBAC Update)</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Release Status</span>
            <span className="info-row-value" style={{ color: "#059669" }}>Stable</span>
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
            <span className="info-row-label">Lead Developer</span>
            <span className="info-row-value">Shaik. John Shaida</span>
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