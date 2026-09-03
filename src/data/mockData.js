// Mock database for VStudy College Transport Management System

export const studentData = {
  name: "KUMARAN S",
  regNo: "192372048",
  profilePhoto: "/profile.png",
  department: "School of Engineering (SIMATS)",
  avatarText: "J",
  passStatus: "Active",
  validTill: "20 Jul 2026", 
  pickupBus: {
    number: "TN87F3994",
    route: "7B - Puzhal Camp",
    time: "06:15",
    from: "Villa Apartment",
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

export const routesList = [
  {
    id: "route-7f",
    routeNumber: "7F",
    routeName: "Ambattur OT II",
    busName: "TN87F7777",
    fees: 55000,
    dailyFee: 150,
    capacity: 55,
    vacantSeats: 33,
    amenities: ["AC", "GPS Tracking", "CCTV", "WiFi"],
    pickupStops: [
      { id: "7f-p1", stopName: "Ambattur OT", time: "07:15", stopOrder: 1, lat: 13.1300, lng: 80.1500 },
      { id: "7f-p2", stopName: "Ambattur Bus Stop", time: "07:25", stopOrder: 2, lat: 13.1320, lng: 80.1520 },
      { id: "7f-p3", stopName: "SIMATS Campus", time: "08:10", stopOrder: 3, lat: 13.0280, lng: 80.0762 }
    ],
    dropStops: [
      { id: "7f-d1", stopName: "SIMATS Campus", time: "16:00", stopOrder: 1, lat: 13.0280, lng: 80.0762 },
      { id: "7f-d2", stopName: "Ambattur Bus Stop", time: "16:15", stopOrder: 2, lat: 13.1320, lng: 80.1520 },
      { id: "7f-d3", stopName: "Ambattur OT", time: "16:30", stopOrder: 3, lat: 13.1300, lng: 80.1500 }
    ]
  },
  {
    id: "route-7b",
    routeNumber: "7B",
    routeName: "Puzhal Camp",
    busName: "TN87F3994",
    fees: 18000,
    dailyFee: 120,
    capacity: 55,
    vacantSeats: 13,
    amenities: ["AC", "GPS Tracking", "CCTV", "First Aid"],
    pickupStops: [
      { id: "p1", stopName: "Puzhal Camp", time: "06:15", stopOrder: 1, lat: 13.1500, lng: 80.1600 },
      { id: "p2", stopName: "Kolathur Bypass", time: "07:25", stopOrder: 2, lat: 13.1420, lng: 80.1550 },
      { id: "p3", stopName: "Ambattur OT", time: "07:35", stopOrder: 3, lat: 13.1300, lng: 80.1500 },
      { id: "p4", stopName: "Maduravoyal Toll Plaza", time: "07:45", stopOrder: 4, lat: 13.1100, lng: 80.1350 },
      { id: "p5", stopName: "SIMATS Campus", time: "08:10", stopOrder: 5, lat: 13.0280, lng: 80.0762 }
    ],
    dropStops: [
      { id: "d1", stopName: "SIMATS Campus", time: "16:00", stopOrder: 1, lat: 13.0280, lng: 80.0762 },
      { id: "d2", stopName: "Maduravoyal Toll Plaza", time: "16:25", stopOrder: 2, lat: 13.1100, lng: 80.1350 },
      { id: "d3", stopName: "Ambattur OT", time: "16:40", stopOrder: 3, lat: 13.1300, lng: 80.1500 },
      { id: "d4", stopName: "Kolathur Bypass", time: "16:55", stopOrder: 4, lat: 13.1420, lng: 80.1550 },
      { id: "d5", stopName: "Villa Apartment", time: "17:15", stopOrder: 5, lat: 13.1500, lng: 80.1600 }
    ]
  },
  {
    id: "route-12a",
    routeNumber: "12A",
    routeName: "Tambaram Sanatorium",
    busName: "TN87F4012",
    fees: 21000,
    dailyFee: 140,
    capacity: 50,
    vacantSeats: 8,
    amenities: ["GPS Tracking", "CCTV", "First Aid"],
    pickupStops: [
      { id: "t1", stopName: "Tambaram Sanatorium", time: "07:00", stopOrder: 1, lat: 12.9279, lng: 80.1211 },
      { id: "t2", stopName: "Chromepet", time: "07:12", stopOrder: 2, lat: 12.9516, lng: 80.1462 },
      { id: "t3", stopName: "Pallavaram", time: "07:22", stopOrder: 3, lat: 12.9675, lng: 80.1491 },
      { id: "t4", stopName: "SIMATS Campus", time: "08:15", stopOrder: 4, lat: 13.0280, lng: 80.0762 }
    ],
    dropStops: [
      { id: "td1", stopName: "SIMATS Campus", time: "16:00", stopOrder: 1, lat: 13.0280, lng: 80.0762 },
      { id: "td2", stopName: "Pallavaram", time: "16:50", stopOrder: 2, lat: 12.9675, lng: 80.1491 },
      { id: "td3", stopName: "Chromepet", time: "17:00", stopOrder: 3, lat: 12.9516, lng: 80.1462 },
      { id: "td4", stopName: "Tambaram Sanatorium", time: "17:15", stopOrder: 4, lat: 12.9279, lng: 80.1211 }
    ]
  }
];

export const initialApplicationsList = [
  {
    id: "app-7f",
    student_name: "KUMARAN S",
    register_number: "192372048",
    photo_url: "/profile.png",
    profile_photo: "/profile.png",
    routeId: "route-7b",
    routeNumber: "7B",
    routeName: "Puzhal Camp",
    pickupStopId: "p1",
    pickup_stop_name: "Villa Apartment",
    pickup_stop_time: "06:15",
    dropStopId: "d5",
    drop_stop_name: "Villa Apartment",
    drop_stop_time: "17:15",
    pass_type: "DAILY",
    passType: "DAILY",
    trip_direction: "DROP",
    tripDirection: "DROP",
    fees: 150,
    annualFee: 150,
    status: "APPROVED", // Matches screenshot "APPROVED"
    createdAt: "2026-07-21T07:03:00Z",
    valid_from: "2026-07-21",
    valid_to: "2027-02-28",
    validFrom: "2026-07-21",
    validTo: "2027-02-28"
  }
];


