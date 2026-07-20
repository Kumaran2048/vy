import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransport } from '../context/TransportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Bus } from 'lucide-react';

const TrackModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { student, setActiveTrackingType } = useTransport();

  const handleSelectBus = (type) => {
    setActiveTrackingType(type);
    onClose();
    navigate('/track');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090614]/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-sm bg-[#120d26] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-950/40">
            <div className="flex items-center gap-2 text-violet-400">
              <Navigation className="w-5 h-5 rotate-45 stroke-[2.5]" />
              <span className="font-bold text-white text-base">Track My Bus</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800/40 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-center">
            <h3 className="text-sm font-semibold text-slate-300 mb-6 tracking-wide">
              Which bus would you like to track?
            </h3>

            {/* Options */}
            <div className="space-y-4">
              {/* Pickup Bus */}
              <button
                onClick={() => handleSelectBus('pickup')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1b1535]/60 hover:bg-[#201940]/90 border border-purple-950/40 hover:border-emerald-500/30 text-left transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Bus className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Pickup Bus <span className="text-slate-400 font-medium">·</span> {student.pickupBus.number}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {student.pickupBus.route}
                  </p>
                </div>
              </button>

              {/* Drop Bus */}
              <button
                onClick={() => handleSelectBus('drop')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1b1535]/60 hover:bg-[#201940]/90 border border-purple-950/40 hover:border-purple-500/30 text-left transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Bus className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Drop Bus <span className="text-slate-400 font-medium">·</span> {student.dropBus.number}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {student.dropBus.route}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrackModal;
