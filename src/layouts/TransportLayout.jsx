import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronLeft, LogOut } from 'lucide-react';
import { useTransport } from '../context/TransportContext';
import { motion } from 'framer-motion';
import logoImg from '../assets/vstudy-logo.svg';

const TransportLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, logout } = useTransport();

  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Transport Application';
      case '/pass':
        return 'Bus Pass';
      case '/track':
        return 'Track Bus';
      default:
        return 'Transport Application';
    }
  };

  if (isLoginPage || isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#090614] text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-[#120d26] border-b border-purple-950/40 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        {/* Left: VStudy Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-inner select-none">
            <img src={logoImg} alt="VStudy" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            VStudy
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/40 hover:bg-slate-700/60 transition flex items-center justify-center text-slate-300 cursor-pointer">
            <Calendar className="w-5 h-5" />
          </button>
          
          <button className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/40 hover:bg-slate-700/60 transition flex items-center justify-center text-slate-300 cursor-pointer">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* User initials bubble */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold flex items-center justify-center shadow-md relative group">
            <span className="text-base">{student.avatarText}</span>
            {/* Tooltip profile popover */}
            <div className="absolute right-0 top-12 w-48 bg-[#18142c] border border-purple-900/50 rounded-xl p-3 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <p className="font-semibold text-sm">{student.name}</p>
              <p className="text-xs text-slate-400">Reg: {student.regNo}</p>
              <hr className="my-2 border-purple-950/60" />
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full text-left text-xs text-rose-400 hover:text-rose-300 transition flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader with Back Button and page title */}
      <div className="bg-[#0e0a20] border-b-2 border-purple-900/30 px-4 py-3 flex items-center gap-4 relative">
        {!isDashboard && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:text-white transition text-slate-300 font-medium text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        {isDashboard && (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:text-white transition text-slate-300 font-medium text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-wide text-slate-200 mx-auto select-none">
          {getPageTitle()}
        </h1>
        {/* Empty placeholder to keep title centered */}
        <div className="w-[76px] invisible"></div>
      </div>

      {/* Main Screen Content Wrapper */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 flex flex-col justify-start">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="w-full flex-1 flex flex-col justify-start"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default TransportLayout;
