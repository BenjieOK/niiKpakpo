import { useState, useEffect } from 'react';

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
      setAtBottom((window.scrollY + window.innerHeight) >= document.body.scrollHeight - 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      className={`scroll-btn${visible ? ' visible' : ''}`}
      onClick={handleClick}
      aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
    >
      <i className={atBottom ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i>
    </button>
  );
}
