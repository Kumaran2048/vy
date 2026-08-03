import React, { useEffect, useRef } from 'react';
import { useTransport } from '../context/TransportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bus, CheckCircle2, Check, RefreshCw, Loader2, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const ScanModal = ({ isOpen, onClose }) => {
  const { 
    scanState, 
    setScanState, 
    verifiedBusDetails, 
    handleVerifyPass 
  } = useTransport();

  const scannerRef = useRef(null);
  const qrcodeInstance = useRef(null);

  // Cycle through states when opening scanner
  useEffect(() => {
    if (isOpen) {
      setScanState('opening');
      const timer = setTimeout(() => {
        setScanState('scanning');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [isOpen]);

  const stopScanner = async () => {
    if (qrcodeInstance.current && qrcodeInstance.current.isScanning) {
      try {
        await qrcodeInstance.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
      qrcodeInstance.current = null;
    }
  };

  // Setup html5-qrcode scanner when scanning state is reached
  useEffect(() => {
    if (scanState === 'scanning' && isOpen) {
      const initScanner = async () => {
        try {
          const html5Qrcode = new Html5Qrcode("reader");
          qrcodeInstance.current = html5Qrcode;

          await html5Qrcode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
            },
            (decodedText) => {
              // Successfully decoded any QR text
              stopScanner().then(() => {
                handleVerifyPass(decodedText);
              });
            },
            (error) => {
              // Ignore standard frame scanning errors
            }
          );
        } catch (err) {
          console.warn("Could not access camera or start scanner:", err);
          // Standard fallback: auto verify after 6 seconds if camera is missing
        }
      };

      initScanner();

      return () => {
        stopScanner();
      };
    }
  }, [scanState, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090614]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 ${
            scanState === 'success' ? 'bg-[#f4f4f5] border-0' : 'bg-[#120d26] border border-purple-900/50'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            scanState === 'success' ? 'bg-[#e2e2e2] border-[#d1d1d1]' : 'border-purple-950/40'
          }`}>
            <div className={`flex items-center gap-3 ${scanState === 'success' ? 'text-emerald-500' : 'text-emerald-400'}`}>
              <Bus className={`stroke-[2.2] ${scanState === 'success' ? 'w-6 h-6' : 'w-5 h-5'}`} />
              <div className="flex flex-col">
                <span className={`font-bold text-base ${scanState === 'success' ? 'text-slate-800' : 'text-white'}`}>
                  Scan to Verify Bus
                </span>
                {scanState === 'success' && (
                  <span className="text-xs text-slate-500 font-medium">Point the camera at the QR sticker on the bus.</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`transition p-1 rounded-lg cursor-pointer ${
                scanState === 'success' 
                  ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            
            {/* 1. OPENING CAMERA LOADER */}
            {scanState === 'opening' && (
              <div className="py-16 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-300">Opening Camera...</p>
              </div>
            )}

            {/* 2. SCANNING INTERFACE */}
            {scanState === 'scanning' && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-slate-400 mb-4 text-center">
                  Point the camera at the QR sticker on the bus.
                </p>

                {/* Viewfinder Wrapper */}
                <div className="w-64 h-64 relative border-2 border-emerald-500/25 bg-slate-950/45 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                  
                  {/* Actual HTML5 QR Container */}
                  <div id="reader" className="w-full h-full object-cover"></div>

                  {/* Custom Scanner Laser & Overlays when camera fails/loads */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Laser line animation */}
                    <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] absolute top-0 left-0 animate-[bounce_3s_infinite]" />
                    
                    {/* Corners styling */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />

                    {/* Camera icon backplate for mock indicator */}
                    <Camera className="w-12 h-12 text-slate-600 opacity-20 absolute" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-semibold mt-4 text-center flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  Scanning for the bus QR...
                </p>

                {/* Manual Simulating Success Option */}
                <button
                  onClick={() => handleVerifyPass("MOCK_QR")}
                  className="mt-6 text-xs text-emerald-400 hover:text-emerald-300 font-bold border border-emerald-500/30 hover:border-emerald-500 px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Simulate QR Detect
                </button>
              </div>
            )}

            {/* 3. VERIFYING PASS STATE */}
            {scanState === 'verifying' && (
              <div className="py-16 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-300">Verifying Pass...</p>
              </div>
            )}

            {/* 4. SUCCESS SCREEN TICKET */}
            {scanState === 'success' && verifiedBusDetails && (
              <div className="flex flex-col items-center justify-center">
                
                {/* Profile Image */}
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full border-[3px] border-[#d1fae5] overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    <img src="/profile.png" alt="Kumaran S" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <h2 className="text-[15px] font-bold text-slate-800 tracking-wide uppercase mb-6">
                  KUMARAN S
                </h2>

                {/* Allowed to Travel Box */}
                <div className="w-full bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 mb-6 flex flex-col items-center text-center">
                  <div className="w-11 h-11 bg-[#047857] rounded-full flex items-center justify-center text-white mb-3">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#047857] tracking-tight leading-snug mb-2">
                    Allowed to Travel — Different Route
                  </h3>
                  <p className="text-[13px] text-[#047857]/80 font-medium leading-tight px-2">
                    This bus is running a different route, but your pass fare matches — you are allowed to travel.
                  </p>
                </div>

                {/* Bus Details */}
                <div className="w-full bg-white border border-[#e5e7eb] rounded-xl overflow-hidden mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex justify-between items-center text-[13px] px-4 py-3">
                    <span className="text-slate-500 font-medium">Bus</span>
                    <span className="text-slate-800 font-bold">{verifiedBusDetails.busNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] px-4 py-3">
                    <span className="text-slate-500 font-medium">Bus Route</span>
                    <span className="text-slate-800 font-bold">{verifiedBusDetails.busRoute}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] px-4 py-3">
                    <span className="text-slate-500 font-medium">Your Pass Route</span>
                    <span className="text-slate-800 font-bold">{verifiedBusDetails.studentRoute}</span>
                  </div>
                </div>

                {/* Scan Again Button */}
                <button
                  onClick={() => setScanState('opening')}
                  className="w-full flex items-center justify-center gap-2 bg-[#34a853] hover:bg-[#2d9249] text-white font-bold py-3.5 px-6 rounded-xl shadow-sm transition-colors cursor-pointer text-[15px]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Scan Again
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScanModal;
