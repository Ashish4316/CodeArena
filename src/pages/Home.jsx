import { useState, useEffect, useRef } from "react";
import { SplineScene } from "../components/ui/splite";
import { Spotlight } from "../components/ui/spotlight";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardsRef = useRef([]);
  const heroRef = useRef(null);

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    setIsVisible(true);
    
    // Staggered entrance animation for cards
    const timer = setTimeout(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          setTimeout(() => {
            card.classList.add('card-enter');
          }, index * 100);
        }
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- Mouse Tracking ---------------- */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ---------------- Cards ---------------- */
  const cards = [
    {
      to: "/sheet/striver",
      icon: "📘",
      image: "https://cdn-1.webcatalog.io/catalog/takeuforward/takeuforward-icon-filled-256.webp?v=1753834971054",
      title: "Striver's Sheet",
      desc: "Complete roadmap with 170+ problems",
      gradient: "from-gray-400 to-gray-600",
      borderColor: "border-gray-200 dark:border-gray-700",
      pulseBorderColor: "border-gray-400/30",
      hoverGlow: "hover:shadow-gray-400/20"
    },
    {
      to: "/sheet/love-babbar",
      icon: "❤️",
      title: "Love Babbar Sheet",
      desc: "450+ problems by Love Babbar",
      gradient: "from-gray-300 to-gray-500",
      borderColor: "border-gray-200 dark:border-gray-700",
      pulseBorderColor: "border-gray-400/30",
      hoverGlow: "hover:shadow-gray-400/20"
    },
    {
      to: "/sheet/faang-sheet",
      icon: "🏢",
      title: "FAANG Problems",
      desc: "Real interview questions from top companies",
      gradient: "from-gray-400 to-gray-600",
      borderColor: "border-gray-200 dark:border-gray-700",
      pulseBorderColor: "border-gray-400/30",
      hoverGlow: "hover:shadow-gray-400/20"
    },
    {
      to: "/dashboard",
      icon: "📊",
      title: "Dashboard",
      desc: "Track stats & streaks with analytics",
      gradient: "from-gray-300 to-gray-500",
      borderColor: "border-gray-200 dark:border-gray-700",
      pulseBorderColor: "border-gray-400/30",
      hoverGlow: "hover:shadow-gray-400/20"
    },
  ];

  /* ---------------- Features ---------------- */
  const features = [
    { icon: "📚", title: "Curated Sheets", desc: "Structured DSA problem sets" },
    { icon: "📈", title: "Progress Tracking", desc: "Detailed stats & insights" },
    { icon: "🔥", title: "Streak System", desc: "Daily motivation" },
    { icon: "🏢", title: "Company Problems", desc: "FAANG questions" },
    { icon: "🎨", title: "Unified Theme", desc: "Consistent UI" },
    { icon: "📤", title: "Export Progress", desc: "CSV reports" },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle dark mesh blobs */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute w-[800px] h-[800px] bg-gradient-to-r from-gray-900/80 to-gray-800/50 rounded-full animate-spin-slow"
            style={{ left: '20%', top: '10%', animationDirection: 'reverse' }}
          />
          <div
            className="absolute w-[600px] h-[600px] bg-gradient-to-r from-gray-950/90 to-gray-800/50 rounded-full animate-spin"
            style={{ right: '15%', bottom: '20%' }}
          />
        </div>

        {/* Mouse follow grey glow */}
        <div
          className="absolute w-[500px] h-[500px] bg-gray-700/20 blur-3xl rounded-full transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x / 10 - 250,
            top: mousePosition.y / 10 - 250,
          }}
        />
      </div>

      {/* ================= FLOATING PARTICLES ================= */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* ================= 🤖 SPLINE ROBOT HERO ================= */}
      <div className="relative w-full px-4 md:px-6 pt-6 pb-8">
        <div
          className={`relative overflow-visible transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Subtle grey spotlight */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="#1f2937"
          />

          <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
            {/* Left: text content */}
            <div className="flex-1 px-4 md:px-10 py-10 md:py-12 relative z-10 flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 relative">
                <span className="text-white">Master</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700 animate-gradient">
                  DSA
                </span>
              </h1>

              <p className="text-gray-400 max-w-md mb-8 text-base leading-relaxed">
                Structured practice, analytics, and interview-ready preparation.
                From Striver's sheet to FAANG problems — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/dashboard"
                  className="relative px-8 py-3 bg-gray-100 text-black font-semibold rounded-xl shadow-lg hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-300 text-center"
                >
                  Get Started 🚀
                </a>
                <a
                  href="/sheet/striver"
                  className="px-8 py-3 border border-gray-700 text-gray-200 font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300 text-center"
                >
                  View Sheets
                </a>
              </div>
            </div>

            {/* Right: 3D Spline robot */}
            <div className="flex-1 md:flex-[1.15] relative min-h-[50vh] md:min-h-0 z-20">
              <div className="absolute inset-0">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full min-h-[50vh] md:min-h-[calc(100vh-4rem)] pointer-events-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARDS + FEATURES + FOOTER ================= */}
      <div className="relative max-w-7xl mx-auto px-6 pb-24">
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 mt-16">
          {cards.map((card, idx) => (
            <a
              key={idx}
              href={card.to}
              ref={el => cardsRef.current[idx] = el}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative card-interactive"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-105`} />
              
              {/* Pulsing Border - FIXED: Using predefined classes */}
              <div className={`absolute -inset-1 rounded-2xl border-2 ${card.pulseBorderColor} animate-pulse-slow opacity-0 group-hover:opacity-100`} />
              
              {/* Card Content */}
              <div className={`relative p-6 rounded-2xl bg-gray-950 border border-gray-800 shadow-sm hover:shadow-md transition-all duration-500 group-hover:scale-[1.02] ${card.hoverGlow} card-content`}>
                {/* Icon with animation */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-white transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {card.desc}
                </p>
                
                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-gray-950 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-all duration-500 hover:scale-[1.02] group"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="text-3xl mb-4 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 inline-block">
                {f.icon}
              </div>
              <h4 className="font-bold mb-2 text-lg text-gray-100 group-hover:text-white transition-colors duration-300">
                {f.title}
              </h4>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-400">
          <span className="animate-pulse">❤️</span> © 2024 CodeArena · Built with passion
        </footer>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes ping-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 20s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .card-enter {
          animation: card-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        /* Selection color */
        ::selection {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }
        
        /* Focus styles */
        *:focus {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          outline-offset: 2px;
        }
        
        /* Card hover effects */
        .card-content {
          position: relative;
          overflow: hidden;
        }
        
        .card-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.7s ease;
        }
        
        .card-content:hover::before {
          left: 100%;
        }
        
        /* Button hover effects */
        .group:hover .group-hover\:translate-x-0 {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default Home;