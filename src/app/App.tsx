import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useQueryState } from 'nuqs'

type FormStatus = 'idle' | 'sending' | 'submitted' | 'error'

const ALBUM_PHOTOS = [...Array(9)].map(((_, index) => ({src: `/gallery/image-${index + 1}.jpg`, alt: ''})))

function Lightbox({ index, onClose, onPrev, onNext }: { index: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const photo = ALBUM_PHOTOS[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-11 flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
        aria-label="Close gallery"
      >
        <span>Закрыть</span>
        <div className="relative w-5 h-5">
          <span className="absolute inset-0 flex items-center justify-center rotate-45 text-lg leading-none">+</span>
        </div>
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-10 font-mono text-[11px] tracking-[0.2em] text-white/40">
        {String(index + 1).padStart(2, "0")} / {String(ALBUM_PHOTOS.length).padStart(2, "0")}
      </div>

      {/* Image */}
      <motion.div
        key={index}
        className="relative z-10 flex items-center justify-center px-16 md:px-24 w-full h-full"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[85vh] max-w-full object-contain select-none"
          draggable={false}
        />
      </motion.div>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-4 md:left-8 z-10 w-10 h-10 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors"
        aria-label="Previous photo"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-4 md:right-8 z-10 w-10 h-10 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors"
        aria-label="Next photo"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {ALBUM_PHOTOS.map((p, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            className="transition-all duration-300 overflow-hidden"
            style={{ width: i === index ? 48 : 32, height: 32, opacity: i === index ? 1 : 0.4, border: i === index ? "1px solid rgba(255,255,255,0.6)" : "1px solid transparent" }}
            aria-label={`Go to photo ${i + 1}`}
          >
            <img src={p.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const PHOTOS = {
  hero: "/hero-bg.jpg",
  venue: "/venue.webp",
  guests: '/guests.jpg'
};

const PROGRAM = [
  { time: "20:00", label: "Сбор гостей", desc: "В холе Дворца бракосочетания" },
  { time: "20:30", label: "Фуршет", desc: "В банкетном зале" },
  { time: "22:30", label: "Регистрация брака", desc: "Торжественная регистрация брака" },
];

const DEFAULT_RSVP_VALUES = { name: "", guests: "1", attendance: "yes", note: "" }

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
      data-delay={delay}
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

function StatusResponse({status, countdown}: {status: FormStatus, countdown?: number}) {
  let title
  let description

  if (status === 'submitted') {
    title = 'Спасибо!'
    description = 'Спасибо за ответ! Ждём вас в сентябре, чтобы вместе создать самые тёплые воспоминания.!'
  }

  if (status === 'error') {
    title = 'Упс!'
    description = 'Что-то пошло не так... Попробуйте еще раз, или свяжитесь с нами доступным Вам способом.'
  }


  return (
    <div className="border border-background/20 p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 border border-background/30 flex items-center justify-center mb-6">
        {status === 'submitted' && <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10L8.5 14.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>}
        {status === 'error' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>}
      </div>
      <h3
        className="text-background text-2xl mb-3"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
      >
        {title}
      </h3>
      <p className="text-background/60 text-[14px] leading-relaxed">
        {description}

      </p>
      {status === 'error' && <p className="text-background/60 mt-6 text-[14px] leading-relaxed">
        Попробовать еще через {countdown}...
      </p>}
    </div>
  )
}

export default function App() {
  const [name] = useQueryState('name')
  const [rsvp, setRsvp] = useState({...DEFAULT_RSVP_VALUES, name});
  const [status, setStatus] = useState < 'idle' | 'sending' | 'submitted' | 'error'>('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(5)

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + ALBUM_PHOTOS.length) % ALBUM_PHOTOS.length : null), []);
  const nextPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % ALBUM_PHOTOS.length : null), []);
  const attendanceTitle = name ? `${name}, посетите` : ''

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    let intervalId: number

    if (status === 'error') {
      intervalId = setInterval(() => {
        if (countdown === 1) {
          clearInterval(intervalId)
          setStatus('idle')
          setCountdown(5)
        } else {
          setCountdown(prev => prev - 1)
        }
      }, 1000);
    }

    return () => clearInterval(intervalId)
  }, [status, countdown])

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatus('submitted')

    try {
      const response = await fetch('https://wedding-site.wedding-site.workers.dev/api/forms/wedding-site/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvp)
      })

      if (response.ok) {
        setStatus('submitted')
        setRsvp(DEFAULT_RSVP_VALUES)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  };

  const navLinks = [
    { href: "#story", label: "История" },
    { href: "#program", label: "Программа" },
    { href: "#venue", label: "Место" },
    { href: "#info", label: "Гостям" },
    { href: "#rsvp", label: "Подтверждение" },
    { href: "#album", label: "Альбом" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {lightboxIndex !== null && (
        <Lightbox index={lightboxIndex} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />
      )}
      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? "rgba(255,255,255,0.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <a href="#" className="items-center font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: scrolled ? "#0a0a0a" : "#ffffff" }}>
            Д <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 400 }}>&amp;</span> E
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
          alt="Дмитрий и Екатерина"
          className="absolute w-[200%] top-[-65%] md:w-[150%] lg:inset-0 lg:size-full max-w-none object-cover lg:object-[50%_83%] opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/60 uppercase mb-6">16 Сентября 2026</p>
            <h1
              className="relative text-white leading-[0.95] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 400 }}
            >
              Дмитрий <span className=" top-1/2 -translate-x-[120%] -translate-y-1/2">&amp;</span> Екатерина
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/40" />
              <p className="font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase">Дворец бракосочетания № 2 · Санкт-Петербург</p>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="hidden md:block absolute bottom-8 right-8 md:right-12 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Скролл вниз</span>
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

      {/* STORY */}
      <section id="story" className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <SectionLabel index="01" label="История" />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            <Reveal delay={0.1}>
              <h2
                className="text-foreground leading-[1.1]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                Наша<br />
                <em>история</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2} className="space-y-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase mb-3">2023 - Встреча</p>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  Все началось в конце мая со случайной встречи... в очереди за шавермой в Севкабеле. Шутка Мити превратилась в разговор, разговор - в долгую прогулку, а затем - в свидание.
                </p>
              </div>
              <div className="h-px bg-background/10" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase mb-3">2024–2025 - Вместе</p>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  Мы показывали друг другу свои миры и постепенно находили то, что становилось общим. Две зимовки на Бали, летний Петербург, Карелия, новые хобби и общие традиции.
                </p>
              </div>
              <div className="h-px bg-background/10" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase mb-3">2026 - Семья</p>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  В начале года Митя сделал предложение - романтично, уютно и очень по-нашему. Впереди появились планы на новую главу нашей жизни.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <SectionLabel index="02" label="Программа" />
          </Reveal>
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 md:gap-24 items-start">
            <Reveal delay={0.05}>
              <h2
                className="text-foreground leading-[1.1]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                16 Сентября<br />
                <em>2026</em>
              </h2>
              <p className="text-muted-foreground text-[14px] mt-4 leading-relaxed">
                Пожалуйста, приходите за десять минут до начала указанного времени, чтобы ничего не пропустить
              </p>
            </Reveal>
            <div className="space-y-0">
              {PROGRAM.map((item, i) => (
                <Reveal key={item.time} className="border-b border-border last:border-b-0" delay={0.05 + i * 0.06}>
                  <div className="group flex gap-6 md:gap-10 py-6 transition-colors duration-300 px-4 -mx-4">
                    <div className="w-14 shrink-0 pt-0.5">
                      <span className="font-mono text-[13px] text-muted-foreground">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section id="venue" className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <SectionLabel index="03" label="Место" />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-16">
            <Reveal delay={0.05}>
              <h2
                className="text-foreground leading-[1.05] tracking-tight letter mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                Дворец <br/> <em>бракосочетания №2</em>
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
                C 1963 года соединяет судьбы влюблённых в самом сердце Петербурга на Фурштатской улице. Дворец расположен в особняке Варгуниных — памятнике архитектуры федерального значения, построенном в 1899 году.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground w-30 shrink-0 pt-0.5 tracking-[0.1em] uppercase">Адрес</span>
                  <p className="text-[14px] text-foreground">Фурштатская ул., 52, Санкт-Петербург, Россия, 191194</p>
                </div>
                <div className="h-px bg-border" />
                <div className="flex gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground w-30 shrink-0 pt-0.5 tracking-[0.1em] uppercase">Точка на&nbsp;карте</span>
                  <a href="https://yandex.ru/maps/-/CTB9Z6~E" className="text-[14px] text-foreground hover:opacity-50 transition-opacity" target="_blank" rel="noopener noreferrer">59.945391, 30.364871</a>
                </div>
                <div className="h-px bg-border" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-muted overflow-hidden aspect-[3/2]">
                <img
                  src={PHOTOS.venue}
                  alt="Дворец бракосочетания №2"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground mt-3 uppercase">Дворец бракосочетания №2</p>
            </Reveal>
          </div>

        </div>
      </section>

      {/* GUEST INFO */}
      <section id="info" className="py-24 md:py-32 bg-secondary">
        <div className="px-6 md:px-12 max-w-[1200px] mx-auto">
          <Reveal>
            <SectionLabel index="04" label="Гостям" />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-2 lg:gap-1">
            {/* Dress Code */}
            <Reveal delay={0.05}>
              <div className="flex flex-col border border-border p-6 lg:p-10 md:p-14 h-full">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-8">Дресс-код</p>
                <h3
                  className="text-foreground leading-[1.05] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400 }}
                >
                  Галстук –<br /><em>по желанию</em>
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
                  Специального дресс-кода у нас нет – приходите в том, в чем будете чувствовать себя комфортно. Если решите добавить своему образу праздника – отлично!
                </p>
                <img src={PHOTOS.guests} className="aspect-[4/3] my-auto"/>
              </div>
            </Reveal>

            {/* Presents */}
            <Reveal delay={0.1}>
              <div className="border border-border border-t-0 lg:border-t-1 lg:border-l-0 p-6 lg:p-10 md:p-14 h-full">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-8">Подарки</p>
                <h3
                  className="text-foreground leading-[1.05] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400 }}
                >
                  Ваше внимание –<br /><em>наш подарок</em>
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
                  Если захочется прийти с чем-то праздничным в руках, доверьтесь своему вкусу.
                  Несколько идей того, что нас точно порадует:
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Наборы полезных сладостей", desc: "Конфеты из сухофруктов и орехов, пастила" },
                    { label: "Кофе", desc: "В зернах, 100% арабика" },
                    { label: "Чай", desc: "бергамот, чабрец, молочный улун и другие классические вкусы" },
                    { label: "Вино", desc: "белое сухое вино (в том числе безалкогольное)" },
                    { label: "Мелочи для уюта", desc: "свечи и ароматы для дома" },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex gap-4 pt-4 border-t border-border">
                      <div className="w-2 h-2 rounded-full bg-foreground shrink-0 mt-1.5" />
                      <div>
                        <p className="text-[13px] font-medium mb-1">{label}</p>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 md:py-32 bg-foreground text-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <SectionLabel index="05" label="Подтверждение" />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <Reveal delay={0.05}>
              <h2
                className="text-background leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
              >
                {name ? `${name},` : null}
                {name ? <br /> : null}
                {name ? 'посетите' : 'Посетите'}&nbsp;ли&nbsp;Вы<br /><em>наше торжество?</em>
              </h2>
              <p className="text-background/60 text-[15px] leading-relaxed mb-4">
                Пожалуйста, дайте нам знать до <strong className="text-background font-medium">1 Августа 2026</strong> чтобы мы успели подготовить все необходимое для праздника
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              {status === 'error' || status === 'submitted' ? (
                <StatusResponse status={status} countdown={countdown}/>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Ваше имя</label>
                      <input
                      type="text"
                      required
                      value={rsvp.name ?? ''}
                      readOnly={!!rsvp.name}
                      onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                      placeholder="Укажите имя"
                      className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] placeholder-background/20 focus:outline-none focus:border-background/60 transition-colors"
                    />
                  </div>
                  {/* Attendance */}
                  <div className="space-y-3">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Приглашение</label>
                    <div className="flex flex-col gap-2">
                      {[{ value: "yes", label: "С радостью принимаю" }, { value: "no", label: "С сожалением отказываюсь" }].map((opt) => (
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
                        <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Кол-во гостей</label>
                        <select
                          value={rsvp.guests}
                          onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}
                          className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] focus:outline-none focus:border-background/60 transition-colors appearance-none cursor-pointer"
                        >
                          {["1", "2"].map(n => <option key={n} value={n} className="bg-black">{n} {n === "1" ? "человек" : "человека"}</option>)}
                        </select>
                        <p className="text-[15px] text-background/20">Если вы будете в паре, укажите имя спутника в графе ниже</p>
                      </div>
                    </>
                  )}
                  {/* Note */}
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/50 block">Примечание (опционально)</label>
                    <textarea
                      rows={3}
                      value={rsvp.attendance === "yes" ? undefined : rsvp.note}
                      onChange={e => setRsvp({ ...rsvp, note: e.target.value })}
                      placeholder="Пищевые аллергии, прочие потребности, или теплые слова..."
                      className="w-full bg-transparent border-b border-background/20 pb-3 text-background text-[15px] placeholder-background/20 focus:outline-none focus:border-background/60 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full border border-background/30 py-4 font-mono text-[11px] tracking-[0.25em] uppercase text-background hover:bg-background hover:text-foreground transition-colors duration-300"
                  >
                    Отправить
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ALBUM */}
      <section id="album" className="py-24 md:py-32 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Reveal>
          <SectionLabel index="06" label="Альбом" />
        </Reveal>
        <Reveal delay={0.05} className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-end">
          <h2
            className="text-foreground leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
          >
            Наши любимые<br /><em>моменты вместе</em>
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            После свадьбы здесь появятся новые воспоминания - загляните сюда снова, чтобы посмотреть фотографии с нашего дня.
          </p>
        </Reveal>
        <div className="md:columns-3 gap-3 md:gap-4">
          {new Array(9).fill(null).map((_, index) => <Reveal delay={index - (index * 0.95)} className="mb-4">
            <button onClick={() => openLightbox(index)} className="group block bg-muted h-full min-h-[320px] overflow-hidden w-full relative cursor-zoom-in">
              <img src={`/gallery/image-${index + 1}.jpg`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>
          </Reveal>)}
        </div>
        <Reveal delay={0.1} className="mt-6">
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground text-right uppercase">
            Полноэкранный режим по клику
          </p>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className="text-foreground text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Д &amp; E
          </span>
          <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground text-center">
            16 · 09 · 2026 &nbsp;·&nbsp; Дворец бракосочетания №2, Санкт-Петербург
          </p>
          <p className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
            C любовью <span className="inline-block align-middle text-[16px]">&#x2661;</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
