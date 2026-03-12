"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { splitChars, splitLines } from "@/utils/split";

export function RevealHeaderOnScroll({ text, className, tag: Tag = "h2" }: { text: string; className?: string; tag?: any; }) {
    const elRef = useRef<HTMLElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!elRef.current) return;
        const el = elRef.current;
        const originalText = text;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.innerHTML = originalText;
                    el.style.opacity = "1";

                    const { chars, revert } = splitChars(el);

                    tlRef.current?.kill();
                    const tl = gsap.timeline();
                    tlRef.current = tl;

                    tl.to(chars, {
                        y: 0,
                        opacity: 1,
                        color: "#f26625",
                        filter: "blur(0px)",
                        startAt: { y: 24, opacity: 0, color: "#f26625", filter: "blur(6px)" },
                        stagger: 0.03,
                        duration: 0.6,
                        ease: "power2.out",
                    });

                    tl.to(chars, {
                        color: "#FFFFFF",
                        overwrite: "auto",
                        stagger: 0.025,
                        duration: 0.3,
                        ease: "power3.in",
                    }, "<0.45");

                    (el as any)._revert = revert;
                } else {
                    el.style.opacity = "0";
                    if ((el as any)._revert) (el as any)._revert();
                    el.innerHTML = originalText;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);

        return () => {
            observer.disconnect();
            tlRef.current?.kill();
        };
    }, [text]);

    return (
        <Tag ref={elRef} className={className} style={{ opacity: 0 }}>
            {text}
        </Tag>
    );
}

export function RevealLinesOnScroll({ text, className, tag: Tag = "p" }: { text: string; className?: string; tag?: any; }) {
    const elRef = useRef<HTMLElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!elRef.current) return;
        const el = elRef.current;
        const originalText = text;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.innerHTML = originalText;
                    el.style.opacity = "1";

                    const { lines, revert } = splitLines(el);

                    tlRef.current?.kill();
                    const tl = gsap.timeline();
                    tlRef.current = tl;

                    tl.to(lines, {
                        yPercent: 0,
                        opacity: 1,
                        startAt: { yPercent: 110, opacity: 0 },
                        stagger: 0.1,
                        duration: 0.65,
                        ease: "power3.out",
                    });

                    (el as any)._revert = revert;
                } else {
                    el.style.opacity = "0";
                    if ((el as any)._revert) (el as any)._revert();
                    el.innerHTML = originalText;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);

        return () => {
            observer.disconnect();
            tlRef.current?.kill();
        };
    }, [text]);

    return (
        <Tag ref={elRef} className={className} style={{ opacity: 0 }}>
            {text}
        </Tag>
    );
}
