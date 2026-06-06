import { useEffect, useState, useRef } from 'react';
import { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../api/apiService';

const EMPTY = { title: '', description: '', image_url: '', status: 'ongoing', order: 0, is_active: true };
const DESC_LIMIT = 300;

function ImageInput({ value, onChange, label }) {
  const fileRef = useRef();
  const [tab, setTab] = useState('url');
  const [preview, setPreview] = useState(value || '');

  const handleUrl = (e) => { onChange(e.target.value); setPreview(e.target.value); };
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target.result); setPreview(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const tabBtn = (active, onClick, icon, lbl) => (
    <button type="button" onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 6, border: '1.5px solid',
      borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      background: active ? 'var(--color-primary)' : 'white',
      color: active ? 'white' : 'var(--color-text-dark)',
      cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    }}>
      <i className={icon} style={{ marginRight: 6 }}></i>{lbl}
    </button>
  );

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {tabBtn(tab === 'url', () => setTab('url'), 'fas fa-link', 'Paste URL')}
        {tabBtn(tab === 'upload', () => setTab('upload'), 'fas fa-upload', 'Upload from PC')}
      </div>
      {tab === 'url' ? (
        <input value={value} onChange={handleUrl} placeholder="https://example.com/image.jpg" />
      ) : (
        <div style={{ border: '2px dashed var(--color-border)', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
          onClick={() => fileRef.current.click()}>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 8, display: 'block' }}></i>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Click to select an image from your computer</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      )}
      {preview && (
        <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="Preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--color-border)', display: 'block' }} />
          <button type="button" onClick={() => { onChange(''); setPreview(''); }}
            style={{ position: 'absolute', top: -8, right: -8, background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetProjects().then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (p) => { setForm({ ...p }); setModal('edit'); };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminCreateProject(form);
        showAlert('Project added!');
      } else {
        await adminUpdateProject(form.id, form);
        showAlert('Project updated!');
      }
      await load();
      closeModal();
    } catch {
      showAlert('Something went wrong.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await adminDeleteProject(id);
      showAlert('Project deleted.');
      load();
    } catch { showAlert('Could not delete.', 'error'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const descLeft = DESC_LIMIT - (form.description?.length || 0);

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-briefcase" style={{ marginRight: 10 }}></i>Portfolio Projects</h3>
          <button className="btn-admin-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add Project
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          These are the projects shown on the Portfolio page.
        </p>

        {projects.length === 0 ? (
          <div className="empty-state"><i className="fas fa-briefcase"></i><p>No projects yet.</p></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Order</th><th>Visible</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                    <br /><small style={{ color: '#6c757d' }}>{p.description.slice(0, 70)}...</small>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td>{p.order}</td>
                  <td><span className={`badge ${p.is_active ? 'badge-success' : 'badge-secondary'}`}>{p.is_active ? 'Yes' : 'No'}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-admin-icon" onClick={() => openEdit(p)}><i className="fas fa-pen"></i></button>
                      <button className="btn-admin-icon danger" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></button>
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
              <h3>{modal === 'add' ? 'Add Project' : 'Edit Project'}</h3>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label>Project Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Offshore Training Center" required />
              </div>

              <div className="admin-form-group">
                <label>
                  Description *
                  <span style={{ float: 'right', fontSize: '0.8rem', color: descLeft < 20 ? '#dc3545' : 'var(--color-text-muted)', fontWeight: 400 }}>
                    {descLeft} characters left
                  </span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value.slice(0, DESC_LIMIT))}
                  rows={4}
                  placeholder="Describe the project... (max 300 characters)"
                  required
                />
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, ((form.description?.length || 0) / DESC_LIMIT) * 100)}%`, background: descLeft < 20 ? '#dc3545' : 'var(--color-primary)', borderRadius: 2, transition: 'width 0.2s' }} />
                </div>
              </div>

              <ImageInput
                label="Project Image (optional)"
                value={form.image_url}
                onChange={v => set('image_url', v)}
              />

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Order Number</label>
                  <input type="number" value={form.order} onChange={e => set('order', e.target.value)} min={0} />
                </div>
              </div>

              <div className="admin-checkbox-group">
                <input type="checkbox" id="proj_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                <label htmlFor="proj_active">Show this project on the website</label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
