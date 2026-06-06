import { useEffect, useState } from 'react';
import { adminGetUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../api/apiService';

const ROLE_MAP = {
  super_admin: { label: 'Super Admin', badge: 'badge-danger', is_superuser: true, is_staff: true },
  editor:      { label: 'Editor',      badge: 'badge-warning', is_superuser: false, is_staff: true },
  viewer:      { label: 'Viewer',      badge: 'badge-info',    is_superuser: false, is_staff: false },
};

const EMPTY_FORM = {
  username: '', email: '', first_name: '', last_name: '',
  role: 'editor', password: '', is_active: true,
};

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const load = () => adminGetUsers().then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const openAdd = () => { setForm(EMPTY_FORM); setShowPw(false); setModal('add'); };
  const openEdit = (u) => {
    setForm({ ...u, role: u.role, password: '' });
    setShowPw(false);
    setModal('edit');
  };
  const closeModal = () => setModal(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildPayload = () => {
    const roleOpts = ROLE_MAP[form.role] || ROLE_MAP.viewer;
    const payload = {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      is_active: form.is_active,
      is_superuser: roleOpts.is_superuser,
      is_staff: roleOpts.is_staff,
    };
    if (form.password) payload.password = form.password;
    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (modal === 'add' && !form.password) {
      showAlert('Password is required for new users.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminCreateUser(buildPayload());
        showAlert('User created successfully!');
      } else {
        await adminUpdateUser(form.id, buildPayload());
        showAlert('User updated!');
      }
      await load();
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.username?.[0]
        || err.response?.data?.error
        || 'Something went wrong.';
      showAlert(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminDeleteUser(id);
      showAlert('User deleted.');
      load();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Could not delete.', 'error');
    }
  };

  const ROLE_OPTIONS = [
    { value: 'super_admin', label: 'Super Admin', desc: 'Full access — can manage all content and users' },
    { value: 'editor', label: 'Editor', desc: 'Can create and edit content, but not manage users' },
    { value: 'viewer', label: 'Viewer', desc: 'Read-only access to the admin panel' },
  ];

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-users-cog" style={{ marginRight: 10 }}></i>Users &amp; Roles</h3>
          <button className="btn-admin-primary" onClick={openAdd}>
            <i className="fas fa-user-plus"></i> Add User
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          Manage who can log in to this admin panel and what they can do.
        </p>

        {/* Role legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {ROLE_OPTIONS.map(r => (
            <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <span className={`badge ${ROLE_MAP[r.value].badge}`}>{r.label}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{r.desc}</span>
            </div>
          ))}
        </div>

        {users.length === 0 ? (
          <div className="empty-state"><i className="fas fa-users"></i><p>No users found.</p></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const role = ROLE_MAP[u.role] || ROLE_MAP.viewer;
                const displayName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', background: 'var(--color-primary)',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                        }}>
                          {displayName[0].toUpperCase()}
                        </div>
                        <span><strong>{displayName}</strong></span>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '0.88rem' }}>{u.username}</code></td>
                    <td style={{ fontSize: '0.88rem' }}>{u.email || '—'}</td>
                    <td><span className={`badge ${role.badge}`}>{role.label}</span></td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn-admin-icon" onClick={() => openEdit(u)} title="Edit"><i className="fas fa-pen"></i></button>
                        <button className="btn-admin-icon danger" onClick={() => handleDelete(u.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-header">
              <h3>{modal === 'add' ? <><i className="fas fa-user-plus" style={{ marginRight: 8 }}></i>Add New User</> : <><i className="fas fa-user-edit" style={{ marginRight: 8 }}></i>Edit User</>}</h3>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>First Name</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="e.g. Edgar" />
                </div>
                <div className="admin-form-group">
                  <label>Last Name</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="e.g. Addo" />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Username *</label>
                <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="e.g. edgar_admin" required />
              </div>

              <div className="admin-form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. edgar@example.com" />
              </div>

              <div className="admin-form-group">
                <label>Role / Permission Level *</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                  {ROLE_OPTIONS.map(r => (
                    <label key={r.value} style={{
                      flex: '1 1 140px', border: '2px solid', borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                      borderColor: form.role === r.value ? 'var(--color-primary)' : 'var(--color-border)',
                      background: form.role === r.value ? 'rgba(7,85,66,0.07)' : 'white',
                      display: 'block',
                    }}>
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={form.role === r.value}
                        onChange={() => set('role', r.value)}
                        style={{ display: 'none' }}
                      />
                      <span className={`badge ${ROLE_MAP[r.value].badge}`} style={{ display: 'inline-block', marginBottom: 6 }}>{r.label}</span>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{r.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>
                  {modal === 'add' ? 'Password *' : 'New Password (leave blank to keep current)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder={modal === 'add' ? 'Set a strong password' : 'Leave blank to keep unchanged'}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    }}
                  >
                    <i className={showPw ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>

              <div className="admin-checkbox-group">
                <input type="checkbox" id="user_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                <label htmlFor="user_active">Account is active (user can log in)</label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : modal === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
