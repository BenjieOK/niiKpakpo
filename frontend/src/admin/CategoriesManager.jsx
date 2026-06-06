import { useEffect, useState } from 'react';
import {
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory
} from '../api/apiService';

const EMPTY = { name: '', slug: '', icon: 'fas fa-tag', order: 0, is_active: true };

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function CategoriesManager() {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetCategories().then(r => setCats(r.data));
  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c }); setModal('edit'); };
  const closeModal = () => setModal(null);

  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v,
    ...(k === 'name' ? { slug: slugify(v) } : {}),
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminCreateCategory(form);
        showAlert('Category added!');
      } else {
        await adminUpdateCategory(form.id, form);
        showAlert('Category updated!');
      }
      await load();
      closeModal();
    } catch (err) {
      const detail = err.response?.data?.slug?.[0] || err.response?.data?.name?.[0] || 'Something went wrong.';
      showAlert(detail, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await adminDeleteCategory(id);
      showAlert('Category deleted.');
      load();
    } catch { showAlert('Could not delete.', 'error'); }
  };

  const ICON_OPTIONS = [
    'fas fa-tag', 'fas fa-ship', 'fas fa-cogs', 'fas fa-tools',
    'fas fa-graduation-cap', 'fas fa-anchor', 'fas fa-water', 'fas fa-compass',
    'fas fa-book', 'fas fa-lightbulb', 'fas fa-flask', 'fas fa-chart-bar',
  ];

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-tags" style={{ marginRight: 10 }}></i>Blog Categories</h3>
          <button className="btn-admin-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add Category
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          Manage the category list shown on the Blog page filter bar.
        </p>

        {cats.length === 0 ? (
          <div className="empty-state"><i className="fas fa-tags"></i><p>No categories yet.</p></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Icon</th><th>Name</th><th>Slug</th><th>Order</th><th>Active</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td><i className={c.icon} style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}></i></td>
                  <td><strong>{c.name}</strong></td>
                  <td><code style={{ background: '#f1f3f5', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>{c.slug}</code></td>
                  <td>{c.order}</td>
                  <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-secondary'}`}>{c.is_active ? 'Yes' : 'No'}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-admin-icon" onClick={() => openEdit(c)}><i className="fas fa-pen"></i></button>
                      <button className="btn-admin-icon danger" onClick={() => handleDelete(c.id)}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{modal === 'add' ? 'Add Category' : 'Edit Category'}</h3>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category Name *</label>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Maritime"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Slug (auto-filled)</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="e.g. maritime"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {ICON_OPTIONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      title={ic}
                      onClick={() => set('icon', ic)}
                      style={{
                        width: 42, height: 42, borderRadius: 8, border: '2px solid',
                        borderColor: form.icon === ic ? 'var(--color-primary)' : 'var(--color-border)',
                        background: form.icon === ic ? 'var(--color-primary)' : 'white',
                        color: form.icon === ic ? 'white' : 'var(--color-text-dark)',
                        cursor: 'pointer', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <i className={ic}></i>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                  Selected: <code>{form.icon}</code> &nbsp;
                  <i className={form.icon} style={{ color: 'var(--color-primary)' }}></i>
                </p>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Order</label>
                  <input type="number" value={form.order} onChange={e => set('order', e.target.value)} min={0} />
                </div>
              </div>

              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={form.is_active}
                  onChange={e => set('is_active', e.target.checked)}
                />
                <label htmlFor="cat_active">Show this category on the blog filter bar</label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
