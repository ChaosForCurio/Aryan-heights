import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // If there's a hash in the URL on load, scroll to it
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          // @ts-ignore
          lenis.scrollTo(element, { offset: 0, duration: 0, immediate: true });
        }, 100);
      }
    }

    // Smooth anchor scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && (href.startsWith("#") || href.startsWith("/#"))) {
          const isHomeLink = href.startsWith("/#");
          const hashIndex = href.indexOf("#");
          const id = href.substring(hashIndex + 1);

          // If it's a home link (/#something) but we're not on the home page, 
          // let the browser handle the navigation naturally.
          if (isHomeLink && window.location.pathname !== "/") {
            return;
          }

          const element = document.getElementById(id);
          if (element) {
            e.preventDefault();
            // @ts-ignore
            lenis.scrollTo(element, { offset: 0, duration: 2 });
          }
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      gsap.ticker.remove(raf);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);
  return null;
};
