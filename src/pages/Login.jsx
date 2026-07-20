import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransport } from '../context/TransportContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useTransport();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    login();
    navigate('/dashboard');
  };

  // List of watermark texts floating in the background
  const watermarks = [
    { text: "Thousands of student exchange programs.", x: "12%", y: "15%", color: "text-[#1e3a8a]/20" },
    { text: "8000+ patients a day.", x: "32%", y: "8%", color: "text-[#1e3a8a]/25" },
    { text: "India's best private research university.", x: "10%", y: "45%", color: "text-[#2563eb]/20" },
    { text: "Chennai best law college.", x: "70%", y: "22%", color: "text-[#1e3a8a]/20" },
    { text: "Study Flex - Unique Choice based system", x: "65%", y: "82%", color: "text-[#d97706]/40" },
    { text: "Best Dental college in India.", x: "28%", y: "40%", color: "text-[#d97706]/35" },
    { text: "Ranked Best medical College in chennai.", x: "72%", y: "50%", color: "text-[#1e3a8a]/20" },
    { text: "Dual degree options.", x: "74%", y: "68%", color: "text-[#2563eb]/20" },
    { text: "15,000 crores to service.", x: "30%", y: "18%", color: "text-[#2563eb]/15" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col justify-between items-center p-6 relative overflow-hidden select-none">
      
      {/* Scattered background watermarks */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {watermarks.map((wm, idx) => (
          <div
            key={idx}
            className={`absolute font-bold text-xs md:text-sm tracking-wide ${wm.color}`}
            style={{ left: wm.x, top: wm.y }}
          >
            {wm.text}
          </div>
        ))}
      </div>

      {/* Mobile background watermarks */}
      <div className="absolute inset-0 pointer-events-none block md:hidden">
        <div className="absolute left-[5%] top-[10%] font-bold text-xs text-[#1e3a8a]/15">
          Thousands of student exchange programs.
        </div>
        <div className="absolute right-[5%] top-[25%] font-bold text-xs text-[#d97706]/20">
          Study Flex - Unique Choice based system
        </div>
        <div className="absolute left-[8%] bottom-[20%] font-bold text-xs text-[#2563eb]/15">
          India's best private research university.
        </div>
      </div>

      {/* Top Section: SAVITHA logo & Header */}
      <div className="flex flex-col items-center mt-12 z-10">
        <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center p-2 mb-3">
          {/* Savitha Crest Vector Simulation */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#0f4c81]" fill="currentColor">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#003566" strokeWidth="4" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0f4c81" strokeWidth="1" strokeDasharray="4" />
            {/* Inner Shield / Crest representation */}
            <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" fill="#003566" />
            <path d="M50 23 L72 37 L72 63 L50 77 L28 63 L28 37 Z" fill="#ffffff" />
            {/* Book & Gear symbol */}
            <path d="M40 40 H60 V55 H40 Z" fill="#e0a96d" />
            <circle cx="50" cy="62" r="6" fill="#0f4c81" />
            {/* Year */}
            <text x="50" y="32" fontSize="5" textAnchor="middle" fill="#003566" fontWeight="bold">2005</text>
            <text x="50" y="73" fontSize="4.5" textAnchor="middle" fill="#003566" fontWeight="bold">SAVEETHA</text>
          </svg>
        </div>
        <h2 className="text-[#003566] text-lg font-extrabold tracking-widest text-center">
          SIMATS ADMISSIONS
        </h2>
      </div>

      {/* Center Section: Google Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl flex flex-col justify-center items-center z-10 my-6"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-xs text-slate-400 text-center leading-relaxed mb-8 max-w-[280px]">
          Login required for transparency and to prevent duplicate or fraudulent applications.
        </p>

        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all py-3.5 px-6 rounded-xl shadow-sm text-slate-700 font-semibold text-sm cursor-pointer"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.4 3.65 1.48 7.5l3.85 3c.9-2.7 3.42-4.46 6.67-4.46z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.69z"
            />
            <path
              fill="#FBBC05"
              d="M5.33 10.5a7.16 7.16 0 010-3c-.9-2.7-3.42-4.46-6.67-4.46L1.48 7.5A11.95 11.95 0 0012 12c.3 0 .6-.02.89-.06l-3.7-2.87c-1.13.79-2.5 1.25-3.86 1.43z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.12.75-2.55 1.2-4.26 1.2-3.25 0-5.77-1.76-6.67-4.46L1.48 16.5C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="w-full flex items-center justify-center gap-2 mt-8">
          <div className="h-[1px] bg-slate-100 flex-1"></div>
          <span className="text-[9px] text-slate-400 font-bold tracking-widest">
            SECURE AUTHENTICATION
          </span>
          <div className="h-[1px] bg-slate-100 flex-1"></div>
        </div>
      </motion.div>

      {/* Bottom Section: Footer Credits */}
      <div className="flex flex-col items-center gap-2 mb-4 z-10 text-center">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider">
          POWERED BY
        </span>
        {/* VianSoft Brand Logo representation */}
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 bg-indigo-950 flex items-center justify-center rounded p-1">
            <svg viewBox="0 0 100 120" className="w-full h-full text-white" fill="currentColor">
              <path d="M50 0 L100 30 L100 90 L50 120 L0 90 L0 30 Z" className="fill-indigo-700" />
              <path d="M50 20 L80 40 L80 80 L50 100 L20 80 L20 40 Z" className="fill-white" />
              <path d="M35 50 L50 35 L65 50 L50 85 Z" className="fill-indigo-950" />
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-indigo-950">
            VianSoft
          </span>
        </div>
        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
          © 2023 Viana Soft Private Limited • Viana Study Platform
        </p>
      </div>

    </div>
  );
};

export default Login;
