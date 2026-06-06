import { useEffect, useState } from 'react';
import { getSiteSettings } from '../api/apiService';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <footer>
      <div className="social-links">
        {settings?.twitter_url && (
          <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        )}
        {settings?.linkedin_url && (
          <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
        )}
        {settings?.facebook_url && (
          <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
        )}
        {!settings?.twitter_url && !settings?.linkedin_url && !settings?.facebook_url && (
          <>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          </>
        )}
      </div>
      <p>&copy; {new Date().getFullYear()} Edgar Nii Kpakpo Addo. All Rights Reserved.</p>
      <p style={{ marginTop: 4 }}>{settings?.location || 'Accra, Ghana'}</p>
    </footer>
  );
}
