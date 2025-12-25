import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current, { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" });
    }

    if (cardsRef.current) {
      const nodes = cardsRef.current.querySelectorAll('.home-card');
      gsap.from(nodes, { opacity: 0, y: 18, stagger: 0.08, duration: 0.6, ease: "power3.out" });
    }
  }, []);

  return (
    <div className="page-wrapper bg-gray-50 dark:bg-slate-900">
      <div className="container-2xl container-base mx-auto px-responsive py-12 sm:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16" ref={heroRef}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
            <span className="text-3xl">🏛️</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Master DSA with <span className="bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">CodeArena</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Structured practice, progress tracking, and interview-ready preparation. Learn DSA the right way.
          </p>
          <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95">
            Get Started →
          </Link>
        </div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" ref={cardsRef}>
          {/* Striver Sheet */}
          <Link to="/sheet/striver" className="group home-card">
            <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📘</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Striver DSA Sheet</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Complete roadmap with 170+ problems</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Start Learning <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Love Babbar */}
          <Link to="/sheet/love-babbar" className="group home-card">
            <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:border-pink-300 dark:hover:border-pink-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-pink-50 to-transparent dark:from-pink-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">❤️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Love Babbar Sheet</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">450+ problems by Love Babbar</p>
                <div className="flex items-center text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Start Learning <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* FAANG */}
          <Link to="/company/faang" className="group home-card">
            <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">FAANG Problems</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Real interview questions</p>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Explore <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Dashboard */}
          <Link to="/dashboard" className="group home-card">
            <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:border-green-300 dark:hover:border-green-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Track stats & streaks</p>
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  View Dashboard <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-12 border border-gray-200 dark:border-slate-700 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            ✨ Why CodeArena?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📚", title: "Curated Sheets", desc: "Multiple structured DSA problem sets" },
              { icon: "📈", title: "Progress Tracking", desc: "Track your learning journey with detailed stats" },
              { icon: "🔥", title: "Streak System", desc: "Stay motivated with daily streak tracking" },
              { icon: "🏢", title: "Company Problems", desc: "Prep for interviews with real questions" },
              { icon: "🌙", title: "Dark Mode", desc: "Easy on the eyes, day or night" },
              { icon: "📤", title: "Export Progress", desc: "Download your progress as CSV" },
            ].map((feature, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to master DSA?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your journey today and become a DSA expert. Thousands have already begun.
            </p>
            <Link to="/sheet/striver" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95">
              Start Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
