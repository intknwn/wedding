import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1731566971965-acfb1151fc34?w=1600&h=900&fit=crop&auto=format",
  album1: "https://images.unsplash.com/photo-1765292783362-91affd475cb7?w=800&h=1000&fit=crop&auto=format",
  album2: "https://images.unsplash.com/photo-1765292783735-9ec7213b1df1?w=800&h=600&fit=crop&auto=format",
  album3: "https://images.unsplash.com/photo-1772412933375-6136edede0b2?w=800&h=1000&fit=crop&auto=format",
  album4: "https://images.unsplash.com/photo-1765292783732-ca81c5b69e25?w=800&h=600&fit=crop&auto=format",
  album5: "https://images.unsplash.com/photo-1765292783731-f130214ca53e?w=600&h=800&fit=crop&auto=format",
  venue: "https://images.unsplash.com/photo-1666617710768-425d2d9088f8?w=1200&h=700&fit=crop&auto=format",
};

const PROGRAM = [
  { time: "16:00", label: "Guest Arrival", desc: "Welcome drinks in the garden courtyard" },
  { time: "17:00", label: "Ceremony", desc: "Exchange of vows in the Grand Hall" },
  { time: "18:00", label: "Cocktail Hour", desc: "Champagne reception on the terrace" },
  { time: "19:30", label: "Dinner", desc: "Seated dinner, four courses with wine pairing" },
  { time: "21:00", label: "First Dance", desc: "Followed by speeches and toasts" },
  { time: "22:00", label: "Dancing", desc: "Live band performance until midnight" },
  { time: "00:00", label: "Farewell", desc: "Late-night bites and safe journeys home" },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">{index}</span>
      <div className="h-px flex-1 bg-border" />
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    </div>
  );
}

export default function App() {
  const [rsvp, setRsvp] = useState({ name: "", guests: "1", attendance: "yes", meal: "", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const navLinks = [
    { href: "#story", label: "Our Story" },
    { href: "#program", label: "Program" },
    { href: "#venue", label: "Venue" },
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? "rgba(255,255,255,0.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <a href="#" className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: scrolled ? "#0a0a0a" : "#ffffff" }}>
            E & M
          </a>
          <nav className="hidden md:flex gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
                style={{ color: scrolled ? "#0a0a0a" : "#ffffff" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            className="md:hidden p-1"
            style={{ color: scrolled ? "#0a0a0a" : "#ffffff" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-6 flex flex-col gap-5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-end overflow-hidden bg-black">
        <img
          src={PHOTOS.hero}
          alt="Elena and Marcus, bride and groom portrait"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/60 uppercase mb-6">14 September 2025</p>
            <h1
              className="text-white leading-[0.95] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 400 }}
            >
              Elena<br />&amp; Marcus
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/40" />
              <p className="font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase">Château Beaumont · Bordeaux</p>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-8 right-8 md:right-12 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Scroll</span>
            <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <motion.div
                className="absolute top-0 w-full bg-white/60"
                style={{ height: "40%" }}
                animate={{ y: ["-100%", "260%"] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ALBUM */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Reveal>
          <SectionLabel index="01" label="Album" />
        </Reveal>
        <Reveal delay={0.05} className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-end">
          <h2
            className="text-foreground leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
          >
            Our Favourite<br /><em>Moments Together</em>
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Wedding photos will be added here shortly after the celebration — come back to relive the day in full. For now, enjoy a few portraits of our lovely couple as we count down to September.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Reveal delay={0.05} className="col-span-1 row-span-2">
            <div className="bg-muted h-full min-h-[320px] overflow-hidden">
              <img src={PHOTOS.album1} alt="Couple holding hands outdoors" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-muted aspect-[4/3] overflow-hidden">
              <img src={PHOTOS.album2} alt="Couple by black car with umbrella" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="bg-muted aspect-[4/3] overflow-hidden">
              <img src={PHOTOS.album4} alt="Couple posing playfully outdoors" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="col-span-1">
            <div className="bg-muted aspect-square overflow-hidden">
              <img src={PHOTOS.album3} alt="Couple by brick building" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="bg-muted aspect-square overflow-hidden">
              <img src={PHOTOS.album5} alt="Bride with decorative umbrella" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-6">
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground text-right uppercase">
            Hover to reveal colour
          </p>
        </Reveal>
      </section>

      {/* STORY */}
      <section id="story" className="py-24 md:py-32 bg-foreground text-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[11px] tracking-[0.2em] text-background/40">02</span>
              <div className="h-px flex-1 bg-background/20" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/40">Our Story</span>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            <Reveal delay={0.1}>
              <h2
                className="text-background leading-[1.05] mb-0"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 400 }}
              >
                A story written<br />
                <em>in small moments</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2} className="space-y-8">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-background/40 uppercase mb-3">2019 — First Meeting</p>
                <p className="text-background/80 leading-relaxed text-[15px]">
                  It was a rainy Tuesday at a friend's dinner party in Lyon. Marcus was late, Elena had already claimed the good chair by the fireplace. He pulled up a stool. They talked until the candles burned out and the host fell asleep.
                </p>
              </div>
              <div className="h-px bg-background/10" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-background/40 uppercase mb-3">2021 — The Move</p>
                <p className="text-background/80 leading-relaxed text-[15px]">
                  Two years of commuting between cities. Then one evening, Elena arrived at the door of Marcus's apartment in Bordeaux with two suitcases and a plant named Claude. That was that.
                </p>
              </div>
              <div className="h-px bg-background/10" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-background/40 uppercase mb-3">2025 — The Proposal</p>
                <p className="text-background/80 leading-relaxed text-[15px]">
                  On a winter morning walk through the vineyard, snow just beginning to stick, Marcus stopped and said nothing for a very long time. Then he said everything. Elena said yes before he finished the question.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="py-24 md:py-32 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Reveal>
          <SectionLabel index="03" label="Evening Program" />
        </Reveal>
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24 items-start">
          <Reveal delay={0.05}>
            <h2
              className="text-foreground leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
            >
              14 September<br />
              <em>2025</em>
            </h2>
            <p className="text-muted-foreground text-[14px] mt-4 leading-relaxed">
              All timings are indicative. Please aim to arrive ten minutes early for each event so you don't miss a thing.
            </p>
          </Reveal>
          <div className="space-y-0">
            {PROGRAM.map((item, i) => (
              <Reveal key={item.time} delay={0.05 + i * 0.06}>
                <div className="group flex gap-6 md:gap-10 py-6 border-b border-border last:border-b-0 hover:bg-muted transition-colors duration-300 px-4 -mx-4">
                  <div className="w-14 shrink-0 pt-0.5">
                    <span className="font-mono text-[13px] text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">—</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section id="venue" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <SectionLabel index="04" label="Venue" />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-16">
            <Reveal delay={0.05}>
              <h2
                className="text-foreground leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                Château Beaumont
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
                Set among the Saint-Émilion vineyards, Château Beaumont has hosted private celebrations since 1887. Its Grand Hall, vaulted cellar dining room, and garden terrace are all available exclusively to our guests for the evening.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0 pt-0.5 tracking-[0.1em] uppercase">Address</span>
                  <p className="text-[14px] text-foreground">12 Route de Beaumont, Saint-Émilion, Bordeaux 33330, France</p>
                </div>
                <div className="h-px bg-border" />
                <div className="flex gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0 pt-0.5 tracking-[0.1em] uppercase">Phone</span>
                  <a href="tel:+33556781234" className="text-[14px] text-foreground hover:opacity-50 transition-opacity">+33 5 56 78 12 34</a>
                </div>
                <div className="h-px bg-border" />
                <div className="flex gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0 pt-0.5 tracking-[0.1em] uppercase">Email</span>
                  <a href="mailto:events@chateau-beaumont.fr" className="text-[14px] text-foreground hover:opacity-50 transition-opacity">events@chateau-beaumont.fr</a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-6">Getting There</h3>
              <div className="space-y-5">
                {[
                  { mode: "By Car", text: "45 minutes from Bordeaux city centre via A10 and D670. Ample parking on-site for all guests." },
                  { mode: "By Train", text: "TGV from Bordeaux Saint-Jean to Libourne (20 min), then taxi 15 min. We recommend booking in advance." },
                  { mode: "By Shuttle", text: "We are running a complimentary shuttle from Bordeaux Grand Hôtel at 15:30. Reserve your seat on RSVP." },
                  { mode: "By Air", text: "Bordeaux–Mérignac Airport (BOD) is 55 minutes by car. Several international connections available." },
                ].map(({ mode, text }) => (
                  <div key={mode} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-foreground shrink-0 mt-2" />
                    <div>
                      <p className="text-[13px] font-medium mb-1">{mode}</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="bg-muted overflow-hidden" style={{ aspectRatio: "16/7" }}>
              <img
                src={PHOTOS.venue}
                alt="Château Beaumont banquet hall interior"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground mt-3 uppercase">Grand Hall, capacity 180 guests</p>
          </Reveal>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 md:py-32 bg-foreground text-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[11px] tracking-[0.2em] text-background/40">05</span>
              <div className="h-px flex-1 bg-background/20" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/40">RSVP</span>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <Reveal delay={0.05}>
              <h2
                className="text-background leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                Will you join<br />
                <em>our celebration?</em>
              </h2>
              <p className="text-background/60 text-[15px] leading-relaxed mb-4">
                Please confirm your attendance by <strong className="text-background font-medium">1st August 2025</strong> so we can finalize seating and catering.
              </p>
              <p className="text-background/60 text-[14px] leading-relaxed">
                If you have any dietary requirements, allergies, or special needs beyond what the form captures, please email us directly at{" "}
                <a href="mailto:wedding@elena-marcus.fr" className="text-background underline underline-offset-4 decoration-background/30 hover:decoration-background transition-colors">
                  wedding@elena-marcus.fr
                </a>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              {submitted ? (
                <div className="border border-background/20 p-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 border border-background/30 flex items-center justify-center mb-6">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8.5 14.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3
                    className="text-background text-2xl mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    Thank you
                  </h3>
                  <p className="text-background/60 text-[14px] leading-relaxed">
                    Your response has been received. We look forward to celebrating with you in September.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={rsvp.name}
                      onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                      placeholder="Elena Rossi"
                      className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] placeholder-background/20 focus:outline-none focus:border-background/60 transition-colors"
                    />
                  </div>
                  {/* Attendance */}
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Attendance</label>
                    <div className="flex gap-6">
                      {[{ value: "yes", label: "Joyfully accept" }, { value: "no", label: "Regretfully decline" }].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                          <div
                            className="w-4 h-4 border border-background/30 flex items-center justify-center shrink-0 transition-colors"
                            style={{ background: rsvp.attendance === opt.value ? "white" : "transparent" }}
                            onClick={() => setRsvp({ ...rsvp, attendance: opt.value })}
                          >
                            {rsvp.attendance === opt.value && (
                              <div className="w-2 h-2 bg-foreground" />
                            )}
                          </div>
                          <span
                            className="text-[14px] cursor-pointer select-none transition-colors"
                            style={{ color: rsvp.attendance === opt.value ? "white" : "rgba(255,255,255,0.5)" }}
                            onClick={() => setRsvp({ ...rsvp, attendance: opt.value })}
                          >
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {rsvp.attendance === "yes" && (
                    <>
                      {/* Guests */}
                      <div className="space-y-2">
                        <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Number of Guests</label>
                        <select
                          value={rsvp.guests}
                          onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}
                          className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] focus:outline-none focus:border-background/60 transition-colors appearance-none cursor-pointer"
                        >
                          {["1", "2", "3", "4"].map(n => <option key={n} value={n} className="bg-black">{n} {n === "1" ? "person" : "people"}</option>)}
                        </select>
                      </div>
                      {/* Meal */}
                      <div className="space-y-2">
                        <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Meal Preference</label>
                        <div className="flex flex-wrap gap-4">
                          {["Standard", "Vegetarian", "Vegan", "Gluten-free"].map((m) => (
                            <label key={m} className="flex items-center gap-2.5 cursor-pointer">
                              <div
                                className="w-4 h-4 border border-background/30 flex items-center justify-center shrink-0 transition-colors"
                                style={{ background: rsvp.meal === m ? "white" : "transparent" }}
                                onClick={() => setRsvp({ ...rsvp, meal: m })}
                              >
                                {rsvp.meal === m && <div className="w-2 h-2 bg-foreground" />}
                              </div>
                              <span
                                className="text-[14px] cursor-pointer select-none"
                                style={{ color: rsvp.meal === m ? "white" : "rgba(255,255,255,0.5)" }}
                                onClick={() => setRsvp({ ...rsvp, meal: m })}
                              >
                                {m}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Shuttle */}
                      <div className="space-y-2">
                        <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Shuttle Service</label>
                        <div className="flex gap-6">
                          {[{ value: "shuttle-yes", label: "Yes, I need a shuttle" }, { value: "shuttle-no", label: "I have transport" }].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                              <div
                                className="w-4 h-4 border border-background/30 flex items-center justify-center shrink-0 transition-colors"
                                style={{ background: rsvp.note === opt.value ? "white" : "transparent" }}
                                onClick={() => setRsvp({ ...rsvp, note: opt.value })}
                              >
                                {rsvp.note === opt.value && <div className="w-2 h-2 bg-foreground" />}
                              </div>
                              <span
                                className="text-[13px] cursor-pointer select-none"
                                style={{ color: rsvp.note === opt.value ? "white" : "rgba(255,255,255,0.5)" }}
                                onClick={() => setRsvp({ ...rsvp, note: opt.value })}
                              >
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {/* Note */}
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Note (optional)</label>
                    <textarea
                      rows={3}
                      value={rsvp.attendance === "yes" ? undefined : rsvp.note}
                      onChange={e => setRsvp({ ...rsvp, note: e.target.value })}
                      placeholder="Allergies, accessibility needs, or a kind word..."
                      className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] placeholder-background/20 focus:outline-none focus:border-background/60 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full border border-background/30 py-4 font-mono text-[11px] tracking-[0.25em] uppercase text-background hover:bg-background hover:text-foreground transition-colors duration-300"
                  >
                    Send Response
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className="text-foreground text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            E &amp; M
          </span>
          <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground text-center">
            14 · 09 · 2025 &nbsp;·&nbsp; Château Beaumont, Bordeaux
          </p>
          <p className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
            With love
          </p>
        </div>
      </footer>
    </div>
  );
}
