export function Testimonials() {
    return (
        <section className="py-20 bg-[var(--landing-navy)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* User Testimonials */}
                <div className="text-center mb-12">
                    <span className="font-sans-landing inline-block text-xs font-medium tracking-wide uppercase text-[var(--landing-orange)] bg-[var(--landing-orange)]/20 px-3 py-1.5 rounded-full mb-4">
                        Success Stories
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white">
                        What Other Expats Say
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {/* Maria - Duolingo story */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--landing-orange)] to-[var(--landing-orange)]/70 flex items-center justify-center text-white font-semibold text-lg">
                                MS
                            </div>
                            <div>
                                <div className="font-sans-landing font-semibold text-white">Maria S.</div>
                                <div className="font-sans-landing text-xs text-white/50">From Brazil, 200+ day Duolingo streak</div>
                            </div>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, j) => (
                                <svg key={j} className="w-4 h-4 text-[var(--landing-orange)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="font-sans-landing text-white/80 text-sm leading-relaxed">
                            &ldquo;I had a <strong className="text-white">200-day Duolingo streak</strong> and still failed my first mock exam here. <em className="text-[var(--landing-orange)]">Knowing vocabulary isn&apos;t the same as knowing the exam format.</em> Once I practiced the actual question types and timing, the real test felt easy.&rdquo;
                        </p>
                    </div>

                    {/* Andrei - Tutor story */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--landing-orange)] to-[var(--landing-orange)]/70 flex items-center justify-center text-white font-semibold text-lg">
                                AK
                            </div>
                            <div>
                                <div className="font-sans-landing font-semibold text-white">Andrei K.</div>
                                <div className="font-sans-landing text-xs text-white/50">From Romania, spent €800 on tutoring</div>
                            </div>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, j) => (
                                <svg key={j} className="w-4 h-4 text-[var(--landing-orange)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="font-sans-landing text-white/80 text-sm leading-relaxed">
                            &ldquo;My tutor was great at teaching Dutch, but <strong className="text-white">she didn&apos;t prepare me for exam day</strong>. €800 later, I <em className="text-[var(--landing-orange)]">still didn&apos;t know what the actual test looked like</em>. This platform showed me exactly what to expect. Passed first try.&rdquo;
                        </p>
                    </div>

                    {/* Priya - Flexibility story */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--landing-orange)] to-[var(--landing-orange)]/70 flex items-center justify-center text-white font-semibold text-lg">
                                PM
                            </div>
                            <div>
                                <div className="font-sans-landing font-semibold text-white">Priya M.</div>
                                <div className="font-sans-landing text-xs text-white/50">From India, busy work schedule</div>
                            </div>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, j) => (
                                <svg key={j} className="w-4 h-4 text-[var(--landing-orange)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="font-sans-landing text-white/80 text-sm leading-relaxed">
                            &ldquo;Between work and kids, <strong className="text-white">I couldn&apos;t commit to tutor schedules</strong>. Here I practiced at midnight, on lunch breaks, whenever I had 20 minutes. <em className="text-[var(--landing-orange)]">The instant feedback helped me learn faster than any classroom.</em>&rdquo;
                        </p>
                    </div>
                </div>

                {/* Founder Story - Rewritten */}
                <div className="max-w-3xl mx-auto">
                    <div className="font-sans-landing text-white/50 text-sm text-center mb-8 uppercase tracking-wide">
                        Why I Built This
                    </div>

                    <div className="text-center">
                        <blockquote className="font-serif text-xl md:text-2xl text-white leading-relaxed mb-8">
                            &ldquo;I built this to solve my own problem. I didn&apos;t have much time, <strong>Duolingo wasn&apos;t working</strong>, and my tutor — while nice — was more focused on general language skills than <em className="text-[var(--landing-orange)]">actually passing the test</em>. We just didn&apos;t click.
                        </blockquote>

                        <p className="font-sans-landing text-white/70 text-lg leading-relaxed mb-6">
                            For expats, <strong className="text-white">the inburgering exam is scary</strong>. It&apos;s filled with unknowns. And we don&apos;t have time to waste on things that don&apos;t work.
                        </p>

                        <p className="font-sans-landing text-white/70 text-lg leading-relaxed mb-8">
                            What I needed was simple: <em className="text-[var(--landing-orange)]">practice with the exact type of questions I&apos;d face</em>, get familiar with the test format, and build the confidence to walk in ready. I couldn&apos;t find it anywhere — so after I passed, I built it myself.&rdquo;
                        </p>

                        <div className="font-sans-landing">
                            <div className="text-white font-medium">- Raymond</div>
                            <div className="text-white/50 text-sm mt-1">Passed Inburgering 2024</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
