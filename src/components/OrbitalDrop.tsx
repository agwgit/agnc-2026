"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function OrbitalDrop() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                if (!targetId) return;

                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    triggerOrbitalDrop(href);
                }
            }
        };

        const handleCustomEvent = (e: any) => {
            if (e.detail?.target) {
                triggerOrbitalDrop(e.detail.target);
            }
        };

        window.addEventListener('click', handleAnchorClick);
        window.addEventListener('shonen:orbital-drop', handleCustomEvent);

        // Expose to window for direct calls if needed
        (window as any).triggerShonenWarp = triggerOrbitalDrop;

        return () => {
            window.removeEventListener('click', handleAnchorClick);
            window.removeEventListener('shonen:orbital-drop', handleCustomEvent);
        };
    }, []);

    const triggerOrbitalDrop = (targetSelector: string) => {
        const svg = svgRef.current;
        if (!svg) return;

        // Clear existing lines
        svg.innerHTML = '';
        gsap.set(svg, { opacity: 1 });

        const w = window.innerWidth;
        const h = window.innerHeight;
        const numLines = 80;

        // 1. Generate Vertical Speedlines
        for (let i = 0; i < numLines; i++) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const xPos = Math.random() * w;
            const length = (Math.random() * h * 0.4) + (h * 0.2);
            const weight = Math.random() * 2 + 0.5;

            line.setAttribute("x1", xPos.toString());
            line.setAttribute("y1", "0");
            line.setAttribute("x2", xPos.toString());
            line.setAttribute("y2", length.toString());
            line.setAttribute("stroke", "#fff");
            line.setAttribute("stroke-width", weight.toString());
            line.setAttribute("opacity", (Math.random() * 0.4 + 0.1).toString());

            gsap.set(line, { y: -length });
            svg.appendChild(line);

            gsap.to(line, {
                y: h + length,
                duration: (Math.random() * 0.15) + 0.05, // Extremely fast
                repeat: -1,
                ease: "none",
                delay: Math.random() * 0.1
            });
        }

        const mainContainer = document.querySelector('main');
        if (!mainContainer) return;

        // 2. The Heavy Scroll Tween
        // Temporarily disable snap to prevent jitter
        const originalSnap = mainContainer.style.scrollSnapType;
        const originalSmooth = mainContainer.style.scrollBehavior;

        mainContainer.style.scrollSnapType = 'none';
        mainContainer.style.scrollBehavior = 'auto';

        gsap.to(mainContainer, {
            scrollTo: (targetSelector === '#' || targetSelector === '#top') ? 0 : targetSelector,
            duration: 1.5,

            ease: "expo.inOut", // The iconic heavy drop ease
            onComplete: () => {
                // Dissipate lines
                gsap.to(svg, {
                    opacity: 0,
                    duration: 0.4,
                    onComplete: () => {
                        svg.innerHTML = '';
                        // Restore snapping if it was there
                        mainContainer.style.scrollSnapType = originalSnap;
                        mainContainer.style.scrollBehavior = originalSmooth;
                    }
                });
            }
        });
    };

    return (
        <svg
            ref={svgRef}
            id="shonen-orbital-drop"
            className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-0"
            preserveAspectRatio="none"
        />
    );
}
