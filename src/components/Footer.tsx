"use client";

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-16 px-6 flex flex-col items-center border-t border-white/5 bg-black relative z-10">
            <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-10">

                {/* Left Side: Copyright & Attribution */}
                <div className="flex flex-col gap-3 text-center md:text-left">
                    <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
                        © 2026 AGNC Studio LLC. All rights reserved.
                    </p>
                    <p className="font-mono text-[8px] text-white/10 tracking-[0.2em] uppercase max-w-xl leading-relaxed">
                        Brand Scanner™, Style Library™, Brand Parachute™, and SuperCrew Studio™ are proprietary tools developed by AGNC.
                        Visual system and underlying framework protected under U.S. copyright law.
                    </p>
                </div>

                {/* Right Side: Links */}
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                    <Link
                        href="/privacy"
                        className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white hover:translate-y-[-1px] transition-all"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white hover:translate-y-[-1px] transition-all"
                    >
                        Terms
                    </Link>
                </div>

            </div>
        </footer>
    );
}
