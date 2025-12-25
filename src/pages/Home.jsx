import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import robotAnimation from "../assets/robot.json";
import RobotChat from "../components/RobotChat";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [robotMode, setRobotMode] = useState("idle");
  const [showChat, setShowChat] = useState(false);
  const robotRef = useRef(null);
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

  /* ---------------- Robot Animation Control ---------------- */
  useEffect(() => {
    if (!robotRef.current) return;

    if (robotMode === "idle") {
      robotRef.current.playSegments([0, 60], true);
    }

    if (robotMode === "wave") {
      robotRef.current.playSegments([60, 80], true);
    }
  }, [robotMode]);

  /* ---------------- Cards ---------------- */
  const cards = [
    {
      to: "/sheet/striver",
      icon: "📘",
      image:
        "https://cdn-1.webcatalog.io/catalog/takeuforward/takeuforward-icon-filled-256.webp?v=1753834971054",
      title: "Striver's Sheet",
      desc: "Complete roadmap with 170+ problems",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      pulseBorderColor: "border-blue-400/20",
      hoverGlow: "hover:shadow-blue-500/20"
    },
    {
      to: "/sheet/love-babbar",
      icon: "❤️",
      title: "Love Babbar Sheet",
      desc: "450+ problems by Love Babbar",
      gradient: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      borderColor: "border-rose-200 dark:border-rose-800",
      textColor: "text-rose-600 dark:text-rose-400",
      pulseBorderColor: "border-rose-400/20",
      hoverGlow: "hover:shadow-rose-500/20"
    },
    {
      to: "/company/faang",
      icon: "🏢",
      title: "FAANG Problems",
      desc: "Real interview questions from top companies",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      textColor: "text-amber-600 dark:text-amber-400",
      pulseBorderColor: "border-amber-400/20",
      hoverGlow: "hover:shadow-amber-500/20"
    },
    {
      to: "/dashboard",
      icon: "📊",
      title: "Dashboard",
      desc: "Track stats & streaks with analytics",
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      textColor: "text-emerald-600 dark:text-emerald-400",
      pulseBorderColor: "border-emerald-400/20",
      hoverGlow: "hover:shadow-emerald-500/20"
    },
  ];

  /* ---------------- Features ---------------- */
  const features = [
    { icon: "📚", title: "Curated Sheets", desc: "Structured DSA problem sets" },
    { icon: "📈", title: "Progress Tracking", desc: "Detailed stats & insights" },
    { icon: "🔥", title: "Streak System", desc: "Daily motivation" },
    { icon: "🏢", title: "Company Problems", desc: "FAANG questions" },
    { icon: "🌙", title: "Dark Mode", desc: "Eye-friendly UI" },
    { icon: "📤", title: "Export Progress", desc: "CSV reports" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-spin-slow" 
            style={{ 
              left: '20%', 
              top: '10%',
              animationDirection: 'reverse'
            }} 
          />
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full animate-spin" 
            style={{ 
              right: '15%', 
              bottom: '20%' 
            }} 
          />
        </div>

        {/* Mouse follow glow */}
        <div
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl rounded-full transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x / 10 - 300,
            top: mousePosition.y / 10 - 300,
          }}
        />
      </div>

      {/* ================= FLOATING PARTICLES ================= */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* ================= 🤖 AI ROBOT ASSISTANT ================= */}
      <div
        className="fixed bottom-10 right-10 z-30 robot-interactive"
        style={{
          transform: `
            rotateY(${(mousePosition.x - window.innerWidth / 2) / 120}deg)
            rotateX(${-(mousePosition.y - window.innerHeight / 2) / 150}deg)
          `,
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="relative animate-robot-float">
          {/* Interactive Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/40 via-purple-400/30 to-transparent blur-3xl rounded-full pointer-events-none transition-all duration-700 ${
            showChat ? 'scale-150' : 'scale-100'
          }`} />
          
          {/* Pulsing Ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-blue-400/20 animate-ping-slow" />

          {/* Interactive Robot Area */}
          <div
            className="cursor-pointer relative z-10 hover:drop-shadow-glow transition-all duration-300"
            onMouseEnter={() => {
              setRobotMode("wave");
              setShowChat(true);
            }}
            onMouseLeave={() => {
              setRobotMode("idle");
            }}
            onClick={() => {
              setShowChat(!showChat);
            }}
          >
            <Lottie
              lottieRef={robotRef}
              animationData={robotAnimation}
              autoplay
              loop={true}
              className="w-52 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
            
            {/* Interactive Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </div>

          {showChat && (
            <RobotChat onClose={() => setShowChat(false)} />
          )}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* HERO */}
        <div 
          ref={heroRef}
          className={`text-center mb-20 transition-all duration-1000 transform ${
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 relative">
            <span className="relative inline-block">
              Master
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-full" />
            </span>
            {' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
              DSA
            </span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 text-lg relative">
            <span className="bg-gradient-to-r from-gray-800/5 to-gray-800/5 dark:from-white/5 dark:to-white/5 backdrop-blur-sm px-4 py-2 rounded-xl">
              Structured practice, analytics, and interview-ready preparation.
            </span>
          </p>
          
          <a
            href="/dashboard"
            className="relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10">Get Started 🚀</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
          </a>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
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
              <div className={`relative p-6 rounded-2xl bg-white/90 dark:bg-gray-900/90 border ${card.borderColor} backdrop-blur-sm transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${card.hoverGlow} card-content`}>
                {/* Icon with animation */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
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

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white dark:hover:bg-gray-900 group"
              style={{
                transitionDelay: `${i * 50}ms`
              }}
            >
              <div className="text-3xl mb-4 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 inline-block">
                {f.icon}
              </div>
              <h4 className="font-bold mb-2 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {f.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="animate-pulse">❤️</span> © 2024 CodeArena · Built with passion
        </footer>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        @keyframes robot-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          25% { 
            transform: translateY(-20px) rotate(2deg); 
          }
          75% { 
            transform: translateY(-10px) rotate(-2deg); 
          }
        }
        
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
        
        .animate-robot-float {
          animation: robot-float 6s ease-in-out infinite;
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