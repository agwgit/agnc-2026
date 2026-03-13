"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function ScrollCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [mounted, setMounted] = useState(false);

    // GSAP QuickTo for performance
    const xTo = useRef<gsap.QuickToFunc | null>(null);
    const yTo = useRef<gsap.QuickToFunc | null>(null);

    // Track current text to avoid redundant DOM updates
    const currentText = useRef("SCROLL");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Desktop check and reduced motion check
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isTouch || prefersReducedMotion || window.innerWidth < 1024) {
            return;
        }

        const cursor = cursorRef.current;
        if (!cursor) return;

        // Init GSAP QuickTo
        // Higher duration = more "heavy/elastic" lag. 0.3 - 0.5 is good for heavy.
        xTo.current = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
        yTo.current = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
            // Default target is mouse position
            let targetX = e.clientX;
            let targetY = e.clientY;
            let scale = 1;
            let textOpacity = 1;

            let targetWidth = 70;
            let targetHeight = 70;
            let targetBorderRadius = "9999px";
            let targetML = -35;
            let targetMT = -35;

            // Check for interactive elements
            const target = e.target as HTMLElement;
            // Snappable elements: buttons, links, inputs, and explicitly marked clickable items (like Logo)
            const snapTarget = target.closest('button, a, [role="button"], [data-clickable="true"], input, textarea, select');

            // Check for custom cursor text
            const customTextTarget = target.closest('[data-cursor-text]');
            const newText = customTextTarget ? customTextTarget.getAttribute('data-cursor-text') || "SCROLL" : "SCROLL";

            if (textRef.current && currentText.current !== newText) {
                textRef.current.innerText = newText;
                currentText.current = newText;
            }

            const boxTarget = target.closest('[data-cursor-box="true"]');

            if (boxTarget) {
                // BOX MATCH HOVER
                const rect = boxTarget.getBoundingClientRect();
                targetX = rect.left + rect.width / 2;
                targetY = rect.top + rect.height / 2;

                targetWidth = rect.width;
                targetHeight = rect.height;
                targetML = -rect.width / 2;
                targetMT = -rect.height / 2;
                targetBorderRadius = "0px";

                textOpacity = 0;
            } else if (snapTarget) {
                // MAGNETIC HOVER
                const rect = snapTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Move cursor to element center
                targetX = centerX;
                targetY = centerY;

                // Scale to "hug" the element
                scale = 1.5;
                textOpacity = 0;
            }

            // Determine colors based on text
            const isDrag = newText === "DRAG";
            const baseColorRGB = isDrag ? "119,162,201" : "255,90,0"; // lightblue vs orange

            // Apply to GSAP
            xTo.current?.(targetX);
            yTo.current?.(targetY);

            // Animate properties separately
            gsap.to(cursor, {
                width: targetWidth,
                height: targetHeight,
                marginLeft: targetML,
                marginTop: targetMT,
                borderRadius: targetBorderRadius,
                scale: scale,
                backgroundColor: (snapTarget || boxTarget) ? `rgba(${baseColorRGB}, 0.05)` : `rgba(${baseColorRGB}, 0.05)`,
                borderColor: (snapTarget || boxTarget) ? `rgba(${baseColorRGB}, 0.8)` : `rgba(${baseColorRGB}, 0.6)`,
                boxShadow: `0 0 20px rgba(${baseColorRGB},0.2)`,
                duration: 0.3
            });

            if (textRef.current) {
                gsap.to(textRef.current, {
                    opacity: textOpacity,
                    color: isDrag ? "#77a2c9" : "#f26625",
                    duration: 0.2
                });
            }
        };

        // Global Click Logic (Wrapped in event to avoid conflicts)
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const snapTarget = target.closest('button, a, [role="button"], [data-clickable="true"], input, textarea, select');
            const suppressTarget = target.closest('[data-suppress-scroll="true"]');

            // If we are clicking something interactive OR something that explicitly suppresses global scroll
            // Note: MenuOverlay has data-suppress-scroll="true", so clicking it will NOT fire the event.
            if (!snapTarget && !suppressTarget) {
                window.dispatchEvent(new CustomEvent("illuminadi-cursor-click"));
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleGlobalClick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleGlobalClick);
        };
    }, [mounted]);

    if (!mounted) return null;

    return createPortal(
        <div
            ref={cursorRef}
            id="scroll-cursor"
            className={`
                fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference
                hidden lg:flex items-center justify-center
                border border-accent-orange/60 bg-accent-orange/5
                shadow-[0_0_20px_rgba(255,90,0,0.2)]
            `}
            style={{ width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: "9999px" }}
        >
            <span
                ref={textRef}
                className="font-display text-[10px] tracking-widest translate-y-[1px] transition-colors duration-300"
                style={{ color: "#f26625" }}
            >
                SCROLL
            </span>
        </div>,
        document.body
    );
}
