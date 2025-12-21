import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center bg-bg-secondary">
      <div className="container-tight py-10 md:py-16">

        {/* Compact Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-accent-subtle text-accent text-xs font-semibold tracking-wide mb-4 border border-blue-100 dark:border-blue-900">
            DSA MASTERY
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight leading-tight px-4">
            Master Data Structures <br className="hidden sm:block" />
            <span className="text-gradient">The Right Way</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed px-4">
            Curated sheets, progress tracking, and consistency analytics. Everything you need to crack your next interview.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/sheet/striver" className="btn btn-secondary">
              Browse Sheets
            </Link>
          </div>
        </div>

        {/* Dense Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              to: "/sheet/striver",
              icon: "📘",
              title: "Striver's Sheet",
              desc: "180+ curated problems.",
            },
            {
              to: "/sheet/love-babbar",
              icon: "❤️",
              title: "Love Babbar",
              desc: "450+ deep practice Qs.",
            },
            {
              to: "/company/faang",
              icon: "🏢",
              title: "Company Sets",
              desc: "Amazon, Google, MS.",
            },
            {
              to: "/dashboard",
              icon: "📊",
              title: "Analytics",
              desc: "Track your streaks.",
            }
          ].map((item, idx) => (
            <Link key={idx} to={item.to} className="ui-card p-5 group hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-semibold text-text-primary">{item.title}</h3>
              </div>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Footer/Trust */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center text-sm text-text-tertiary gap-4">
          <div>© 2024 CodeArena. Open Source.</div>
          <div className="flex gap-6">
            <span>10K+ Users</span>
            <span>500K+ Solved</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
