import { useState, useEffect } from 'react';
import { sendContactMessage, getSiteSettings } from '../api/apiService';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div className="container">
        <h1 className="page-title">Get In Touch</h1>
        <div className="contact-layout">
          <div className="contact-form-container">
            <h3>Send a Message</h3>
            <p>For collaborations, consulting, or speaking engagements, please reach out.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" value={form.message} onChange={handleChange} required></textarea>
              </div>
              {status === 'success' && (
                <div className="success-msg">Thank you! Your message has been sent successfully.</div>
              )}
              {status === 'error' && (
                <div className="error-msg">Something went wrong. Please try again.</div>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 16 }}>
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="contact-info-container">
            <h3>Contact Information</h3>
            <p><i className="fas fa-map-marker-alt"></i> {settings?.location || 'Accra, Ghana'}</p>
            <p style={{ marginTop: 8 }}><i className="fas fa-envelope"></i> {settings?.contact_email || 'contact@niikpakpo.com'}</p>
            <h3 style={{ marginTop: '2rem' }}>Connect on Social Media</h3>
            <div className="social-links-contact">
              {settings?.twitter_url
                ? <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a>
                : <a href="#"><i className="fab fa-twitter"></i> Twitter</a>}
              {settings?.linkedin_url
                ? <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i> LinkedIn</a>
                : <a href="#"><i className="fab fa-linkedin-in"></i> LinkedIn</a>}
              {settings?.facebook_url
                ? <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i> Facebook</a>
                : <a href="#"><i className="fab fa-facebook-f"></i> Facebook</a>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
