import { useEffect, useState, useRef } from 'react';
import { adminGetBlogPosts, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost, adminGetCategories } from '../api/apiService';

const SUMMARY_LIMIT = 300;
const EMPTY = {
  title: '', author: 'Edgar Nii Kpakpo Addo', category: '',
  summary: '', content: '', image_url: '', is_featured: false, is_published: true,
};

function ImageInput({ value, onChange, label }) {
  const fileRef = useRef();
  const [tab, setTab] = useState('url'); // 'url' | 'upload'
  const [preview, setPreview] = useState(value || '');

  const handleUrl = (e) => {
    onChange(e.target.value);
    setPreview(e.target.value);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => setTab('url')}
          style={{
            padding: '6px 14px', borderRadius: 6, border: '1.5px solid',
            borderColor: tab === 'url' ? 'var(--color-primary)' : 'var(--color-border)',
            background: tab === 'url' ? 'var(--color-primary)' : 'white',
            color: tab === 'url' ? 'white' : 'var(--color-text-dark)',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}
        >
          <i className="fas fa-link" style={{ marginRight: 6 }}></i>Paste URL
        </button>
        <button
          type="button"
          onClick={() => setTab('upload')}
          style={{
            padding: '6px 14px', borderRadius: 6, border: '1.5px solid',
            borderColor: tab === 'upload' ? 'var(--color-primary)' : 'var(--color-border)',
            background: tab === 'upload' ? 'var(--color-primary)' : 'white',
            color: tab === 'upload' ? 'white' : 'var(--color-text-dark)',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}
        >
          <i className="fas fa-upload" style={{ marginRight: 6 }}></i>Upload from PC
        </button>
      </div>

      {tab === 'url' ? (
        <input value={value} onChange={handleUrl} placeholder="https://example.com/image.jpg" />
      ) : (
        <div
          style={{
            border: '2px dashed var(--color-border)', borderRadius: 8, padding: 24,
            textAlign: 'center', cursor: 'pointer', background: '#fafafa',
          }}
          onClick={() => fileRef.current.click()}
        >
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 8, display: 'block' }}></i>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Click to select an image from your computer</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--color-border)' }}>JPG, PNG, WebP supported</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      )}

      {preview && (
        <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="Preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--color-border)', display: 'block' }} />
          <button
            type="button"
            onClick={() => { onChange(''); setPreview(''); }}
            style={{ position: 'absolute', top: -8, right: -8, background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetBlogPosts().then(r => setPosts(r.data));
  useEffect(() => {
    load();
    adminGetCategories().then(r => {
      setCategories(r.data);
      setForm(f => ({ ...f, category: r.data[0]?.slug || '' }));
    }).catch(() => {});
  }, []);

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
        await adminCreateBlogPost(form);
        showAlert('Blog post published!');
      } else {
        await adminUpdateBlogPost(form.id, form);
        showAlert('Blog post updated!');
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
    if (!confirm('Delete this blog post?')) return;
    try {
      await adminDeleteBlogPost(id);
      showAlert('Post deleted.');
      load();
    } catch { showAlert('Could not delete.', 'error'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const summaryLeft = SUMMARY_LIMIT - (form.summary?.length || 0);

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-newspaper" style={{ marginRight: 10 }}></i>Blog Posts</h3>
          <button className="btn-admin-primary" onClick={openAdd}>
            <i className="fas fa-pen"></i> Write New Post
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          Manage articles shown in the News &amp; Insights section.
        </p>

        {posts.length === 0 ? (
          <div className="empty-state"><i className="fas fa-newspaper"></i><p>No blog posts yet.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(p => (
              <div key={p.id} className="blog-admin-row">
                {/* Featured image — fills full left height */}
                <div className="blog-admin-row-img">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} />
                    : <div className="blog-admin-row-placeholder"><i className="fas fa-image"></i></div>
                  }
                </div>
                <div className="blog-admin-row-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge badge-info">{categories.find(c => c.slug === p.category)?.name || p.category}</span>
                        {p.is_featured && <span className="badge badge-warning">Featured</span>}
                        <span className={`badge ${p.is_published ? 'badge-success' : 'badge-secondary'}`}>
                          {p.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', textTransform: 'uppercase', margin: '0 0 4px' }}>{p.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        By {p.author} &bull; {formatDate(p.date)}
                      </p>
                    </div>
                    <div className="btn-group" style={{ flexShrink: 0 }}>
                      <button className="btn-admin-icon" onClick={() => openEdit(p)} title="Edit"><i className="fas fa-pen"></i></button>
                      <button className="btn-admin-icon danger" onClick={() => handleDelete(p.id)} title="Delete"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: 1.5 }}>{p.summary?.slice(0, 120)}{p.summary?.length > 120 ? '...' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 740 }}>
            <div className="admin-modal-header">
              <h3>{modal === 'add' ? 'Write New Post' : 'Edit Post'}</h3>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label>Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title..." required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Author *</label>
                  <input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Author name" required />
                </div>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageInput
                label="Cover Image (optional)"
                value={form.image_url}
                onChange={v => set('image_url', v)}
              />

              <div className="admin-form-group">
                <label>
                  Short Summary *
                  <span style={{ float: 'right', fontSize: '0.8rem', color: summaryLeft < 20 ? '#dc3545' : 'var(--color-text-muted)', fontWeight: 400 }}>
                    {summaryLeft} characters left
                  </span>
                </label>
                <textarea
                  value={form.summary}
                  onChange={e => set('summary', e.target.value.slice(0, SUMMARY_LIMIT))}
                  rows={3}
                  placeholder="A brief summary shown on the blog listing page (max 300 characters)..."
                  required
                  style={{ borderColor: summaryLeft < 0 ? '#dc3545' : undefined }}
                />
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginTop: 6 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, ((form.summary?.length || 0) / SUMMARY_LIMIT) * 100)}%`, background: summaryLeft < 20 ? '#dc3545' : 'var(--color-primary)', borderRadius: 2, transition: 'width 0.2s, background 0.2s' }} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Full Article Content *</label>
                <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={10} placeholder="Write the full article here..." required />
              </div>

              <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className="admin-checkbox-group">
                  <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
                  <label htmlFor="is_featured">Feature this post (shows first, larger)</label>
                </div>
                <div className="admin-checkbox-group">
                  <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} />
                  <label htmlFor="is_published">Publish (visible on website)</label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
