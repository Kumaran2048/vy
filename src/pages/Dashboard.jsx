import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransport } from '../context/TransportContext';
import { motion } from 'framer-motion';
import { Scan, Ticket, Navigation, ChevronRight } from 'lucide-react';
import ScanModal from '../components/ScanModal';
import TrackModal from '../components/TrackModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    setScanModalOpen, 
    setTrackModalOpen,
    scanModalOpen,
    trackModalOpen 
  } = useTransport();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start py-4">
      {/* Active Pass Badge */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 font-semibold text-sm mb-3 cursor-default"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Pass Active
      </motion.div>

      {/* Main Headers */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight mb-1">
        Your Bus Pass
      </h2>
      <p className="text-sm text-slate-400 text-center mb-8">
        Choose what you'd like to do
      </p>

      {/* Menu Cards Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full space-y-4 max-w-sm"
      >
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="glass-panel w-full p-4 rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-600/40 hover:bg-[#1a163a]/80 transition-all duration-300 relative overflow-hidden group shadow-md"
          >
            {/* Soft background light */}
            <div className="absolute -left-12 -top-12 w-24 h-24 bg-purple-600/5 blur-2xl group-hover:bg-purple-600/10 transition-all"></div>
            
            <div className="flex items-center gap-4 z-10">
              {/* Icon Bubble */}
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                {item.icon}
              </div>
              
              {/* Text metadata */}
              <div className="text-left">
                <h3 className="text-base font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Chevron Arrow */}
            <div className="text-slate-500 group-hover:text-white transition-colors duration-300 pr-2">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modals */}
      <ScanModal isOpen={scanModalOpen} onClose={() => setScanModalOpen(false)} />
      <TrackModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
