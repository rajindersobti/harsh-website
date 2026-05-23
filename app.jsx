/* global React, ReactDOM, motion, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor */
const { useState, useEffect, useRef } = React;
const M = window.motion || {};
const Motion = M.motion || {};

/* ---------- helpers ---------- */
const FadeUp = ({ children, delay = 0, as: Tag = "div", ...rest }) => {
  if (Motion.div) {
    const Component = Motion[Tag] || Motion.div;
    return (
      <Component
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        {...rest}
      >
        {children}
      </Component>
    );
  }
  return <Tag {...rest}>{children}</Tag>;
};

/* ---------- NAV ---------- */
const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "books", label: "Books" },
  { id: "creativity", label: "Creativity" },
  { id: "compound", label: "Growth" },
  { id: "academics", label: "Academics" },
  { id: "contact", label: "Contact" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);

      let cur = "home";
      for (const item of NAV) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top < 140) cur = item.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#home" className="nav-mark">
          Harsh Sobti<span className="dot"></span>
        </a>
        <div className="nav-links">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={`nav-link ${active === n.id ? "active" : ""}`}>{n.label}</a>
          ))}
        </div>
      </div>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }}></div>
    </nav>
  );
}

/* ---------- FEATURE 1: GLANCE CARD ---------- */
function GlanceCard({ num, sup, tag }) {
  return (
    <div className="glance-card">
      <div className="glance-num">{num}<sup>{sup}</sup></div>
      <div className="glance-tag">{tag}</div>
    </div>
  );
}

/* ---------- FEATURE 3: GROWTH TIMELINE ---------- */
const TIMELINE_DATA = [
  {
    discipline: "Tabla",
    color: "var(--accent)",
    icon: "♩",
    startAge: 3,
    events: [
      { age: 3,  note: "First lesson — instrument bigger than I was." },
      { age: 6,  note: "Purna exam — Distinction. Bangiya Sangeet Parishad." },
      { age: 7,  note: "Junior Diploma — Distinction." },
      { age: 9,  note: "Senior Diploma — Distinction." },
      { age: 10, note: "Fourth year exam — Distinction." },
      { age: 16, note: "Sixth year exam — First Division." },
    ],
  },
  {
    discipline: "Books",
    color: "var(--accent)",
    icon: "✦",
    startAge: 11,
    events: [
      { age: 11, note: "First real draft — written in a notebook." },
      { age: 12, note: "Land of Horrors published on Amazon." },
      { age: 16, note: "Second book: four years more deliberate." },
      { age: 17, note: "Book III in progress." },
    ],
  },
  {
    discipline: "Origami",
    color: "var(--accent)",
    icon: "◆",
    startAge: 7,
    events: [
      { age: 7,  note: "Basic cranes and modular forms." },
      { age: 13, note: "Tessellations — designing before folding." },
      { age: 15, note: "Curved creases and modular peacock (5000+ units)." },
      { age: 16, note: "Instagram: @geometricfolds." },
    ],
  },
  {
    discipline: "Karate",
    color: "var(--accent)",
    icon: "◎",
    startAge: 5,
    events: [
      { age: 5,    note: "White belt. May 2014 — started at 5." },
      { age: 5.4,  note: "Yellow belt. Oct 2014 — first grading passed." },
      { age: 5.9,  note: "Orange belt. Mar 2015." },
      { age: 6.5,  note: "Green belt. Dec 2015." },
      { age: 7.25, note: "Blue belt. Sep 2016." },
      { age: 7.75, note: "Purple belt. Feb 2017." },
      { age: 9.5,  note: "Brown belt. Dec 2018. First medal the next month." },
      { age: 10.75,note: "Brown/White stripe (2nd Kyu). Feb 2020. Black belt next." },
    ],
  },
  {
    discipline: "Research",
    color: "var(--accent)",
    icon: "∴",
    startAge: 15,
    events: [
      { age: 15, note: "First research paper begun — zero experience." },
      { age: 16, note: "Paper I complete. 47 review comments. Rewrote." },
      { age: 17, note: "Under peer review. Second paper in progress." },
    ],
  },
];

function getActiveNote(discipline, age) {
  const events = discipline.events.filter(e => e.age <= age);
  if (events.length === 0) return null;
  return events[events.length - 1].note;
}

function GrowthTimeline() {
  const [scrubAge, setScrubAge] = React.useState(17);
  const trackRef = React.useRef(null);
  const dragging = React.useRef(false);
  const minAge = 3, maxAge = 17;

  const ageFromEvent = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(minAge + pct * (maxAge - minAge));
  };

  const onMouseDown  = (e) => { dragging.current = true;  setScrubAge(ageFromEvent(e.clientX)); };
  const onMouseMove  = (e) => { if (dragging.current) setScrubAge(ageFromEvent(e.clientX)); };
  const onMouseUp    = ()  => { dragging.current = false; };
  const onTouchStart = (e) => { dragging.current = true;  setScrubAge(ageFromEvent(e.touches[0].clientX)); };
  const onTouchMove  = (e) => { if (dragging.current) setScrubAge(ageFromEvent(e.touches[0].clientX)); };
  const onTouchEnd   = ()  => { dragging.current = false; };

  React.useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, []);

  const handlePct = ((scrubAge - minAge) / (maxAge - minAge)) * 100;
  const activeDisciplines = TIMELINE_DATA.filter(d => scrubAge >= d.startAge);

  return (
    <FadeUp delay={0.3}>
      <div className="gtl-wrap">
        <div className="gtl-header">
          <div className="gtl-label">— Drag to explore the timeline</div>
          <div className="gtl-age-display">Age <span className="gtl-age-num">{scrubAge}</span></div>
        </div>
        <div className="gtl-track" ref={trackRef} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          <div className="gtl-track-fill" style={{ width: `${handlePct}%` }} />
          {[5,7,9,11,13,15,17].map(age => (
            <div key={age} className="gtl-age-mark" style={{ left: `${((age-minAge)/(maxAge-minAge))*100}%` }}>
              <span>{age}</span>
            </div>
          ))}
          <div className="gtl-handle" style={{ left: `${handlePct}%` }} />
        </div>
        <div className="gtl-panel">
          {activeDisciplines.length === 0
            ? <div className="gtl-empty">Drag right to explore.</div>
            : activeDisciplines.map((d, i) => {
                const note = getActiveNote(d, scrubAge);
                return note ? (
                  <div key={i} className="gtl-item">
                    <span className="gtl-icon" style={{ color: d.color }}>{d.icon}</span>
                    <span className="gtl-disc"  style={{ color: d.color }}>{d.discipline}</span>
                    <span className="gtl-note">{note}</span>
                  </div>
                ) : null;
              })
          }
        </div>
      </div>
    </FadeUp>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section id="home" className="hero" style={{ borderTop: "none" }}>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <FadeUp>
              <div className="hero-meta">
                <span>Portfolio</span><span className="dash"></span>
                <span>Author · Musician · Athlete</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1>
                A student of <span className="accent">curiosity,</span><br />
                rhythm, and <span className="accent">paper.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="hero-lead">
                I'm Harsh — an eleventh-grader writing books, folding tessellations, drumming tabla, and earning belts. This is the long-form version of who I am, beyond the application form.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="hero-cta-row">
                <a href="#about" className="btn btn-primary">Read the narrative <span className="btn-arrow">→</span></a>
                <a href="#books" className="btn btn-ghost">View published works</a>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <div className="hero-portrait placeholder">
              <span className="ph-label">portrait · 4:5 · replace_me.jpg</span>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.25}>
          <div className="glance">
            <div className="glance-label">— A Quick Glance</div>
            <div className="glance-grid">
              <GlanceCard num="02" sup="books" tag="Authored & published — available on Amazon." />
              <GlanceCard num="13" sup="yrs" tag="Of tabla, from first lesson to advanced examinations." />
              <GlanceCard num="08" sup="belts" tag="Belts earned in karate — currently brown/white stripe." />
              <GlanceCard num="07" sup="MUNs" tag="Conferences debated; two awards across committees." />
              <GlanceCard num="02" sup="papers" tag="Authored research, one under review and one in progress." />
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <section id="about">
      <div className="wrap">
        <FadeUp>
          <div className="section-head">
            <div className="section-num">02 — About</div>
            <div>
              <span className="section-kicker">Narrative</span>
              <h2 className="section-title">A multidimensional upbringing.</h2>
            </div>
          </div>
        </FadeUp>

        <div className="about-grid">
          <div />
          <FadeUp>
            <div className="about-narrative">
              <p><span className="drop">I</span> grew up in a house where every question had room to breathe. We don't really do the dinner-table thing — we gather around ideas instead, turning them over from every angle, arguing the way other families pass the salt. My dad lives somewhere between his work and his health routine. My mom is my creative compass: she's the one who handed me my first paintbrush, and the one who sat me down at my first tabla when I was three and the instrument was honestly bigger than I was. I was the kid who asked too many questions, and somehow nobody ever told me to stop.</p>
              <p>Books showed up at our place faster than anyone could finish them. My dad and I keep a running monthly tally of who's read more, and — sorry Dad — it hasn't been close in a while. I published my first book at twelve and the second one four years later. Music came early too, and rhythm became more than a skill for me; it's where I go when the world gets loud. Origami has been a steady companion for the last ten years — quieter than the rest, but it taught me what patience actually feels like in my hands.</p>
              <p>Fitness is non-negotiable. I started karate at five and made it to second brown belt before Covid pressed pause on the whole thing. Badminton and cycling fill in the gaps.</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="about-side">
              <div className="trait">
                <div className="trait-name">Patient</div>
                <div className="trait-body">Origami taught me that a beautiful result is mostly waiting, then a single confident move.</div>
              </div>
              <div className="trait">
                <div className="trait-name">Disciplined</div>
                <div className="trait-body">Thirteen years of tabla riyaaz means showing up daily, especially when nobody is listening.</div>
              </div>
              <div className="trait">
                <div className="trait-name">Curious</div>
                <div className="trait-body">I authored a research paper because I'd rather sit with a question for months than answer it in a week.</div>
              </div>
              <div className="trait">
                <div className="trait-name">Articulate</div>
                <div className="trait-body">Seven MUNs taught me that good arguments respect the room as much as the resolution.</div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Extracurriculars */}
        <FadeUp>
          <div className="ec-grid">
            <div />
            <div>
              <span className="section-kicker">— Leadership & Voice</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, marginBottom: 32, maxWidth: "20ch", lineHeight: 1.15 }}>
                Speaking, organizing, and showing up.
              </h3>
              <div className="ec-cards">
                <div className="ec-card">
                  <div className="ec-icon">D</div>
                  <div className="ec-title">Debate</div>
                  <div className="ec-body">Captain of the school debate team. Inter-school finalist three times in parliamentary format; coached two junior cohorts on rebuttal craft.</div>
                  <div className="ec-meta"><span>2023 — present</span><span>Captain</span></div>
                </div>
                <div className="ec-card">
                  <div className="ec-icon">M</div>
                  <div className="ec-title">Model UN</div>
                  <div className="ec-body">Seven conferences, two awards across UNODC and DISEC committees. Director of the school's hosted MUN in 2025.</div>
                  <div className="ec-meta"><span>2023 — present</span><span>Director</span></div>
                </div>
                <div className="ec-card">
                  <div className="ec-icon">L</div>
                  <div className="ec-title">Leadership</div>
                  <div className="ec-body">Student council representative; founded the school's first creative writing circle. Mentor in a peer-tutoring program for math and writing.</div>
                  <div className="ec-meta"><span>2024 — present</span><span>Founder</span></div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- BOOKS ---------- */
function Books() {
  return (
    <section id="books" className="books-section">
      <div className="wrap">
        <FadeUp>
          <div className="section-head">
            <div className="section-num">03 — Books</div>
            <div>
              <span className="section-kicker">Authored Works</span>
              <h2 className="section-title">Two volumes, twice the questions.</h2>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="book">
            <div className="book-meta-num">№ 01 / 02</div>
            <div className="book-cover book-cover-photo">
              <img src="images/book-cover-1.jpg" alt="Land of Horrors — Jack and His Adventures in Cowland Book One" />
            </div>
            <div className="book-info">
              <h3>Land of Horrors</h3>
              <div className="subtitle">Jack and His Adventures in Cowland — Book One</div>
              <p className="summary">
                The opening volume of the Cowland series introduces Jack, a young protagonist swept into a world where the ordinary rules of his life no longer apply. As he navigates the Land of Horrors, he discovers that bravery is less about the absence of fear and more about what you choose to do beside it — a story written for middle-grade readers but built around the kind of questions that follow a reader long after the last page.
              </p>
              <div className="book-stats">
                <div className="book-stat"><span className="lbl">Series</span><span className="val">Cowland · I</span></div>
                <div className="book-stat"><span className="lbl">Genre</span><span className="val">Middle-grade adventure</span></div>
                <div className="book-stat"><span className="lbl">Published</span><span className="val">2021</span></div>
                <div className="book-stat"><span className="lbl">ISBN</span><span className="val">1639045686</span></div>
              </div>
              <a href="https://www.amazon.in/Land-Horrors-Book-Adventures-Cowland/dp/1639045686/" target="_blank" rel="noopener" className="amazon-cta">Buy on Amazon <span style={{ fontSize: 18 }}>→</span></a>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="book">
            <div className="book-meta-num">№ 02 / 02</div>
            <div className="book-cover book-cover-photo">
              <img src="images/book-cover-2.jpg" alt="Jack and His Adventures in Cowland — Book Two" />
            </div>
            <div className="book-info">
              <h3>Jack and His Adventures in Cowland</h3>
              <div className="subtitle">Book Two of the Cowland series</div>
              <p className="summary">
                The second installment picks up Jack's story with a wider world, higher stakes, and a more complicated cast. Where the first book was a fable of fear, this one is a study in friendship and consequence — what it means to keep a promise to someone whose mind you can't read, and a stranger whose motives you don't know.
              </p>
              <div className="book-stats">
                <div className="book-stat"><span className="lbl">Series</span><span className="val">Cowland · II</span></div>
                <div className="book-stat"><span className="lbl">Genre</span><span className="val">Middle-grade adventure</span></div>
                <div className="book-stat"><span className="lbl">Published</span><span className="val">2025</span></div>
                <div className="book-stat"><span className="lbl">Format</span><span className="val">Kindle / Paperback</span></div>
              </div>
              <a href="https://www.amazon.in/Jack-His-Adventures-Cowland-Book/dp/B0FHJ85C4J/" target="_blank" rel="noopener" className="amazon-cta">Buy on Amazon <span style={{ fontSize: 18 }}>→</span></a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- CREATIVITY ---------- */
function Creativity() {
  const [tab, setTab] = useState("origami");
  return (
    <section id="creativity">
      <div className="wrap">
        <FadeUp>
          <div className="section-head">
            <div className="section-num">04 — Creativity</div>
            <div>
              <span className="section-kicker">Three Disciplines</span>
              <h2 className="section-title">Paper, percussion, persistence.</h2>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.65, maxWidth: "62ch", marginBottom: 48 }}>
            I started tabla at three, karate at five, and origami at seven. They didn't feel related at the time. They do now. Each one is a way of practicing the same skill — listening to a difficult thing closely enough to make it look easy.
          </p>
        </FadeUp>

        <div className="disc-tabs">
          <button onClick={() => setTab("origami")} className={`disc-tab ${tab === "origami" ? "active" : ""}`}>
            <span className="num">A</span><span className="label">Origami</span>
          </button>
          <button onClick={() => setTab("tabla")} className={`disc-tab ${tab === "tabla" ? "active" : ""}`}>
            <span className="num">B</span><span className="label">Tabla</span>
          </button>
          <button onClick={() => setTab("karate")} className={`disc-tab ${tab === "karate" ? "active" : ""}`}>
            <span className="num">C</span><span className="label">Karate</span>
          </button>
        </div>

        {tab === "origami" && <Origami />}
        {tab === "tabla" && <Tabla />}
        {tab === "karate" && <Karate />}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ORIGAMI TILES CONFIG
   ─────────────────────────────────────────────────────────────────────────
   HOW TO ADD A NEW CLUSTER
   1. Create a folder:  images/origami/<folder-name>/
   2. Drop photos in:   images/origami/<folder-name>/01.jpeg  02.jpeg  …
      (any extension works: .jpg, .jpeg, .png, .webp)
   3. Add an entry to ORIGAMI_TILES below:

      {
        cls:       "wide" | "tall" | ""   — grid cell size
        label:     "display name · optional detail"
        fit:       "contain"              — optional; use for tall portrait shots
        instaLink: "https://www.instagram.com/p/POST_ID/"  — optional; links tile to a specific post
        photos:    [ "images/origami/<folder>/<file>", … ]
      }

   cls values:
     ""     → 1×1 square
     "wide" → 2 columns wide
     "tall" → 2 rows tall

   Leave instaLink out (or set to "") to show no Instagram button on that tile.
   ───────────────────────────────────────────────────────────────────────── */
const ORIGAMI_TILES = [
  {
    cls: "wide",
    label: "modular peacock · 5000+ units",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/peacock/01.jpeg",
      "images/origami/peacock/02.jpeg",
      "images/origami/peacock/03.jpeg",
    ],
  },
  {
    cls: "",
    label: "blakiston's fish owl · single sheet",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/owl/01.jpeg",
    ],
  },
  {
    cls: "tall",
    label: "origami eagle",
    fit: "contain",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/eagle/01.jpeg",
      "images/origami/eagle/02.jpeg",
      "images/origami/eagle/03.jpeg",
    ],
  },
  {
    cls: "",
    label: "turbine tessellation",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/tessellation/01.jpeg",
      "images/origami/tessellation/02.jpeg",
    ],
  },
  {
    cls: "",
    label: "hana bishi",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/hana-bishi/01.jpeg",
      "images/origami/hana-bishi/02.jpeg",
    ],
  },
  {
    cls: "",
    label: "cactus kusudama",
    instaLink: "https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==",
    photos: [
      "images/origami/cactus-kusudama/01.jpeg",
      "images/origami/cactus-kusudama/02.jpeg",
    ],
  },
];

/* Instagram SVG icon — inline so no external dependency */
const InstaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

function OrigamiCarousel({ tile }) {
  const scrollRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const photos = tile.photos || [];
  const count = Math.max(photos.length, 1);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };

  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={`origami-tile ${tile.cls}`}>
      <div className="corner"></div>
      {count > 1 && (
        <div className="origami-count">{String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</div>
      )}
      {tile.instaLink && (
        <a
          href={tile.instaLink}
          target="_blank"
          rel="noopener"
          className="origami-insta"
          aria-label="View on Instagram"
          onClick={(e) => e.stopPropagation()}
        >
          <InstaIcon />
        </a>
      )}
      <div className="origami-scroll" ref={scrollRef} onScroll={onScroll}>
        {photos.length === 0 ? (
          <div className="origami-frame empty"></div>
        ) : (
          photos.map((src, i) => (
            <div className="origami-frame" key={i}>
              <img
                src={src}
                alt={`${tile.label} — ${i + 1}`}
                loading="lazy"
                style={tile.fit === "contain" ? { objectFit: "contain", padding: "12px" } : undefined}
              />
            </div>
          ))
        )}
      </div>
      {count > 1 && (
        <>
          <button className="origami-nav prev" onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Previous">‹</button>
          <button className="origami-nav next" onClick={() => goTo(Math.min(count - 1, idx + 1))} disabled={idx === count - 1} aria-label="Next">›</button>
          <div className="origami-dots">
            {photos.map((_, i) => (
              <span key={i} className={`origami-dot ${i === idx ? "active" : ""}`}></span>
            ))}
          </div>
        </>
      )}
      <div className="label">{tile.label}</div>
    </div>
  );
}

function Origami() {
  const tiles = ORIGAMI_TILES;
  return (
    <FadeUp>
      <div className="origami-grid">
        {tiles.map((t, i) => (
          <OrigamiCarousel key={i} tile={t} />
        ))}
      </div>

      <div className="foundations">
        <div>
          <div className="sub">— Foundational Principles</div>
          <h3>The grammar behind the fold.</h3>
          <div className="social-row">
            <a href="https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==" target="_blank" rel="noopener" className="social-link">
              <span style={{ width: 14, height: 14, border: "1.5px solid currentColor", borderRadius: 4, display: "inline-block" }}></span>
              @geometricfolds
            </a>
            <span style={{ color: "var(--slate)" }}>— follow the practice on Instagram</span>
          </div>
        </div>
        <div>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.65 }}>
            I work within the Yoshizawa–Randlett notation — valley and mountain folds, dotted axes, reverse folds — but the territory that interests me most is tessellation and curved-crease work. Tessellations are designed before they're folded: crease patterns that tile a plane and satisfy Maekawa's theorem at every interior vertex. Curved creases go further, folding along arcs so the paper itself becomes the form-finder, bending into developable geometries no flat-fold sequence can produce. Modular construction — kusudama, sonobe, polyhedra built from hundreds of identical units — closes the loop: it behaves less like art and more like combinatorial geometry.
          </p>
        </div>
      </div>
    </FadeUp>
  );
}

function Tabla() {
  const timeline = [
    { yr: "2013", title: "First lesson", milestone: true },
    { yr: "2015", title: "First exam (Purna) — Distinction", milestone: true },
    { yr: "2016", title: "Junior Diploma — Distinction" },
    { yr: "2017", title: "Second year exam — Distinction" },
    { yr: "2018", title: "Senior Diploma — Distinction", milestone: true },
    { yr: "2019", title: "Fourth year exam — Distinction" },
    { yr: "2025", title: "Sixth year exam — First Division", milestone: true },
  ];
  const trophies = [
    { yr: "2015", nm: "First exam (Purna) — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "Distinction" },
    { yr: "2016", nm: "Junior Diploma — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "Distinction" },
    { yr: "2017", nm: "Second year exam — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "Distinction" },
    { yr: "2018", nm: "Senior Diploma — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "Distinction" },
    { yr: "2019", nm: "Fourth year exam — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "Distinction" },
    { yr: "2025", nm: "Sixth year exam — Bangiya Sangeet Parishad · Rabindra Bharati University", grade: "First Division" },
  ];
  return (
    <FadeUp>
      <div className="tabla-hero">
        <div>
          <div className="tabla-years">13<sub>years</sub></div>
        </div>
        <div className="tabla-blurb">
          <p>Thirteen years on the same pair of drums. The bayan and dayan have outlasted every other hobby I've ever started. Tabla isn't the thing I'm best at — it's the thing I'm most patient with, which is probably why I keep coming back.</p>
        </div>
      </div>

      <div className="timeline">
        <div className="glance-label">— Timeline of practice</div>
        <div className="timeline-track">
          {timeline.map((t, i) => (
            <div key={i} className={`tl-step ${t.milestone ? "milestone" : ""}`}>
              <div className="tl-year">{t.yr}</div>
              <div className="tl-title">{t.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="trophy-case">
        <div>
          <div className="glance-label">— Examinations</div>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Certifications & results</h3>
          <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 8, maxWidth: "32ch" }}>All exams under Bangiya Sangeet Parishad · Rabindra Bharati University.</p>
        </div>
        <div className="trophy-list">
          {trophies.map((t, i) => (
            <div className="trophy" key={i}>
              <div className="yr">{t.yr}</div>
              <div className="nm">{t.nm}</div>
              <div className="grade">{t.grade}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="media-frame placeholder">
        <div className="play">
          <div className="play-disc"></div>
          <div className="ph-meta">video · teentaal solo · 03:42 — replace_me.mp4</div>
        </div>
        <div className="scrub"></div>
      </div>
    </FadeUp>
  );
}

function Karate() {
  return (
    <FadeUp>
      <div className="karate-hero">
        <div className="section-num" style={{ paddingTop: 0, marginTop: 4 }}>BELT JOURNEY</div>
        <div>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: 1.05, fontWeight: 400, marginBottom: 18 }}>
            Eight years from white to brown.
          </h3>
          <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: "44ch" }}>
            What I've learned in the dojo doesn't show up in the medals — it shows up in how I lose. Karate is the practice that made me unafraid of being beginner-level at something for years before getting good.
          </p>
        </div>
        <div className="belt-stack">
          <div className="belt b-white">white</div>
          <div className="belt b-yellow">yellow</div>
          <div className="belt b-orange">orange</div>
          <div className="belt b-green">green</div>
          <div className="belt b-blue">blue</div>
          <div className="belt b-purple">purple</div>
          <div className="belt b-brown">brown</div>
          <div className="belt b-black">black</div>
        </div>
      </div>

      <div className="karate-stats">
        <div className="kstat">
          <div className="num">08</div>
          <div className="lbl">— Years of training</div>
        </div>
      </div>

      <div>
        <div className="glance-label">— Tournament</div>
        <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.65, maxWidth: "44ch" }}>
          First and only tournament entered — January 2019, the month after earning the brown belt. Won 1 medal.
        </p>
      </div>

      <div className="discipline-quote">
        "The dojo doesn't reward winning — it rewards <em>showing up tired and bowing in anyway."</em>
        <span className="attr">— Notebook, 2024</span>
      </div>
    </FadeUp>
  );
}

/* ---------- ACADEMICS ---------- */
function Academics() {
  const courses = [
    { code: "MATH 11", name: "Mathematics", focus: "Calculus, linear algebra, and proof-based problem solving." },
    { code: "PHYS 11", name: "Physics", focus: "Mechanics, electromagnetism, and an introduction to quantum behaviour." },
    { code: "CHEM 11", name: "Chemistry", focus: "Physical and organic chemistry, with a focus on bonding and reaction mechanisms." },
    { code: "ECON 11", name: "Economics", focus: "Microeconomic theory, market design, and applied macro fundamentals." },
    { code: "ENG 11", name: "English Literature", focus: "Comparative essays, narrative theory, and long-form argumentative writing." },
  ];
  const papers = [
    {
      title: "Origami Constructions as an Extension of Classical Euclidean Geometry",
      meta: ["Sole author", "Under Review", "Geometry · Computational Mathematics"],
      live: true,
      abstract: "This paper investigates how the axioms of paper-folding (the Huzita–Hatori system) extend the constructive power of classical compass-and-straightedge geometry. By formalising the operations of a single fold as algebraic constructions, we show how origami can solve cubic equations — including the angle trisection and the Delian problem — that are provably impossible under Euclid's axioms, positioning paper as a legitimate computational instrument rather than a craft tool.",
      coauth: ["Harsh Sobti"],
    },
    {
      title: "Is the wave–particle duality of electrons the single most important quantum principle underpinning modern semiconductor technology?",
      meta: ["Sole author", "Under Research", "Quantum Physics"],
      live: false,
      abstract: "An ongoing investigation into how electron wave–particle duality — manifested through tunneling, band structure, and de Broglie behaviour — sits at the foundation of every modern semiconductor device. The paper situates duality alongside other contenders (Pauli exclusion, quantisation of energy) and argues, through case studies of MOSFETs, tunnel diodes, and emerging 2D-material transistors, why duality remains the load-bearing principle of the field.",
      coauth: ["Harsh Sobti"],
    },
  ];
  return (
    <section id="academics">
      <div className="wrap">
        <FadeUp>
          <div className="section-head">
            <div className="section-num">05 — Academics</div>
            <div>
              <span className="section-kicker">Curriculum & Research</span>
              <h2 className="section-title">The classroom and what it spills into.</h2>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="acad-grid">
            <div />
            <div>
              <span className="section-kicker">— 11th Standard</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, marginBottom: 24, maxWidth: "20ch", lineHeight: 1.15 }}>
                Sciences with a literary shadow.
              </h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.65, maxWidth: "44ch" }}>
                I lean toward STEM, but I refuse to give up the humanities. My current focus is the overlap — the math of music, the geometry of paper, the rhetoric of science.
              </p>
            </div>
            <div className="curriculum">
              {courses.map((c, i) => (
                <div className="course" key={i}>
                  <div className="name">{c.name}</div>
                  <div className="focus">{c.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="research-grid">
            <div />
            <div>
              <span className="section-kicker">— Publications & Co-authorship</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, marginBottom: 24, maxWidth: "22ch", lineHeight: 1.15 }}>
                Two papers, one ongoing line of inquiry.
              </h3>
              {papers.map((p, i) => (
                <div className="paper" key={i}>
                  <div className="pn">№ 0{i + 1}</div>
                  <div>
                    <h4 className="paper-title">{p.title}</h4>
                    <div className="paper-meta">
                      {p.meta.map((m, j) => (
                        <span key={j} className={`tag ${p.live && j === 1 ? "live" : ""}`}>{m}</span>
                      ))}
                    </div>
                    <p className="paper-abstract">{p.abstract}</p>
                    <div className="paper-coauth">
                      Authors:&nbsp;
                      {p.coauth.map((a, j) => (
                        <span key={j}>{a === "Harsh" ? <strong>Harsh</strong> : a}{j < p.coauth.length - 1 ? " · " : ""}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="future">
            <div />
            <div>
              <div className="future-headline">
                I want a life where making, performing, and proving aren't kept in separate rooms.
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7, maxWidth: "62ch" }}>
                I'm applying to schools strong in computational and applied mathematics, physics, and economics — with serious humanities programs and active student arts cultures. The goal is to keep the three rooms — research, performance, sport — connected to one corridor. Somewhere I can take a math seminar in the morning, draft a paper in the afternoon, and play something on a Friday night without one feeling like a hobby and the other a calling.
              </p>
              <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7, maxWidth: "62ch", marginTop: 16 }}>
                Longer term: a third book by twenty, a peer-reviewed publication before undergrad ends, and a black belt eventually.
              </p>
              <div className="future-cols">
                <div className="future-col">
                  <h4>Intended Majors</h4>
                  <ul>
                    <li>Mathematics</li>
                    <li>Physics</li>
                    <li>Economics</li>
                  </ul>
                </div>
                <div className="future-col">
                  <h4>Research Interests</h4>
                  <ul>
                    <li>Computational geometry & origami math</li>
                    <li>Music cognition & rhythm perception</li>
                    <li>Pedagogy of long-form practice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- FOOTER / CONTACT ---------- */
function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="section-num" style={{ borderTop: "none", paddingTop: 0, marginTop: 0, marginBottom: 24 }}>06 — Contact</div>
            <h2>For admissions <em>officers, mentors,</em> and curious readers.</h2>
            <p className="footer-lead">
              I'd be happy to share the application packet, references, full publication list, or a longer conversation. The fastest reply is by email.
            </p>
          </div>
          <div className="footer-col">
            <h5>Direct</h5>
            <ul>
              <li><a href="mailto:harshsobti2009@gmail.com">harshsobti2009@gmail.com</a></li>
              <li><a href="#">+91 · on request</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("openCVModal")); }}>Download CV (PDF)</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Elsewhere</h5>
            <ul>
              <li><a href="https://www.instagram.com/geometricfolds?igsh=MTh2YjltdDA3Y25xeA==" target="_blank" rel="noopener">Instagram — @geometricfolds</a></li>
              <li><a href="https://www.linkedin.com/in/harsh-sobti-6a1095318?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener">LinkedIn — Harsh Sobti</a></li>
              <li><a href="https://www.amazon.in/Land-Horrors-Book-Adventures-Cowland/dp/1639045686/" target="_blank" rel="noopener">Amazon — author page</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© Harsh Sobti</span>
          <span>Designed & written, May 2026</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- FEATURE 2: PARALLEL PROGRESS ---------- */
function ParallelProgress() {
  const tracks = [
    {
      discipline: "Tabla", startAge: 3, currentAge: 16, color: "var(--accent)",
      milestones: [
        { age: 3,  label: "First lesson" },
        { age: 6,  label: "Purna" },
        { age: 7,  label: "Jr Diploma" },
        { age: 9,  label: "Sr Diploma" },
        { age: 16, label: "6th yr exam" },
      ],
      goal: { label: "Next level", age: 20 },
    },
    {
      discipline: "Karate", startAge: 5, currentAge: 17, color: "var(--accent)",
      milestones: [
        { age: 5,     pip: true, noLabel: true, dotColor: "#f5f5f0" },
        { age: 5.4,   pip: true, noLabel: true, dotColor: "#f5c518" },
        { age: 5.9,   pip: true, noLabel: true, dotColor: "#f97316" },
        { age: 6.5,   pip: true, noLabel: true, dotColor: "#22c55e" },
        { age: 7.25,  pip: true, noLabel: true, dotColor: "#3b82f6" },
        { age: 7.75,  pip: true, noLabel: true, dotColor: "#a855f7" },
        { age: 9.5,   pip: true, noLabel: true, dotColor: "#92400e" },
        { age: 10.75, pip: true, noLabel: true, dotColor: "#b06030" },
      ],
      goal: { label: "Black belt", age: 19 },
    },
    {
      discipline: "Books", startAge: 11, currentAge: 17, color: "var(--accent)",
      milestones: [
        { age: 11, label: "First draft" }, { age: 12, label: "Book I" },
        { age: 16, label: "Book II" }, { age: 17, label: "Book III — writing" },
      ],
      goal: { label: "Book III out", age: 20 },
    },
    {
      discipline: "Origami", startAge: 7, currentAge: 17, color: "var(--accent)",
      milestones: [
        { age: 7,  label: "First crane" },
        { age: 13, label: "Tessellations" },
        { age: 15, label: "5,000-unit peacock" },
        { age: 16, label: "@geometricfolds" },
      ],
      goal: { label: "Continued practice", age: 20 },
    },
    {
      discipline: "Research", startAge: 15, currentAge: 17, color: "#7c6a52",
      milestones: [
        { age: 15, label: "Paper begun" }, { age: 16, label: "Paper I done" },
        { age: 17, label: "Under review" },
      ],
      goal: { label: "Peer-reviewed pub", age: 18 },
    },
    {
      discipline: "MUN / Debate", startAge: 14, currentAge: 17, color: "#3d6b5e",
      milestones: [
        { age: 14, label: "First conf." }, { age: 15, label: "First award" },
        { age: 16, label: "Captain" }, { age: 17, label: "MUN Director" },
      ],
      goal: { label: "Continue", age: 18 },
    },
  ];

  const minAge = 3, maxAge = 20, span = maxAge - minAge;
  const toPercent = (age) => ((age - minAge) / span) * 100;

  return (
    <section id="compound">
      <div className="wrap">
        <FadeUp>
          <div className="section-head">
            <div className="section-num">01 — The Compound</div>
            <div>
              <span className="section-kicker">All Disciplines · Same Timeline</span>
              <h2 className="section-title">Five practices, <em>one pattern.</em></h2>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <p className="compound-intro">
            Each row is a different discipline at the same timeline resolution — age 3 to 20.
            The open circle is where each track is going. The pattern they share: enter at zero,
            develop slowly, then something shifts.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="pp-age-ruler">
            {[5,7,9,11,13,15,17,19].map(age => (
              <div key={age} className="pp-ruler-mark" style={{left:`${toPercent(age)}%`}}>
                <span>{age}</span>
              </div>
            ))}
            <div className="pp-ruler-now" style={{left:`${toPercent(17)}%`}}>
              <span>now</span>
            </div>
          </div>
        </FadeUp>

        <div className="pp-tracks">
          {tracks.map((track, ti) => (
            <FadeUp key={ti} delay={0.05 * ti}>
              <div className="pp-row">
                <div className="pp-label">
                  <span className="pp-discipline">{track.discipline}</span>
                </div>
                <div className="pp-track-area">
                  <div className="pp-now-line" style={{left:`${toPercent(17)}%`}} />
                  <div className="pp-line-active" style={{
                    left:`${toPercent(track.startAge)}%`,
                    width:`${toPercent(track.currentAge) - toPercent(track.startAge)}%`,
                    background: track.color,
                  }}/>
                  <div className="pp-line-goal" style={{
                    left:`${toPercent(track.currentAge)}%`,
                    width:`${toPercent(track.goal.age) - toPercent(track.currentAge)}%`,
                  }}/>
                  {track.milestones.map((m, mi) => (
                    <div key={mi} className="pp-milestone" style={{left:`${toPercent(m.age)}%`}}>
                      {m.pip
                        ? <div className="pp-belt-pip" style={{
                            background: m.dotColor,
                            outline: m.dotColor === "#f5f5f0" ? "1px solid #4A96A0" : "none",
                          }} />
                        : <div className="pp-dot" style={{background: m.dotColor || track.color}} />
                      }
                      {!m.noLabel && <div className="pp-milestone-label">{m.label}</div>}
                    </div>
                  ))}
                  <div className="pp-milestone pp-goal-dot" style={{left:`${toPercent(track.goal.age)}%`}}>
                    <div className="pp-dot-open" style={{borderColor: track.color}} />
                    <div className="pp-milestone-label pp-goal-label">{track.goal.label}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <div className="compound-pull">
            "None of these threads are actually separate — they're all the same thing,
            just speaking <em>different languages.</em>"
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- CV REQUEST MODAL ---------- */
function CVModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", institution: "", email: "", phone: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.institution.trim()) e.institution = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = "Please enter a valid email address";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^[+\d][\d\s\-()]{6,}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number";
    if (!form.reason.trim()) e.reason = "Required";
    else if (form.reason.trim().length < 10) e.reason = "A little more context, please";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const log = JSON.parse(localStorage.getItem("cvRequests") || "[]");
      log.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("cvRequests", JSON.stringify(log));
    } catch (_) {}
    setSubmitted(true);
  };

  const triggerDownload = () => {
    const blob = new Blob(
      [`Harsh Sobti — Curriculum Vitae\n\nRequested by: ${form.name} (${form.institution})\nEmail: ${form.email}\n\n[Replace this placeholder with the real CV PDF.]`],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Harsh-Sobti-CV.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onClose();
  };

  return (
    <div className="cv-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cv-card" role="dialog" aria-modal="true" aria-labelledby="cv-title">
        <button className="cv-close" onClick={onClose} aria-label="Close">×</button>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="cv-kicker">— Request CV</div>
            <h3 id="cv-title" className="cv-title">A few details before I share my CV.</h3>
            <p className="cv-sub">I keep a brief log of who's read it — partly courtesy, partly so I can follow up if it's relevant. Nothing here goes anywhere else.</p>

            <div className="cv-field">
              <label className="cv-label" htmlFor="cv-name">Full Name</label>
              <input id="cv-name" className={`cv-input ${errors.name ? "error" : ""}`} type="text" value={form.name} onChange={(e) => update("name", e.target.value)} autoFocus />
              {errors.name && <div className="cv-error-msg">{errors.name}</div>}
            </div>

            <div className="cv-field">
              <label className="cv-label" htmlFor="cv-inst">University or Company</label>
              <input id="cv-inst" className={`cv-input ${errors.institution ? "error" : ""}`} type="text" value={form.institution} onChange={(e) => update("institution", e.target.value)} />
              {errors.institution && <div className="cv-error-msg">{errors.institution}</div>}
            </div>

            <div className="cv-field">
              <label className="cv-label" htmlFor="cv-email">Email Address</label>
              <input id="cv-email" className={`cv-input ${errors.email ? "error" : ""}`} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              {errors.email && <div className="cv-error-msg">{errors.email}</div>}
            </div>

            <div className="cv-field">
              <label className="cv-label" htmlFor="cv-phone">Phone Number</label>
              <input id="cv-phone" className={`cv-input ${errors.phone ? "error" : ""}`} type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              {errors.phone && <div className="cv-error-msg">{errors.phone}</div>}
            </div>

            <div className="cv-field">
              <label className="cv-label" htmlFor="cv-reason">Reason for Download</label>
              <textarea id="cv-reason" className={`cv-textarea ${errors.reason ? "error" : ""}`} rows="3" value={form.reason} onChange={(e) => update("reason", e.target.value)} placeholder="Admissions review, mentorship, collaboration, …" />
              {errors.reason && <div className="cv-error-msg">{errors.reason}</div>}
            </div>

            <div className="cv-actions">
              <button type="button" className="cv-btn cv-btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="cv-btn cv-btn-primary">Submit & continue →</button>
            </div>
          </form>
        ) : (
          <div className="cv-success">
            <div className="check">✓</div>
            <div className="cv-kicker">— Thank you</div>
            <h3 className="cv-title">Your CV is ready, {form.name.split(" ")[0]}.</h3>
            <p className="cv-sub">I appreciate you sharing your details. The CV will download as a PDF — feel free to reach me at harshsobti2009@gmail.com with any follow-ups.</p>
            <div className="cv-actions">
              <button type="button" className="cv-btn cv-btn-ghost" onClick={onClose}>Close</button>
              <button type="button" className="cv-btn cv-btn-primary" onClick={triggerDownload}>Download CV ↓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- TWEAKS ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ocean",
  "serifChoice": "instrument",
  "density": "comfortable",
  "showAccent": true,
  "accentColor": "#5EBEC4"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement.style;
  const palettes = {
    /* ── Deep Ocean (default) ── */
    ocean: {
      ink: "#D4E4E8", paper: "#0F1F2E", navy: "#1A3344", deep: "#0F2535",
      inkSoft: "#8DA5AD", slate: "#6A8B96", hairline: "#2D5266",
      hairlineSoft: "#1E3D50", paperDeep: "#08141F",
    },
    /* ── Aurora Digitalis (dark) ── */
    aurora:  {
      ink: "#E0E6ED", paper: "#1A1640", navy: "#0047FF", deep: "#0035CC",
      inkSoft: "#A8B3C4", slate: "#6B7A96", hairline: "rgba(255,255,255,0.10)",
      hairlineSoft: "rgba(255,255,255,0.05)", paperDeep: "#120E30",
    },
    /* ── Light palettes ── */
    navy:    { ink: "oklch(0.22 0.01 255)", paper: "oklch(0.975 0.008 85)", navy: "oklch(0.28 0.06 255)", deep: "oklch(0.22 0.07 258)",
               inkSoft: "oklch(0.32 0.015 255)", slate: "oklch(0.55 0.02 255)", hairline: "oklch(0.86 0.01 255)", hairlineSoft: "oklch(0.92 0.008 255)", paperDeep: "oklch(0.945 0.012 85)" },
    forest:  { ink: "oklch(0.22 0.02 160)", paper: "oklch(0.97 0.01 110)", navy: "oklch(0.32 0.06 160)", deep: "oklch(0.22 0.06 158)",
               inkSoft: "oklch(0.34 0.02 160)", slate: "oklch(0.56 0.025 160)", hairline: "oklch(0.86 0.01 130)", hairlineSoft: "oklch(0.93 0.008 130)", paperDeep: "oklch(0.94 0.015 110)" },
    bordeaux:{ ink: "oklch(0.22 0.02 20)",  paper: "oklch(0.97 0.012 60)", navy: "oklch(0.32 0.08 20)", deep: "oklch(0.22 0.08 18)",
               inkSoft: "oklch(0.34 0.025 20)", slate: "oklch(0.55 0.03 20)", hairline: "oklch(0.87 0.01 50)", hairlineSoft: "oklch(0.93 0.008 50)", paperDeep: "oklch(0.945 0.015 60)" },
    graphite:{ ink: "oklch(0.18 0 0)",      paper: "oklch(0.96 0 0)",      navy: "oklch(0.28 0.005 250)", deep: "oklch(0.18 0.005 250)",
               inkSoft: "oklch(0.30 0 0)", slate: "oklch(0.55 0 0)", hairline: "oklch(0.86 0 0)", hairlineSoft: "oklch(0.92 0 0)", paperDeep: "oklch(0.93 0 0)" },
  };
  const p = palettes[t.palette] || palettes.ocean;
  root.setProperty("--ink", p.ink);
  root.setProperty("--ink-soft", p.inkSoft);
  root.setProperty("--slate", p.slate);
  root.setProperty("--hairline", p.hairline);
  root.setProperty("--hairline-soft", p.hairlineSoft);
  root.setProperty("--paper", p.paper);
  root.setProperty("--paper-deep", p.paperDeep);
  root.setProperty("--navy", p.navy);
  root.setProperty("--navy-deep", p.deep);

  const fonts = {
    instrument: '"Instrument Serif", Georgia, serif',
    cormorant:  '"Cormorant Garamond", Georgia, serif',
    playfair:   '"Playfair Display", Georgia, serif',
    fraunces:   '"Fraunces", Georgia, serif',
    spectral:   '"Spectral", Georgia, serif',
  };
  root.setProperty("--serif", fonts[t.serifChoice] || fonts.instrument);

  if (t.showAccent && t.accentColor) {
    root.setProperty("--accent", t.accentColor);
  } else if (!t.showAccent) {
    root.setProperty("--accent", "var(--ink)");
  }

  document.body.style.fontSize = t.density === "compact" ? "15px" : t.density === "spacious" ? "17px" : "16px";
}

function App() {
  const tweaks = useTweaks ? useTweaks(TWEAK_DEFAULTS) : null;
  const t = tweaks ? tweaks[0] : TWEAK_DEFAULTS;
  const setTweak = tweaks ? tweaks[1] : () => {};
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => { applyTweaks(t); }, [t]);

  useEffect(() => {
    const open = () => setCvOpen(true);
    window.addEventListener("openCVModal", open);
    return () => window.removeEventListener("openCVModal", open);
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <ParallelProgress />
      <About />
      <Books />
      <Creativity />
      <Academics />
      <Footer />

      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />

      {TweaksPanel && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Palette">
            <TweakRadio label="Tone" value={t.palette} onChange={(v) => setTweak("palette", v)}
              options={[
                { value: "navy", label: "Navy" },
                { value: "forest", label: "Forest" },
                { value: "bordeaux", label: "Bordeaux" },
                { value: "graphite", label: "Graphite" },
              ]} />
            <TweakToggle label="Accent color" value={t.showAccent} onChange={(v) => setTweak("showAccent", v)} />
            {t.showAccent && (
              <TweakColor label="Accent" value={t.accentColor} onChange={(v) => setTweak("accentColor", v)} />
            )}
          </TweakSection>
          <TweakSection title="Typography">
            <TweakRadio label="Serif" value={t.serifChoice} onChange={(v) => setTweak("serifChoice", v)}
              options={[
                { value: "cormorant", label: "Cormorant" },
                { value: "playfair", label: "Playfair" },
                { value: "fraunces", label: "Fraunces" },
                { value: "spectral", label: "Spectral" },
              ]} />
            <TweakRadio label="Density" value={t.density} onChange={(v) => setTweak("density", v)}
              options={[
                { value: "compact", label: "Compact" },
                { value: "comfortable", label: "Comfortable" },
                { value: "spacious", label: "Spacious" },
              ]} />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
