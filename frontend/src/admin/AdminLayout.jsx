import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fas fa-home', end: true },
  { to: '/admin/hero', label: 'Hero Slides', icon: 'fas fa-images' },
  { to: '/admin/expertise', label: 'Expertise Cards', icon: 'fas fa-star' },
  { to: '/admin/projects', label: 'Projects', icon: 'fas fa-briefcase' },
  { to: '/admin/blog', label: 'Blog Posts', icon: 'fas fa-newspaper' },
  { to: '/admin/categories', label: 'Blog Categories', icon: 'fas fa-tags' },
  { to: '/admin/messages', label: 'Messages', icon: 'fas fa-envelope' },
  { to: '/admin/users', label: 'Users & Roles', icon: 'fas fa-users-cog' },
  { to: '/admin/settings', label: 'Site Settings', icon: 'fas fa-cog' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1>Content Manager</h1>
          <p>Edgar Nii Kpakpo Addo</p>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            >
              <i className={icon}></i>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-item" style={{ marginBottom: 8, textDecoration: 'none' }}>
            <i className="fas fa-external-link-alt"></i> View Website
          </a>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Admin Panel</h2>
          <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
            <i className="fas fa-circle" style={{ color: '#28a745', marginRight: 6 }}></i>
            Online
          </span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
