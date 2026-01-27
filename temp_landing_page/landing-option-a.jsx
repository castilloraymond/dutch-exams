import React, { useState } from 'react';

export default function LandingPageA() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        
        .headline-font { font-family: 'Playfair Display', serif; }
        .body-font { font-family: 'DM Sans', sans-serif; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
        
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        
        .cta-button {
          background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .feature-card {
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Navigation */}
      <nav className="body-font flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">P</span>
          </div>
          <span className="font-semibold text-[#1a1a1a] text-lg">passinburgering</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#666]">
          <a href="#features" className="hover:text-[#1a1a1a] transition-colors">Features</a>
          <a href="#pricing" className="hover:text-[#1a1a1a] transition-colors">Pricing</a>
          <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#333] transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="animate-fade-up delay-1">
          <span className="inline-block px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-8">
            The exam simulator built for expats
          </span>
        </div>
        
        <h1 className="headline-font text-5xl md:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6 animate-fade-up delay-2">
          Pass Your Inburgering.<br />
          <span className="text-[#FF6B35]">First Try.</span>
        </h1>
        
        <p className="body-font text-xl text-[#666] max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-3">
          Practice on a computer, exactly like the real exam. No courses. No tutors. 
          Just realistic test simulations that build your confidence.
        </p>

        {/* Email Capture */}
        <div className="animate-fade-up delay-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 rounded-xl border border-[#e5e5e5] bg-white text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
            />
            <button 
              className="cta-button px-8 py-4 text-white rounded-xl font-medium whitespace-nowrap"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Free Trial →
            </button>
          </div>
          <p className="text-sm text-[#999]">Free 15-minute practice session. No credit card required.</p>
        </div>
      </main>

      {/* Social Proof Bar */}
      <div className="bg-[#1a1a1a] py-6">
        <div className="max-w-4xl mx-auto px-8 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
          <span>Trusted by expats at</span>
          <span className="text-white font-medium">Booking.com</span>
          <span className="text-white font-medium">ASML</span>
          <span className="text-white font-medium">Adyen</span>
          <span className="text-white font-medium">Shell</span>
          <span className="text-white font-medium">ING</span>
        </div>
      </div>

      {/* Key Differentiator Section */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="headline-font text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Why This Works
            </h2>
            <p className="body-font text-lg text-[#666] max-w-xl mx-auto">
              Other apps teach Dutch. We teach you to pass the exam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card bg-[#FAFAF9] rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="headline-font text-xl font-semibold text-[#1a1a1a] mb-3">
                Real Exam Interface
              </h3>
              <p className="body-font text-[#666] leading-relaxed">
                Practice on a computer interface that mirrors the actual test. No surprises on exam day.
              </p>
            </div>

            <div className="feature-card bg-[#FAFAF9] rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="headline-font text-xl font-semibold text-[#1a1a1a] mb-3">
                Built for Efficiency
              </h3>
              <p className="body-font text-[#666] leading-relaxed">
                Skip the 6-month courses. Practice tests get you exam-ready in weeks, not months.
              </p>
            </div>

            <div className="feature-card bg-[#FAFAF9] rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="headline-font text-xl font-semibold text-[#1a1a1a] mb-3">
                A0-A1 Level Focus
              </h3>
              <p className="body-font text-[#666] leading-relaxed">
                Content calibrated exactly to inburgering requirements. Every question serves your goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="headline-font text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Complete Exam Coverage
            </h2>
            <p className="body-font text-lg text-[#666]">
              All modules. One platform. One goal: your permanent residence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Reading', status: 'available', icon: '📖' },
              { name: 'Listening', status: 'coming', icon: '🎧' },
              { name: 'Writing', status: 'coming', icon: '✍️' },
              { name: 'Speaking', status: 'coming', icon: '🗣️' },
              { name: 'KNM', status: 'coming', icon: '🏛️' },
              { name: 'ONA', status: 'coming', icon: '🎯' },
            ].map((module, i) => (
              <div 
                key={i}
                className={`p-6 rounded-xl text-center ${
                  module.status === 'available' 
                    ? 'bg-white border-2 border-[#FF6B35] shadow-lg' 
                    : 'bg-white border border-[#e5e5e5]'
                }`}
              >
                <span className="text-3xl mb-3 block">{module.icon}</span>
                <h4 className="font-semibold text-[#1a1a1a] mb-1">{module.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.status === 'available'
                    ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                    : 'bg-[#f5f5f5] text-[#999]'
                }`}>
                  {module.status === 'available' ? 'Available Now' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="headline-font text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Pass Your Exam?
          </h2>
          <p className="body-font text-lg text-white/70 mb-10">
            Join thousands of expats who chose practice over courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF6B35] transition-all"
            />
            <button className="px-8 py-4 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#e55a2b] transition-colors whitespace-nowrap">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <span>© 2026 passinburgering.com</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
