"use client";

import Link from "next/link";
import Starfield from "@/components/Starfield";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
                <h1 className="font-display font-black text-5xl sm:text-7xl mb-6 tracking-tighter text-white">Privacy Policy</h1>
                <p className="font-mono text-accent-lightblue text-[11px] tracking-[0.4em] uppercase mb-20 border-b border-white/10 pb-12">Effective Date: July 15, 2025</p>

                <div className="space-y-16 text-gray-400 leading-relaxed text-lg sm:text-xl">
                    <section>
                        <p className="text-white text-xl sm:text-2xl font-light italic opacity-90 leading-relaxed">
                            Your privacy matters to us. This policy describes how AGNC collects, uses, and protects your information.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">1. What We Collect</h2>
                        <div className="space-y-6">
                            <div>
                                <p className="font-mono text-[11px] text-accent-lightblue/60 uppercase tracking-widest mb-4">We may collect:</p>
                                <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                    <li>JSON inputs, brand descriptions, or visual data you manually submit</li>
                                    <li>Anonymous usage data (e.g., browser, session duration)</li>
                                    <li>Referring URLs (e.g., ?profile= link) for personalization</li>
                                    <li>LocalStorage content for maintaining preferences</li>
                                </ul>
                            </div>

                            <div className="pt-4">
                                <p className="font-mono text-[11px] text-accent-rose/60 uppercase tracking-widest mb-4">We do not collect:</p>
                                <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                                    <li>Credit card data directly</li>
                                    <li>Sensitive personal identifiers (unless explicitly added by you)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">2. How We Use Your Data</h2>
                        <p className="text-white/80">We use your data to:</p>
                        <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                            <li>Provide dynamic personalization in tools and brand experiences</li>
                            <li>Store your brand preferences locally for a smoother return visit</li>
                            <li>Improve our product’s functionality and content experience</li>
                        </ul>
                        <p className="pt-4">We do not sell or rent your data. We do not share identifiable information with third parties unless required by law.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">3. Cookies & LocalStorage</h2>
                        <p className="text-white/80">We use LocalStorage to:</p>
                        <ul className="space-y-4 text-base border-l border-white/5 pl-6">
                            <li>Remember which brand profile you submitted</li>
                            <li>Pre-fill your experience on return</li>
                            <li>Save aesthetic or UX preferences</li>
                        </ul>
                        <p className="pt-4">This does not track you across sites, and no cookie-based tracking is used unless specified for analytics.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">4. Third-Party Tools</h2>
                        <p>AGNC may use third-party services (e.g., analytics, AI models, hosting platforms). These providers may collect limited data as needed to deliver their services. We strive to work only with GDPR/CCPA-compliant vendors.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">5. Security</h2>
                        <p>We use industry-standard practices to protect your data. However, no system is 100% secure. By using the Service, you accept this risk.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">6. Children's Privacy</h2>
                        <p>AGNC is not intended for users under 13 years of age. We do not knowingly collect information from children.</p>
                    </section>

                    <section className="space-y-8 border-t border-white/5 pt-12">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">7. Changes to this Policy</h2>
                        <p>We may revise this Privacy Policy from time to time. Updates will be posted to this page with a new effective date.</p>
                    </section>
                </div>

            </div>
            <Footer />
        </main>
    );
}
