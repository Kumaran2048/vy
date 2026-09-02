import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentData, routeCoordinates, busData, routesList, initialApplicationsList } from '../data/mockData';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(studentData);
  const [routes, setRoutes] = useState(routesList);
  const [applications, setApplications] = useState(initialApplicationsList);
  
  // QR Countdown & Verification State
  const [countdown, setCountdown] = useState(59);
  const [qrCodeData, setQrCodeData] = useState("");
  const [manualCode, setManualCode] = useState("969 793");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  // GPS Simulation State for Tracking Page
  const [busCoordinateIndex, setBusCoordinateIndex] = useState(0);
  const [simulatedBusLocation, setSimulatedBusLocation] = useState(routeCoordinates[0]);
  const [speed, setSpeed] = useState(busData.speed);
  const [eta, setEta] = useState(busData.eta);
  const [distanceRemaining, setDistanceRemaining] = useState(busData.distanceRemaining);

  // Scan to Verify Bus State
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'opening' | 'scanning' | 'verifying' | 'success'
  const [verifiedBusDetails, setVerifiedBusDetails] = useState(null);

  // Track selection modal
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [activeTrackingType, setActiveTrackingType] = useState('pickup'); // 'pickup' | 'drop'

  // Computed active pass
  const activePass = applications.find(
    (app) => String(app.status).toUpperCase() === 'PAID' || String(app.status).toUpperCase() === 'ACTIVE'
  ) || null;

  // Helper to generate a new 6-digit manual verification code
  const generateManualCode = () => {
    const code1 = Math.floor(100 + Math.random() * 900);
    const code2 = Math.floor(100 + Math.random() * 900);
    return `${code1} ${code2}`;
  };

  // Helper to generate updated QR payload object
  const refreshPassDetails = () => {
    const newTimestamp = new Date().toISOString();
    setTimestamp(newTimestamp);
    setManualCode(generateManualCode());
    
    // Construct the payload matching target format: Student, Register Number, Bus, Route, Timestamp
    const qrPayload = JSON.stringify({
      studentName: student.name,
      registerNumber: student.regNo,
      busNumber: activePass ? activePass.busName || student.dropBus.number : student.dropBus.number,
      route: activePass ? `${activePass.routeNumber} - ${activePass.routeName}` : student.dropBus.route,
      timestamp: newTimestamp
    });
    setQrCodeData(qrPayload);
  };

  // Initialize QR details once
  useEffect(() => {
    refreshPassDetails();
  }, [student, activePass]);

  // Countdown timer logic (59 -> 0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshPassDetails();
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // GPS Simulation: moves the bus along the route coordinates every 4 seconds
  useEffect(() => {
    const gpsTimer = setInterval(() => {
      setBusCoordinateIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % routeCoordinates.length;
        setSimulatedBusLocation(routeCoordinates[nextIndex]);
        
        // Simulating minor dynamic speeds & metrics changes
        const randomSpeed = Math.floor(40 + Math.random() * 15);
        setSpeed(randomSpeed);

        const remainingStops = routeCoordinates.length - 1 - nextIndex;
        if (remainingStops === 0) {
          setEta("Arrived");
          setDistanceRemaining("0 km");
        } else {
          setEta(`${remainingStops * 2 + 1} mins`);
          setDistanceRemaining(`${(remainingStops * 0.8).toFixed(1)} km`);
        }

        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(gpsTimer);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Triggered when a QR code is detected or simulated in the scanner
  const handleVerifyPass = (scannedContent) => {
    setScanState('verifying');
    
    setTimeout(() => {
      setVerifiedBusDetails({
        busNumber: student.dropBus.number,
        busRoute: student.dropBus.route,
        studentRoute: student.dropBus.route,
        verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setScanState('success');
    }, 400); // 400ms processing delay for snappy feedback
  };

  // Action: Pay application fee to activate pass
  const payApplication = (appId) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: 'PAID' } : app
      )
    );
  };

  // Action: Cancel application
  const cancelApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
  };

  // Action: Apply for a pass
  const submitApplication = (newAppData) => {
    const targetRoute = routes.find((r) => r.id === newAppData.routeId);
    const pickupStopObj = targetRoute?.pickupStops?.find((s) => s.id === newAppData.pickupStopId);
    const dropStopObj = targetRoute?.dropStops?.find((s) => s.id === newAppData.dropStopId);

    const isDaily = newAppData.passType === 'DAILY';
    const isPickup = newAppData.tripDirection === 'PICKUP' || newAppData.tripDirection === 'BOTH';
    const isDrop = newAppData.tripDirection === 'DROP' || newAppData.tripDirection === 'BOTH';

    const calcFee = isDaily
      ? (targetRoute?.dailyFee || 100) * ((isPickup ? 1 : 0) + (isDrop ? 1 : 0))
      : targetRoute?.fees || 18000;

    const newApp = {
      id: `app-${Date.now()}`,
      routeId: targetRoute?.id || newAppData.routeId,
      routeNumber: targetRoute?.routeNumber || 'Route',
      routeName: targetRoute?.routeName || 'Campus Shuttle',
      pickupStopId: newAppData.pickupStopId,
      pickup_stop_name: pickupStopObj?.stopName || 'Campus Gate',
      pickup_stop_time: pickupStopObj?.time || '07:30',
      dropStopId: newAppData.dropStopId,
      drop_stop_name: dropStopObj?.stopName || 'Student Residence',
      drop_stop_time: dropStopObj?.time || '17:30',
      pass_type: newAppData.passType || 'ANNUAL',
      passType: newAppData.passType || 'ANNUAL',
      trip_direction: newAppData.tripDirection || 'BOTH',
      tripDirection: newAppData.tripDirection || 'BOTH',
      fees: calcFee,
      annualFee: calcFee,
      status: isDaily ? 'PAID' : 'APPROVED', // Daily passes are direct pay, Annual are Approved awaiting payment
      createdAt: new Date().toISOString(),
      valid_from: isDaily ? newAppData.passDate || new Date().toISOString().slice(0, 10) : '2026-08-01',
      valid_to: isDaily ? newAppData.passDate || new Date().toISOString().slice(0, 10) : '2027-05-31',
      validFrom: isDaily ? newAppData.passDate || new Date().toISOString().slice(0, 10) : '2026-08-01',
      validTo: isDaily ? newAppData.passDate || new Date().toISOString().slice(0, 10) : '2027-05-31'
    };

    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  // Action: Transfer Route
  const transferApplication = (appId, transferData) => {
    const targetRoute = routes.find((r) => r.id === transferData.routeId);
    const pickupStopObj = targetRoute?.pickupStops?.find((s) => s.id === transferData.pickupStopId);
    const dropStopObj = targetRoute?.dropStops?.find((s) => s.id === transferData.dropStopId);

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          routeId: targetRoute?.id || transferData.routeId,
          routeNumber: targetRoute?.routeNumber || app.routeNumber,
          routeName: targetRoute?.routeName || app.routeName,
          pickupStopId: transferData.pickupStopId,
          pickup_stop_name: pickupStopObj?.stopName || app.pickup_stop_name,
          pickup_stop_time: pickupStopObj?.time || app.pickup_stop_time,
          dropStopId: transferData.dropStopId,
          drop_stop_name: dropStopObj?.stopName || app.drop_stop_name,
          drop_stop_time: dropStopObj?.time || app.drop_stop_time,
          status: 'AWAITING_PAYMENT'
        };
      })
    );
  };

  return (
    <TransportContext.Provider
      value={{
        isAuthenticated,
        student,
        routes,
        applications,
        activePass,
        countdown,
        qrCodeData,
        manualCode,
        timestamp,
        simulatedBusLocation,
        speed,
        eta,
        distanceRemaining,
        scanModalOpen,
        setScanModalOpen,
        scanState,
        setScanState,
        verifiedBusDetails,
        handleVerifyPass,
        trackModalOpen,
        setTrackModalOpen,
        activeTrackingType,
        setActiveTrackingType,
        payApplication,
        cancelApplication,
        submitApplication,
        transferApplication,
        login,
        logout
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => useContext(TransportContext);

