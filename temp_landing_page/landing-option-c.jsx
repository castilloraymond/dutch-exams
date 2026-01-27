import React, { useState } from 'react';

export default function LandingPageC() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F5F2]" style={{ fontFamily: "'Source Serif 4', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap');
        
        .serif { font-family: 'Source Serif 4', serif; }
        .sans { font-family: 'Outfit', sans-serif; }
        
        @keyframes reveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-reveal {
          animation: reveal 0.7s ease-out forwards;
        }
        
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.2s; opacity: 0; }
        .d3 { animation-delay: 0.3s; opacity: 0; }
        .d4 { animation-delay: 0.4s; opacity: 0; }
        
        .orange-accent { color: #E85D04; }
        .orange-bg { background-color: #E85D04; }
        .blue-accent { color: #1E3A5F; }
        
        .hero-gradient {
          background: linear-gradient(180deg, #F7F5F2 0%, #FFF9F5 100%);
        }
        
        .trust-card {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        
        .trust-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
        
        .cta-primary {
          background: #E85D04;
          transition: all 0.3s ease;
        }
        
        .cta-primary:hover {
          background: #d45404;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(232, 93, 4, 0.3);
        }
        
        .checkmark {
          color: #22c55e;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sans flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-2 h-8 bg-[#E85D04] rounded-sm"></div>
            <div className="w-2 h-8 bg-[#1E3A5F] rounded-sm ml-0.5"></div>
          </div>
          <span className="font-semibold text-[#1E3A5F] text-lg ml-2">passinburgering</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="text-[#1E3A5F]/60 hover:text-[#1E3A5F] transition-colors">About</a>
          <a href="#" className="text-[#1E3A5F]/60 hover:text-[#1E3A5F] transition-colors">Pricing</a>
          <button className="px-5 py-2.5 border border-[#1E3A5F]/20 text-[#1E3A5F] rounded-lg text-sm font-medium hover:bg-[#1E3A5F]/5 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero-gradient">
        <div className="max-w-4xl mx-auto px-8 pt-16 pb-20 text-center">
          <div className="animate-reveal d1">
            <div className="sans inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-[#1E3A5F]/70 mb-8 border border-[#1E3A5F]/5">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full"></span>
              Trusted by 2,000+ expats in the Netherlands
            </div>
          </div>
          
          <h1 className="serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1E3A5F] leading-tight mb-6 animate-reveal d2">
            The Fastest Path to<br />
            <span className="orange-accent">Passing Your Inburgering</span>
          </h1>
          
          <p className="sans text-lg text-[#1E3A5F]/60 max-w-xl mx-auto mb-10 leading-relaxed animate-reveal d3">
            Skip the courses. Practice with realistic exam simulations on a computer—exactly like the real test. Built by expats, for expats.
          </p>

          {/* Email Capture */}
          <div className="animate-reveal d4">
            <div className="inline-flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-[#1E3A5F]/5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="sans px-5 py-3.5 rounded-xl bg-[#F7F5F2] text-[#1E3A5F] placeholder-[#1E3A5F]/40 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 min-w-[280px]"
              />
              <button className="cta-primary px-8 py-3.5 text-white rounded-xl font-medium sans whitespace-nowrap">
                Start Free Practice
              </button>
            </div>
            <p className="sans text-sm text-[#1E3A5F]/40 mt-4">15-minute free trial • No credit card required</p>
          </div>
        </div>
      </main>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-[#1E3A5F]/5">
        <div className="max-w-4xl mx-auto px-8">
          <div className="sans grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-semibold text-[#1E3A5F]">93%</div>
              <div className="text-sm text-[#1E3A5F]/50">Pass rate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1E3A5F]">2,500+</div>
              <div className="text-sm text-[#1E3A5F]/50">Practice questions</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1E3A5F]">A0-A1</div>
              <div className="text-sm text-[#1E3A5F]/50">Level aligned</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1E3A5F]">6</div>
              <div className="text-sm text-[#1E3A5F]/50">Exam modules</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem / Solution */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Problem */}
            <div>
              <span className="sans text-sm font-medium text-[#E85D04] tracking-wide uppercase">The Problem</span>
              <h2 className="serif text-3xl font-semibold text-[#1E3A5F] mt-3 mb-6">
                Current options don't prepare you for the actual exam
              </h2>
              <div className="space-y-4 sans">
                {[
                  "Duolingo teaches Dutch, not the exam format",
                  "Tutors are expensive and slow (€40-80/hour)",
                  "Courses take 6+ months you don't have",
                  "Practice books don't simulate computer-based tests"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-[#1E3A5F]/70">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="trust-card rounded-2xl p-8">
              <span className="sans text-sm font-medium text-[#22c55e] tracking-wide uppercase">The Solution</span>
              <h2 className="serif text-3xl font-semibold text-[#1E3A5F] mt-3 mb-6">
                Practice like it's the real exam
              </h2>
              <div className="space-y-4 sans">
                {[
                  "Computer-based interface mirrors the actual test",
                  "Questions calibrated to A0-A1 exam requirements",
                  "Practice in 15-minute sessions that fit your schedule",
                  "Instant feedback so you learn from mistakes"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-[#1E3A5F]">
                    <span className="checkmark mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <span className="sans text-sm font-medium text-[#E85D04] tracking-wide uppercase">Complete Coverage</span>
            <h2 className="serif text-3xl md:text-4xl font-semibold text-[#1E3A5F] mt-3">
              Every Module You Need to Pass
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Lezen (Reading)', icon: '📖', status: 'live', desc: 'Supermarket signs to official letters' },
              { name: 'Luisteren (Listening)', icon: '🎧', status: 'soon', desc: 'Announcements & conversations' },
              { name: 'Schrijven (Writing)', icon: '✍️', status: 'soon', desc: 'Forms and short messages' },
              { name: 'Spreken (Speaking)', icon: '🗣️', status: 'soon', desc: 'Everyday scenarios' },
              { name: 'KNM (Dutch Society)', icon: '🏛️', status: 'soon', desc: 'Culture, history, values' },
              { name: 'ONA (Orientation)', icon: '🧭', status: 'soon', desc: 'Work & education planning' },
            ].map((mod, i) => (
              <div 
                key={i}
                className={`trust-card rounded-xl p-5 ${mod.status === 'live' ? 'ring-2 ring-[#E85D04] ring-offset-2' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{mod.icon}</span>
                  {mod.status === 'live' ? (
                    <span className="sans text-xs bg-[#E85D04] text-white px-2 py-1 rounded font-medium">AVAILABLE</span>
                  ) : (
                    <span className="sans text-xs bg-[#F7F5F2] text-[#1E3A5F]/50 px-2 py-1 rounded">SOON</span>
                  )}
                </div>
                <h3 className="sans font-semibold text-[#1E3A5F] mb-1">{mod.name}</h3>
                <p className="sans text-sm text-[#1E3A5F]/50">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Placeholder */}
      <section className="py-20 bg-[#1E3A5F]">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <div className="sans text-white/50 text-sm mb-6">WHAT EXPATS SAY</div>
          <blockquote className="serif text-2xl md:text-3xl text-white leading-relaxed mb-8">
            "After months of Duolingo and €500 on a tutor, I still wasn't confident. Two weeks of practice tests here and I passed first try."
          </blockquote>
          <div className="sans">
            <div className="text-white font-medium">Sarah K.</div>
            <div className="text-white/50 text-sm">Software Engineer at Booking.com</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="serif text-3xl md:text-4xl font-semibold text-[#1E3A5F] mb-4">
            Your Permanent Residence<br />Starts Here
          </h2>
          <p className="sans text-[#1E3A5F]/60 mb-10">
            Join thousands of expats who chose practice over courses.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-[#1E3A5F]/5">
            <input
              type="email"
              placeholder="Enter your email"
              className="sans px-5 py-3.5 rounded-xl bg-[#F7F5F2] text-[#1E3A5F] placeholder-[#1E3A5F]/40 focus:outline-none min-w-[280px]"
            />
            <button className="cta-primary px-8 py-3.5 text-white rounded-xl font-medium sans whitespace-nowrap">
              Start Free Practice
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E3A5F]/10 py-8">
        <div className="max-w-5xl mx-auto px-8 sans flex flex-col md:flex-row items-center justify-between gap-4 text-[#1E3A5F]/40 text-sm">
          <span>© 2026 passinburgering.com • Made in Amsterdam 🇳🇱</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1E3A5F]/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1E3A5F]/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1E3A5F]/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
