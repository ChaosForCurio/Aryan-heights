import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const links = [
  ["About", "/#about"],
  ["Rooms", "/rooms"],
  ["Facilities", "/#facilities"],
  ["Mess", "/#mess"],
  ["Gallery", "/#gallery"],
  ["Visit", "/#contact"],
];

export const FullscreenMenu = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    if (open) {
      gsap.set(root.current, { display: "flex" });
      const tl = gsap.timeline();
      tl.fromTo(root.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
        .from("[data-menu-link]", { yPercent: 110, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.4")
        .from("[data-menu-meta]", { opacity: 0, y: 20, stagger: 0.05, duration: 0.6 }, "-=0.4");
    } else {
      gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: () => gsap.set(root.current, { display: "none" }) });
    }
  }, [open]);
  return (
    <div ref={root} style={{ display: "none" }} className="fixed inset-0 z-[90] bg-background flex-col">
      <div className="flex items-center justify-between px-5 md:px-8 py-5 border-b border-hairline">
        <span className="font-display text-base">Aryan Heights — Menu</span>
        <button onClick={onClose} aria-label="Close menu" className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-lg hover:bg-ivory hover:text-ink transition-colors rotate-45">+</button>
      </div>
      <div className="flex-1 grid md:grid-cols-12 gap-8 px-5 md:px-8 py-10 overflow-y-auto overflow-x-hidden">
        <nav className="md:col-span-8 flex flex-col justify-center gap-2">
          {links.map(([l, h], i) => (
            <a key={h} href={h} onClick={onClose} className="block overflow-hidden">
              <span data-menu-link className="font-display text-[12vw] md:text-[8.5vw] leading-[0.95] tracking-tighter hover:text-maroon transition-colors block">
                <span className="text-foreground/40 text-[0.25em] align-top mr-4">0{i + 1}</span>{l}
              </span>
            </a>
          ))}
        </nav>
        <aside className="md:col-span-4 flex flex-col justify-end gap-8 text-sm">
          <div data-menu-meta>
            <div className="eyebrow text-foreground/50 mb-2">Address</div>
            <p className="font-display text-lg">Talwandi, Kota<br/>Rajasthan 324005</p>
          </div>
          <div data-menu-meta>
            <div className="eyebrow text-foreground/50 mb-2">Reach Out</div>
            <p className="font-display text-lg">+91 98290 00000<br/>hello@aryanheights.in</p>
          </div>
          <div data-menu-meta className="flex gap-5 text-foreground/60">
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">YouTube</a>
            <a href="#" className="hover:text-foreground">WhatsApp</a>
          </div>
        </aside>
      </div>
    </div>
  );
};
