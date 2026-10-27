import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

const API_URL = "http://localhost:5000";

// Helper to check if a value exists and isn't empty
const hasValue = (v) =>
  v !== null &&
  v !== undefined &&
  !(typeof v === "string" && v.trim() === "") &&
  !(typeof v === "object" && Object.keys(v).length === 0);

// Helper to find the photo regardless of backend naming
const getProfilePhoto = (u) => {
  if (!u) return null;
  const candidates = [
    u.profilePhoto, u.profile_photo, u.profile_picture, u.avatar, u.photo,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim() !== "") return c;
  }
  return null;
};


const computeCompletion = (u) => {
  if (!u) return 0;
  let score = 0;
  if (hasValue(u.name)) score += 20;
  if (hasValue(u.email)) score += 20;
  if (hasValue(u.phone)) score += 20;
  if (getProfilePhoto(u)) score += 20;

  // 5th slot: base 20%
  score += 20;

  return Math.min(100, score);
};

// Helper to generate the mini calendar grid
const MiniCalendar = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="mini-calendar-dropdown">
      <div className="mini-calendar-header">
        {monthNames[month]} {year}
      </div>
      <div className="mini-calendar-grid">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="mini-calendar-day-name">{d}</div>
        ))}
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`mini-calendar-day ${day === today.getDate() ? "today" : ""} ${!day ? "empty" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [stats, setStats] = useState({
    total: 0, active: 0, inactive: 0, admins: 0, normalUsers: 0,
    tasks: 0, profileCompletion: 0, loading: true, error: "",
  });

  const isAdmin = user?.role === "admin";

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCalendar && !e.target.closest('.dashboard-date')) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // Load user
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser?.id) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
  }, [navigate]);

  // Load stats
  // Load stats — refetch fresh profile so profilePhoto/phone/status are current
  // Load stats
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const loadStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: "" }));
        const token = localStorage.getItem("token");

        // 1. Fetch the FRESH profile from the backend
        let freshUser = user;
        try {
          const profRes = await fetch(`${API_URL}/profile/getProfile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user.id }),
          });

          if (profRes.ok) {
            const profData = await profRes.json();
            if (profData.user) {
              // Merge fresh data with existing user
              freshUser = { ...user, ...profData.user };
              // Save to localStorage so it persists
              localStorage.setItem("user", JSON.stringify(freshUser));
            }
          }
        } catch (e) {
          console.log("Failed to fetch profile, using local storage.", e);
        }

        // 2. Handle Admin vs Normal User
        if (freshUser.role === "admin") {
          const response = await fetch(`${API_URL}/admin/getAccounts?page=1&limit=10000`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Failed to load admin stats.");
          const result = await response.json();
          const accounts = Array.isArray(result.accounts) ? result.accounts : [];

          const active = accounts.filter((a) => (a.status || "Active") === "Active").length;
          const inactive = accounts.filter((a) => (a.status || "Active") === "Inactive").length;
          const admins = accounts.filter((a) => a.role === "admin").length;
          const normalUsers = accounts.filter((a) => a.role !== "admin").length;

          if (!cancelled) {
            setStats({
              total: accounts.length, active, inactive, admins, normalUsers,
              tasks: 0, profileCompletion: 0, loading: false, error: "",
            });
          }
        } else {
          let taskCount = 0;
          try {
            const taskRes = await fetch(`${API_URL}/tasks`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (taskRes.ok) {
              const taskData = await taskRes.json();
              taskCount = taskData.tasks ? taskData.tasks.length : 0;
            }
          } catch (e) { console.log(e); }

          if (!cancelled) {
            setStats({
              total: 1,
              active: freshUser.status === "Active" ? 1 : 0,
              inactive: freshUser.status === "Inactive" ? 1 : 0,
              admins: 0,
              normalUsers: 1,
              tasks: taskCount,
              profileCompletion: computeCompletion(freshUser),
              loading: false,
              error: "",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStats((prev) => ({ ...prev, loading: false, error: err.message }));
        }
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, [user?.id]);

  if (!user) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">DASHBOARD</p>
          <h1>Welcome back, {user?.name || "User"}!</h1>
          <p className="dashboard-description">
            {isAdmin ? "Here's an overview of your system and recent activity." : "Here's an overview of your account and recent activity."}
          </p>
        </div>

        {/* CURRENT DATE WITH MINI CALENDAR */}
        <div
          className="dashboard-date"
          onClick={() => setShowCalendar(!showCalendar)}
          style={{
            cursor: "pointer",
            position: "relative",
            zIndex: 50,
            border: "1px solid #e2e8f0",
            padding: "8px 16px",
            borderRadius: "10px",
            background: "#ffffff"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
            <Calendar size={14} /> Today
          </span>

          <strong style={{
            color: "#4f46e5",
            opacity: 1,
            textDecoration: "underline",
            textDecorationColor: "transparent",
            transition: "text-decoration-color 0.2s ease",
            fontSize: "14px",
            marginTop: "2px",
          }}
            onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = "#4f46e5"}
            onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = "transparent"}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short", day: "2-digit", month: "short", year: "numeric",
            })}
          </strong>
          {showCalendar && <MiniCalendar />}
        </div>
      </div>

      {/* ... KEEP THE REST OF YOUR STAT CARDS AND QUICK ACTIONS ... */}
      <div className="dashboard-stats" style={{ gridTemplateColumns: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)" }}>
        {isAdmin ? (
          <>
            <div className="stat-card"><div className="stat-icon login-icon">👑</div><div className="stat-content"><p>Admin Users</p><h3>{stats.loading ? "…" : stats.admins}</h3><span>Secondary Admins</span></div></div>
            <div className="stat-card"><div className="stat-icon profile-icon">👤</div><div className="stat-content"><p>Normal Users</p><h3>{stats.loading ? "…" : stats.normalUsers}</h3><span>Standard Accounts</span></div></div>
            <div className="stat-card"><div className="stat-icon status-icon">✓</div><div className="stat-content"><p>Active Accounts</p><h3>{stats.loading ? "…" : stats.active}</h3><span className="stat-success">● {stats.active} active</span></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>✕</div><div className="stat-content"><p>Inactive Accounts</p><h3>{stats.loading ? "…" : stats.inactive}</h3><span>Needs review</span></div></div>
          </>
        ) : (
          <>
            <div className="stat-card"><div className="stat-icon status-icon">✓</div><div className="stat-content"><p>Account Status</p><h3 style={{ color: user.status === "Active" ? "#059669" : "#dc2626" }}>{user.status || "Active"}</h3><span>Your current status</span></div></div>
            <div className="stat-card"><div className="stat-icon login-icon">📝</div><div className="stat-content"><p>My Tasks</p><h3>{stats.loading ? "…" : stats.tasks}</h3><span>Pending items in To-Do</span></div></div>
            <div className="stat-card">
              <div className="stat-icon profile-icon">📊</div>
              <div className="stat-content">
                <p>Profile Completion</p>
                <h3>{stats.loading ? "…" : `${stats.profileCompletion}%`}</h3>
                <span>
                  {stats.loading ? "Calculating..." : (
                    stats.profileCompletion === 100
                      ? "All details complete 🎉"
                      : (() => {
                        const missing = [];
                        if (!hasValue(user?.phone)) missing.push("phone");
                        if (!getProfilePhoto(user)) missing.push("photo");
                        return missing.length
                          ? `Add ${missing.join(" & ")} to reach 100%`
                          : "Almost there";
                      })()
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel">
          <div className="panel-header"><div><h2>Quick Actions</h2><p>Quickly access important sections.</p></div></div>
          <div className="quick-actions">
            <button className="quick-action" onClick={() => navigate("/profile")}><div className="quick-icon">👤</div><div className="quick-text"><strong>View Profile</strong><span>View your account profile</span></div><span className="quick-arrow">→</span></button>
            <button className="quick-action" onClick={() => navigate("/settings")}><div className="quick-icon">⚙</div><div className="quick-text"><strong>Edit Settings</strong><span>Manage your account settings</span></div><span className="quick-arrow">→</span></button>
            <button className="quick-action" onClick={() => navigate("/about")}><div className="quick-icon">ℹ</div><div className="quick-text"><strong>Account Information</strong><span>Learn more about your account</span></div><span className="quick-arrow">→</span></button>
          </div>
        </div>

        <div className="dashboard-panel account-summary">
          <div className="panel-header"><div><h2>{isAdmin ? "System Summary" : "Account Summary"}</h2><p>{isAdmin ? "Overall platform data" : "Your account information"}</p></div></div>
          {isAdmin ? (
            <>
              <div className="summary-item"><span>Total Admins</span><strong>{stats.admins}</strong></div>
              <div className="summary-item"><span>Total Normal Users</span><strong>{stats.normalUsers}</strong></div>
              <div className="summary-item"><span>Total Accounts</span><strong>{stats.total}</strong></div>
            </>
          ) : (
            <>
              <div className="summary-item"><span>Account Status</span><strong className={user.status === "Active" ? "security-good" : ""}>{user.status || "Active"}</strong></div>
              <div className="summary-item"><span>Tasks Created</span><strong>{stats.tasks}</strong></div>
              <div className="summary-item"><span>Profile Completion</span><strong>{stats.profileCompletion}%</strong></div>
            </>
          )}
          <div className="summary-item"><span>Security</span><strong className="security-good">Protected</strong></div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;