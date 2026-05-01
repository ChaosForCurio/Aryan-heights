import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/hooks/useMagnetic";
import hero from "@/assets/hero-building.jpg";

const rotators = ["24/7 Security", "Mess like Home", "3 min to Allen", "Study halls open all night"];

export const Hero = () => {
  const root = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const rot = useRef<HTMLDivElement>(null);
  const scrollRef = useMagnetic<HTMLDivElement>(0.3);
  const depthLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.4, defaults: { ease: "expo.out" } });
      tl.from("[data-hero-line] span", { yPercent: 110, duration: 1.4, stagger: 0.1 })
        .from("[data-hero-tag]", { opacity: 0, y: 30, duration: 1 }, "-=1")
        .from("[data-hero-meta]", { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, "-=0.8")
        .from(img.current, { scale: 1.3, duration: 2.2, ease: "power4.out" }, 0)
        .from("[data-hero-rotator]", { opacity: 0, y: 25, duration: 0.8 }, "-=0.6")
        .from("[data-hero-scroll]", { opacity: 0, y: -20, duration: 1 }, "-=0.4");

      // Main image parallax
      gsap.to(img.current, {
        yPercent: 15, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Depth layer parallax (opposite direction for depth)
      if (depthLayer.current) {
        gsap.to(depthLayer.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }

      const items = rot.current?.querySelectorAll("[data-rot-item]");
      if (items && items.length) {
        const rtl = gsap.timeline({ repeat: -1 });
        items.forEach((_, i) => {
          rtl.to(items, { yPercent: -100 * (i + 1), duration: 0.8, ease: "expo.inOut" }, `+=1.8`);
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <div className="max-w-[1700px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-6 md:gap-10">
        <div className="md:col-span-7 z-10">
          <div data-hero-tag className="eyebrow text-foreground/60 mb-8 flex items-center gap-3">
            <span className="w-10 h-px bg-maroon" /> Premium Boys Hostel · Since 2010
          </div>
          <h1 className="font-display text-[14vw] md:text-[8.5vw] leading-[0.92] tracking-tight">
            <span data-hero-line className="block overflow-hidden"><span className="block">A premium</span></span>
            <span data-hero-line className="block overflow-hidden"><span className="block">boys' hostel,</span></span>
            <span data-hero-line className="block overflow-hidden"><span className="block">in <span className="text-maroon">Kota.</span></span></span>
          </h1>
          <div className="hairline mt-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[["15+","Years of Trust"],["1200+","Aspirants Housed"],["24/7","Security & Care"],["3min","To Allen Campus"]].map(([n,l]) => (
              <div data-hero-meta key={l}>
                <div className="font-display text-3xl md:text-4xl">{n}</div>
                <div className="eyebrow text-foreground/55 mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 relative h-[60svh] md:h-[80svh] overflow-hidden rounded-sm group/hero-img">
          <img ref={img} src={hero} alt="Aryan Heights exterior" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1280} />
          
          {/* Depth layer for parallax effect */}
          <div ref={depthLayer} className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
             <div className="w-[80%] h-[80%] border border-white/10 rounded-full blur-3xl bg-maroon/5 mix-blend-screen opacity-40" />
          </div>

          <div className="absolute inset-0 z-20" style={{ background: "linear-gradient(180deg, hsl(var(--bg) / 0.1), hsl(var(--bg) / 0.75))" }} />
          
          <div className="absolute top-6 left-6 eyebrow text-foreground/80 z-30">Kota · Rajasthan</div>
          <div className="absolute top-6 right-6 eyebrow text-foreground/80 z-30">26.91°N · 75.79°E</div>
          
          {/* Floating glass badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/hero-img:opacity-100 transition-opacity duration-700 pointer-events-none">
             <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 eyebrow text-[0.6rem] tracking-[0.25em] text-white">
                The Standard
             </div>
          </div>

          <div data-hero-rotator className="absolute bottom-6 left-6 right-6 z-30">
            <div className="eyebrow text-foreground/60 mb-3">What you get</div>
            <div className="h-9 overflow-hidden">
              <div ref={rot}>
                {[...rotators, rotators[0]].map((r, i) => (
                  <div key={i} data-rot-item className="h-9 flex items-center font-display text-2xl md:text-3xl">{r}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-hero-scroll ref={scrollRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 eyebrow text-foreground/55 flex flex-col items-center gap-2 cursor-pointer z-20">
        <span className="pointer-events-none">Scroll</span>
        <span className="w-px h-10 bg-foreground/30 animate-pulse pointer-events-none" />
      </div>
    </section>
  );
};

