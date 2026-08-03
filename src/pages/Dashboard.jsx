import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransport } from '../context/TransportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  Bus, 
  Building2, 
  Cloud, 
  Megaphone, 
  GraduationCap, 
  BookOpen, 
  ChevronLeft, 
  Scan, 
  Ticket, 
  Navigation,
  X
} from 'lucide-react';
import ScanModal from '../components/ScanModal';
import TrackModal from '../components/TrackModal';
import logoImg from '../assets/vstudy-logo.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    student, 
    setScanModalOpen, 
    setTrackModalOpen,
    scanModalOpen,
    trackModalOpen 
  } = useTransport();

  // State for side menu & transport app view
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('transport'); // 'transport' default active
  const [showTransportApp, setShowTransportApp] = useState(false);

  const menuItems = [
    {
      id: 'scan',
      title: 'Scan to Verify Bus',
      subtitle: 'Check you can board',
      color: 'bg-emerald-600 shadow-emerald-950/20 text-white',
      icon: <Scan className="w-6 h-6 stroke-[2.5]" />,
      action: () => setScanModalOpen(true)
    },
    {
      id: 'pass',
      title: 'View Bus Pass',
      subtitle: 'Show your QR pass',
      color: 'bg-blue-600 shadow-blue-950/20 text-white',
      icon: <Ticket className="w-6 h-6 stroke-[2.5]" />,
      action: () => navigate('/pass')
    },
    {
      id: 'track',
      title: 'Track My Bus',
      subtitle: 'Live location',
      color: 'bg-violet-600 shadow-violet-950/20 text-white',
      icon: <Navigation className="w-6 h-6 rotate-45 stroke-[2.5]" />,
      action: () => setTrackModalOpen(true)
    }
  ];

  // Progress gauge helper for Attendance Widget
  const AttendanceRing = ({ percentage, slot, code }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-14 h-14 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="text-emerald-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="text-[#22c55e] transition-all duration-1000 ease-out"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-xs font-bold text-slate-800">
            {percentage}%
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-700 uppercase mt-1">
          {slot}
        </span>
        <span className="text-[9px] text-slate-400 font-medium tracking-tight">
          {code}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-hidden font-sans select-none bg-slate-900">
      
      {/* Background Image (Beach Desktop Wallpaper) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-700"
        style={{ backgroundImage: `url('/beach_wallpaper.png')` }}
      />
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

      {/* TOP NAVBAR */}
      <header className="relative z-30 bg-[#0c0915]/90 backdrop-blur-md border-b border-purple-950/40 px-4 py-2.5 flex items-center justify-between shadow-lg">
        {/* Left: VStudy Logo Button with Red Badge */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center p-1 shadow-md hover:scale-105 transition cursor-pointer"
            title="Toggle Menu"
          >
            <img src={logoImg} alt="VStudy Logo" className="w-full h-full object-contain" />
            {/* Red Notification Badge '1' */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border border-white shadow">
              1
            </span>
          </button>
          <span className="text-lg font-bold text-white tracking-wide">
            Viana Study
          </span>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-2.5">
          <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-center text-white cursor-pointer">
            <Calendar className="w-4 h-4" />
          </button>
          
          <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-center text-white cursor-pointer">
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* User Profile Headshot */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 shadow-md">
            <img src="/profile.png" alt="Kumaran S" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-20 flex-1 w-full p-4 md:p-6 flex flex-col justify-between">
        
        {/* TOP-RIGHT ATTENDANCE WIDGET */}
        <div className="absolute top-4 right-4 md:top-6 md:right-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-4 shadow-xl max-w-sm"
          >
            {/* Widget Header */}
            <div className="flex items-center gap-2 mb-3 text-slate-700 text-xs font-bold">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>M51 Jul-Sep 2026</span>
            </div>

            {/* 4 Gauge Rings */}
            <div className="grid grid-cols-4 gap-3 items-center">
              <AttendanceRing percentage={88} slot="SLOT A" code="ELA0111" />
              <AttendanceRing percentage={88} slot="SLOT B" code="CSA0911" />
              <AttendanceRing percentage={80} slot="SLOT C" code="ECA1408" />
              <AttendanceRing percentage={94} slot="SLOT D" code="CSA1605" />
            </div>
          </motion.div>
        </div>

        {/* LEFT SIDEBAR DRAWER MENU */}
        <AnimatePresence>
          {isSideMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-4 left-4 z-30 flex items-start gap-2"
            >
              {/* Main Left Menu Container */}
              <div className="w-64 bg-[#151221]/95 text-white border border-purple-900/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-1.5">
                
                {/* VSpace Storage Card */}
                <div className="bg-[#1e1930]/90 border border-purple-950/50 rounded-xl p-2.5 mb-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold">VSpace</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">0%</span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-rose-500 w-[0%]" />
                  </div>
                  <span className="text-[9px] text-slate-400 block text-right font-semibold">
                    0 B of 1.00 GB
                  </span>
                </div>

                {/* Notice Board */}
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Megaphone className="w-4 h-4 text-slate-400" />
                    <span>Notice Board</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                {/* Admissions */}
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Admissions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                {/* Transport & Hostel (ACTIVE RED BUTTON WITH BADGE 1) */}
                <button 
                  onClick={() => setActiveMenu(activeMenu === 'transport' ? '' : 'transport')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeMenu === 'transport' 
                      ? 'bg-[#d9232e] text-white shadow-md' 
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4" />
                    <span>Transport & Hostel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-white/20 text-white rounded-full text-[10px] flex items-center justify-center font-extrabold">
                      1
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeMenu === 'transport' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* My Learning */}
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>My Learning</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

              </div>

              {/* SUBMENU PANEL FOR TRANSPORT & HOSTEL */}
              {activeMenu === 'transport' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-52 bg-[#1b172b] text-white border border-purple-900/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md space-y-2"
                >
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-1">
                    TRANSPORT & HOSTEL
                  </span>

                  {/* Apply for Transport Button */}
                  <button
                    onClick={() => setShowTransportApp(true)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition cursor-pointer border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-emerald-400" />
                      <span>Apply for Transport</span>
                    </div>
                    <span className="w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                  </button>

                  {/* Apply for Hostel Button */}
                  <button
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer opacity-75"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Apply for Hostel</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* TRANSPORT APPLICATION MODAL / OVERLAY VIEW */}
      <AnimatePresence>
        {showTransportApp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-50 bg-[#090614] flex flex-col justify-start overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-[#120d26] border-b border-purple-950/40 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
              <button
                onClick={() => setShowTransportApp(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 text-slate-200 transition text-xs font-medium cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h1 className="text-base font-bold text-slate-100">
                Transport Application
              </h1>
              <button
                onClick={() => setShowTransportApp(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center justify-start flex-1 pt-6">
              
              {/* Active Pass Badge */}
              <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 font-semibold text-xs mb-3 cursor-default">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Pass Active
              </div>

              {/* Main Headers */}
              <h2 className="text-2xl font-extrabold text-white text-center tracking-tight mb-1">
                Your Bus Pass
              </h2>
              <p className="text-xs text-slate-400 text-center mb-8">
                Choose what you'd like to do
              </p>

              {/* Action Cards */}
              <div className="w-full space-y-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className="glass-panel w-full p-4 rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-600/40 hover:bg-[#1a163a]/80 transition-all duration-300 relative overflow-hidden group shadow-md"
                  >
                    <div className="flex items-center gap-4 z-10">
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                        {item.icon}
                      </div>
                      
                      <div className="text-left">
                        <h3 className="text-base font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-500 group-hover:text-white transition-colors duration-300 pr-2">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ScanModal isOpen={scanModalOpen} onClose={() => setScanModalOpen(false)} />
      <TrackModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
