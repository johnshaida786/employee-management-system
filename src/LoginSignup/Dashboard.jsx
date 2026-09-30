import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => { 

  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      {/* =========================
          TOP WELCOME SECTION
      ========================== */}
      <div className="dashboard-header">

        <div>
          <p className="dashboard-greeting">
            DASHBOARD
          </p>

          <h1>
            Welcome back, User! 
          </h1>

          <p className="dashboard-description">
            Here's an overview of your account and recent activity.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>
          <strong>
            {new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </strong>
        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================== */}
      <div className="dashboard-stats">

        {/* Account Status */}
        <div className="stat-card">

          <div className="stat-icon status-icon">
            ✓
          </div>

          <div className="stat-content">
            <p>Account Status</p>
            <h3>Active</h3>
            <span className="stat-success">
              ● Your account is active
            </span>
          </div>

        </div>


        {/* Profile */}
        <div className="stat-card">

          <div className="stat-icon profile-icon">
            👤
          </div>

          <div className="stat-content">
            <p>Profile Completion</p>
            <h3>Not Available</h3>
            <span>
              Complete your profile
            </span>
          </div>

        </div>


        {/* Last Login */}
        <div className="stat-card">

          <div className="stat-icon login-icon">
            ◷
          </div>

          <div className="stat-content">
            <p>Last Login</p>
            <h3>Not Available</h3>
            <span>
              Login information unavailable
            </span>
          </div>

        </div>

      </div>


      {/* =========================
          MAIN DASHBOARD GRID
      ========================== */}
      <div className="dashboard-main-grid">

        {/* =====================
            QUICK ACTIONS
        ====================== */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Quick Actions</h2>
              <p>
                Quickly access important sections.
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <button
              className="quick-action"
              onClick={() => navigate('/profile')}
            >

              <div className="quick-icon">
                👤
              </div>

              <div className="quick-text">
                <strong>View Profile</strong>
                <span>
                  View your account profile
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action"
              onClick={() => navigate('/settings')}
            >

              <div className="quick-icon">
                ⚙
              </div>

              <div className="quick-text">
                <strong>Edit Settings</strong>
                <span>
                  Manage your account settings
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action"
              onClick={() => navigate('/about')}
            >

              <div className="quick-icon">
                ℹ
              </div>

              <div className="quick-text">
                <strong>Account Information</strong>
                <span>
                  Learn more about your account
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>

          </div>

        </div>


        {/* =====================
            ACCOUNT SUMMARY
        ====================== */}
        <div className="dashboard-panel account-summary">

          <div className="panel-header">

            <div>
              <h2>Account Summary</h2>
              <p>
                Your account information
              </p>
            </div>

          </div>


          <div className="summary-item">
            <span>Account</span>
            <strong>Active</strong>
          </div>

          <div className="summary-item">
            <span>Profile</span>
            <strong>Not Available</strong>
          </div>

          <div className="summary-item">
            <span>Last Login</span>
            <strong>Not Available</strong>
          </div>

          <div className="summary-item">
            <span>Security</span>
            <strong className="security-good">
              Protected
            </strong>
          </div>

        </div>

      </div>


      

    </div>
  );
};

export default Dashboard;