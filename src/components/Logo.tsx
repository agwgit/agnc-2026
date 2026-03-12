"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";

interface LogoProps {
    isDocked: boolean;
}

export default function Logo({ isDocked }: LogoProps) {
    const textGroupRef = useRef<SVGGElement>(null);
    const iconGroupRef = useRef<SVGGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Animation Logic
    useEffect(() => {
        const textGroup = textGroupRef.current;
        const iconGroup = iconGroupRef.current;
        if (!textGroup || !iconGroup) return;

        // agnc-logo.svg viewBox is 240x68
        // The 'A' (path 1) spans from x=0 to x~69, center is ~35.
        // Full logo width is 240. Center is 120.
        // Delta to center A in the middle: 120 - 35 = 85.
        const centerOffset = 85;

        if (isDocked) {
            // DOCKED STATE
            if (isHovered) {
                // HOVERING DOCKED (Reveal Text)
                gsap.to(textGroup, {
                    attr: { opacity: 1 },
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Icon moves back to left
                gsap.to(iconGroup, {
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            } else {
                // IDLE DOCKED (Icon Only, Centered)
                gsap.to(textGroup, {
                    attr: { opacity: 0 },
                    x: -20,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
                // Icon moves to center
                gsap.to(iconGroup, {
                    x: centerOffset,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            }
        } else {
            // HOME STATE (Full Lockup)
            gsap.to(textGroup, {
                attr: { opacity: 1 },
                x: 0,
                duration: 0.6,
                ease: "power3.out"
            });
            gsap.to(iconGroup, {
                x: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        }
    }, [isDocked, isHovered]);

    return (
        <div
            ref={containerRef}
            className={`
                fixed top-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 cursor-pointer pointer-events-auto
                ${isDocked ? "scale-[0.6]" : "scale-[0.67]"}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-clickable="true"
            onClick={(e) => {
                e.stopPropagation();
                if (pathname === '/') {
                    if ((window as any).triggerShonenWarp) {
                        (window as any).triggerShonenWarp('#');
                    } else {
                        document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    router.push('/');
                }
            }}

        >
            <svg width="240" height="68" viewBox="0 0 240 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full max-w-[120px] md:max-w-[200px]">
                {/* GROUP: TEXT (GNC) */}
                <g id="text" ref={textGroupRef}>
                    {/* N */}
                    <path d="M167.3 1.89415H188.749V3.03064H187.42C183.624 3.03064 178.784 11.4596 178.784 18.9415V67.9053H177.55L177.075 67.1476L169.578 56.6351L148.698 27.1811L140.156 15.0585L137.973 17.2368C136.739 18.5627 136.075 20.6462 136.075 22.5404V49.7214C136.075 57.2033 140.346 65.6323 144.332 65.6323H146.135V66.6741H124.306V65.6323H125.255C129.052 65.6323 133.892 57.2033 133.892 49.7214V22.9192C133.892 21.0251 134.366 19.0362 136.075 17.0474L140.63 11.9332L148.698 3.03064H124.306V1.89415H149.837L151.45 4.16713L175.367 38.2618C175.937 39.0195 176.601 39.3036 176.601 38.1671V18.9415C176.601 11.4596 172.33 3.03064 168.344 3.03064H167.3V1.89415Z" fill="white" />
                    {/* C */}
                    <path d="M238.861 41.0084H240V67.3371H238.956C238.007 66.2953 235.824 64.4011 232.312 64.4011C227.567 64.4011 225.669 67.3371 218.456 67.3371C204.979 67.3371 188.749 56.0669 188.749 33.337C188.749 10.6072 206.687 0.0947063 218.266 0.0947063C225.194 0.0947063 228.136 2.17827 231.743 2.17827C234.59 2.17827 236.393 1.70474 238.007 0H238.671L239.241 23.0139H238.197C235.16 14.7744 228.991 2.08357 218.646 2.08357C208.965 2.08357 204.124 13.6379 204.124 33.337C204.124 53.0362 208.3 65.2535 219.025 65.2535C228.042 65.2535 235.539 53.6045 238.861 41.0084Z" fill="white" />
                    {/* G */}
                    <path fillRule="evenodd" clipRule="evenodd" d="M125.288 31.2535H96.3665V32.39H115.986L105.831 43.6602C103.079 46.7855 101.276 49.8162 101.276 54.7409V58.0557C101.276 63.9276 97.9538 65.6323 93.588 65.6323C82.9582 65.6323 79.8262 53.6992 79.8262 34V32.39V31.2535C80.2058 13.259 84.6665 3.03064 93.9676 3.03064C104.408 3.03064 111.146 14.7744 114.278 23.0139H115.322L114.088 0H113.424C111.905 1.89415 110.197 2.84123 106.97 2.84123C105.465 2.84123 104.108 2.46163 102.527 2.01936C100.321 1.40218 97.6794 0.662955 93.588 0.662955C82.0091 0.662955 64.451 11.2702 64.451 34C64.451 56.7298 79.6364 68 93.0185 68C97.222 68 100.013 67.0287 102.383 66.2034C104.134 65.5939 105.656 65.0641 107.35 65.0641C111.241 65.0641 114.563 67.0529 115.512 68H116.081V36.7465C116.081 33.8106 117.22 32.39 119.878 32.39H125.288V31.2535Z" fill="white" />
                </g>

                {/* GROUP: ICON (A) */}
                <g id="icon" ref={iconGroupRef}>
                    {/* A */}
                    <path fillRule="evenodd" clipRule="evenodd" d="M69.0937 65.5376H43.0886L52.7693 55.4986C55.5217 52.7521 56.281 48.585 54.7624 44.9861L36.1603 0.662964H34.8316L11.5789 53.6992C9.49089 58.1504 5.03017 65.5376 0 65.5376V66.6741H23.5374V65.5376C14.4262 65.5376 12.9076 55.7827 15.1854 50.2897L17.6531 44.5125L18.6021 42.5237L18.6971 42.3343L28.1879 20.3621L37.0145 42.5237L37.8686 44.5125L41.7599 54.5515C43.6581 59.3816 41.3803 65.5376 35.8756 65.5376V66.6741H69.0937V65.5376Z" fill="white" />
                </g>
            </svg>
        </div>
    );
}
