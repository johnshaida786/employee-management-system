import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    loading: true,
    error: "",
  });

  // ---------- Load logged-in user ----------
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser?.id) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
  }, [navigate]);

  // ---------- Load account stats ----------
  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: "" }));

        // Fetch a large page so we can count everything on the client.
        // If your backend supports a /admin/stats endpoint, prefer that instead.
        const response = await fetch(
          `${API_URL}/admin/accounts?page=1&limit=10000`
        );

        if (!response.ok) {
          throw new Error("Failed to load account statistics.");
        }

        const result = await response.json();
        const accounts = Array.isArray(result.accounts) ? result.accounts : [];

        const active = accounts.filter(
          (a) => (a.status || "Active") === "Active"
        ).length;
        const inactive = accounts.filter(
          (a) => (a.status || "Active") === "Inactive"
        ).length;

        if (!cancelled) {
          setStats({
            total: accounts.length,
            active,
            inactive,
            loading: false,
            error: "",
          });
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
        if (!cancelled) {
          setStats({
            total: 0,
            active: 0,
            inactive: 0,
            loading: false,
            error: err.message || "Cannot load statistics.",
          });
        }
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Render ----------
  return (
    <div className="dashboard-page">
      {/* =========================
          TOP WELCOME SECTION
      ========================== */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">DASHBOARD</p>

          <h1>Welcome back, {user?.name || "User"}!</h1>

          <p className="dashboard-description">
            Here's an overview of your account and recent activity.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>
          <strong>
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </strong>
        </div>
      </div>

      {/* =========================
          STAT CARDS
      ========================== */}
      <div className="dashboard-stats">
        {/* Active Accounts */}
        <div className="stat-card">
          <div className="stat-icon status-icon">✓</div>
          <div className="stat-content">
            <p>Active Accounts</p>
            <h3>
              {stats.loading ? "…" : stats.error ? "—" : stats.active}
            </h3>
            <span className="stat-success">
              ● {stats.loading
                ? "Loading…"
                : stats.error
                ? stats.error
                : `${stats.active} of ${stats.total} accounts`}
            </span>
          </div>
        </div>

        {/* Inactive Accounts */}
        <div className="stat-card">
          <div className="stat-icon profile-icon">👤</div>
          <div className="stat-content">
            <p>Inactive Accounts</p>
            <h3>
              {stats.loading ? "…" : stats.error ? "—" : stats.inactive}
            </h3>
            <span>
              {stats.loading
                ? "Loading…"
                : stats.error
                ? "—"
                : `${stats.inactive} account${
                    stats.inactive === 1 ? "" : "s"
                  } inactive`}
            </span>
          </div>
        </div>

        {/* Total Accounts */}
        <div className="stat-card">
          <div className="stat-icon login-icon">◷</div>
          <div className="stat-content">
            <p>Total Accounts</p>
            <h3>
              {stats.loading ? "…" : stats.error ? "—" : stats.total}
            </h3>
            <span>
              {stats.loading
                ? "Loading…"
                : stats.error
                ? "—"
                : "All registered accounts"}
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
              <p>Quickly access important sections.</p>
            </div>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action"
              onClick={() => navigate("/profile")}
            >
              <div className="quick-icon">👤</div>
              <div className="quick-text">
                <strong>View Profile</strong>
                <span>View your account profile</span>
              </div>
              <span className="quick-arrow">→</span>
            </button>

            <button
              className="quick-action"
              onClick={() => navigate("/settings")}
            >
              <div className="quick-icon">⚙</div>
              <div className="quick-text">
                <strong>Edit Settings</strong>
                <span>Manage your account settings</span>
              </div>
              <span className="quick-arrow">→</span>
            </button>

            <button
              className="quick-action"
              onClick={() => navigate("/about")}
            >
              <div className="quick-icon">ℹ</div>
              <div className="quick-text">
                <strong>Account Information</strong>
                <span>Learn more about your account</span>
              </div>
              <span className="quick-arrow">→</span>
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
              <p>Your account information</p>
            </div>
          </div>

          <div className="summary-item">
            <span>Active Accounts</span>
            <strong>
              {stats.loading ? "…" : stats.error ? "—" : stats.active}
            </strong>
          </div>

          <div className="summary-item">
            <span>Inactive Accounts</span>
            <strong>
              {stats.loading ? "…" : stats.error ? "—" : stats.inactive}
            </strong>
          </div>

          <div className="summary-item">
            <span>Total Accounts</span>
            <strong>
              {stats.loading ? "…" : stats.error ? "—" : stats.total}
            </strong>
          </div>

          <div className="summary-item">
            <span>Security</span>
            <strong className="security-good">Protected</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;