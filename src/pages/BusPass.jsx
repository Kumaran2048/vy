import React from 'react';
import { useTransport } from '../context/TransportContext';
import { motion } from 'framer-motion';
import { Bus, Printer, RefreshCw, ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';

const BusPass = () => {
  const { student, countdown, qrCodeData, manualCode } = useTransport();

  // Dynamically format today's date (e.g., "20 Jul 2026")
  const getFormattedToday = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start py-2 print:p-0">
      
      {/* Outer Card Wrapper (White Card in screenshots) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-800 border border-slate-200/80 mb-6 print:border-0 print:shadow-none print:my-0"
      >
        
        {/* Blue Card Header (SIMATS) */}
        <div className="bg-[#2563eb] text-white px-6 py-4 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 fill-white/10" />
            <span className="font-extrabold text-sm tracking-wide">BUS PASS</span>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider opacity-90">
            SIMATS – ENGINEERING
          </span>
        </div>

        {/* Student Profile Info */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          {/* Avatar Bubble */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center text-3xl shadow-md border-4 border-slate-100 mb-3 select-none">
            {student.avatarText}
          </div>

          {/* Student Name & Reg */}
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
            {student.name}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5 select-all">
            Reg No: {student.regNo}
          </p>

          {/* Bus Route */}
          <div className="flex items-center gap-1.5 text-[#2563eb] font-bold text-sm mt-3">
            <Bus className="w-4 h-4" />
            <span>{student.dropBus.route}</span>
          </div>

          {/* Timing details */}
          <div className="flex items-center justify-center gap-2 mt-2 select-none">
            <span className="bg-rose-50 border border-rose-200 text-rose-500 font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase">
              Drop
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              SIMATS <span className="opacity-60 font-normal">·</span> {student.dropBus.time} → Villa Apartment <span className="opacity-60 font-normal">·</span> {student.dropBus.expectedDropTime}
            </span>
          </div>

          {/* Validity Badge */}
          <div className="flex items-center gap-2 mt-4 select-none">
            <span className="bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xs px-3 py-1 rounded-full">
              Trip Pass
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Valid: {getFormattedToday()}
            </span>
          </div>
        </div>

        {/* Dotted Divider */}
        <div className="w-full flex items-center justify-between px-3 select-none">
          <div className="w-3.5 h-7 rounded-r-full bg-[#090614] border-r border-slate-200 print:bg-white"></div>
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2"></div>
          <div className="w-3.5 h-7 rounded-l-full bg-[#090614] border-l border-slate-200 print:bg-white"></div>
        </div>

        {/* QR Code Segment */}
        <div className="px-6 py-6 flex flex-col items-center">
          
          {/* QR Viewport */}
          <div className="bg-white p-4 border border-slate-100 rounded-3xl shadow-inner mb-4 flex items-center justify-center">
            {qrCodeData ? (
              <div className="w-48 h-48 select-none">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrCodeData}
                  viewBox="0 0 256 256"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-400 font-semibold">
                Generating QR...
              </div>
            )}
          </div>

          {/* Manual Verification Code */}
          <span className="text-[10px] font-bold text-slate-400 tracking-widest select-none">
            MANUAL CODE
          </span>
          <div className="text-xl font-extrabold tracking-[0.25em] text-slate-900 mt-1 select-all font-mono">
            {manualCode}
          </div>

          {/* Automatic countdown bar */}
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs mt-4 select-none">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-[#2563eb]" />
            <span>Refreshes in {countdown}s</span>
          </div>

        </div>

      </motion.div>

      {/* Print receipt CTA button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 text-rose-500 hover:text-white border border-rose-500 hover:bg-rose-600 transition-all duration-300 font-bold px-8 py-3.5 rounded-xl cursor-pointer shadow-md select-none print:hidden"
      >
        <Printer className="w-4.5 h-4.5" />
        Print Receipt
      </button>

    </div>
  );
};

export default BusPass;
