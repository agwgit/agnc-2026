"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [bootText, setBootText] = useState("SYS.INIT // 0%");

    useEffect(() => {
        const bootPhrases = [
            "SYS.INIT",
            "LOADING THREE.JS",
            "COMPILING SHADERS",
            "SECURING CONNECTION",
            "READY"
        ];

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 1;

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setProgress(100);
                setBootText("READY // 100%");

                setTimeout(() => {
                    setIsVisible(false);
                    document.body.style.overflow = 'auto';

                    setTimeout(() => {
                        const preloader = document.getElementById('agnc-preloader');
                        if (preloader) preloader.remove();
                    }, 800);
                }, 500);
            } else {
                setProgress(currentProgress);
                const phraseIndex = Math.min(
                    Math.floor((currentProgress / 100) * bootPhrases.length),
                    bootPhrases.length - 2
                );
                setBootText(`${bootPhrases[phraseIndex]} // ${currentProgress}%`);
            }
        }, 80);

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            id="agnc-preloader"
            className={`fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isVisible ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'}`}
            style={{
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
        >
            <div className="w-full max-w-[300px] flex flex-col items-center gap-6">
                <h1 className="font-serif italic font-light text-[2.5rem] text-white opacity-90">AGNC.Lab</h1>
                <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf] transition-all duration-100 linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="font-mono text-[0.65rem] text-white/40 tracking-[0.3em] uppercase h-4 text-center">
                    {bootText}
                </div>
            </div>
        </div>
    );
}
