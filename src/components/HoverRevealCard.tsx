"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { splitChars } from "@/utils/split";

interface HoverRevealCardProps {
    proj: {
        title: string;
        meta: string;
        body: string;
        cta: string;
        image?: string;
        link?: string;
    };
    index: number;
}

export default function HoverRevealCard({ proj, index }: HoverRevealCardProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const onHoverEnter = () => {
        const el = titleRef.current;
        if (!el) return;

        // Reset text
        el.innerHTML = proj.title;

        const { chars, revert } = splitChars(el);
        (el as any)._revert = revert;

        // Make chars immediately visible since splitChars sets opacity to 0
        gsap.set(chars, { opacity: 1 });

        tlRef.current?.kill();
        const tl = gsap.timeline();
        tlRef.current = tl;

        tl.to(chars, {
            color: "#f26625", // accent-orange
            stagger: 0.02,
            duration: 0.2,
            ease: "power1.out",
        });

        tl.to(chars, {
            color: "#FFFFFF",
            stagger: 0.02,
            duration: 0.2,
            ease: "power2.in",
        }, "<0.2");
    };

    const onHoverLeave = () => {
        const el = titleRef.current;
        if (el && (el as any)._revert) {
            tlRef.current?.kill();
            (el as any)._revert();
            el.innerHTML = proj.title;
        }
    };

    return (
        <a
            href={proj.link || "#"}
            data-cursor-box="true"
            className="group relative w-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden flex flex-col p-8 md:p-16 block cursor-pointer min-h-[auto] md:min-h-[55vh] md:justify-end"
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 hidden md:block" />
            <div className="absolute inset-0 bg-white/[0.02] opacity-50 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 transform -rotate-12 translate-y-10 group-hover:translate-y-0 transition-transform duration-[2s]" />
            </div>

            {/* Mobile Meta */}
            <div className="flex md:hidden items-center gap-4 mb-8 relative z-20">
                <span className="font-mono text-[10px] text-accent-lightblue tracking-[0.4em]">
                    0{index + 1}
                </span>
                <span className="h-[1px] flex-grow bg-white/10" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
                    {proj.meta}
                </span>
            </div>

            {proj.image && (
                <div className="relative md:absolute md:top-0 md:right-0 w-full md:w-1/2 h-64 md:h-full z-[5] md:p-8 overflow-hidden mb-8 md:mb-0">
                    <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-contain md:object-right transform scale-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                    />
                </div>
            )}

            <div className="relative z-20 max-w-2xl transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                {/* Desktop Meta */}
                <div className="hidden md:flex items-center gap-4 mb-8">
                    <span className="font-mono text-[10px] text-accent-lightblue tracking-[0.4em]">
                        0{index + 1}
                    </span>
                    <span className="h-[1px] w-12 bg-white/10" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
                        {proj.meta}
                    </span>
                </div>

                <h3 ref={titleRef} className="font-display font-black text-4xl md:text-6xl mb-6 md:mb-8 transition-colors tracking-tight text-white leading-tight">
                    {proj.title}
                </h3>

                <p className="font-body text-gray-400 text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 max-w-xl">
                    {proj.body}
                </p>

                <div className="inline-flex items-center gap-6 text-[10px] font-mono tracking-[0.4em] uppercase text-white/50 group-hover:text-accent-orange transition-all duration-500">
                    {proj.cta} <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
                </div>
            </div>
        </a>
    );
}
