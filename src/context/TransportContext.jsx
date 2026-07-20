import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentData, routeCoordinates, busData } from '../data/mockData';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(studentData);
  
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
      busNumber: student.dropBus.number,
      route: student.dropBus.route,
      timestamp: newTimestamp
    });
    setQrCodeData(qrPayload);
  };

  // Initialize QR details once
  useEffect(() => {
    refreshPassDetails();
  }, [student]);

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
    }, 2000); // 2 seconds processing delay
  };

  return (
    <TransportContext.Provider
      value={{
        isAuthenticated,
        student,
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
        login,
        logout
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => useContext(TransportContext);
