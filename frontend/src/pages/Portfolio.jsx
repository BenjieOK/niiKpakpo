import { useEffect, useState } from 'react';
import { getProjects, getTimeline } from '../api/apiService';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    getProjects().then(r => setProjects(r.data)).catch(() => {});
    getTimeline().then(r => setTimeline(r.data)).catch(() => {});
  }, []);

  return (
    <main className="page-main">
      <div className="container">
        <div className="portfolio-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title">A Career of Impact</h1>
          <p className="page-subtitle">Blending academic excellence with hands-on industrial innovation.</p>
        </div>

        <section className="key-highlights">
          <div className="highlight-card">
            <i className="fas fa-certificate"></i>
            <h3>Certified Engineer</h3>
            <p>Corporate member of the Council of Engineers (PE 02583).</p>
          </div>
          <div className="highlight-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>TVET Facilitator</h3>
            <p>Certified by COTVET Ghana to lead technical and vocational training.</p>
          </div>
          <div className="highlight-card">
            <i className="fas fa-ship"></i>
            <h3>Maritime Expert</h3>
            <p>Lecturer at Regional Maritime University &amp; industry consultant.</p>
          </div>
        </section>

        <section className="portfolio-section">
          <h2 className="section-title">Professional Experience & Signature Projects</h2>
          <div className="experience-summary">
            <p>As a Marine Engineering Lecturer and industry consultant, my work focuses on bridging the gap between theoretical knowledge and practical application. I've had the privilege of consulting for global institutions like <strong>SMTC Global, Charkin Offshore Maritime, and Rig World Ghana</strong>, contributing to the design, fabrication, and maintenance of critical engineering structures.</p>
          </div>
          <div className="projects-grid-portfolio">
            {projects.map((p) => (
              <div key={p.id} className="project-card">
                {p.image_url && <img src={p.image_url} alt={p.title} />}
                <div className="project-content">
                  <span className={`project-status ${p.status}`}>{p.status}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="portfolio-section academic-journey">
          <h2 className="section-title">Academic Journey</h2>
          <ul className="timeline">
            {timeline.map((entry) => (
              <li key={entry.id}>
                <div className="timeline-badge"><i className="fas fa-university"></i></div>
                <div className="timeline-panel">
                  <h4>{entry.degree}</h4>
                  <p><strong>{entry.institution}</strong></p>
                  {entry.description && <p style={{ color: '#6c757d' }}>{entry.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="portfolio-section">
          <h2 className="section-title">Publications & Memberships</h2>
          <div className="constituency-grid">
            <div className="constituency-work">
              <h4><i className="fas fa-book-open"></i> Academic Publications</h4>
              <p>Authored and co-authored multiple research papers published in reputable international and local journals, contributing to the body of knowledge in engineering and maritime technology.</p>
              <a href="https://www.ijasre.net" target="_blank" rel="noopener noreferrer" className="btn-link">View International Publications &rarr;</a>
            </div>
            <div className="constituency-work">
              <h4><i className="fas fa-users"></i> Professional Memberships</h4>
              <p>A dedicated corporate member of the <strong>Council of Engineers</strong> and an active member of the <strong>African Materials Research Society (AMRS-UG Chapter)</strong>, contributing to professional standards.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
