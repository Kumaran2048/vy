// Mock database for VStudy College Transport Management System

export const studentData = {
  name: "KUMARAN S",
  regNo: "192372048",
  department: "School of Engineering (SIMATS)",
  avatarText: "K",
  passStatus: "Active",
  validTill: "20 Jul 2026", // Will be formatted dynamically in pages
  pickupBus: {
    number: "TN87F3994",
    route: "7B - Puzhal Camp",
    time: "07:30",
    from: "Puzhal Camp",
    to: "SIMATS Campus",
  },
  dropBus: {
    number: "TN87F3994",
    route: "7B - Puzhal Camp",
    time: "15:30",
    from: "SIMATS Campus",
    to: "Villa Apartment",
    expectedDropTime: "17:40"
  }
};

export const driverData = {
  name: "R. Selvam",
  phone: "+91 98765 43210",
  rating: 4.8,
  experience: "8 years",
  status: "On Trip",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Selvam"
};

export const busData = {
  plateNumber: "TN87F3994",
  routeName: "7B - Puzhal Camp",
  capacity: 55,
  occupied: 42,
  speed: 48, // km/h
  distanceRemaining: "4.2 km",
  eta: "14 mins",
  nextStop: "Poonamallee Bypass",
  status: "On Schedule"
};

// Route polyline coordinates around Chennai area (from Poonamallee SIMATS to Puzhal Camp)
export const routeCoordinates = [
  { lat: 13.0280, lng: 80.0762, name: "SIMATS Campus (Start)" },
  { lat: 13.0350, lng: 80.0900, name: "Poonamallee Bypass" },
  { lat: 13.0550, lng: 80.1050, name: "Kumananchavadi" },
  { lat: 13.0800, lng: 80.1200, name: "Porur Junction" },
  { lat: 13.1100, lng: 80.1350, name: "Maduravoyal Toll Plaza" },
  { lat: 13.1300, lng: 80.1500, name: "Ambattur OT" },
  { lat: 13.1420, lng: 80.1550, name: "Kolathur Bypass" },
  { lat: 13.1500, lng: 80.1600, name: "Puzhal Camp (Villa Apartment)" }
];

export const notificationsList = [
  {
    id: 1,
    title: "Route Delay",
    message: "Bus 7B is running 10 mins late due to bypass traffic.",
    time: "2 mins ago",
    type: "warning"
  },
  {
    id: 2,
    title: "Pass Renewed",
    message: "Your transport pass has been verified for the current semester.",
    time: "1 day ago",
    type: "success"
  }
];
