import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { Nav } from "@/components/aryan/Nav";
import { useBooking } from "@/context/BookingContext";
import { Cursor } from "@/components/aryan/Cursor";
import { SmoothScroll } from "@/components/aryan/SmoothScroll";
import roomSingleImg from "@/assets/room-single.jpg";
import studyRoomImg from "@/assets/study-room.jpg";
import hallwayImg from "@/assets/hallway.jpg";
import rooftopImg from "@/assets/rooftop.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ─── Icons ───────────────────────────────────────────────── */
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-maroon flex-shrink-0 mt-[2px]">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─── Data ────────────────────────────────────────────────── */
const rooms = [
  {
    id: "01", tag: "Shared", name: "Twin Sharing",
    tagline: "Smart. Social. Affordable.",
    price: "₹9,500", priceNote: "/ month",
    capacity: "2 Students", image: hallwayImg, dark: false,
    amenities: ["Orthopaedic beds","Dedicated study desk","Attached bathroom","Daily housekeeping","Three meals daily","High-speed Wi-Fi"],
  },
  {
    id: "02", tag: "Private", name: "Single AC",
    tagline: "Focus. Comfort. Excellence.",
    price: "₹16,500", priceNote: "/ month",
    capacity: "1 Student", image: roomSingleImg, dark: true, featured: true,
    amenities: ["1.5-ton split AC","Ergonomic desk + lamp","Bathroom with geyser","Linen change weekly","Three meals daily","Priority Wi-Fi"],
  },
  {
    id: "03", tag: "Suite", name: "Premium Suite",
    tagline: "Luxury. Privacy. Prestige.",
    price: "₹22,000", priceNote: "/ month",
    capacity: "1 Student", image: studyRoomImg, dark: false,
    amenities: ["Private balcony + AC","Mini fridge + lounge","Premium bath + geyser","Priority laundry","Meals + evening snacks","Dedicated Wi-Fi router"],
  },
];

const perks = [
  { label: "3 Meals Daily", sub: "Breakfast, lunch & dinner" },
  { label: "24/7 Security", sub: "CCTV + on-site staff" },
  { label: "High-Speed Wi-Fi", sub: "Dedicated per floor" },
  { label: "Housekeeping", sub: "Every single day" },
];

/* ─── Text Split Utilities ─────────────────────────────────── */
function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  el.style.overflow = "visible";
  return text.trim().split(/\s+/).map((word) => {
    const outer = document.createElement("span");
    outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.28em;";
    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;will-change:transform;";
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  return text.trim().split("").map((ch) => {
    const outer = document.createElement("span");
    outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom;";
    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;will-change:transform;";
    inner.textContent = ch === " " ? "\u00A0" : ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

/* ─── Page ────────────────────────────────────────────────── */
const RoomsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Hero panel + image ── */
      gsap.from(".hero-dark-panel", { x: -80, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.1 });
      gsap.fromTo(".hero-img", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out", delay: 0.2 });

      /* ── Hero eyebrow — char cascade ── */
      const eyebrowEl = document.querySelector<HTMLElement>(".hero-eyebrow");
      if (eyebrowEl) {
        const chars = splitChars(eyebrowEl);
        gsap.from(chars, { yPercent: 110, opacity: 0, stagger: 0.022, duration: 0.65, ease: "power3.out", delay: 0.5 });
      }

      /* ── Hero title — word clip reveal ── */
      document.querySelectorAll<HTMLElement>(".hero-title-word").forEach((el, i) => {
        const words = splitWords(el);
        gsap.from(words, { yPercent: 105, duration: 1.1, ease: "expo.out", delay: 0.6 + i * 0.12, stagger: 0.06 });
      });

      /* ── Hero sub-items ── */
      gsap.from(".h-fade", { opacity: 0, y: 22, stagger: 0.12, duration: 1, ease: "power3.out", delay: 1.1 });

      /* ── Stats count-up ── */
      document.querySelectorAll<HTMLElement>(".count-up").forEach((el) => {
        const target = parseInt(el.dataset.target ?? "0", 10);
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: target, duration: 1.8, ease: "power2.out", snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.from(".stat-label", {
        opacity: 0, y: 12, stagger: 0.08, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".stats-bar", start: "top 88%", once: true },
      });

      /* ── Scroll word reveals (h2 headings) ── */
      document.querySelectorAll<HTMLElement>(".scroll-word-reveal").forEach((el) => {
        const words = splitWords(el);
        gsap.from(words, {
          yPercent: 110, stagger: 0.05, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      /* ── Scroll char reveals (eyebrows / labels) ── */
      document.querySelectorAll<HTMLElement>(".scroll-char-reveal").forEach((el) => {
        const chars = splitChars(el);
        gsap.from(chars, {
          yPercent: 110, opacity: 0, stagger: 0.018, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ── Scroll body-text word reveals ── */
      document.querySelectorAll<HTMLElement>(".scroll-words-body").forEach((el) => {
        const words = splitWords(el);
        gsap.from(words, {
          y: 18, opacity: 0, stagger: 0.028, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 91%", once: true },
        });
      });

      /* ── Bento cards ── */
      gsap.from(".bento-card", {
        y: 80, opacity: 0, stagger: 0.15, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".bento-wrap", start: "top 82%", once: true },
      });

      /* ── Perks ── */
      gsap.from(".perk-item", {
        y: 48, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".perks-row", start: "top 85%", once: true },
      });

      /* ── Horizontal divider lines ── */
      gsap.from(".line-reveal", {
        scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".line-reveal", start: "top 92%", once: true },
      });

    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-background text-foreground min-h-screen grain">
      <SmoothScroll />
      <Cursor />
      <Nav />

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO: dark split + full-bleed image
          Reference: top panel of the design mockup
      ═══════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] max-h-[900px] flex overflow-hidden">

        {/* Left: dark editorial panel */}
        <div className="hero-dark-panel relative z-10 flex flex-col justify-between w-full md:w-[42%] lg:w-[36%] bg-[#13141a] text-ivory px-8 md:px-12 lg:px-16 pt-32 pb-10">

          {/* Eyebrow — char-cascade on load */}
          <div>
            <div className="overflow-hidden mb-6">
              <p className="hero-eyebrow eyebrow text-white/40 text-[0.65rem]">(04) — ACCOMMODATIONS</p>
            </div>

            {/* Big title — word clip reveal */}
            <h1 className="hero-title-word font-display text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-tight mb-1">Rooms</h1>
            <h1 className="hero-title-word font-display text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-tight text-maroon italic">&amp; Suites</h1>

            {/* Subtitle — word-by-word fade */}
            <div className="mt-8 h-fade">
              <p className="text-white/55 text-sm leading-relaxed max-w-[280px]">
                Three curated tiers designed for students who demand focus, comfort, and absolute value.
              </p>
            </div>

            {/* Price start callout */}
            <div className="mt-10 h-fade flex items-baseline gap-2">
              <span className="font-display text-4xl text-ivory">₹9,500</span>
              <span className="text-white/40 text-xs tracking-widest">STARTING / MONTH</span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="h-fade flex flex-col gap-4">
            <button 
              onClick={() => openBooking()}
              className="group inline-flex items-center gap-4 bg-maroon text-ivory px-7 py-4 rounded-full text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-ivory hover:text-[#13141a] self-start"
            >
              Explore Rooms <span className="transition-transform group-hover:translate-x-1"><ArrowRight size={16} /></span>
            </button>
            <Link to="/"
              className="text-white/35 text-[0.65rem] tracking-widest uppercase hover:text-white/70 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Right: full-bleed hero image */}
        <div className="absolute inset-0 md:left-[42%] lg:left-[36%]">
          <img src={rooftopImg} alt="Aryan Heights"
            className="hero-img w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#13141a] via-transparent to-transparent md:from-[#13141a]/60 md:via-transparent" />
          <div className="absolute bottom-8 right-8">
            <span className="eyebrow text-[0.6rem] px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20">Aryan Heights · Kota</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — STATS BAR
      ═══════════════════════════════════════════════════ */}
      <div className="stats-bar border-b border-hairline bg-surface">
        <div className="max-w-[1700px] mx-auto px-8 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-hairline">
          {[
            { val: 3,  suffix: "",            label: "Room Tiers" },
            { val: 14, suffix: "+",           label: "Years Operating" },
            { val: 500, suffix: "+",          label: "Students Housed" },
            { val: 0,  suffix: " Hidden Fees",label: "Guaranteed" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 first:pl-0 last:pr-0 py-2">
              <div className="font-display text-3xl md:text-4xl tracking-tighter leading-none">
                <span className="count-up" data-target={s.val}>{s.val}</span>
                <span>{s.suffix}</span>
              </div>
              <div className="stat-label eyebrow text-foreground/45 text-[0.6rem] mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — BENTO ROOM GRID
          Reference: middle bento section of design mockup
      ═══════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1700px] mx-auto px-5 md:px-12">

          {/* Section header */}
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              {/* Eyebrow — char cascade on scroll */}
              <p className="scroll-char-reveal eyebrow text-foreground/45 text-[0.65rem] mb-3">Select Your Tier</p>
              {/* Heading — word clip reveal on scroll */}
              <h2 className="font-display text-3xl md:text-5xl tracking-tighter leading-tight">
                <span className="scroll-word-reveal block">Every room,</span>
                <span className="scroll-word-reveal block text-maroon italic">thoughtfully built.</span>
              </h2>
            </div>
            {/* Body paragraph — word-by-word on scroll */}
            <p className="scroll-words-body hidden md:block text-foreground/50 text-sm leading-relaxed max-w-[260px] text-right">
              All prices are all-inclusive. No extra charges for electricity, meals, or housekeeping.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="bento-wrap grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 auto-rows-auto">

            {/* ── Room 01: Twin Sharing — Wide horizontal card ── */}
            <article id="room-01" className="bento-card md:col-span-7 group flex flex-col md:flex-row overflow-hidden rounded-[1.5rem] border border-hairline bg-surface" style={{minHeight:'220px'}}>
              <div className="relative overflow-hidden md:w-[52%] h-40 md:h-[260px]">
                <img src={hallwayImg} alt="Twin Sharing" loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
                <span className="absolute top-3 left-3 eyebrow text-[0.55rem] px-2.5 py-1 bg-background/80 backdrop-blur-sm text-foreground/80 rounded-full border border-hairline">SHARED / 01</span>
              </div>
              <div className="md:w-[48%] p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <h3 className="scroll-word-reveal font-display text-2xl md:text-3xl tracking-tight mb-1">Twin Sharing</h3>
                  <p className="scroll-words-body text-foreground/50 text-xs mb-4">Smart. Social. Affordable.</p>
                  <ul className="space-y-2">
                    {["Orthopaedic beds", "Study desk per student", "Attached bathroom", "Three meals daily"].map(a => (
                      <li key={a} className="flex items-start gap-2 text-xs text-foreground/70"><Check />{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-hairline flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl tracking-tighter">₹9,500</div>
                    <div className="eyebrow text-foreground/40 text-[0.55rem] mt-0.5">per month</div>
                  </div>
                  <button 
                    onClick={() => openBooking("twin")}
                    className="group/btn inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full text-[0.65rem] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-maroon hover:text-ivory"
                  >
                    Reserve <span className="transition-transform group-hover/btn:translate-x-1"><ArrowRight size={12} /></span>
                  </button>
                </div>
              </div>
            </article>

            {/* ── Room 02: Single AC — Tall dark card ── */}
            <article id="room-02"
              className="bento-card md:col-span-5 group relative overflow-hidden rounded-[1.5rem] bg-[#13141a] text-ivory flex flex-col"
              style={{ minHeight: "220px", boxShadow: "0 20px 60px -15px rgba(128,0,32,0.25)" }}>

              {/* Image fills top */}
              <div className="relative h-36 overflow-hidden flex-shrink-0">
                <img src={roomSingleImg} alt="Single AC" loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#13141a]" />
                <div className="absolute top-3 left-3">
                  <span className="eyebrow text-[0.55rem] px-2.5 py-1 bg-maroon text-ivory rounded-full tracking-widest">Most Picked</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="eyebrow text-[0.55rem] text-white/50">PRIVATE / 02</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="scroll-word-reveal font-display text-2xl md:text-3xl tracking-tight mb-1">Single AC</h3>
                  <p className="scroll-words-body text-white/50 text-xs mb-3">Focus. Comfort. Excellence.</p>
                  <ul className="space-y-2">
                    {["1.5-ton split AC", "Ergonomic desk + lamp", "Bathroom with geyser", "Priority Wi-Fi"].map(a => (
                      <li key={a} className="flex items-start gap-2 text-xs text-white/70">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-maroon flex-shrink-0 mt-[2px]"><polyline points="20 6 9 17 4 12" /></svg>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl tracking-tighter">₹16,500</div>
                    <div className="eyebrow text-white/35 text-[0.55rem] mt-0.5">per month</div>
                  </div>
                  <button 
                    onClick={() => openBooking("single")}
                    className="group/btn inline-flex items-center gap-2 bg-ivory text-[#13141a] px-4 py-2.5 rounded-full text-[0.65rem] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-maroon hover:text-ivory"
                  >
                    Reserve <span className="transition-transform group-hover/btn:translate-x-1"><ArrowRight size={12} /></span>
                  </button>
                </div>
              </div>
            </article>

            {/* ── Room 03: Premium Suite — 3-column wide, image-dominant ── */}
            <article id="room-03"
              className="bento-card md:col-span-12 group relative overflow-hidden rounded-[1.5rem] border border-hairline bg-surface flex flex-col lg:flex-row"
              style={{ minHeight: "220px" }}>

              {/* Large image — fixed height on all breakpoints */}
              <div className="relative overflow-hidden lg:w-[48%] h-48 lg:h-[260px]">
                <img src={studyRoomImg} alt="Premium Suite" loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/10" />
                <span className="absolute top-3 left-3 eyebrow text-[0.55rem] px-2.5 py-1 bg-background/80 backdrop-blur-sm text-foreground/80 rounded-full border border-hairline">SUITE / 03</span>
              </div>

              {/* Content — right side */}
              <div className="lg:w-[52%] p-5 md:p-6 lg:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="scroll-char-reveal eyebrow text-maroon text-[0.58rem] border border-maroon/40 px-2.5 py-1 rounded-full">5-Star Experience</span>
                    <h3 className="scroll-word-reveal font-display text-2xl md:text-3xl tracking-tight mt-3 leading-tight">Premium Suite</h3>
                    <p className="scroll-words-body text-foreground/50 text-xs mt-1">Luxury. Privacy. Prestige.</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border border-maroon/30 flex flex-col items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-maroon mb-0.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="font-display text-[0.6rem] text-maroon">5★</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                  {["Private balcony + AC", "Mini fridge + lounge", "Premium bath + geyser", "Priority laundry", "Meals + evening snacks", "Dedicated router"].map(a => (
                    <div key={a} className="flex items-start gap-2 text-xs text-foreground/70"><Check />{a}</div>
                  ))}
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl tracking-tighter">₹22,000</div>
                    <div className="eyebrow text-foreground/40 text-[0.55rem] mt-0.5">per month · all inclusive</div>
                  </div>
                  <button 
                    onClick={() => openBooking("suite")}
                    className="group/btn inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full text-[0.65rem] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-maroon hover:text-ivory"
                  >
                    Reserve <span className="transition-transform group-hover/btn:translate-x-1"><ArrowRight size={12} /></span>
                  </button>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — PERKS STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="border-t border-hairline py-14 md:py-20">
        <div className="max-w-[1700px] mx-auto px-5 md:px-12">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div>
              {/* Eyebrow — char cascade */}
              <p className="scroll-char-reveal eyebrow text-foreground/45 text-[0.65rem] mb-3">What's always included</p>
              {/* Heading — word clip reveal */}
              <h2 className="font-display text-3xl md:text-5xl tracking-tighter">
                <span className="scroll-word-reveal block">Everything.</span>
                <span className="scroll-word-reveal block text-maroon italic">Included.</span>
              </h2>
            </div>
          </div>

          {/* Perks grid */}
          <div className="perks-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "3 Meals Daily",       sub: "Breakfast, lunch & dinner served fresh every day.", icon: "🍽️" },
              { label: "24/7 Security",        sub: "CCTV coverage and on-site warden staff round the clock.", icon: "🔒" },
              { label: "High-Speed Wi-Fi",     sub: "Dedicated connection per floor. No throttling.", icon: "📡" },
              { label: "Daily Housekeeping",   sub: "Professional cleaning service every single day.", icon: "✨" },
            ].map((p) => (
              <div key={p.label} className="perk-item group p-8 rounded-[1.5rem] border border-hairline bg-surface hover:border-maroon/40 transition-colors duration-500">
                <span className="text-4xl mb-6 block">{p.icon}</span>
                {/* Perk title — word clip reveal per card */}
                <h4 className="scroll-word-reveal font-display text-xl tracking-tight mb-3">{p.label}</h4>
                {/* Perk body — word-by-word */}
                <p className="scroll-words-body text-foreground/50 text-sm leading-relaxed">{p.sub}</p>
              </div>
            ))}
          </div>

          {/* Divider line — width reveal */}
          <div className="line-reveal mt-16 h-px bg-hairline" />

          {/* Fine print + CTA row */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Fine print — char cascade */}
            <p className="scroll-char-reveal eyebrow text-foreground/35 text-[0.62rem] tracking-widest text-center md:text-left max-w-lg">
              All prices include three meals daily, electricity, high-speed Wi-Fi, and daily housekeeping.
              Rates subject to availability. No deposit surprises.
            </p>
            {/* CTA — word reveal */}
            <button 
              onClick={() => openBooking()}
              className="group inline-flex items-center gap-4 bg-maroon text-ivory px-8 py-4 rounded-full text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-foreground hover:text-background flex-shrink-0"
            >
              <span className="scroll-word-reveal">Book a Visit Today</span>
              <span className="transition-transform group-hover:translate-x-1"><ArrowRight size={16} /></span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default RoomsPage;
