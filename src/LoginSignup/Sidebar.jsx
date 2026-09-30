import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  Settings,
  CircleHelp,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {

  const navItems = [
    {
      name: "Dashboard",
      path: "/home",
      icon: LayoutDashboard
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings
    },
    {
      name: "About",
      path: "/about",
      icon: CircleHelp
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      } ${
        mobileOpen ? "sidebar-mobile-open" : ""
      }`}
    >

      {/* =========================
          HEADER
      ========================== */}
      <div className="sidebar-header">

        <div className="sidebar-brand">

          <div className="sidebar-brand-icon">
            <span>✓</span>
          </div>

          <span className="sidebar-brand-text">
            SecureApp
          </span>

        </div>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>

      </div>


      {/* =========================
          NAVIGATION
      ========================== */}
      <nav className="sidebar-nav">

        {navItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >

              <span className="sidebar-icon">
                <Icon
                  size={20}
                  strokeWidth={2}
                />
              </span>

              <span className="sidebar-label">
                {item.name}
              </span>

              {collapsed && (
                <span className="sidebar-tooltip">
                  {item.name}
                </span>
              )}

            </NavLink>
          );

        })}

      </nav>


      {/* =========================
          FOOTER
      ========================== */}
      <div className="sidebar-footer">

        <button
          type="button"
          className="sidebar-item logout-item"
          onClick={handleLogout}
        >

          <span className="sidebar-icon">
            <LogOut
              size={20}
              strokeWidth={2}
            />
          </span>

          <span className="sidebar-label">
            Logout
          </span>

          {collapsed && (
            <span className="sidebar-tooltip">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;