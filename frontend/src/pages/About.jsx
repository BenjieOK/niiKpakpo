import { useEffect, useState } from 'react';
import { getSiteSettings } from '../api/apiService';

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const quote = settings?.quote_banner || "My mission is simple: make hands-on technical education the driving force of Ghana's economic transformation.";
  const parts = quote.split('hands-on technical education');

  return (
    <main className="page-main no-padding-top" style={{ paddingTop: 0 }}>

      {/* Hero — A Visionary in Maritime Education */}
      <section className="about-hero-section" style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="split-layout">
            <div className="image-block hero-image">
              <img
                src="/images/photo-2.jpg"
                alt="Edgar Nii Kpakpo Addo — Maritime Educator"
                style={{ width: '100%', height: 520, objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div className="text-block centered-vertical">
              <div className="icon-header">
                <i className="fas fa-anchor"></i>
              </div>
              <h2 className="section-heading">A Visionary in <br />Maritime Education</h2>
              <h3 className="sub-heading">The Edgar Biography</h3>
              <div className="content-body">
                <p>
                  Discover the inspiring journey of Edgar Nii Kpakpo Addo, a distinguished Maritime
                  Education Practitioner, Certified Engineer, and Entrepreneur. Deeply committed to his
                  faith and family, Nii Kpakpo's mission is anchored in leveraging technical education
                  to drive Ghana's industrialization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="quote-banner-section">
        <div className="container">
          <h2>
            "{parts[0]}
            <span className="highlight">hands-on technical education</span>
            {parts[1]}"
          </h2>
        </div>
      </section>

      {/* Career of Impact */}
      <section className="journey-section" style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="split-layout reverse-mobile">
            <div className="text-block">
              <h2 className="section-heading">Edgar Nii Kpakpo Addo:</h2>
              <h3 className="sub-heading">A Career of Impact</h3>
              <div className="content-body">
                <p><strong>Lecturer & Industry Leader.</strong> Currently pursuing a PhD in Material Science and Engineering at the University of Ghana, Edgar has established himself as a leading expert at the Regional Maritime University.</p>
                <p>He bridges the gap between the classroom and the rig. His work involves designing, fabricating, and maintaining engineering structures for global giants like <strong>SMTC Global</strong> and <strong>Rig World Ghana</strong>. He believes that true economic liberation for the youth lies in competency-based skill acquisition.</p>
              </div>
            </div>
            <div className="image-block">
              <div className="masonry-grid">
                <div className="grid-item item-1">
                  <img src="/images/photo-4.jpg" alt="Edgar Lecturing" />
                </div>
                <div className="grid-item item-2">
                  <img src="/images/photo-6.jpg" alt="Edgar On Site" />
                </div>
                <div className="grid-item item-3">
                  <img src="/images/photo-8.jpg" alt="Edgar Consulting" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TVET & Leadership */}
      <section className="expertise-display-section bg-light" style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="split-layout">
            <div className="text-block">
              <h2 className="section-heading">Pioneering Change:</h2>
              <h3 className="sub-heading">TVET & Leadership</h3>
              <div className="content-body">
                <p>Edgar is not just an engineer; he is an advocate for systemic change. He champions <strong>Competency-Based Training (CBT)</strong>, ensuring curricula align with evolving industry needs.</p>
                <p>His consulting portfolio includes the setup of training centers across Africa and Asia, proving that Ghanaian expertise has a global impact. His leadership extends to mentorship, guiding the next generation of engineers to embrace innovation and integrity.</p>
              </div>
            </div>
            <div className="image-block">
              <div className="overlap-images">
                <img src="/images/photo-9.jpg" className="img-back" alt="Leadership" />
                <img src="/images/photo-3.jpg" className="img-front" alt="Innovation" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="education-section" style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="split-layout reverse-mobile">
            <div className="image-block centered-image">
              <img
                src="/images/photo-10.jpg"
                alt="Academic Excellence"
                style={{ width: '100%', height: 400, objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}
              />
            </div>
            <div className="text-block centered-vertical">
              <div className="icon-header">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h2 className="section-heading">Academic Excellence &<br />Professional Expertise</h2>
              <div className="content-body">
                <p>Edgar holds an <strong>MSc in Mechanical Engineering Technology</strong> from the University of Education, Winneba, and a <strong>BSc in Instrumentation and Control Engineering</strong>.</p>
                <p>He is currently a PhD Candidate in Material Science and Engineering. A corporate member of the Council of Engineers (PE 02583) and a certified TVET Facilitator, his academic rigor fuels his practical innovations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
