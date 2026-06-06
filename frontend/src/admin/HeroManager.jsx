import { useEffect, useState, useRef } from 'react';
import {
  adminGetHeroSlides, adminCreateHeroSlide, adminUpdateHeroSlide, adminDeleteHeroSlide
} from '../api/apiService';

const EMPTY = { headline: '', subtitle: '', button_text: '', button_url: '/', button_style: 'primary', background_image: '', order: 0, is_active: true };
const SUBTITLE_LIMIT = 300;

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

  const tabBtn = (active, onClick, icon, label) => (
    <button type="button" onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 6, border: '1.5px solid',
      borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      background: active ? 'var(--color-primary)' : 'white',
      color: active ? 'white' : 'var(--color-text-dark)',
      cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    }}>
      <i className={icon} style={{ marginRight: 6 }}></i>{label}
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

export default function HeroManager() {
  const [slides, setSlides] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetHeroSlides().then(r => setSlides(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (slide) => { setForm({ ...slide }); setModal('edit'); };
  const closeModal = () => setModal(null);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminCreateHeroSlide(form);
        showAlert('Slide added successfully!');
      } else {
        await adminUpdateHeroSlide(form.id, form);
        showAlert('Slide updated successfully!');
      }
      await load();
      closeModal();
    } catch {
      showAlert('Something went wrong. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await adminDeleteHeroSlide(id);
      showAlert('Slide deleted.');
      load();
    } catch {
      showAlert('Could not delete slide.', 'error');
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const subtitleLeft = SUBTITLE_LIMIT - (form.subtitle?.length || 0);

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-images" style={{ marginRight: 10 }}></i>Hero Slides</h3>
          <button className="btn-admin-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add New Slide
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          These are the rotating banner slides shown on the home page.
        </p>

        {slides.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-images"></i>
            <p>No slides yet. Click "Add New Slide" to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Headline</th><th>Button</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slides.map(slide => (
                <tr key={slide.id}>
                  <td style={{ width: 60 }}>{slide.order}</td>
                  <td>
                    <strong>{slide.headline}</strong>
                    <br /><small style={{ color: '#6c757d' }}>{slide.subtitle.slice(0, 60)}...</small>
                  </td>
                  <td><span className="badge badge-info">{slide.button_text}</span></td>
                  <td>
                    <span className={`badge ${slide.is_active ? 'badge-success' : 'badge-secondary'}`}>
                      {slide.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-admin-icon" onClick={() => openEdit(slide)} title="Edit"><i className="fas fa-pen"></i></button>
                      <button className="btn-admin-icon danger" onClick={() => handleDelete(slide.id)} title="Delete"><i className="fas fa-trash"></i></button>
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
              <h3>{modal === 'add' ? 'Add New Slide' : 'Edit Slide'}</h3>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label>Headline *</label>
                <input value={form.headline} onChange={e => set('headline', e.target.value)} placeholder="e.g. Expertise, Innovation, Impact" required />
              </div>

              <div className="admin-form-group">
                <label>
                  Subtitle *
                  <span style={{ float: 'right', fontSize: '0.8rem', color: subtitleLeft < 20 ? '#dc3545' : 'var(--color-text-muted)', fontWeight: 400 }}>
                    {subtitleLeft} characters left
                  </span>
                </label>
                <textarea
                  value={form.subtitle}
                  onChange={e => set('subtitle', e.target.value.slice(0, SUBTITLE_LIMIT))}
                  rows={3}
                  placeholder="A short description... (max 300 characters)"
                  required
                />
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, ((form.subtitle?.length || 0) / SUBTITLE_LIMIT) * 100)}%`, background: subtitleLeft < 20 ? '#dc3545' : 'var(--color-primary)', borderRadius: 2, transition: 'width 0.2s' }} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Button Text *</label>
                  <input value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="e.g. Learn More" required />
                </div>
                <div className="admin-form-group">
                  <label>Button Link *</label>
                  <input value={form.button_url} onChange={e => set('button_url', e.target.value)} placeholder="e.g. /about" required />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Button Style</label>
                  <select value={form.button_style} onChange={e => set('button_style', e.target.value)}>
                    <option value="primary">Primary (Green)</option>
                    <option value="accent">Accent (Gold)</option>
                    <option value="secondary">Secondary (Outline)</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Order Number</label>
                  <input type="number" value={form.order} onChange={e => set('order', e.target.value)} min={0} />
                </div>
              </div>

              <ImageInput
                label="Background Image (optional — leave blank for default green)"
                value={form.background_image}
                onChange={v => set('background_image', v)}
              />

              <div className="admin-checkbox-group">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                <label htmlFor="is_active">Show this slide on the website</label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
