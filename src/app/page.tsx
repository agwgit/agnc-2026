"use client";

import { useState } from "react";
import Image from "next/image";
import ProcessSection from "@/components/ProcessSection";
import Starfield from "@/components/Starfield";
import Logo from "@/components/Logo";
import ScrollCursor from "@/components/ScrollCursor";
import { RevealHeaderOnScroll, RevealLinesOnScroll } from "@/components/RevealText";
import HoverRevealCard from "@/components/HoverRevealCard";
import OrbitalDrop from "@/components/OrbitalDrop";
import IntakeModal from "@/components/IntakeModal";


export default function Home() {
  const [isDocked, setIsDocked] = useState(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  return (
    <main
      className="w-full h-screen overflow-y-auto snap-y snap-mandatory bg-black text-white selection:bg-accent-blue/30"

      onScroll={(e) => setIsDocked(e.currentTarget.scrollTop > 100)}
    >
      <Logo isDocked={isDocked} />
      <ScrollCursor />
      <OrbitalDrop />
      <Starfield />


      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen snap-center flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          <div className="w-full max-w-[80vw] sm:max-w-2xl mb-12 flex justify-center text-white">
            <Image
              src="/after-ai.svg"
              alt="#After A.I."
              width={800}
              height={150}
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] text-white fill-white"
            />
          </div>

          <RevealHeaderOnScroll
            tag="h1"
            text="We architect high-fidelity products and systems for founders building complicated things."
            className="font-display font-black text-[clamp(1.5rem,3.2vw,3rem)] max-w-4xl leading-[1.1] mb-8 tracking-tight px-4"
          />

          <RevealLinesOnScroll
            text="From polished demos to living platforms, we provide the structure and story that get them shipped."
            className="font-body text-[clamp(1rem,1.5vw,1.35rem)] text-gray-400 max-w-xl leading-relaxed mb-14"
          />

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
            <a href="#contact" className="px-10 py-4 bg-white text-black font-mono font-bold hover:bg-white/90 transition-colors uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 duration-200">
              Book a launch call
            </a>
            <a href="#work" className="px-10 py-4 border border-white/20 text-white font-mono hover:border-white/50 transition-colors uppercase tracking-[0.2em] text-[10px]">
              View selected work
            </a>
          </div>

          <p className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase mt-8 absolute bottom-12">
            For founders, AI teams, and media products that need to look real fast.
          </p>
        </div>
      </section>

      {/* 2. WHAT WE'RE HIRED FOR */}
      <section className="relative w-full min-h-screen snap-center flex items-center bg-black/50 py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto w-full z-10">
          <RevealHeaderOnScroll
            text="What we’re hired for"
            className="font-display font-black text-4xl sm:text-5xl md:text-7xl mb-24 opacity-90 border-b border-white/10 pb-10 tracking-tighter"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/5">
            {/* Lane 1 */}
            <div className="group flex flex-col border-b md:border-b-0 md:border-r border-white/5 p-8 md:p-14 hover:bg-white/[0.02] transition-colors">
              <h3 className="font-display font-black text-4xl mb-8 tracking-tight">Launch Sprints</h3>
              <RevealLinesOnScroll tag="div" text="A focused engagement to turn rough product thinking into a functional surface. Not a strategy deck. Not a mood board. A sharp, working demonstration designed to secure the yes." className="font-body text-gray-400 text-lg leading-relaxed mb-10 flex-grow" />
              <div className="mb-12">
                <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent-lightblue border border-accent-lightblue/30 px-4 py-2">
                  Best for: demos, pitches, pilot launches.
                </span>
              </div>
              <a href="#contact" className="font-mono group-hover:text-accent-orange transition-colors tracking-[0.3em] text-[10px] uppercase flex items-center gap-4">
                Start a sprint <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">→</span>
              </a>
            </div>

            {/* Lane 2 */}
            <div className="group flex flex-col border-b md:border-b-0 md:border-r border-white/5 p-8 md:p-14 hover:bg-white/[0.02] transition-colors">
              <h3 className="font-display font-black text-4xl mb-8 tracking-tight">AI Front-ends</h3>
              <RevealLinesOnScroll tag="div" text="If the logic is brilliant but the interface still looks like a dev tool, we build the missing frontstage. Client-safe. Branded. Human-readable." className="font-body text-gray-400 text-lg leading-relaxed mb-10 flex-grow" />
              <div className="mb-12">
                <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent-lightblue border border-accent-lightblue/30 px-4 py-2">
                  Best for: agentic workflows, automation.
                </span>
              </div>
              <a href="#work" className="font-mono group-hover:text-accent-orange transition-colors tracking-[0.3em] text-[10px] uppercase flex items-center gap-4">
                See SuperCrew <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">→</span>
              </a>
            </div>

            {/* Lane 3 */}
            <div className="group flex flex-col p-8 md:p-14 hover:bg-white/[0.02] transition-colors">
              <h3 className="font-display font-black text-4xl mb-8 tracking-tight">Product Systems</h3>
              <RevealLinesOnScroll tag="div" text="For teams that already know the product is the moat and need a lead hand on UX, systems, and execution beyond a single sprint." className="font-body text-gray-400 text-lg leading-relaxed mb-10 flex-grow" />
              <div className="mb-12">
                <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent-lightblue border border-accent-lightblue/30 px-4 py-2">
                  Best for: shipping teams, roadmap execution.
                </span>
              </div>
              <a href="#contact" className="font-mono group-hover:text-accent-orange transition-colors tracking-[0.3em] text-[10px] uppercase flex items-center gap-4 mt-auto">
                Discuss ongoing work <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SELECTED WORK */}
      <section id="work" className="relative w-full min-h-screen snap-start bg-black/40 py-32 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto z-10 relative">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10 gap-6">
            <RevealHeaderOnScroll
              text="Selected work"
              className="font-display font-black text-4xl sm:text-5xl md:text-7xl opacity-90 tracking-tighter"
            />
            <RevealLinesOnScroll
              text="A few things that show the range."
              className="font-mono text-[10px] tracking-[0.3em] opacity-50 uppercase mb-2"
            />
          </div>

          <div className="flex flex-col gap-12 w-full">
            {[
              {
                title: "SuperCrew Studio",
                meta: "AI PRODUCT · UX SYSTEM · FRONTEND DESIGN",
                body: "A white-label mission control layer for AI dev shops and automation teams, built to turn invisible workflow into something clients can actually follow.",
                cta: "Explore case study",
                image: "/projects/supercrew.png",
                link: "https://supercrew.studio"
              },
              {
                title: "AGNC Assistant",
                meta: "AI ASSISTANT · BRAND UX · TOOL DESIGN",
                body: "A studio-grade assistant concept designed to turn brand knowledge into a cleaner, more useful conversational product surface.",
                cta: "View project",
                image: "/projects/assistant.png"
              },
              {
                title: "Curbee",
                meta: "CLIENT PLATFORM · UX SYSTEM · PRODUCT DESIGN",
                body: "Product thinking and interface design for a real operational platform—focused on clarity, momentum, and cleaner workflow surfaces.",
                cta: "View project",
                image: "/projects/curbee.png",
                link: "https://curbee.com"
              },
              {
                title: "Angel Compass",
                meta: "CONCEPT PRODUCT · UX FLOWS · SYSTEM THINKING",
                body: "A social navigation concept that treats nightlife, timing, and chemistry like a readable system instead of pure luck.",
                cta: "View project",
                image: "/projects/angel-compass.png",
                link: "https://angelcompass.ai"
              },
              {
                title: "Illuminadi",
                meta: "IMMERSIVE WEB · CREATIVE DIRECTION · EXPERIENCE DESIGN",
                body: "A theatrical digital experience built to feel more like an activated shrine than a standard portfolio site.",
                cta: "View project",
                image: "/projects/illuminadi.png"
              }
            ].map((proj, i) => (
              <HoverRevealCard key={proj.title} proj={proj} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEPLOYMENT PHASE / PROCESS */}
      <ProcessSection />

      {/* 6. AGNC.LAB */}
      <section className="relative w-full py-40 snap-center bg-black border-y border-white/5 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 z-10 relative">
          <div className="flex-1">
            <RevealHeaderOnScroll tag="h2" text="AGNC.LAB" className="font-display font-black text-[clamp(2.5rem,5vw,4rem)] text-white mb-4 tracking-tighter" />
            <p className="font-mono text-accent-lightblue/80 text-[10px] tracking-[0.4em] uppercase mb-8">Experiments, prototypes, and active investigations.</p>
            <RevealLinesOnScroll tag="div" text="Loose studies from the studio—ideas in motion, surfaces in development, systems still becoming." className="font-body text-gray-400 max-w-lg leading-relaxed text-lg" />
          </div>
          <a href="#" className="border border-white/10 font-mono text-[10px] text-white hover:bg-white hover:text-black transition-all duration-500 px-10 py-5 tracking-[0.3em] uppercase shrink-0">
            Open archive
          </a>
        </div>
      </section>

      {/* 5. CONTACT */}
      <section id="contact" className="relative w-full min-h-screen snap-center flex items-center justify-center p-6 bg-black text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <RevealHeaderOnScroll tag="h2" text="Start your next project" className="font-display font-black text-[clamp(3rem,8vw,7rem)] mb-8 tracking-tighter leading-none" />
          <p className="font-mono text-accent-lightblue tracking-[0.4em] text-[10px] mb-14 uppercase">
            Tell us what you’re building and what it needs to do on screen.
          </p>
          <RevealLinesOnScroll tag="div" text="If the idea is strong but the interface still isn’t there yet, that’s where AGNC comes in." className="font-body text-2xl md:text-3xl text-gray-400 mb-20 leading-relaxed max-w-3xl" />

          <button onClick={() => setIsIntakeOpen(true)} className="bg-white text-black px-16 py-6 font-mono font-black tracking-[0.3em] uppercase hover:bg-white/80 active:scale-95 transition-all text-xs mb-16">
            Get in touch
          </button>

          <p className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">
            Prefer email? <a href="mailto:agw@duck.com" className="text-white hover:text-accent-orange transition-colors underline underline-offset-[10px] decoration-white/20 pointer-events-auto pl-2">agw@duck.com</a>
          </p>
        </div>
      </section>

      <IntakeModal isOpen={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </main>
  );
}
