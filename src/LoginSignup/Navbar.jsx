import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#4f46e5",
          textDecoration: "none",
          letterSpacing: "-0.4px",
        }}
      >
        MyApp
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
        <Link to="/" style={navLinkStyle}>Sign Up</Link>
        <Link to="/login" style={navLinkStyle}>Login</Link>
      </div>
    </nav>
  );
};

const navLinkStyle = {
  color: "#334155",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
};

export default Navbar;