import React, { useEffect, useRef } from 'react';
import { useTransport } from '../context/TransportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bus, CheckCircle2, RefreshCw, Loader2, Camera } from 'lucide-react';
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
          className="w-full max-w-sm bg-[#120d26] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-950/40">
            <div className="flex items-center gap-2 text-emerald-400">
              <Bus className="w-5 h-5 stroke-[2.2]" />
              <span className="font-bold text-white text-base">Scan to Verify Bus</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800/40 rounded-lg cursor-pointer"
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
                {/* Large Green Success Alert Banner */}
                <div className="w-full bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-5 mb-6 flex flex-col items-center text-center shadow-md">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800 tracking-tight">
                    Allowed to Travel
                  </h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Pass verified for this bus. You are allowed to travel.
                  </p>
                </div>

                {/* Details List */}
                <div className="w-full bg-[#1b1535]/50 border border-purple-950/40 rounded-2xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Bus</span>
                    <span className="text-slate-200">{verifiedBusDetails.busNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Bus Route</span>
                    <span className="text-slate-200">{verifiedBusDetails.busRoute}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Your Pass Route</span>
                    <span className="text-slate-200">{verifiedBusDetails.studentRoute}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Verification Time</span>
                    <span className="text-slate-200">{verifiedBusDetails.verificationTime}</span>
                  </div>
                </div>

                {/* Scan Again Button */}
                <button
                  onClick={() => setScanState('opening')}
                  className="w-full flex items-center justify-center gap-2 bg-[#f4b63e] hover:bg-[#e2a42a] text-slate-900 font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
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
