import React from 'react';
import { useTransport } from '../context/TransportContext';
import { routeCoordinates, driverData, busData } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Phone, Star, MapPin, Gauge, ShieldAlert, Compass, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Map Markers using vector HTML elements to avoid bundle asset errors
const getStudentIcon = () => {
  return L.divIcon({
    className: 'custom-student-icon',
    html: `
      <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const getBusIcon = (angle = 0) => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div class="w-10 h-10 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white shadow-xl animate-pulse" style="box-shadow: 0 0 15px rgba(139, 92, 246, 0.6)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.1 2 11.3 2 11.5V16c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const getStopIcon = (stopName) => {
  return L.divIcon({
    className: 'custom-stop-icon',
    html: `
      <div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center shadow">
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const TrackBus = () => {
  const { 
    activeTrackingType, 
    simulatedBusLocation, 
    speed, 
    eta, 
    distanceRemaining 
  } = useTransport();

  const mapCenter = [13.0800, 80.1200]; // Porur center point
  const polylineCoords = routeCoordinates.map(c => [c.lat, c.lng]);

  const studentHomeLocation = [13.1500, 80.1600]; // Puzhal Camp

  return (
    <div className="w-full flex-1 flex flex-col justify-start">
      
      {/* Active Trip Header Banner */}
      <div className="w-full bg-[#1b1535]/60 border border-purple-950/40 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Currently Tracking
          </span>
          <span className="text-sm font-extrabold text-white">
            {activeTrackingType === 'pickup' ? 'Pickup' : 'Drop'} Route · {busData.plateNumber}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
          <Compass className="w-3.5 h-3.5" />
          Live
        </div>
      </div>

      {/* Map Display Container */}
      <div className="w-full h-80 relative rounded-2xl overflow-hidden border border-purple-900/40 shadow-xl mb-4 z-10">
        <MapContainer 
          center={mapCenter} 
          zoom={11} 
          scrollWheelZoom={false}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Draw entire bus pathway polyline */}
          <Polyline 
            positions={polylineCoords} 
            color="#8b5cf6" 
            weight={4} 
            opacity={0.7}
            dashArray="1, 8"
          />

          {/* Student Marker (Destination or Pickup point) */}
          <Marker position={studentHomeLocation} icon={getStudentIcon()}>
            <Popup>
              <div className="text-slate-800 font-bold text-xs p-1">
                Student Pickup/Drop Stop:<br/>
                <span className="text-purple-600">Villa Apartment</span>
              </div>
            </Popup>
          </Marker>

          {/* Animated Bus GPS Location Marker */}
          <Marker 
            position={[simulatedBusLocation.lat, simulatedBusLocation.lng]} 
            icon={getBusIcon()}
          >
            <Popup>
              <div className="text-slate-800 font-bold text-xs p-1">
                Bus {busData.plateNumber}<br/>
                Speed: <span className="text-purple-600">{speed} km/h</span><br/>
                Status: <span className="text-emerald-600">On Schedule</span>
              </div>
            </Popup>
          </Marker>

          {/* Stops Markers */}
          {routeCoordinates.map((stop, idx) => (
            <Marker 
              key={idx} 
              position={[stop.lat, stop.lng]} 
              icon={getStopIcon(stop.name)}
            >
              <Popup>
                <div className="text-slate-800 font-bold text-xs p-1">
                  Stop {idx + 1}: <span className="text-purple-600">{stop.name}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Dynamic Trip Metrics & Driver Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Widget 1: Trip Status Statistics */}
        <div className="glass-panel p-4 rounded-3xl flex flex-col justify-between shadow-md">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-purple-400" />
            Trip Status
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-1">
            <div className="bg-[#1b1535]/40 border border-purple-950/40 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">ETA</span>
              <span className="text-base font-extrabold text-purple-400 mt-0.5 block">{eta}</span>
            </div>
            <div className="bg-[#1b1535]/40 border border-purple-950/40 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Remaining</span>
              <span className="text-base font-extrabold text-slate-200 mt-0.5 block">{distanceRemaining}</span>
            </div>
            <div className="bg-[#1b1535]/40 border border-purple-950/40 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Speed</span>
              <span className="text-base font-extrabold text-slate-200 mt-0.5 block">{speed} km/h</span>
            </div>
            <div className="bg-[#1b1535]/40 border border-purple-950/40 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Next Stop</span>
              <span className="text-xs font-extrabold text-slate-200 mt-1 block truncate max-w-full" title={simulatedBusLocation.name}>
                {simulatedBusLocation.name}
              </span>
            </div>
          </div>
        </div>

        {/* Widget 2: Driver Card Details */}
        <div className="glass-panel p-4 rounded-3xl flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
              Driver Profile
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-purple-500/10 border border-purple-500/35 px-2 py-0.5 rounded-full select-none">
              On Trip
            </span>
          </div>

          <div className="flex items-center gap-3.5 my-3">
            <img 
              src={driverData.avatarUrl} 
              alt={driverData.name} 
              className="w-12 h-12 bg-slate-900 border border-purple-950/40 rounded-xl"
            />
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-white tracking-wide">
                {driverData.name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-xs text-slate-200 font-bold">{driverData.rating}</span>
                <span className="text-[10px] text-slate-400 font-medium">({driverData.experience})</span>
              </div>
            </div>
          </div>

          <a 
            href={`tel:${driverData.phone}`}
            className="w-full flex items-center justify-center gap-2 bg-[#f4b63e] hover:bg-[#e2a42a] text-slate-900 font-bold py-2.5 rounded-xl text-xs transition duration-300 shadow-md cursor-pointer select-none"
          >
            <Phone className="w-3.5 h-3.5 fill-slate-900" />
            Contact Driver
          </a>
        </div>

      </div>

    </div>
  );
};

export default TrackBus;
