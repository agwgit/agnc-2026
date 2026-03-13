'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AgncScreensaver() {
    const [isIdle, setIsIdle] = useState(false);
    const [artifactPos, setArtifactPos] = useState({ x: 100, y: 100 });
    const [cornerHit, setCornerHit] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | undefined>(undefined);

    // Artifact Settings
    const size = 150;
    // Slightly mismatched speeds prevent endless non-corner loops
    const speedX = 2.56;
    const speedY = 2.16;
    const velocity = useRef({ dx: speedX, dy: speedY });

    // 1. INACTIVITY TIMER (30 SECONDS)
    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;
        const idleTime = 30000; // 30 seconds

        const resetTimer = () => {
            if (isIdle) {
                setIsIdle(false);
                document.body.classList.remove('screensaver-active');
                setTimeout(() => setCornerHit(false), 1000);
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsIdle(true);
                document.body.classList.add('screensaver-active');
            }, idleTime);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '`') {
                setIsIdle(prev => {
                    const next = !prev;
                    if (!next) {
                        // Reset easter egg on wake up
                        document.body.classList.remove('screensaver-active');
                        setTimeout(() => setCornerHit(false), 1000);
                    } else {
                        document.body.classList.add('screensaver-active');
                    }
                    return next;
                });
            } else {
                resetTimer();
            }
        };

        const events = ['mousemove', 'mousedown', 'touchstart', 'scroll'];
        events.forEach(e => window.addEventListener(e, resetTimer as any));
        window.addEventListener('keydown', handleKeyDown);

        // Start initial timer only if not already idle
        if (!isIdle) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsIdle(true);
                document.body.classList.add('screensaver-active');
            }, idleTime);
        }

        return () => {
            events.forEach(e => window.removeEventListener(e, resetTimer as any));
            window.removeEventListener('keydown', handleKeyDown);
            if (timeout) clearTimeout(timeout);
        };
    }, [isIdle]);

    // 2. DVD BOUNCER LOGIC WITH CORNER MAGNET
    useEffect(() => {
        if (!isIdle) {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }

        const updatePosition = () => {
            if (!containerRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            setContainerSize({ w: width, h: height });

            setArtifactPos((prev) => {
                let nx = prev.x + velocity.current.dx;
                let ny = prev.y + velocity.current.dy;

                // X-axis collision
                if (nx <= 0) {
                    nx = 0;
                    velocity.current.dx = speedX;
                } else if (nx + size >= width) {
                    nx = width - size;
                    velocity.current.dx = -speedX;
                }

                // Y-axis collision
                if (ny <= 0) {
                    ny = 0;
                    velocity.current.dy = speedY;
                } else if (ny + size >= height) {
                    ny = height - size;
                    velocity.current.dy = -speedY;
                }

                // THE EASTER EGG: Corner Tolerance & Magnet
                const tolerance = 12;
                const nearLeft = nx <= tolerance;
                const nearRight = nx + size >= width - tolerance;
                const nearTop = ny <= tolerance;
                const nearBottom = ny + size >= height - tolerance;

                if ((nearLeft || nearRight) && (nearTop || nearBottom) && !cornerHit) {
                    setCornerHit(true);
                    // Magnetic snap to the exact corner for visual perfection
                    if (nearLeft) nx = 0;
                    if (nearRight) nx = width - size;
                    if (nearTop) ny = 0;
                    if (nearBottom) ny = height - size;
                }

                return { x: nx, y: ny };
            });

            requestRef.current = requestAnimationFrame(updatePosition);
        };

        requestRef.current = requestAnimationFrame(updatePosition);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isIdle, cornerHit]);

    // Ensure fonts are loaded
    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    // Generate an ultra-long string to prevent the SVG loop glitch
    const phrase = "fearless by design. built with precision. \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ";
    const endlessMarqueeText = phrase.repeat(60); // Repeats 60 times to ensure it never runs out

    return (
        <>
            <style>{`
        @keyframes fadeBlurIn {
          0% {
            opacity: 0;
            transform: scale(1.1) translateZ(-100px);
            filter: blur(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateZ(0);
            filter: blur(0px);
          }
        }

        @keyframes artifactMaterialize {
          0% { opacity: 0; transform: scale(0.8) rotate(-15deg); filter: blur(15px); }
          50% { opacity: 0.5; filter: blur(5px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0px); }
        }

        @keyframes superchargeGlow {
          0%, 100% { filter: drop-shadow(0 0 25px rgba(251, 146, 60, 0.9)); transform: scale(1) rotate(0deg); }
          50% { filter: drop-shadow(0 0 60px rgba(255, 255, 255, 1)); transform: scale(1.15) rotate(10deg); }
        }

        .easter-egg-active {
          animation: superchargeGlow 1.5s ease-in-out infinite !important;
        }

        .screensaver-overlay {
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          /* Dramatic Magma Radial Background */
          background: radial-gradient(circle at 50% 110%, rgba(217, 119, 6, 0.15) 0%, rgba(5, 5, 5, 1) 50%, #030303 100%);
          z-index: 9999;
          position: fixed;
          inset: 0;
        }
        
        .screensaver-overlay.active {
          pointer-events: auto;
          opacity: 1;
        }

        .arch-container {
          opacity: 0;
        }

        .screensaver-overlay.active .arch-container {
          animation: fadeBlurIn 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
        }

        .artifact-container {
          opacity: 0;
        }

        .screensaver-overlay.active .artifact-container {
          animation: artifactMaterialize 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1.5s;
        }
      `}</style>

            {/* OVERLAY CONTAINER */}
            <div
                ref={containerRef}
                className={`fixed inset-0 overflow-hidden screensaver-overlay ${isIdle ? 'active' : ''}`}
            >

                {/* ARCHED HORIZON & MARQUEE WITH FADED EDGES */}
                <div
                    className="absolute inset-0 flex items-center justify-center arch-container"
                    style={{
                        /* CSS Mask applies the beautiful fade on the left and right edges */
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                    }}
                >
                    <svg
                        viewBox="0 0 1400 600"
                        className="w-[120vw] h-auto max-w-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <path
                                id="textArch"
                                d="M -200,580 Q 700,-320 1600,580"
                                fill="none"
                            />
                            <path
                                id="glowArch"
                                d="M -200,600 Q 700,-300 1600,600"
                                fill="none"
                            />
                        </defs>

                        {/* Dramatic Magma Glow Layers */}
                        <use
                            href="#glowArch"
                            stroke="rgba(217, 119, 6, 0.5)"
                            strokeWidth="24"
                            style={{ filter: 'blur(20px)' }}
                        />
                        <use
                            href="#glowArch"
                            stroke="rgba(251, 146, 60, 0.7)"
                            strokeWidth="10"
                            style={{ filter: 'blur(8px)' }}
                        />
                        <use
                            href="#glowArch"
                            stroke="rgba(255, 237, 213, 0.9)"
                            strokeWidth="1.5"
                        />

                        {/* TEXT MARQUEE */}
                        <text
                            fill="rgba(255, 255, 255, 0.4)"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '32px',
                                fontWeight: '300',
                                letterSpacing: '0.12em'
                            }}
                        >
                            <textPath href="#textArch" startOffset="0%">
                                {endlessMarqueeText}
                                {/* 5-minute continuous scroll deep into negative space prevents any visual looping jumps */}
                                <animate
                                    attributeName="startOffset"
                                    from="0%"
                                    to="-500%"
                                    dur="300s"
                                    repeatCount="indefinite"
                                />
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* 3D ARTIFACT (DVD BOUNCER) */}
                <div
                    className="absolute artifact-container"
                    style={{
                        left: `${artifactPos.x}px`,
                        top: `${artifactPos.y}px`,
                        width: `${size}px`,
                        height: `${size}px`,
                        willChange: 'left, top'
                    }}
                >
                    <img
                        src="/agnc-onyx.gif"
                        alt="AGNC 3D Artifact"
                        className={`w-full h-full object-contain transition-all duration-700 ${cornerHit ? 'easter-egg-active' : ''}`}
                        style={{
                            filter: cornerHit ? 'none' : 'drop-shadow(0 20px 25px rgba(217, 119, 6, 0.3))'
                        }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                        }}
                    />

                    {/* Fallback Shape */}
                    <div
                        className="w-full h-full bg-stone-900 border border-orange-500/30 rounded-[30%] shadow-[0_0_30px_rgba(217,119,6,0.3)] hidden"
                        style={{ transform: 'rotate(45deg)' }}
                    ></div>
                </div>

                {/* HUD Overlay */}
                <div className="absolute bottom-8 right-8 font-mono text-[10px] text-orange-500/40 uppercase tracking-[0.3em] arch-container">
                    SYS.IDLE // AGNC.Studio
                </div>
            </div>
        </>
    );
}
