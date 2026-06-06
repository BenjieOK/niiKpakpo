import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { adminGetStats } from '../api/apiService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminGetStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Hero Slides', value: stats?.hero_slides ?? '—', icon: 'fas fa-images', color: 'green' },
    { label: 'Projects', value: stats?.projects ?? '—', icon: 'fas fa-briefcase', color: 'gold' },
    { label: 'Blog Posts', value: stats?.blog_posts ?? '—', icon: 'fas fa-newspaper', color: 'blue' },
    { label: 'Unread Messages', value: stats?.unread_messages ?? '—', icon: 'fas fa-envelope', color: 'red' },
  ];

  const quickLinks = [
    { to: '/admin/hero', label: 'Edit Slides', icon: 'fas fa-images' },
    { to: '/admin/expertise', label: 'Edit Cards', icon: 'fas fa-star' },
    { to: '/admin/projects', label: 'Edit Projects', icon: 'fas fa-briefcase' },
    { to: '/admin/blog', label: 'Write Blog', icon: 'fas fa-pen' },
    { to: '/admin/messages', label: 'Read Messages', icon: 'fas fa-inbox' },
    { to: '/admin/settings', label: 'Site Settings', icon: 'fas fa-cog' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '1.8rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Welcome Back
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Here's an overview of your website content.</p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${color}`}>
              <i className={icon}></i>
            </div>
            <div className="stat-info">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Quick Actions</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>Click a card to manage that section</p>
        </div>
        <div className="quick-links">
          {quickLinks.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className="quick-link-card">
              <i className={icon}></i>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'white' }}>
        <h3 style={{ color: 'white', fontFamily: 'var(--font-family-heading)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          <i className="fas fa-info-circle" style={{ marginRight: 10 }}></i>
          How to Use This Panel
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
          <li style={{ marginBottom: 8 }}><i className="fas fa-check" style={{ marginRight: 8, color: 'var(--color-accent)' }}></i> Use the sidebar to navigate between sections</li>
          <li style={{ marginBottom: 8 }}><i className="fas fa-check" style={{ marginRight: 8, color: 'var(--color-accent)' }}></i> Click <strong>Edit</strong> or <strong>Add New</strong> to update content</li>
          <li style={{ marginBottom: 8 }}><i className="fas fa-check" style={{ marginRight: 8, color: 'var(--color-accent)' }}></i> Changes appear on the website immediately after saving</li>
          <li><i className="fas fa-check" style={{ marginRight: 8, color: 'var(--color-accent)' }}></i> Check Messages to see contact form submissions</li>
        </ul>
      </div>
    </div>
  );
}
