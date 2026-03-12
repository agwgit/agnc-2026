"use client";

import { useState, useEffect } from "react";
import { RevealHeaderOnScroll, RevealLinesOnScroll } from "@/components/RevealText";

// ── PAYWALL BYPASS: Both steps hit the SAME webhook (Scenario 1 Router) ──
// The Make.com Router splits traffic using filters:
//   Path A (name exists)    → Add Row (Pending)
//   Path B (context exists) → Search → Update Row (Secured) → Slack
const WEBHOOK_ROUTER = "https://hook.us2.make.com/rv3xc169hdf1rg7cy4hr7hplkhqytd2o";

export default function IntakeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [shouldRender, setShouldRender] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [context, setContext] = useState("");
    const [state, setState] = useState("");

    // Lock body scroll and reset when closing
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setShouldRender(true));
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            const timer = setTimeout(() => {
                setStep(1);
                setName("");
                setPhone("");
                setEmail("");
                setContext("");
                setState("");
                setShouldRender(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const submitStep1 = () => {
        if (!name || !phone) {
            alert("Name and Phone are required to secure the line.");
            return;
        }

        fetch(WEBHOOK_ROUTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'step1_started',
                name: name,
                phone: phone,
                email: email,
                timestamp: new Date().toISOString()
            })
        }).catch(err => console.error("Status:", err));

        setStep(2);
    };

    const backToStep1 = () => {
        setStep(1);
    };

    const submitFinal = () => {
        fetch(WEBHOOK_ROUTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'step2_completed',
                name: name,
                phone: phone,
                email: email,
                context: context,
                state: state
            })
        }).catch(err => console.error("Status:", err));

        setStep(3);
    };

    return (
        <>
            <style jsx>{`
                .modal-backdrop {
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s ease;
                    backdrop-filter: blur(10px);
                    background: rgba(3, 3, 3, 0.85);
                }
                .modal-backdrop.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .modal-panel {
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .modal-backdrop.open .modal-panel {
                    transform: translateY(0);
                    opacity: 1;
                }
                .agnc-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem 0;
                    color: white;
                    font-size: 1.25rem;
                    border-radius: 0;
                    transition: border-color 0.3s ease;
                }
                .agnc-input:focus {
                    outline: none;
                    border-bottom-color: white;
                    box-shadow: none;
                }
                .agnc-input::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }
                .step-container {
                    animation: fadeUp 0.4s ease forwards;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .btn-primary {
                    background: white;
                    color: black;
                    padding: 1rem 2rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .btn-primary:hover {
                    background: #e5e5e5;
                    transform: translateY(-2px);
                }
                .btn-ghost {
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem 2rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .btn-ghost:hover {
                    border-color: white;
                }
            `}</style>

            <div className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${isOpen ? "open" : ""}`}>
                <div className="modal-panel w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 relative overflow-hidden">

                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>

                    {/* Status Indicator */}
                    <div className="font-mono text-[10px] text-[#2dd4bf] tracking-[0.3em] uppercase mb-8 opacity-70 flex justify-between">
                        <span>System // Intake Protocol</span>
                        <span>{step === 3 ? "Mission Secured" : `Step 0${step} / 02`}</span>
                    </div>

                    {/* STEPS */}
                    <div className="relative">
                        {shouldRender && step === 1 && (
                            <div className="step-container">
                                <RevealHeaderOnScroll tag="h3" text="Identify." className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight" />
                                <RevealLinesOnScroll text="Secure the line. If we get disconnected before the brief is finished, we'll follow up directly." className="font-body text-gray-400 text-sm mb-10 max-w-md leading-relaxed" />

                                <div className="space-y-6">
                                    <div>
                                        <input type="text" className="agnc-input font-body" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <input type="tel" className="agnc-input font-body" placeholder="Phone Number (Mobile)" value={phone} onChange={e => setPhone(e.target.value)} required />
                                    </div>
                                    <div>
                                        <input type="email" className="agnc-input font-body" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <button onClick={submitStep1} className="btn-primary font-mono font-bold tracking-[0.2em] uppercase text-xs w-full sm:w-auto flex items-center justify-center gap-3">
                                        Continue Briefing
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {shouldRender && step === 2 && (
                            <div className="step-container">
                                <RevealHeaderOnScroll tag="h3" text="The Chaos." className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight" />
                                <RevealLinesOnScroll text="What is the complex logic we need to turn into form?" className="font-body text-gray-400 text-sm mb-8 leading-relaxed" />

                                <div className="space-y-8">
                                    <div>
                                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">What are you actually building?</label>
                                        <textarea rows={3} className="agnc-input font-body resize-none text-lg" placeholder="Don't use jargon. Just tell us what it does." value={context} onChange={e => setContext(e.target.value)}></textarea>
                                    </div>

                                    <div>
                                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Current State</label>
                                        <select className="agnc-input font-body appearance-none bg-transparent cursor-pointer text-white text-lg" value={state} onChange={e => setState(e.target.value)}>
                                            <option value="" disabled className="text-gray-500 bg-[#0a0a0a]">Select the current phase...</option>
                                            <option value="idea" className="bg-[#0a0a0a] text-base">Just an idea and some docs</option>
                                            <option value="backend" className="bg-[#0a0a0a] text-base">Backend/Agent works, needs interface</option>
                                            <option value="scaling" className="bg-[#0a0a0a] text-base">Live, but needs a Command Center/Scale</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-between items-center">
                                    <button onClick={backToStep1} className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
                                        ← Back
                                    </button>
                                    <button onClick={submitFinal} className="btn-primary font-mono font-bold tracking-[0.2em] uppercase text-xs">
                                        Submit Mission
                                    </button>
                                </div>
                            </div>
                        )}

                        {shouldRender && step === 3 && (
                            <div className="step-container text-center py-12">
                                <div className="w-16 h-16 mx-auto border border-[#2dd4bf] rounded-full flex items-center justify-center mb-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2dd4bf]"><path d="M20 6L9 17l-5-5" /></svg>
                                </div>
                                <RevealHeaderOnScroll tag="h3" text="Brief Received." className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight" />
                                <RevealLinesOnScroll text="The line is secured. Our team will review the architecture and reach out shortly to discuss the handoff." className="font-body text-gray-400 text-sm max-w-sm mx-auto leading-relaxed" />
                                <button onClick={onClose} className="btn-ghost mt-10 font-mono font-bold tracking-[0.2em] uppercase text-xs">Close</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
