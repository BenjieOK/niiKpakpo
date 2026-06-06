import { useEffect, useState } from 'react';
import { adminGetMessages, adminMarkRead, adminDeleteMessage } from '../api/apiService';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);

  const load = () => adminGetMessages().then(r => setMessages(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await adminMarkRead(msg.id);
        setMessages(ms => ms.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await adminDeleteMessage(id);
      showAlert('Message deleted.');
      setSelected(null);
      load();
    } catch { showAlert('Could not delete.', 'error'); }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      {alert && <div className={`admin-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>
            <i className="fas fa-inbox" style={{ marginRight: 10 }}></i>
            Messages Inbox
            {unreadCount > 0 && (
              <span className="badge badge-unread" style={{ marginLeft: 10 }}>
                {unreadCount} unread
              </span>
            )}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{messages.length} total messages</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          These are messages sent via the Contact form on your website. Click a message to read it.
        </p>

        {messages.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No messages yet. Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
            <div>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message-card${!msg.is_read ? ' unread' : ''}`}
                  onClick={() => openMessage(msg)}
                  style={{ cursor: 'pointer', opacity: selected?.id === msg.id ? 1 : 0.9 }}
                >
                  <div className="message-card-header">
                    <h4>{msg.subject}</h4>
                    {!msg.is_read && <span className="badge badge-unread">New</span>}
                  </div>
                  <div className="message-card-meta">
                    <strong>{msg.name}</strong> &bull; {msg.email} &bull; {formatDate(msg.created_at)}
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            {selected && (
              <div className="admin-card" style={{ margin: 0, position: 'sticky', top: 20, alignSelf: 'start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '1.3rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    {selected.subject}
                  </h3>
                  <button className="btn-admin-icon" onClick={() => setSelected(null)} title="Close">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div style={{ background: '#f8f9fa', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                  <p style={{ margin: '0 0 4px' }}><strong>From:</strong> {selected.name}</p>
                  <p style={{ margin: '0 0 4px' }}><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
                  <p style={{ margin: 0 }}><strong>Received:</strong> {formatDate(selected.created_at)}</p>
                </div>
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 6, padding: 16, marginBottom: 20, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-admin-primary">
                    <i className="fas fa-reply"></i> Reply via Email
                  </a>
                  <button className="btn-admin-danger" onClick={() => handleDelete(selected.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
