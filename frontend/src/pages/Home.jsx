import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHeroSlides, getExpertiseCards, getSiteSettings } from '../api/apiService';

const SLIDE_IMAGES = [
  '/images/photo-1.jpg',
  '/images/photo-3.jpg',
  '/images/photo-5.jpg',
  '/images/photo-7.jpg',
];

// Per-slide color schemes — all harmonise with the site's green/gold palette
const SLIDE_SCHEMES = [
  { bg: 'linear-gradient(145deg, #075542 0%, #053b2e 100%)', fadeEnd: '#053b2e', fadeStop: '82%', accentLine: '#D4AF37' },
  { bg: 'linear-gradient(145deg, #0d6b50 0%, #075542 100%)', fadeEnd: '#075542', fadeStop: '76%', accentLine: '#c8a060' },
  { bg: 'linear-gradient(145deg, #14523d 0%, #0a3d2e 100%)', fadeEnd: '#0a3d2e', fadeStop: '85%', accentLine: '#D4AF37' },
  { bg: 'linear-gradient(145deg, #1a4a3a 0%, #0f3028 100%)', fadeEnd: '#0f3028', fadeStop: '79%', accentLine: '#d9b84a' },
];

function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCurrent((idx + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 5500);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  if (!slides.length) return null;

  return (
    <section id="hero-carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => {
          const scheme = SLIDE_SCHEMES[i % SLIDE_SCHEMES.length];
          return (
            <div key={slide.id} className="carousel-item carousel-item-split">
              {/* Left content panel — unique background per slide */}
              <div
                className="carousel-content-side"
                style={{ background: scheme.bg }}
              >
                {/* Gold accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: 5, height: '100%',
                  background: scheme.accentLine, opacity: 0.9,
                }} />
                <div className="hero-content">
                  <h1>{slide.headline}</h1>
                  <p>{slide.subtitle}</p>
                  <Link to={slide.button_url} className={`btn btn-${slide.button_style}`}>
                    {slide.button_text}
                  </Link>
                </div>
              </div>

              {/* Right image panel — fades into the content-side colour */}
              <div className="carousel-image-side">
                <img
                  src={SLIDE_IMAGES[i % SLIDE_IMAGES.length]}
                  alt={slide.headline}
                  className="carousel-split-img"
                />
                {/* Fade uses CSS variable so it matches the current slide colour */}
                <div
                  className="carousel-img-fade"
                  style={{ '--slide-bg-end': scheme.fadeEnd, '--slide-fade-stop': scheme.fadeStop }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="carousel-control prev" onClick={() => goTo(current - 1)} aria-label="Previous">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-control next" onClick={() => goTo(current + 1)} aria-label="Next">
        <i className="fas fa-chevron-right"></i>
      </button>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [cards, setCards] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getHeroSlides().then(r => setSlides(r.data)).catch(() => {});
    getExpertiseCards().then(r => setCards(r.data)).catch(() => {});
    getSiteSettings().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <HeroCarousel slides={slides} />

      <section id="about-home" className="container" style={{ marginTop: 40, marginBottom: 40 }}>
        <div className="home-about-image">
          <img src={settings?.home_about_image || '/images/edgar-portrait.jpg'} alt="Edgar Nii Kpakpo Addo" />
        </div>
        <div className="about-content">
          <h2>{settings?.home_about_title || 'About Edgar Nii Kpakpo Addo'}</h2>
          <p>{settings?.home_about_p1}</p>
          <p>{settings?.home_about_p2}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/about" className="btn btn-secondary">Read More</Link>
          </div>
        </div>
      </section>

      <section id="issues">
        <div className="container">
          <h2 className="section-title">Areas of Expertise</h2>
          <div className="issues-grid">
            {cards.map((card) => (
              <div key={card.id} className="issue-card">
                <i className={card.icon}></i>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="container" style={{ marginTop: 40, marginBottom: 40 }}>
        <h2>{settings?.cta_title || 'Join the Vision'}</h2>
        <p>{settings?.cta_body}</p>
        <div className="cta-buttons">
          <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
        </div>
      </section>
    </>
  );
}
