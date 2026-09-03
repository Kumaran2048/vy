import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransport } from '../context/TransportContext';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import {
  Bus,
  ScanLine,
  Ticket,
  Navigation,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  Search,
  Check,
  CircleCheck,
  CircleX,
  X,
  Send,
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react';
import ScanModal from './ScanModal';
import TrackModal from './TrackModal';

// Styles theme matching prompt code & exact user screenshot aesthetics
const t = {
  cardWindow: "bg-[#0f0c21] border border-purple-900/40 text-white rounded-3xl shadow-2xl backdrop-blur-xl",
  cardWindowHeader: "px-5 py-4 border-b border-purple-900/30 flex items-center justify-between",
  textPrimary: "text-white font-bold",
  textSecondary: "text-purple-200",
  textMuted: "text-slate-400",
  badgeApproved: "border border-blue-400/60 bg-blue-500/10 text-blue-300 font-extrabold rounded-lg px-2.5 py-0.5 text-[11px] tracking-wider uppercase",
  badgeSuccess: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold rounded-full px-2.5 py-0.5 text-[11px]",
  badgeWarning: "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold rounded-full px-2.5 py-0.5 text-[11px]",
  badgeInfo: "bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold rounded-full px-2.5 py-0.5 text-[11px]",
  btnPrimary: "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg rounded-xl font-extrabold cursor-pointer transition-all duration-200",
  btnSecondary: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 rounded-xl cursor-pointer transition-all duration-200",
  btnOutline: "border border-purple-500/40 hover:bg-purple-500/15 text-purple-200 rounded-xl cursor-pointer transition-all duration-200",
  btnCancel: "border border-red-500/40 hover:bg-red-500/20 text-red-400 rounded-xl cursor-pointer transition-all duration-200",
  input: "bg-[#130d29] border border-purple-900/70 focus:border-amber-500 text-white rounded-xl px-3.5 py-2.5 outline-none transition-colors",
  label: "block text-xs font-bold text-slate-200 mb-1",
  menuPanel: "bg-[#18132e] border border-purple-900/60 rounded-xl shadow-2xl backdrop-blur-xl",
  menuItem: "hover:bg-purple-600/20 text-slate-300 hover:text-white rounded-lg transition-colors",
  menuItemActive: "bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg",
  borderColor: "border-purple-900/40"
};

// Helper formatters
const formatCurrency = (val) => Number(val || 0).toLocaleString('en-IN');
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? '-'
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Stop Selector Dropdown Component
const StopDropdown = ({ stops = [], value, onChange, placeholder = "Select stop", omitFirst = false, omitLast = false, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filteredStops = useMemo(() => {
    let list = [...stops].sort((a, b) => (Number(a.stopOrder) || 0) - (Number(b.stopOrder) || 0));
    if (omitFirst && list.length > 1) list = list.slice(1);
    if (omitLast && list.length > 1) list = list.slice(0, -1);
    const q = search.trim().toLowerCase();
    return q ? list.filter(s => (s.stopName || '').toLowerCase().includes(q)) : list;
  }, [stops, omitFirst, omitLast, search]);

  const selectedStop = stops.find(s => s.id === value) || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(prev => !prev)}
        className={`${t.input} w-full text-xs flex items-center justify-between gap-2 ${disabled ? "opacity-50 cursor-not-allowed bg-[#0b0819]" : "cursor-pointer"}`}
      >
        <span className={`truncate ${selectedStop ? t.textPrimary : t.textMuted}`}>
          {selectedStop 
            ? `${selectedStop.stopOrder || 1}. ${selectedStop.stopName}${selectedStop.time ? ` · ${selectedStop.time}` : ''}` 
            : placeholder
          }
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 ${t.textMuted}`} />
      </button>

      {isOpen && !disabled && (
        <div className={`${t.menuPanel} absolute z-50 mt-1 left-0 right-0 p-1.5`}>
          <div className="relative mb-1.5">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stop..."
              className={`${t.input} w-full pl-8 text-xs py-1.5`}
            />
          </div>
          <ul className="max-h-44 overflow-auto space-y-0.5 no-scrollbar">
            {filteredStops.length ? (
              filteredStops.map((stop, idx) => (
                <li key={stop.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(stop.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`${t.menuItem} w-full text-left px-2.5 py-2 text-xs flex items-center justify-between gap-2 cursor-pointer`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`shrink-0 w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${t.badgeInfo}`}>
                        {stop.stopOrder || idx + 1}
                      </span>
                      <span className={`truncate ${t.textPrimary}`}>{stop.stopName}</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      {stop.time && <span className={`text-[10px] font-semibold ${t.textMuted}`}>{stop.time}</span>}
                      {stop.id === value && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className={`px-2.5 py-2 text-xs ${t.textMuted}`}>No stops found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// Route Selector Dropdown Component
const RouteDropdown = ({ routes = [], value, onChange, placeholder = "Select a route" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selectedRoute = routes.find(r => r.id === value) || null;
  const filteredRoutes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? routes.filter(r => `${r.routeNumber || ''} ${r.routeName || ''}`.toLowerCase().includes(q))
      : routes;
  }, [routes, search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`${t.input} w-full text-xs flex items-center justify-between gap-2 cursor-pointer`}
      >
        <span className={`truncate ${selectedRoute ? t.textPrimary : t.textMuted}`}>
          {selectedRoute 
            ? `${selectedRoute.routeNumber} – ${selectedRoute.routeName} · ${selectedRoute.vacantSeats || 33} seats` 
            : placeholder
          }
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 ${t.textMuted}`} />
      </button>

      {isOpen && (
        <div className={`${t.menuPanel} absolute z-50 mt-1 left-0 right-0 p-1.5`}>
          <div className="relative mb-1.5">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search route..."
              className={`${t.input} w-full pl-8 text-xs py-1.5`}
            />
          </div>
          <ul className="max-h-44 overflow-auto space-y-0.5 no-scrollbar">
            {filteredRoutes.length ? (
              filteredRoutes.map(route => (
                <li key={route.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(route.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`${t.menuItem} w-full text-left px-2.5 py-2 text-xs flex items-center justify-between gap-2 cursor-pointer`}
                  >
                    <span className={`truncate ${t.textPrimary}`}>
                      {route.routeNumber} – {route.routeName} · {route.vacantSeats || 33} seats
                    </span>
                    {route.id === value && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                </li>
              ))
            ) : (
              <li className={`px-2.5 py-2 text-xs ${t.textMuted}`}>No routes found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// Bus Pass Card Component
const BusPassCard = ({ application, student, countdown, qrCodeData, manualCode, institutionName = "SIMATS - ENGINEERING (SSE)" }) => {
  const getFormattedToday = () => {
    const today = new Date();
    // Format to "03 Sept 2026"
    return `${today.getDate().toString().padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
  };

  const app = application || {};
  const isAnnual = String(app.pass_type || 'ANNUAL').toUpperCase() === 'ANNUAL';

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl border-none shadow-2xl bg-[#ebebeb] text-slate-800 pb-8">
      
      {/* Header Gradient */}
      <div className="bg-[#5c574b] text-white px-5 py-3.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide">
          <Bus className="w-4.5 h-4.5 text-white" /> BUS PASS
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider truncate max-w-[55%] text-right">
          {institutionName}
        </span>
      </div>

      {/* Date Banner */}
      <div className="mt-5 text-center">
        <span className="text-3xl font-medium leading-tight text-slate-900 tracking-tight">
          {getFormattedToday()}
        </span>
      </div>

      {/* Student Profile Info */}
      <div className="px-5 pt-5 pb-3 flex flex-col items-center text-center">
        {/* Profile Photo */}
        <img
          src={app.photo_url || app.profile_photo || student?.profilePhoto || "/profile.png"}
          alt={app.student_name || student?.name || "Student"}
          className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-sm bg-blue-100"
        />

        <div className="mt-4 text-lg font-medium leading-tight text-slate-900">
          {app.student_name || student?.name || 'KUMARAN S'}
        </div>
        <div className="text-xs font-normal text-slate-500 mt-0.5">
          Reg No: {app.register_number || student?.regNo || '192372048'}
        </div>

        <div className="mt-3 inline-flex items-center gap-2 text-lg font-medium text-slate-800">
          <Bus className="w-5 h-5 text-blue-600" />
          <span>{app.routeNumber ? `${app.routeNumber} - ${app.routeName}` : (app.routeName || '7F - Ambattur OT II')}</span>
        </div>

        <div className="mt-2.5 w-full px-2 space-y-1 text-xs">
          <div className="flex items-center justify-center gap-2 text-slate-500 font-normal">
            <span className="rounded bg-red-100 text-red-600 px-1.5 py-0.5 text-[10px] font-medium">Drop</span>
            <span>SIMATS (Thandalam campus) · 15:20 → {app.drop_stop_name || 'Ambattur'}<br/>Bus Stop · {app.drop_stop_time || '16:15'}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="rounded-full bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium">
            {isAnnual ? 'Annual Pass' : 'Trip Pass'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">
            <CircleCheck className="w-3.5 h-3.5" /> Active
          </span>
        </div>
      </div>

      {/* Dotted Tear Line */}
      <div className="relative my-2 select-none">
        <div className="border-t-2 border-dashed border-slate-300 mx-4" />
        <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#0b0818]" />
        <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#0b0818]" />
      </div>

      {/* QR Code Container */}
      <div className="px-5 pb-8 pt-4 flex flex-col items-center">
        <div className="bg-white p-3.5 border border-slate-200 rounded-2xl shadow-sm mb-3">
          {qrCodeData ? (
            <div className="w-44 h-44 select-none">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrCodeData}
                viewBox="0 0 256 256"
              />
            </div>
          ) : (
            <div className="w-44 h-44 bg-slate-200 animate-pulse rounded-xl" />
          )}
        </div>

        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
          MANUAL VERIFICATION CODE
        </span>
        <div className="text-xl font-extrabold tracking-[0.25em] text-slate-800 font-mono mt-0.5">
          {manualCode}
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs mt-3">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          <span>Refreshes in {countdown}s</span>
        </div>
      </div>

    </div>
  );
};

export default function TransportApplication({ onClose }) {
  const {
    student,
    routes,
    applications,
    activePass,
    countdown,
    qrCodeData,
    manualCode,
    scanModalOpen,
    setScanModalOpen,
    trackModalOpen,
    setTrackModalOpen,
    payApplication,
    cancelApplication,
    submitApplication,
    transferApplication
  } = useTransport();

  // Internal Navigation Mode: 'home' | 'pass' | 'applications'
  const [viewMode, setViewMode] = useState('home');

  // Application Modal & Transfer Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(0); // 0: Route, 1: Stops, 2: Pass Type, 3: Confirm
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedPickupStopId, setSelectedPickupStopId] = useState("");
  const [selectedDropStopId, setSelectedDropStopId] = useState("");
  const [passType, setPassType] = useState("ANNUAL"); // 'ANNUAL' | 'DAILY'
  const [tripPickup, setTripPickup] = useState(true);
  const [tripDrop, setTripDrop] = useState(true);
  const [travelDate, setTravelDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routeSearch, setRouteSearch] = useState('');

  // Transfer route modal state (matching Screenshot 2)
  const [transferAppTarget, setTransferAppTarget] = useState(null);
  const [transferRouteId, setTransferRouteId] = useState('');
  const [transferPickupStopId, setTransferPickupStopId] = useState('');
  const [transferDropStopId, setTransferDropStopId] = useState('');
  const [transferPassType, setTransferPassType] = useState('DAILY'); // 'ANNUAL' | 'DAILY'
  const [transferTripPickup, setTransferTripPickup] = useState(false);
  const [transferTripDrop, setTransferTripDrop] = useState(true);
  const [transferTravelDate, setTransferTravelDate] = useState(new Date().toISOString().slice(0, 10));
  const [isTransferring, setIsTransferring] = useState(false);

  // Rejected application dismiss state
  const [dismissedRejectedId, setDismissedRejectedId] = useState(null);

  const hasActivePass = !!activePass;

  // Filtered applications
  const awaitingPaymentApps = useMemo(() => 
    applications.filter(a => String(a.status).toUpperCase() === 'AWAITING_PAYMENT' || String(a.status).toUpperCase() === 'APPROVED'),
  [applications]);

  const awaitingPaymentCount = awaitingPaymentApps.length;
  const activeAppsCount = applications.filter(a => String(a.status).toUpperCase() === 'ACTIVE' || String(a.status).toUpperCase() === 'PAID').length;

  const rejectedApp = useMemo(() => 
    applications.find(a => String(a.status).toUpperCase() === 'REJECTED' && a.id !== dismissedRejectedId) || null,
  [applications, dismissedRejectedId]);

  // Selected route object in apply wizard
  const selectedRoute = useMemo(() => routes.find(r => r.id === selectedRouteId) || null, [routes, selectedRouteId]);

  // Selected transfer route object
  const transferRoute = useMemo(() => routes.find(r => r.id === transferRouteId) || null, [routes, transferRouteId]);

  // Filtered routes list for search
  const filteredRoutes = useMemo(() => {
    const q = routeSearch.trim().toLowerCase();
    if (!q) return routes;
    return routes.filter(r => {
      const stopsStr = [...(r.pickupStops || []), ...(r.dropStops || [])].map(s => s.stopName).join(' ');
      return `${r.routeNumber} ${r.routeName} ${stopsStr}`.toLowerCase().includes(q);
    });
  }, [routes, routeSearch]);

  // Open Apply Pass Wizard
  const openApplyWizard = () => {
    setSelectedRouteId(routes[0]?.id || "");
    setSelectedPickupStopId(routes[0]?.pickupStops?.[0]?.id || "");
    setSelectedDropStopId(routes[0]?.dropStops?.[routes[0]?.dropStops?.length - 1]?.id || "");
    setPassType("ANNUAL");
    setTripPickup(true);
    setTripDrop(true);
    setApplyStep(0);
    setIsApplyModalOpen(true);
  };

  // Open Transfer Modal with pre-filled application details
  const openTransferModal = (app) => {
    setTransferAppTarget(app);
    setTransferRouteId(app.routeId || routes[0]?.id || '');
    setTransferPickupStopId(app.pickupStopId || '');
    setTransferDropStopId(app.dropStopId || '');
    setTransferPassType(String(app.pass_type || 'DAILY').toUpperCase() === 'DAILY' ? 'DAILY' : 'ANNUAL');
    const isPickup = app.trip_direction === 'PICKUP' || app.trip_direction === 'BOTH';
    const isDrop = app.trip_direction === 'DROP' || app.trip_direction === 'BOTH';
    setTransferTripPickup(isPickup);
    setTransferTripDrop(isDrop);
    setTransferTravelDate(app.valid_from || new Date().toISOString().slice(0, 10));
  };

  // Step validation in Apply Wizard
  const canAdvanceStep = (step) => {
    if (step === 0) return !!selectedRouteId;
    if (step === 1) return !!selectedPickupStopId && !!selectedDropStopId;
    if (step === 2) return passType === 'ANNUAL' ? (selectedRoute?.vacantSeats ?? 1) > 0 : (tripPickup || tripDrop) && !!travelDate;
    return true;
  };

  // Submit Pass Application
  const handleConfirmApplication = () => {
    if (!selectedRouteId || !selectedPickupStopId || !selectedDropStopId) {
      toast.error("Please fill in all required stop selections.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const tripDirection = (tripPickup && tripDrop) ? 'BOTH' : tripPickup ? 'PICKUP' : 'DROP';
      submitApplication({
        routeId: selectedRouteId,
        pickupStopId: selectedPickupStopId,
        dropStopId: selectedDropStopId,
        passType,
        passDate: travelDate,
        tripDirection
      });
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      toast.success(passType === 'DAILY' ? 'Trip pass booked & paid successfully!' : 'Transport application submitted!');
      setViewMode('applications');
    }, 500);
  };

  // Transfer Route handler
  const handleConfirmTransfer = () => {
    if (!transferAppTarget || !transferRouteId) {
      toast.error("Please select a new route.");
      return;
    }
    setIsTransferring(true);
    setTimeout(() => {
      transferApplication(transferAppTarget.id, {
        routeId: transferRouteId,
        pickupStopId: transferTripPickup ? transferPickupStopId : null,
        dropStopId: transferTripDrop ? transferDropStopId : null
      });
      setIsTransferring(false);
      setTransferAppTarget(null);
      toast.success("Route transferred successfully!");
    }, 500);
  };

  // Auto set default stops when route changes in wizard
  useEffect(() => {
    if (selectedRoute) {
      if (selectedRoute.pickupStops?.length) setSelectedPickupStopId(selectedRoute.pickupStops[0].id);
      if (selectedRoute.dropStops?.length) setSelectedDropStopId(selectedRoute.dropStops[selectedRoute.dropStops.length - 1].id);
    }
  }, [selectedRouteId]);

  return (
    <div className="h-full w-full flex flex-col bg-[#0b0818] text-white overflow-hidden relative font-sans select-none">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className={`${t.cardWindowHeader} bg-[#120d26]/95 backdrop-blur-md sticky top-0 z-20`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`${t.btnSecondary} px-3 py-1.5 text-xs flex items-center gap-1.5 font-semibold cursor-pointer`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-black text-white tracking-wide truncate">
              Transport Application
            </h2>
          </div>
        </div>

        {viewMode === 'applications' && (
          <button
            type="button"
            onClick={openApplyWizard}
            className={`${t.btnPrimary} px-4 py-2 text-xs flex items-center gap-1.5`}
          >
            <Bus className="w-4 h-4" />
            <span>Apply</span>
          </button>
        )}
      </div>

      {/* Main Body Content based on View Mode */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 flex flex-col items-center">
        
        {/* VIEW MODE 1: HOME (MATCHING USER SCREENSHOT) */}
        {viewMode === 'home' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            
            {/* Header Status Bar */}
            <div className="mb-6 text-center">
              <p className={`text-xs md:text-sm font-medium ${t.textMuted}`}>
                {hasActivePass 
                  ? "Your pass is active - scan, view or track your bus." 
                  : "No active pass yet. Open My Applications to apply."
                }
              </p>
            </div>

            {/* 4 Feature Cards Grid (2x2 Always, Mobile Responsive) */}
            <div className="w-full grid grid-cols-2 gap-3 sm:gap-5">
              
              {/* Card 1: Scan to Verify Bus */}
              <button
                type="button"
                disabled={!hasActivePass}
                onClick={() => setScanModalOpen(true)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3.5 transition-all duration-300 ${
                  !hasActivePass 
                    ? "opacity-60 cursor-not-allowed bg-[#140f2d]/80 border-purple-900/30" 
                    : "hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/50 bg-[#171233]/90 border-purple-900/40 cursor-pointer"
                }`}
              >
                {!hasActivePass && (
                  <span className={`absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold ${t.badgeWarning}`}>
                    <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Locked
                  </span>
                )}
                
                <span className="inline-flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <ScanLine className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                </span>
                
                <div>
                  <span className={`block text-xs sm:text-base font-extrabold ${t.textPrimary}`}>
                    Scan to Verify Bus
                  </span>
                  <span className={`mt-0.5 block text-[10px] sm:text-xs ${t.textMuted}`}>
                    Check you can board
                  </span>
                </div>
              </button>

              {/* Card 2: View Bus Pass */}
              <button
                type="button"
                onClick={() => setViewMode('pass')}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3.5 transition-all duration-300 bg-[#171233]/90 border-purple-900/40 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/50 cursor-pointer"
              >
                <span className="inline-flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Ticket className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                </span>

                <div>
                  <span className={`block text-xs sm:text-base font-extrabold ${t.textPrimary}`}>
                    View Bus Pass
                  </span>
                  <span className={`mt-0.5 block text-[10px] sm:text-xs ${t.textMuted}`}>
                    Show your QR pass
                  </span>
                </div>
              </button>

              {/* Card 3: Track My Bus */}
              <button
                type="button"
                disabled={!hasActivePass}
                onClick={() => setTrackModalOpen(true)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3.5 transition-all duration-300 ${
                  !hasActivePass 
                    ? "opacity-60 cursor-not-allowed bg-[#140f2d]/80 border-purple-900/30" 
                    : "hover:-translate-y-1 hover:shadow-xl hover:border-violet-500/50 bg-[#171233]/90 border-purple-900/40 cursor-pointer"
                }`}
              >
                {!hasActivePass && (
                  <span className={`absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold ${t.badgeWarning}`}>
                    <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Locked
                  </span>
                )}

                <span className="inline-flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Navigation className="h-6 w-6 sm:h-7 sm:w-7 rotate-45 stroke-[2.5]" />
                </span>

                <div>
                  <span className={`block text-xs sm:text-base font-extrabold ${t.textPrimary}`}>
                    Track My Bus
                  </span>
                  <span className={`mt-0.5 block text-[10px] sm:text-xs ${t.textMuted}`}>
                    Live bus location
                  </span>
                </div>
              </button>

              {/* Card 4: My Applications */}
              <button
                type="button"
                onClick={() => setViewMode('applications')}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3.5 transition-all duration-300 bg-[#171233]/90 border-purple-900/40 hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/50 cursor-pointer"
              >
                {awaitingPaymentCount > 0 && (
                  <span className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-5 sm:h-6 min-w-[1.25rem] sm:min-w-[1.5rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] sm:text-xs font-black text-white shadow-md animate-pulse">
                    {awaitingPaymentCount}
                  </span>
                )}

                <span className="inline-flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                </span>

                <div>
                  <span className={`block text-xs sm:text-base font-extrabold ${t.textPrimary}`}>
                    My Applications
                  </span>
                  <span className={`mt-0.5 block text-[10px] sm:text-xs ${t.textMuted}`}>
                    {awaitingPaymentCount > 0
                      ? `${awaitingPaymentCount} awaiting payment`
                      : activeAppsCount > 0
                      ? `${activeAppsCount} active`
                      : "Apply for pass"
                    }
                  </span>
                </div>
              </button>

            </div>

            {/* Footer lock note */}
            {!hasActivePass && (
              <p className={`mt-6 text-center text-xs flex items-center gap-1.5 ${t.textMuted}`}>
                <Lock className="inline h-3.5 w-3.5 text-amber-400" />
                <span>Scan and Track unlock once you have an active (paid) pass.</span>
              </p>
            )}

          </div>
        )}

        {/* VIEW MODE 2: BUS PASS */}
        {viewMode === 'pass' && (
          <div className="w-full max-w-lg space-y-4">
            <button
              type="button"
              onClick={() => setViewMode('home')}
              className={`${t.btnSecondary} px-3.5 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 mb-2 cursor-pointer`}
            >
              <ChevronLeft className="w-4 h-4" /> Back to Transport Dashboard
            </button>

            {hasActivePass ? (
              <BusPassCard
                application={activePass}
                student={student}
                countdown={countdown}
                qrCodeData={qrCodeData}
                manualCode={manualCode}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center bg-[#171233]/70 border border-purple-900/30 rounded-3xl p-8">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
                  <Ticket className="h-8 w-8" />
                </span>
                <div>
                  <div className={`text-base font-extrabold ${t.textPrimary}`}>
                    No active pass yet
                  </div>
                  <div className={`text-xs ${t.textMuted} mt-1`}>
                    Pay your approved application or apply for a pass to activate.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('applications')}
                  className={`${t.btnPrimary} px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2`}
                >
                  <ClipboardList className="w-4 h-4" /> Go to My Applications
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: MY APPLICATIONS (MATCHING SCREENSHOT 1) */}
        {viewMode === 'applications' && (
          <div className="w-full max-w-3xl space-y-4">
            
            {/* Sub-header with Back + title + count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('home')}
                  className={`${t.btnSecondary} px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">My Applications</h3>
                  <p className="text-[11px] text-slate-400">
                    {activeAppsCount} active pass{activeAppsCount !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejected application banner */}
            {rejectedApp && (
              <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <CircleX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-extrabold text-red-200 text-sm">
                        Previous Application Rejected
                      </div>
                      <div className="text-red-300/80 mt-0.5">
                        {rejectedApp.routeNumber} - {rejectedApp.routeName} ({rejectedApp.pickup_stop_name} → {rejectedApp.drop_stop_name})
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissedRejectedId(rejectedApp.id)}
                    className="text-red-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={openApplyWizard}
                    className={`${t.btnPrimary} px-4 py-1.5 text-xs font-bold inline-flex items-center gap-1.5`}
                  >
                    <Bus className="w-3.5 h-3.5" /> Reapply Now
                  </button>
                </div>
              </div>
            )}

            {/* Applications List */}
            {applications.length ? (
              <div className="space-y-4">
                {applications.map(app => {
                  const statusUpper = String(app.status).toUpperCase();
                  const isPaid = statusUpper === 'PAID' || statusUpper === 'ACTIVE';
                  const isAwaitingPayment = statusUpper === 'AWAITING_PAYMENT' || statusUpper === 'APPROVED';
                  const isPending = statusUpper === 'PENDING' || statusUpper === 'SUBMITTED';

                  return (
                    <div
                      key={app.id}
                      className="rounded-3xl border border-purple-900/40 bg-[#161131]/90 p-6 flex flex-col gap-4 shadow-xl hover:border-purple-800/60 transition"
                    >
                      {/* App Header matching Screenshot 1 */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-black text-white">
                            {app.routeNumber ? `${app.routeNumber} – ${app.routeName}` : (app.routeName || '7F – Ambattur OT II')}
                          </h4>
                          <p className="text-xs text-purple-200/80 mt-0.5 font-medium">
                            Pickup → {app.drop_stop_name || 'Ambattur Bus Stop'}
                          </p>
                        </div>

                        <span className={t.badgeApproved}>
                          {app.status || 'APPROVED'}
                        </span>
                      </div>

                      {/* App Metrics matching Screenshot 1 */}
                      <div className="grid grid-cols-2 gap-4 text-xs bg-[#110d26]/80 p-4 rounded-2xl border border-purple-950/60">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Applied On</span>
                          <span className="font-bold text-white mt-0.5 block">{formatDate(app.createdAt)}, 07:03 am</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Fee</span>
                          <span className="font-bold text-white mt-0.5 block">₹{formatCurrency(app.fees || app.annualFee || 150)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Pass Type</span>
                          <span className="font-bold text-white mt-0.5 block">
                            {String(app.pass_type || 'DAILY').toUpperCase() === 'DAILY' ? 'Trip Pass · Drop' : 'Annual Pass'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Validity</span>
                          <span className="font-bold text-white mt-0.5 block">
                            {app.valid_to ? formatDate(app.valid_to) : '28 Feb 2027'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons matching Screenshot 1 */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {isPaid && (
                          <button
                            type="button"
                            onClick={() => setViewMode('pass')}
                            className={`${t.btnPrimary} px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5`}
                          >
                            <Ticket className="w-3.5 h-3.5" /> View Pass
                          </button>
                        )}

                        {isAwaitingPayment && (
                          <>
                            <button
                              type="button"
                              onClick={() => openTransferModal(app)}
                              className={`${t.btnSecondary} px-4 py-2 text-xs font-bold inline-flex items-center gap-2 cursor-pointer border border-purple-500/40`}
                            >
                              <Send className="w-3.5 h-3.5 text-purple-300" /> Transfer
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                payApplication(app.id);
                                toast.success("Payment received! Your pass is now active.");
                              }}
                              className={`${t.btnPrimary} px-5 py-2 text-xs font-black inline-flex items-center gap-1.5`}
                            >
                              Pay ₹{formatCurrency(app.fees || app.annualFee || 150)}
                            </button>
                          </>
                        )}

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => {
                              cancelApplication(app.id);
                              toast.success("Application cancelled.");
                            }}
                            className={`${t.btnCancel} px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5`}
                          >
                            <CircleX className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center bg-[#171233]/70 border border-purple-900/30 rounded-3xl p-8">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
                  <ClipboardList className="h-8 w-8" />
                </span>
                <div>
                  <div className={`text-base font-extrabold ${t.textPrimary}`}>
                    No applications found
                  </div>
                  <div className={`text-xs ${t.textMuted} mt-1`}>
                    Apply for a bus pass to get started.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openApplyWizard}
                  className={`${t.btnPrimary} px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2`}
                >
                  <Bus className="w-4 h-4" /> Apply for a Pass
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL 1: APPLY PASS MULTI-STEP WIZARD */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`${t.cardWindow} relative z-10 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-purple-800/50`}
            >
              {/* Wizard Header */}
              <div className={`${t.cardWindowHeader} p-4`}>
                <h3 className="text-sm font-extrabold text-white">Apply for a Pass</h3>
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps Indicator */}
              <div className="px-5 pt-3 pb-2 border-b border-purple-950/60 bg-[#120d28]">
                <div className="flex items-center gap-2">
                  {["Route", "Stops", "Pass Type", "Confirm"].map((label, stepIdx) => {
                    const isDone = stepIdx < applyStep;
                    const isCurrent = stepIdx === applyStep;
                    return (
                      <React.Fragment key={label}>
                        <button
                          type="button"
                          disabled={stepIdx > applyStep}
                          onClick={() => setApplyStep(stepIdx)}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            isDone ? "bg-emerald-500 text-white" : isCurrent ? t.btnPrimary : "bg-purple-950/80 text-purple-300"
                          }`}>
                            {isDone ? <Check className="w-3.5 h-3.5" /> : stepIdx + 1}
                          </span>
                          <span className={`text-xs font-semibold hidden sm:block ${isCurrent ? "text-white" : "text-slate-400"}`}>
                            {label}
                          </span>
                        </button>
                        {stepIdx < 3 && <span className={`h-0.5 flex-1 ${stepIdx < applyStep ? "bg-emerald-500" : "bg-purple-950"}`} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 text-xs">
                
                {/* STEP 0: ROUTE SELECTION */}
                {applyStep === 0 && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                      <input
                        type="text"
                        value={routeSearch}
                        onChange={e => setRouteSearch(e.target.value)}
                        placeholder="Search by route number, route name or stop..."
                        className={`${t.input} w-full pl-9 pr-8 text-xs`}
                      />
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block pt-1">
                      Available Routes ({filteredRoutes.length})
                    </span>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar pr-1">
                      {filteredRoutes.map(route => {
                        const isSelected = route.id === selectedRouteId;
                        return (
                          <button
                            key={route.id}
                            type="button"
                            onClick={() => setSelectedRouteId(route.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/20 border-amber-500/60 text-white shadow-md"
                                : "bg-[#161131] border-purple-900/40 text-slate-300 hover:border-purple-700/60"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-bold text-sm text-white">
                                <Bus className="w-4 h-4 text-amber-400" />
                                <span>{route.routeNumber} – {route.routeName}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-purple-200/70">
                                <span>Fee: <strong className="text-emerald-400">₹{formatCurrency(route.fees)}</strong> / yr</span>
                                <span>Vacant: <strong>{route.vacantSeats} seats</strong></span>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 1: STOP SELECTION */}
                {applyStep === 1 && selectedRoute && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block mb-1">
                        Selected Route
                      </span>
                      <h4 className="text-sm font-extrabold text-white">{selectedRoute.routeNumber} – {selectedRoute.routeName}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={t.label}>Pickup Stop</label>
                        <StopDropdown
                          stops={selectedRoute.pickupStops || []}
                          value={selectedPickupStopId}
                          onChange={setSelectedPickupStopId}
                          placeholder="Select pickup stop"
                          omitLast
                        />
                      </div>
                      <div>
                        <label className={t.label}>Drop Stop</label>
                        <StopDropdown
                          stops={selectedRoute.dropStops || []}
                          value={selectedDropStopId}
                          onChange={setSelectedDropStopId}
                          placeholder="Select drop stop"
                          omitFirst
                        />
                      </div>
                    </div>

                    <div className="bg-[#140f28] p-3.5 rounded-2xl border border-purple-900/40 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block">
                        Route Stops Sequence
                      </span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                        {(selectedRoute.pickupStops || []).map((stop, idx) => (
                          <div key={stop.id} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-purple-900/20">
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-900/60 text-purple-200 text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-slate-200">{stop.stopName}</span>
                            </span>
                            <span className="text-[10px] font-mono text-purple-300/60">{stop.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PASS TYPE SELECTION */}
                {applyStep === 2 && selectedRoute && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block">
                      Select Pass Type
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPassType("ANNUAL")}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                          passType === 'ANNUAL'
                            ? "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg border-red-500"
                            : "bg-[#161131] border-purple-900/40 text-slate-300 hover:border-purple-700/50"
                        }`}
                      >
                        <div className="font-extrabold text-sm text-white">Annual Pass</div>
                        <div className="text-[11px] opacity-80 mt-1">Valid for academic year</div>
                        <div className="text-base font-black mt-2">₹{formatCurrency(selectedRoute.fees)}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPassType("DAILY")}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                          passType === 'DAILY'
                            ? "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg border-red-500"
                            : "bg-[#161131] border-purple-900/40 text-slate-300 hover:border-purple-700/50"
                        }`}
                      >
                        <div className="font-extrabold text-sm text-white">Trip Pass</div>
                        <div className="text-[11px] opacity-80 mt-1">Per trip / one day</div>
                        <div className="text-base font-black mt-2">₹{selectedRoute.dailyFee || 150} / trip</div>
                      </button>
                    </div>

                    {passType === 'DAILY' && (
                      <div className="bg-[#140f28] p-4 rounded-2xl border border-purple-900/40 space-y-3">
                        <label className={t.label}>Trips</label>
                        <div className="grid grid-cols-2 gap-2">
                          <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                            tripPickup ? "bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-500" : "bg-[#130d29] border-purple-900/60"
                          }`}>
                            <input
                              type="checkbox"
                              checked={tripPickup}
                              onChange={e => setTripPickup(e.target.checked)}
                              className="accent-amber-400"
                            />
                            <div>
                              <span className="font-bold text-xs block">Pickup</span>
                              <span className="text-[10px] opacity-80">To campus · ₹{selectedRoute.dailyFee || 150}</span>
                            </div>
                          </label>

                          <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                            tripDrop ? "bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-500" : "bg-[#130d29] border-purple-900/60"
                          }`}>
                            <input
                              type="checkbox"
                              checked={tripDrop}
                              onChange={e => setTripDrop(e.target.checked)}
                              className="accent-amber-400"
                            />
                            <div>
                              <span className="font-bold text-xs block">Drop</span>
                              <span className="text-[10px] opacity-80">From campus · ₹{selectedRoute.dailyFee || 150}</span>
                            </div>
                          </label>
                        </div>

                        <label className={t.label}>Travel Date</label>
                        <input
                          type="date"
                          min={new Date().toISOString().slice(0, 10)}
                          value={travelDate}
                          onChange={e => setTravelDate(e.target.value)}
                          className={`${t.input} w-full text-xs`}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: REVIEW & CONFIRM */}
                {applyStep === 3 && selectedRoute && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block">
                      Review & Confirm Application
                    </span>

                    <div className="bg-[#140f28] p-4 rounded-2xl border border-purple-900/40 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Route:</span>
                        <span className="font-extrabold text-white">{selectedRoute.routeNumber} – {selectedRoute.routeName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Pickup Stop:</span>
                        <span className="font-semibold text-white">{selectedRoute.pickupStops?.find(s => s.id === selectedPickupStopId)?.stopName || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Drop Stop:</span>
                        <span className="font-semibold text-white">{selectedRoute.dropStops?.find(s => s.id === selectedDropStopId)?.stopName || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Pass Type:</span>
                        <span className="font-semibold text-white">{passType === 'DAILY' ? 'Trip Pass' : 'Annual Pass'}</span>
                      </div>
                      <div className="border-t border-purple-900/40 pt-2.5 flex justify-between items-center text-sm">
                        <span className="font-bold text-white">Total Amount Payable:</span>
                        <span className="font-black text-amber-400 text-base">
                          ₹{formatCurrency(passType === 'DAILY' ? (selectedRoute.dailyFee || 150) * ((tripPickup ? 1 : 0) + (tripDrop ? 1 : 0)) : selectedRoute.fees)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Wizard Footer Controls */}
              <div className={`${t.cardWindowHeader} p-4 bg-[#120d28]`}>
                <button
                  type="button"
                  onClick={() => applyStep === 0 ? setIsApplyModalOpen(false) : setApplyStep(s => s - 1)}
                  className={`${t.btnSecondary} px-4 py-2 text-xs font-semibold cursor-pointer`}
                >
                  {applyStep === 0 ? "Cancel" : "Back"}
                </button>

                {applyStep < 3 ? (
                  <button
                    type="button"
                    disabled={!canAdvanceStep(applyStep)}
                    onClick={() => setApplyStep(s => s + 1)}
                    className={`${t.btnPrimary} px-5 py-2 text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1.5`}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmApplication}
                    className={`${t.btnPrimary} px-6 py-2 text-xs font-black`}
                  >
                    {isSubmitting ? "Submitting..." : "Confirm & Apply"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: TRANSFER ROUTE (EXACTLY MATCHING SCREENSHOT 2) */}
      <AnimatePresence>
        {transferAppTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransferAppTarget(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`${t.cardWindow} relative z-10 w-full max-w-lg p-6 space-y-4 shadow-2xl border-purple-800/60 bg-[#120c2b] max-h-[92vh] overflow-y-auto no-scrollbar`}
            >
              {/* Header matching Screenshot 2 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white">Transfer Route</h3>
                  <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                    Currently {transferAppTarget.routeNumber ? `${transferAppTarget.routeNumber} – ${transferAppTarget.routeName}` : '7F – Ambattur OT II'}. Choose a new route and stops – you'll pay the new route's fee.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTransferAppTarget(null)}
                  className="rounded-lg border border-purple-800/60 p-1.5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Controls matching Screenshot 2 */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Route Selector */}
                <div>
                  <label className={t.label}>Route</label>
                  <RouteDropdown
                    routes={routes}
                    value={transferRouteId}
                    onChange={id => {
                      setTransferRouteId(id);
                      const r = routes.find(rt => rt.id === id);
                      if (r) {
                        setTransferPickupStopId(r.pickupStops?.[0]?.id || '');
                        setTransferDropStopId(r.dropStops?.[r.dropStops?.length - 1]?.id || '');
                      }
                    }}
                  />
                </div>

                {/* 2. Pickup Stop (not needed) / Active Pickup Stop */}
                <div>
                  <label className={t.label}>
                    Pickup Stop {transferTripPickup ? "" : "(not needed)"}
                  </label>
                  <StopDropdown
                    stops={transferRoute?.pickupStops || routes[0]?.pickupStops || []}
                    value={transferPickupStopId}
                    onChange={setTransferPickupStopId}
                    placeholder="Select pickup stop"
                    disabled={!transferTripPickup}
                  />
                </div>

                {/* 3. Drop Stop */}
                <div>
                  <label className={t.label}>Drop Stop</label>
                  <StopDropdown
                    stops={transferRoute?.dropStops || routes[0]?.dropStops || []}
                    value={transferDropStopId}
                    onChange={setTransferDropStopId}
                    placeholder="Select drop stop"
                    disabled={!transferTripDrop}
                  />
                </div>

                {/* 4. Pass Type Selection matching Screenshot 2 */}
                <div>
                  <label className={t.label}>Pass Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTransferPassType("ANNUAL")}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                        transferPassType === 'ANNUAL'
                          ? "bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white shadow-lg border-red-500"
                          : "bg-[#181234] border-purple-900/60 text-slate-300 hover:border-purple-700/60"
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">Annual Pass</div>
                      <div className="text-sm font-black mt-1">₹{formatCurrency(transferRoute?.fees || 55000)}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferPassType("DAILY")}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                        transferPassType === 'DAILY'
                          ? "bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white shadow-lg border-red-500"
                          : "bg-[#181234] border-purple-900/60 text-slate-300 hover:border-purple-700/60"
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">Trip Pass</div>
                      <div className="text-sm font-black mt-1">₹{transferRoute?.dailyFee || 150} / trip</div>
                    </button>
                  </div>
                </div>

                {/* 5. Trips Selection matching Screenshot 2 */}
                {transferPassType === 'DAILY' && (
                  <div className="space-y-2">
                    <label className={t.label}>Trips</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                        transferTripPickup 
                          ? "bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white border-red-500" 
                          : "bg-[#181234] border-purple-900/60 text-slate-300"
                      }`}>
                        <input
                          type="checkbox"
                          checked={transferTripPickup}
                          onChange={e => setTransferTripPickup(e.target.checked)}
                          className="w-4 h-4 rounded accent-amber-400"
                        />
                        <div>
                          <span className="font-extrabold text-xs block">Pickup</span>
                          <span className="text-[10px] opacity-80 block">To campus · ₹{transferRoute?.dailyFee || 150}</span>
                        </div>
                      </label>

                      <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                        transferTripDrop 
                          ? "bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white border-red-500" 
                          : "bg-[#181234] border-purple-900/60 text-slate-300"
                      }`}>
                        <input
                          type="checkbox"
                          checked={transferTripDrop}
                          onChange={e => setTransferTripDrop(e.target.checked)}
                          className="w-4 h-4 rounded accent-amber-400"
                        />
                        <div>
                          <span className="font-extrabold text-xs block">Drop</span>
                          <span className="text-[10px] opacity-80 block">From campus · ₹{transferRoute?.dailyFee || 150}</span>
                        </div>
                      </label>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-400 pt-0.5">
                      {((transferTripPickup ? 1 : 0) + (transferTripDrop ? 1 : 0))} trip × ₹{transferRoute?.dailyFee || 150}
                    </div>
                  </div>
                )}

                {/* 6. Travel Date */}
                <div>
                  <label className={t.label}>Travel Date</label>
                  <input
                    type="date"
                    value={transferTravelDate}
                    onChange={e => setTransferTravelDate(e.target.value)}
                    className={`${t.input} w-full text-xs font-medium cursor-pointer`}
                  />
                </div>

                {/* 7. New Total Fee matching Screenshot 2 */}
                <div className="bg-[#171135] p-3.5 rounded-2xl border border-purple-900/60 flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs">New Total Fee</span>
                  <span className="font-black text-amber-400 text-sm">
                    ₹{formatCurrency(
                      transferPassType === 'DAILY'
                        ? (transferRoute?.dailyFee || 150) * ((transferTripPickup ? 1 : 0) + (transferTripDrop ? 1 : 0))
                        : (transferRoute?.fees || 55000)
                    )}
                  </span>
                </div>

              </div>

              {/* Modal Footer Controls matching Screenshot 2 */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setTransferAppTarget(null)}
                  className={`${t.btnCancel} px-5 py-2.5 text-xs font-extrabold`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isTransferring}
                  onClick={handleConfirmTransfer}
                  className={`${t.btnPrimary} px-5 py-2.5 text-xs font-black`}
                >
                  {isTransferring ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Modals for Scan and Track */}
      <ScanModal isOpen={scanModalOpen} onClose={() => setScanModalOpen(false)} />
      <TrackModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
    </div>
  );
}
