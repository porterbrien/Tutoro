import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose: #c97384;
          --rose-light: #f0d4da;
          --rose-dark: #a85868;
          --teal: #73C9B8;
          --teal-light: #d4f0eb;
          --teal-dark: #4fa898;
          --white: #fdfcfb;
          --dark: #1a1a2e;
          --gray: #6b7280;
        }

        body { background: var(--white); }

        /* Navbar */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 3rem;
          background: rgba(253, 252, 251, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201, 115, 132, 0.1);
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--dark);
          letter-spacing: 0.02em;
          text-decoration: none;
        }

        .nav-logo span {
          color: var(--rose);
          font-style: italic;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--gray);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-link:hover { color: var(--dark); }

        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: white;
          background: var(--rose);
          padding: 0.6rem 1.4rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }

        .nav-cta:hover {
          background: var(--rose-dark);
          transform: translateY(-1px);
        }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 3rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(115, 201, 184, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201, 115, 132, 0.1) 0%, transparent 70%);
          z-index: 0;
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: float 8s ease-in-out infinite;
        }

        .hero-blob-1 {
          width: 400px;
          height: 400px;
          background: rgba(201, 115, 132, 0.12);
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .hero-blob-2 {
          width: 300px;
          height: 300px;
          background: rgba(115, 201, 184, 0.12);
          bottom: 10%;
          right: 25%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 680px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--teal-dark);
          background: var(--teal-light);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
          animation: slideDown 0.8s ease forwards;
        }

        .hero-title {
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--dark);
          margin-bottom: 1.5rem;
          animation: slideUp 0.8s ease 0.2s both;
        }

        .hero-title em {
          font-style: italic;
          color: var(--rose);
        }

        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--gray);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 2.5rem;
          animation: slideUp 0.8s ease 0.4s both;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          animation: slideUp 0.8s ease 0.6s both;
        }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: white;
          background: var(--rose);
          padding: 0.9rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(201, 115, 132, 0.3);
        }

        .btn-primary:hover {
          background: var(--rose-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 115, 132, 0.4);
        }

        .btn-secondary {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--dark);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: gap 0.2s;
        }

        .btn-secondary:hover { gap: 0.8rem; }

        /* Scroll reveal animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .reveal-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal-right.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }

        /* Features section */
        .features {
          padding: 6rem 3rem;
          background: white;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 300;
          line-height: 1.2;
          color: var(--dark);
          margin-bottom: 1rem;
        }

        .section-title em {
          font-style: italic;
          color: var(--teal-dark);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--rose), var(--teal));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 1.2rem;
        }

        .feature-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.6rem;
        }

        .feature-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--gray);
          line-height: 1.7;
          font-weight: 300;
        }

        /* CTA section */
        .cta-section {
          margin: 0 3rem 6rem;
          padding: 5rem 4rem;
          background: linear-gradient(135deg, var(--dark) 0%, #2d1b4e 100%);
          border-radius: 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(ellipse 40% 40% at 30% 50%, rgba(201, 115, 132, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 70% 50%, rgba(115, 201, 184, 0.2) 0%, transparent 60%);
          z-index: 0;
        }

        .cta-content { position: relative; z-index: 1; }

        .cta-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 300;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .cta-title em {
          font-style: italic;
          color: var(--teal);
        }

        .cta-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          color: rgba(255,255,255,0.65);
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-white {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--dark);
          background: white;
          padding: 0.9rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .btn-outline-white {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.9rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .btn-outline-white:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.5);
        }

        /* Stats */
        .stats-section {
          padding: 5rem 3rem;
          background: linear-gradient(135deg, var(--rose-light) 0%, var(--teal-light) 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--dark);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-number span { color: var(--rose); }

        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: var(--gray);
          font-weight: 400;
        }

        /* Footer */
        .footer {
          padding: 3rem;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: gap;
        }

        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--dark);
        }

        .footer-logo span { color: var(--rose); font-style: italic; }

        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: var(--gray);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
          .hero { padding: 7rem 1.5rem 4rem; }
          .features { padding: 4rem 1.5rem; }
          .cta-section { margin: 0 1.5rem 4rem; padding: 3rem 2rem; }
          .stats-section { padding: 4rem 1.5rem; }
          .footer { padding: 2rem 1.5rem; flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="nav">
        <a href="/" className="nav-logo">Tutoro<span>Health</span></a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/signup" className="nav-cta">Create account</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-content">
          <div className="hero-tag">✦ Your health, simplified</div>
          <h1 className="hero-title">
            Care that <em>moves</em><br />with you
          </h1>
          <p className="hero-subtitle">
            Tutoro Health connects caregivers and clients in one seamless platform — tracking, communicating, and coordinating care with elegance.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Get started free</Link>
            <Link to="/login" className="btn-secondary">
              Sign in <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="reveal">
          <p className="section-label">Everything you need</p>
          <h2 className="section-title">Built for <em>real</em> care</h2>
        </div>
        <div className="features-grid">
          {[
            {
              icon: '📍',
              bg: 'rgba(115, 201, 184, 0.12)',
              title: 'Live Location Tracking',
              desc: 'Know where your clients are at all times with real-time GPS tracking — peace of mind for families and caregivers alike.',
              delay: 'delay-1'
            },
            {
              icon: '👤',
              bg: 'rgba(201, 115, 132, 0.12)',
              title: 'Client Profiles',
              desc: 'Complete medical history, allergies, medications, and emergency contacts — everything in one secure place.',
              delay: 'delay-2'
            },
            {
              icon: '🏠',
              bg: 'rgba(115, 201, 184, 0.12)',
              title: 'Home Information',
              desc: 'Entry instructions, special notes, and address details readily available so caregivers are always prepared.',
              delay: 'delay-3'
            },
            {
              icon: '🔒',
              bg: 'rgba(201, 115, 132, 0.12)',
              title: 'Secure & Private',
              desc: 'Role-based access control ensures only the right people see the right information — always.',
              delay: 'delay-4'
            },
          ].map((feature, i) => (
            <div key={i} className={`feature-card reveal ${feature.delay}`}>
              <div className="feature-icon" style={{ background: feature.bg }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { number: '24', unit: '/7', label: 'Real-time monitoring' },
            { number: '100', unit: '%', label: 'Secure & encrypted' },
            { number: '2', unit: ' roles', label: 'Admin & client access' },
            { number: '∞', unit: '', label: 'Care connections' },
          ].map((stat, i) => (
            <div key={i} className={`reveal delay-${i + 1}`}>
              <div className="stat-number">{stat.number}<span>{stat.unit}</span></div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content reveal">
          <h2 className="cta-title">Ready to transform<br /><em>how you care?</em></h2>
          <p className="cta-subtitle">Join Tutoro Health and experience care coordination done right.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-white">Create your account</Link>
            <Link to="/login" className="btn-outline-white">Sign in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Tutoro<span>Health</span></div>
        <p className="footer-copy">© 2026 TutoroHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;