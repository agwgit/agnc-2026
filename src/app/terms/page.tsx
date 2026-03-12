"use client";

import Link from "next/link";
import Starfield from "@/components/Starfield";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <main id="main-scroller" className="w-full h-screen overflow-y-auto bg-black text-white selection:bg-accent-blue/30 font-body relative">
            <Starfield />
            <Logo isDocked={true} />

            {/* Back to Home */}
            <nav className="fixed top-8 left-6 sm:left-12 z-[100]">
                <Link
                    href="/"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white flex items-center gap-3 group transition-all"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> BACK TO HOME
                </Link>
            </nav>

            <div className="max-w-3xl mx-auto pt-48 pb-32 px-6 relative z-10">
                <h1 className="font-display font-black text-5xl sm:text-7xl mb-6 tracking-tighter text-white">Terms of Service</h1>
                <p className="font-mono text-accent-lightblue text-[11px] tracking-[0.4em] uppercase mb-20 border-b border-white/10 pb-12">Effective Date: July 15, 2025</p>

                <div className="space-y-16 text-gray-400 leading-relaxed text-lg sm:text-xl">
                    <section>
                        <p className="text-white text-xl sm:text-2xl font-light italic opacity-90 leading-relaxed">
                            Welcome to AGNC. By accessing or using our website, tools, templates, and services (collectively the "Service"), you agree to be bound by the following terms and conditions.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">1. Use of Service</h2>
                        <div className="space-y-6">
                            <p className="text-white/80">You agree to use the Service for lawful purposes only. You may not:</p>
                            <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                <li>Use our systems to distribute spam or malicious content</li>
                                <li>Submit false, harmful, or unauthorized data</li>
                                <li>Reverse-engineer, copy, or resell AGNC tools or visual systems</li>
                                <li>Attempt to interfere with the platform's security or infrastructure</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">2. AI-Powered Content</h2>
                        <div className="space-y-6">
                            <p className="text-white/80">AGNC may use artificial intelligence and third-party tools to enhance or generate portions of the Service. You acknowledge:</p>
                            <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                <li>Some outputs may be AI-assisted or AI-generated.</li>
                                <li>While we strive for accuracy and originality, AI-generated results may not be unique or free of error.</li>
                                <li>You are solely responsible for reviewing and deciding how to use any outputs or content derived from our tools.</li>
                                <li>We do not grant warranties on the originality, fitness for a particular purpose, or copyright protection of AI-generated content.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">3. User Input and Uploaded Content</h2>
                        <div className="space-y-6">
                            <p className="text-white/80">When you provide or paste data (including JSON profiles, brand inputs, text, or feedback):</p>
                            <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                <li>You grant AGNC a non-exclusive license to process that data for the purpose of delivering personalized or dynamic experiences.</li>
                                <li>You confirm you have the right to submit the content, and that it does not violate any rights or laws.</li>
                                <li>You may not upload sensitive personal data (e.g., passwords, financial records) unless explicitly requested.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">4. Referral & Customization Features</h2>
                        <div className="space-y-6">
                            <p className="text-white/80">AGNC may offer referral or dynamic customization features using unique links or local data. You acknowledge that:</p>
                            <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                <li>Profile customization and personalized views are stored locally or passed via URL query strings.</li>
                                <li>AGNC is not liable for incorrect data behavior caused by malformed links or user modification.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">5. Limitation of Liability</h2>
                        <p>AGNC is provided on an "as-is" basis. We make no guarantees regarding uptime, accuracy, or performance. In no event shall AGNC, its founders, or affiliates be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">6. Termination</h2>
                        <p>We reserve the right to suspend or terminate access at any time for behavior that violates these Terms or puts the platform or users at risk.</p>
                    </section>

                    <section className="space-y-8 border-t border-white/5 pt-12">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">7. Changes</h2>
                        <p>We may update these Terms periodically. Continued use of the Service constitutes acceptance of the revised terms.</p>
                    </section>
                </div>

            </div>
            <Footer />
        </main>
    );
}
