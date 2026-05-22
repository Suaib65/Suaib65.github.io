import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── THEME TOKENS ── */
  .portfolio.dark {
    --bg:        #0a0a0a;
    --bg-card:   #111111;
    --bg-card2:  #161616;
    --border:    #1e1e1e;
    --border2:   #2a2a2a;
    --text:      #f0f0f0;
    --text-sub:  #aaaaaa;
    --muted:     #555555;
    --green:     #39FF6A;
    --green-dim: rgba(57,255,106,0.08);
    --green-bdr: rgba(57,255,106,0.2);
    --nav-bg:    rgba(10,10,10,0.88);
    --scrollbar: #2a2a2a;
    --hero-ghost:#1a1a1a;
    --edu-year:  #1e1e1e;
    --shadow:    none;
  }

  .portfolio.light {
    --bg:        #f5f4f0;
    --bg-card:   #ffffff;
    --bg-card2:  #efefeb;
    --border:    #e0ddd6;
    --border2:   #cecbc3;
    --text:      #0f0f0f;
    --text-sub:  #444444;
    --muted:     #888888;
    --green:     #1a9e3f;
    --green-dim: rgba(26,158,63,0.07);
    --green-bdr: rgba(26,158,63,0.22);
    --nav-bg:    rgba(245,244,240,0.92);
    --scrollbar: #d0cdc6;
    --hero-ghost:#dddbd5;
    --edu-year:  #e8e5df;
    --shadow:    0 2px 16px rgba(0,0,0,0.06);
  }

  body { overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 2px; }

  .portfolio {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    transition: background 0.35s ease, color 0.35s ease;
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 3rem;
    background: var(--nav-bg);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    transition: background 0.35s ease, border-color 0.35s ease;
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.1rem;
    color: var(--text); letter-spacing: -0.02em;
  }
  .nav-logo span { color: var(--green); }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--muted);
    text-decoration: none; letter-spacing: 0.08em;
    text-transform: uppercase; transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--green); }
  .nav-right { display: flex; align-items: center; gap: 1.25rem; }
  .nav-status {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--muted);
  }
  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* ── THEME TOGGLE ── */
  .theme-toggle {
    width: 40px; height: 22px;
    border-radius: 100px;
    background: var(--border2);
    border: 1px solid var(--border2);
    cursor: pointer;
    position: relative;
    transition: background 0.3s ease;
    flex-shrink: 0;
    display: flex; align-items: center;
    padding: 2px;
  }
  .theme-toggle:hover { border-color: var(--green); }
  .toggle-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--green);
    position: absolute;
    left: 3px;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; line-height: 1;
  }
  .portfolio.light .toggle-thumb { transform: translateX(17px); }
  .toggle-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; color: var(--muted);
    letter-spacing: 0.06em; white-space: nowrap;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 8rem 3rem 4rem;
    position: relative; overflow: hidden;
  }
  .hero-bg-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(6rem, 18vw, 18rem);
    color: transparent;
    -webkit-text-stroke: 1px var(--hero-ghost);
    white-space: nowrap;
    pointer-events: none; user-select: none;
    letter-spacing: -0.04em;
    transition: -webkit-text-stroke-color 0.35s;
  }
  .hero-grid {
    display: grid; grid-template-columns: 1fr auto;
    gap: 4rem; align-items: center;
    width: 100%; max-width: 1200px;
    margin: 0 auto; position: relative; z-index: 1;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green-dim);
    border: 1px solid var(--green-bdr);
    border-radius: 100px; padding: 0.4rem 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--green);
    letter-spacing: 0.06em; margin-bottom: 1.5rem;
  }
  .hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    line-height: 1.0; letter-spacing: -0.04em;
    color: var(--text); margin-bottom: 1.25rem;
  }
  .hero-title em { font-style: normal; color: var(--green); }
  .hero-sub {
    font-size: 1rem; color: var(--text-sub);
    max-width: 480px; line-height: 1.7;
    font-weight: 300; margin-bottom: 2.5rem;
  }
  .hero-cta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green); color: #000;
    padding: 0.75rem 1.75rem; border-radius: 4px;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.06em; cursor: pointer;
    border: none; text-decoration: none;
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.82; transform: translateY(-1px); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--text);
    padding: 0.75rem 1.75rem; border-radius: 4px;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem; letter-spacing: 0.06em;
    cursor: pointer; border: 1px solid var(--border);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: var(--green); color: var(--green); }

  .hero-right { display: flex; flex-direction: column; gap: 1rem; min-width: 220px; }
  .hero-stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow);
    transition: background 0.35s, border-color 0.35s;
  }
  .hero-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2.4rem; font-weight: 800;
    color: var(--green); line-height: 1;
  }
  .hero-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--muted);
    letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.25rem;
  }
  .location-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--muted);
    letter-spacing: 0.06em;
    border-top: 1px solid var(--border);
    padding-top: 1rem; margin-top: 0.5rem;
  }

  /* ── SECTIONS ── */
  section {
    padding: 6rem 3rem;
    max-width: 1200px; margin: 0 auto;
  }
  .section-header {
    display: flex; align-items: baseline; gap: 1rem;
    margin-bottom: 3rem;
  }
  .section-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--green); letter-spacing: 0.1em;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 2rem;
    letter-spacing: -0.03em; color: var(--text);
  }
  .section-line { flex: 1; height: 1px; background: var(--border); margin-left: 1rem; }

  /* ── ABOUT ── */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: start;
  }
  .about-text {
    font-size: 1rem; color: var(--text-sub);
    line-height: 1.85; font-weight: 300;
  }
  .about-text strong { color: var(--text); font-weight: 500; }
  .about-right { display: flex; flex-direction: column; gap: 1rem; }
  .skill-row { display: flex; flex-direction: column; gap: 0.4rem; }
  .skill-header {
    display: flex; justify-content: space-between;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--muted); letter-spacing: 0.06em;
  }
  .skill-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .skill-fill {
    height: 100%; background: var(--green);
    border-radius: 2px;
    transition: width 1.5s cubic-bezier(0.16,1,0.3,1);
    width: 0;
  }
  .skill-fill.animate { width: var(--w); }

  .skills-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .skill-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--muted);
    border: 1px solid var(--border); border-radius: 4px;
    padding: 0.45rem 1rem; letter-spacing: 0.06em;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .skill-tag:hover { color: var(--green); border-color: var(--green-bdr); }
  .skill-tag.highlight {
    color: var(--green); border-color: var(--green-bdr);
    background: var(--green-dim);
  }

  /* ── TIMELINE ── */
  .timeline { position: relative; padding-left: 1.5rem; }
  .timeline::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 1px; background: var(--border);
  }
  .timeline-item { position: relative; padding-left: 2rem; padding-bottom: 3rem; }
  .timeline-item::before {
    content: ''; position: absolute;
    left: -1.53rem; top: 0.35rem;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 3px var(--green-dim);
  }
  .timeline-period {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--muted);
    letter-spacing: 0.08em; margin-bottom: 0.5rem;
  }
  .timeline-role {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.2rem;
  }
  .timeline-company {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem; color: var(--green); margin-bottom: 1rem;
  }
  .timeline-points { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .timeline-points li {
    font-size: 0.88rem; color: var(--text-sub);
    line-height: 1.6; padding-left: 1rem; position: relative;
  }
  .timeline-points li::before {
    content: '→'; position: absolute; left: 0;
    color: var(--green); font-size: 0.75rem;
  }

  /* ── PROJECTS ── */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px,1fr));
    gap: 1.5rem;
  }
  .project-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 2rem;
    transition: border-color 0.2s, transform 0.2s, background 0.35s, box-shadow 0.2s;
    position: relative; overflow: hidden;
    box-shadow: var(--shadow);
  }
  .project-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: var(--green); opacity: 0;
    transition: opacity 0.2s;
  }
  .project-card:hover { border-color: var(--border2); transform: translateY(-3px); }
  .project-card:hover::before { opacity: 1; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
  .project-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; color: var(--green);
    background: var(--green-dim);
    border: 1px solid var(--green-bdr);
    padding: 0.2rem 0.6rem; border-radius: 3px; letter-spacing: 0.06em;
  }
  .project-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.75rem; letter-spacing: -0.02em;
  }
  .project-desc {
    font-size: 0.85rem; color: var(--text-sub);
    line-height: 1.7; margin-bottom: 1.5rem;
  }
  .project-highlights {
    list-style: none; display: flex; flex-direction: column;
    gap: 0.4rem; margin-bottom: 1.5rem;
  }
  .project-highlights li {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--muted);
    padding-left: 1rem; position: relative;
  }
  .project-highlights li::before { content: '—'; position: absolute; left: 0; color: var(--border2); }
  .project-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--muted);
    text-decoration: none; letter-spacing: 0.06em;
    display: inline-flex; align-items: center; gap: 0.3rem;
    transition: color 0.2s;
  }
  .project-link:hover { color: var(--green); }

  /* ── EDUCATION ── */
  .cert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px,1fr));
    gap: 1rem;
  }
  .cert-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 1.5rem;
    display: flex; gap: 1rem; align-items: flex-start;
    transition: border-color 0.2s, background 0.35s;
    box-shadow: var(--shadow);
  }
  .cert-card:hover { border-color: var(--green-bdr); }
  .cert-icon {
    width: 36px; height: 36px; border-radius: 6px;
    background: var(--green-dim);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 1rem; color: var(--green);
  }
  .cert-name {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem; font-weight: 600;
    color: var(--text); margin-bottom: 0.25rem;
  }
  .cert-issuer {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em;
  }
  .edu-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 2rem 2.5rem;
    display: flex; justify-content: space-between;
    align-items: center; gap: 2rem;
    box-shadow: var(--shadow);
    transition: background 0.35s, border-color 0.35s;
  }
  .edu-degree {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem; font-weight: 700;
    color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.4rem;
  }
  .edu-uni { font-size: 0.9rem; color: var(--text-sub); margin-bottom: 0.25rem; }
  .edu-cgpa {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--green); letter-spacing: 0.06em;
  }
  .edu-year {
    font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800;
    color: var(--edu-year); letter-spacing: -0.04em; white-space: nowrap;
  }

  /* ── CONTACT ── */
  .contact-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: start;
  }
  .contact-big {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800; color: var(--text);
    letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 1.5rem;
  }
  .contact-big em { font-style: normal; color: var(--green); }
  .contact-sub { font-size: 0.9rem; color: var(--text-sub); line-height: 1.7; margin-bottom: 2rem; }
  .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
  .contact-link {
    display: flex; align-items: center; gap: 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem; color: var(--text-sub);
    text-decoration: none; letter-spacing: 0.04em;
    padding: 1rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: 6px; background: var(--bg-card);
    transition: border-color 0.2s, color 0.2s, background 0.35s;
    box-shadow: var(--shadow);
  }
  .contact-link:hover { border-color: var(--green-bdr); color: var(--green); }
  .contact-link-icon { font-size: 0.9rem; color: var(--green); min-width: 16px; }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem 3rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color 0.35s;
  }
  .footer-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em;
  }

  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hero { padding: 7rem 1.5rem 3rem; }
    .hero-grid { grid-template-columns: 1fr; }
    .hero-right { flex-direction: row; }
    .hero-stat-card { flex: 1; }
    section { padding: 4rem 1.5rem; }
    .about-grid, .contact-inner { grid-template-columns: 1fr; gap: 2rem; }
    .edu-card { flex-direction: column; }
    footer { padding: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
  }
`;

const skills = [
  { name: "SQL", pct: 88 },
  { name: "Python", pct: 75 },
  { name: "PostgreSQL", pct: 85 },
  { name: "Data Analysis", pct: 80 },
];

const allSkills = [
  "SQL", "Python", "PostgreSQL", "pgAdmin4", "VS Code",
  "Data Modeling", "ETL Pipelines", "Window Functions",
  "CTEs", "Query Optimization", "OpenCV", "Kaggle",
  "Data Cleaning", "ERD Design", "Database Indexing",
  "NumPy", "Pandas", "Git",
];

const projects = [
  {
    title: "Amazon Sales SQL Analysis",
    tags: ["PostgreSQL", "pgAdmin4", "Kaggle"],
    desc: "End-to-end analysis of 20,000+ Amazon sales records to surface business KPIs, customer behavior patterns, and revenue trends.",
    highlights: [
      "Designed normalized ERD with 9 related tables + FK/PK constraints",
      "Advanced SQL: Window Functions (RANK, DENSE_RANK, LAG), CTEs",
      "Addressed null values in shipping & payment fields for data integrity",
      "Solved real-world business problems via complex multi-table joins",
    ],
    link: "#",
  },
  {
    title: "Attendance Management System",
    tags: ["Python", "OpenCV", "Machine Learning"],
    desc: "Computer vision-powered attendance tracker using facial recognition — eliminating manual roll calls for Dhemaji Engineering College.",
    highlights: [
      "Haar cascade classifiers for real-time face detection",
      "OpenCV pipeline for image acquisition & recognition",
      "Automated attendance logging — zero manual intervention",
    ],
    link: "#",
  },
];

function SkillBar({ name, pct }) {
  const fillRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.setProperty("--w", pct + "%");
        fillRef.current.classList.add("animate");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [pct]);
  return (
    <div className="skill-row">
      <div className="skill-header">
        <span>{name}</span><span>{pct}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-fill" ref={fillRef} />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`portfolio ${isDark ? "dark" : "light"}`}>

        {/* NAV */}
        <nav>
          <div className="nav-logo">SA<span>.</span></div>
          <ul className="nav-links">
            {["about", "experience", "projects", "contact"].map((s) => (
              <li key={s}>
                <a href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <div className="nav-status">
              <div className="status-dot" />
              Open to opportunities
            </div>
            {/* THEME TOGGLE */}
            <button
              className="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              <div className="toggle-thumb">
                {isDark ? "🌙" : "☀️"}
              </div>
            </button>
            <span className="toggle-label">{isDark ? "DARK" : "LIGHT"}</span>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero" id="hero">
          <div className="hero-bg-text">DATA</div>
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <span>◆</span>
                Fresher · Data Analyst · Data Engineer
              </div>
              <h1 className="hero-title">
                Suaib<br /><em>Ahmed</em>
              </h1>
              <p className="hero-sub">
                B.Tech CSE graduate turning raw data into real decisions.
                I design databases, write complex SQL, and build pipelines
                that make data actually useful.
              </p>
              <div className="hero-cta">
                <a className="btn-primary" href="mailto:officialsuaibahmed@gmail.com">
                  ✉ Get in touch
                </a>
                <a className="btn-ghost" href="https://github.com/Suaib65" target="_blank" rel="noreferrer">
                  ↗ GitHub
                </a>
              </div>
              <div className="location-tag" style={{ marginTop: "2rem" }}>
                📍 Assam, India · +91-7635922225
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-stat-card">
                <div className="hero-stat-num">20K+</div>
                <div className="hero-stat-label">Records Analyzed</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-num">7.4</div>
                <div className="hero-stat-label">CGPA · First Class</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-num">2</div>
                <div className="hero-stat-label">Projects Shipped</div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2 className="section-title">About</h2>
            <div className="section-line" />
          </div>
          <div className="about-grid">
            <div>
              <p className="about-text">
                I'm a <strong>B.Tech Computer Science</strong> graduate from Assam, India,
                with a deep interest in how data powers decisions. My core focus is{" "}
                <strong>data engineering and analytics</strong> — architecting reliable
                databases, writing performant SQL, and extracting insights that actually
                move the needle.
              </p>
              <br />
              <p className="about-text">
                During my internship at{" "}
                <strong>Assam Power Generation Corporation Limited</strong>, I built the
                backend database for a full Tender Management System in PostgreSQL —
                gaining hands-on experience in schema design, query tuning, and indexing
                under real enterprise constraints.
              </p>
              <br />
              <p className="about-text">
                I hold a <strong>DataCamp Data Engineer Associate Certification</strong> and
                I'm actively looking for roles where I can grow in data engineering,
                analytics, or backend data infrastructure.
              </p>
            </div>
            <div className="about-right">
              {skills.map((s) => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
                  color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.75rem"
                }}>
                  TECH STACK
                </div>
                <div className="skills-grid">
                  {allSkills.map((s, i) => (
                    <span key={s} className={`skill-tag ${i < 4 ? "highlight" : ""}`}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <span className="section-num">02</span>
            <h2 className="section-title">Experience</h2>
            <div className="section-line" />
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-period">2024</div>
              <div className="timeline-role">Web Development Intern</div>
              <div className="timeline-company">
                Assam Power Generation Corporation Limited · Guwahati
              </div>
              <ul className="timeline-points">
                <li>Architected the backend PostgreSQL database for a comprehensive Tender Generation & Management system, ensuring data consistency and reliability at scale.</li>
                <li>Designed normalized relational schemas, wrote complex SQL with multi-table joins, aggregations, and sub-queries for dynamic tender workflows.</li>
                <li>Optimized data retrieval speeds for admin and user interfaces via PostgreSQL indexing strategies and query performance tuning.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <span className="section-num">03</span>
            <h2 className="section-title">Projects</h2>
            <div className="section-line" />
          </div>
          <div className="projects-grid">
            {projects.map((p) => (
              <div className="project-card" key={p.title}>
                <div className="project-tags">
                  {p.tags.map((t) => <span className="project-tag" key={t}>{t}</span>)}
                </div>
                <div className="project-title">{p.title}</div>
                <p className="project-desc">{p.desc}</p>
                <ul className="project-highlights">
                  {p.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <a href={p.link} className="project-link">View on GitHub ↗</a>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION & CERTS */}
        <section id="education" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <span className="section-num">04</span>
            <h2 className="section-title">Education & Certs</h2>
            <div className="section-line" />
          </div>
          <div className="edu-card" style={{ marginBottom: "1.5rem" }}>
            <div>
              <div className="edu-degree">B.Tech · Computer Science</div>
              <div className="edu-uni">
                Assam Science and Technology University · Dhemaji Engineering College, Assam
              </div>
              <div className="edu-cgpa">CGPA 7.4 — First Class</div>
            </div>
            <div className="edu-year">2024–25</div>
          </div>
          <div className="cert-grid">
            <div className="cert-card">
              <div className="cert-icon">⬡</div>
              <div>
                <div className="cert-name">Data Engineer Associate</div>
                <div className="cert-issuer">DataCamp · Nov 2025</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <span className="section-num">05</span>
            <h2 className="section-title">Contact</h2>
            <div className="section-line" />
          </div>
          <div className="contact-inner">
            <div>
              <div className="contact-big">
                Let's build<br />something<br /><em>great.</em>
              </div>
              <p className="contact-sub">
                I'm actively seeking data analyst and data engineering roles.
                If you have an opportunity or just want to talk data — my inbox is open.
              </p>
              <a className="btn-primary" href="mailto:officialsuaibahmed@gmail.com" style={{ display: "inline-flex" }}>
                ✉ Send a message
              </a>
            </div>
            <div className="contact-links">
              {[
                { icon: "✉", label: "officialsuaibahmed@gmail.com", href: "mailto:officialsuaibahmed@gmail.com" },
                { icon: "📞", label: "+91-7635922225", href: "tel:+917635922225" },
                { icon: "in", label: "linkedin.com/in/suaib9", href: "https://linkedin.com/in/suaib9" },
                { icon: "⌥", label: "github.com/Suaib65", href: "https://github.com/Suaib65" },
              ].map((c) => (
                <a key={c.label} className="contact-link" href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span className="contact-link-icon">{c.icon}</span>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span className="footer-text">© 2025 Suaib Ahmed</span>
          <span className="footer-text">Built with React · Syne + DM Mono</span>
          <span className="footer-text">Assam, India</span>
        </footer>

      </div>
    </>
  );
}