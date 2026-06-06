import { useEffect, useState, useRef } from 'react';
import { getSiteSettings, adminUpdateSettings } from '../api/apiService';

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
        <input value={value} onChange={handleUrl} placeholder="https://example.com/photo.jpg" />
      ) : (
        <div
          style={{ border: '2px dashed var(--color-border)', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
          onClick={() => fileRef.current.click()}
        >
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 8, display: 'block' }}></i>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Click to select an image from your computer</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      )}
      {preview && (
        <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="Preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, border: '1px solid var(--color-border)', display: 'block' }} />
          <button type="button" onClick={() => { onChange(''); setPreview(''); }}
            style={{ position: 'absolute', top: -8, right: -8, background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteSettingsPage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getSiteSettings().then(r => setForm(r.data)).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSettings(form);
      showAlert('Settings saved! Changes are live on the website.');
    } catch {
      showAlert('Could not save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="loading">Loading settings...</div>;

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><i className="fas fa-address-card" style={{ marginRight: 10 }}></i>Contact Information</h3>
          </div>
          <div className="admin-form admin-form-row">
            <div className="admin-form-group">
              <label>Contact Email</label>
              <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Accra, Ghana" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3><i className="fas fa-share-alt" style={{ marginRight: 10 }}></i>Social Media Links</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
            Enter the full URL for each social media profile. Leave blank to hide the link.
          </p>
          <div className="admin-form">
            <div className="admin-form-group">
              <label><i className="fab fa-twitter" style={{ marginRight: 8, color: '#1da1f2' }}></i>Twitter URL</label>
              <input value={form.twitter_url} onChange={e => set('twitter_url', e.target.value)} placeholder="https://twitter.com/yourhandle" />
            </div>
            <div className="admin-form-group">
              <label><i className="fab fa-linkedin-in" style={{ marginRight: 8, color: '#0077b5' }}></i>LinkedIn URL</label>
              <input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            <div className="admin-form-group">
              <label><i className="fab fa-facebook-f" style={{ marginRight: 8, color: '#1877f2' }}></i>Facebook URL</label>
              <input value={form.facebook_url} onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/yourpage" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3><i className="fas fa-home" style={{ marginRight: 10 }}></i>Home Page Content</h3>
          </div>
          <div className="admin-form" style={{ maxWidth: '100%' }}>
            <ImageInput
              label="About Section Photo (portrait image shown on the left)"
              value={form.home_about_image || ''}
              onChange={v => set('home_about_image', v)}
            />
            <div className="admin-form-group">
              <label>About Section Title</label>
              <input value={form.home_about_title} onChange={e => set('home_about_title', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>About Paragraph 1</label>
              <textarea value={form.home_about_p1} onChange={e => set('home_about_p1', e.target.value)} rows={4} />
            </div>
            <div className="admin-form-group">
              <label>About Paragraph 2</label>
              <textarea value={form.home_about_p2} onChange={e => set('home_about_p2', e.target.value)} rows={4} />
            </div>
            <div className="admin-form-group">
              <label>Quote Banner Text <span style={{ fontWeight: 400, color: '#6c757d' }}>(shown on About page)</span></label>
              <textarea value={form.quote_banner} onChange={e => set('quote_banner', e.target.value)} rows={3} />
              <p className="hint">The phrase "hands-on technical education" will be highlighted in gold automatically.</p>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Call-to-Action Title</label>
                <input value={form.cta_title} onChange={e => set('cta_title', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label>Call-to-Action Text</label>
                <textarea value={form.cta_body} onChange={e => set('cta_body', e.target.value)} rows={3} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving} style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
            <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
