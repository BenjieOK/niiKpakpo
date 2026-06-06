import { useEffect, useState } from 'react';
import { adminGetExpertiseCards, adminUpdateExpertiseCard } from '../api/apiService';

const ICONS = [
  { value: 'fas fa-ship', label: 'Ship (Maritime)' },
  { value: 'fas fa-cogs', label: 'Cogs (TVET)' },
  { value: 'fas fa-tools', label: 'Tools (Engineering)' },
  { value: 'fas fa-graduation-cap', label: 'Graduation Cap' },
  { value: 'fas fa-anchor', label: 'Anchor' },
  { value: 'fas fa-industry', label: 'Industry' },
  { value: 'fas fa-flask', label: 'Flask (Research)' },
  { value: 'fas fa-chalkboard-teacher', label: 'Lecturer' },
  { value: 'fas fa-hard-hat', label: 'Hard Hat' },
  { value: 'fas fa-wrench', label: 'Wrench' },
];

export default function ExpertiseManager() {
  const [cards, setCards] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetExpertiseCards().then(r => setCards(r.data));
  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openEdit = (card) => { setForm({ ...card }); setEditing(card.id); };
  const cancelEdit = () => { setEditing(null); setForm({}); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateExpertiseCard(form.id, form);
      showAlert('Card updated!');
      await load();
      setEditing(null);
    } catch {
      showAlert('Could not save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-star" style={{ marginRight: 10 }}></i>Expertise Cards</h3>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          These are the three cards showing "Areas of Expertise" on the home page. Click Edit to change any card.
        </p>

        {cards.map(card => (
          <div key={card.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
            {editing === card.id ? (
              <form onSubmit={handleSave}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Icon</label>
                    <select value={form.icon} onChange={e => set('icon', e.target.value)}>
                      {ICONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                    </select>
                    <p className="hint">Preview: <i className={form.icon} style={{ color: 'var(--color-accent)' }}></i></p>
                  </div>
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} required />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description *</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} required />
                </div>
                <div className="btn-group">
                  <button type="submit" className="btn-admin-primary" disabled={saving}>
                    <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn-admin-secondary" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 56, height: 56, background: '#e8f5e9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <i className={card.icon}></i>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 4 }}>{card.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{card.description}</p>
                  </div>
                </div>
                <button className="btn-admin-icon" onClick={() => openEdit(card)} title="Edit">
                  <i className="fas fa-pen"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
