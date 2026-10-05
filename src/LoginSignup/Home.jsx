import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Dashboard from './Dashboard.jsx';
import Profile from './Profile.jsx';
import Settings from './Settings.jsx';
import About from './About.jsx';

const Home = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();


  // =====================================================
  // DISPLAY PAGE BASED ON CURRENT URL
  // =====================================================

  const renderPage = () => {

    switch (location.pathname) {

      case '/home':
        return <Dashboard />;

      case '/profile':
        return <Profile />;

      case '/settings':
        return <Settings />;

      case '/about':
        return <About />;

      default:
        return <Dashboard />;

    }
  };


  // =====================================================
  // MAIN LAYOUT
  // =====================================================

  return (

    <div
      className={`home-container ${
        collapsed ? 'sidebar-is-collapsed' : ''
      }`}
    >

      {/* ===============================================
          FIXED SIDEBAR
      =============================================== */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />


      {/* ===============================================
          SCROLLABLE CONTENT
      =============================================== */}

      <div className="home-content">

        {renderPage()}

      </div>

    </div>

  );
};

export default Home;