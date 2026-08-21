import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Layers,
  ParkingSquare,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Radio
} from "lucide-react";
import "../styles/AppLayout.css";
import ConfirmModal from "./ConfirmModal";

function AppLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userName = localStorage.getItem("userName") || "Admin User";
  const userRole = localStorage.getItem("role") || "ADMIN";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Vehicles", path: "/vehicles", icon: Car },
    { label: "Parking Slots", path: "/parking-slots", icon: ParkingSquare },
    { label: "Parking Floors", path: "/parking-floors", icon: Layers },
    { label: "Parking Tickets", path: "/parking-tickets", icon: Ticket },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-icon-box">
            <ParkingSquare size={24} />
          </div>
          <div className="brand-info">
            <span className="brand-name">ParkFlow</span>
            <span className="brand-tag">Smart System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavigate(item.path)}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="avatar-circle">{userInitials}</div>
            <div className="user-meta">
              <div className="user-name">{userName}</div>
              <div className="user-role-badge">{userRole}</div>
            </div>
          </div>

          <button
            className="btn-logout"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="app-main">
        <header className="app-header">
          <div className="header-left">
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="header-title-group">
              <h1>{title || "Dashboard"}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>

          <div className="header-right">
            <div className="live-indicator">
              <span className="pulse-dot" />
              <span>Live System</span>
            </div>
          </div>
        </header>

        <div className="page-content animate-fade-in">{children}</div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        type="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default AppLayout;
