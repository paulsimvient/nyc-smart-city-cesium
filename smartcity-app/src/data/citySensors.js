// Smart City Sensors Database
// This contains all the sensors, infrastructure, and data points for the smart city

export const citySensors = [
  // Traffic Sensors
  {
    id: 'traffic_001',
    name: 'Traffic Light Controller - 5th & Main',
    type: 'traffic',
    category: 'transportation',
    location: { lat: 40.7128, lng: -74.006, height: 5 },
    status: 'active',
    data: {
      currentFlow: 45, // vehicles per minute
      averageSpeed: 28, // mph
      congestionLevel: 'moderate',
      lastUpdate: new Date().toISOString()
    },
    color: '#FFD700'
  },
  {
    id: 'traffic_002',
    name: 'Traffic Camera - Broadway & 42nd',
    type: 'camera',
    category: 'transportation',
    location: { lat: 40.7589, lng: -73.9851, height: 8 },
    status: 'active',
    data: {
      vehicleCount: 120,
      pedestrianCount: 85,
      incidentDetected: false,
      lastUpdate: new Date().toISOString()
    },
    color: '#FFD700'
  },
  {
    id: 'traffic_003',
    name: 'Smart Parking Sensor - Central Park West',
    type: 'parking',
    category: 'transportation',
    location: { lat: 40.7829, lng: -73.9654, height: 1 },
    status: 'active',
    data: {
      availableSpots: 12,
      totalSpots: 50,
      occupancyRate: 76,
      lastUpdate: new Date().toISOString()
    },
    color: '#FFD700'
  },

  // Environmental Sensors
  {
    id: 'env_001',
    name: 'Air Quality Monitor - Times Square',
    type: 'air_quality',
    category: 'environmental',
    location: { lat: 40.7580, lng: -73.9855, height: 15 },
    status: 'active',
    data: {
      pm25: 12, // μg/m³
      pm10: 25, // μg/m³
      co2: 420, // ppm
      airQualityIndex: 'good',
      lastUpdate: new Date().toISOString()
    },
    color: '#00FF00'
  },
  {
    id: 'env_002',
    name: 'Weather Station - Battery Park',
    type: 'weather',
    category: 'environmental',
    location: { lat: 40.7033, lng: -74.0170, height: 10 },
    status: 'active',
    data: {
      temperature: 72, // °F
      humidity: 65, // %
      windSpeed: 8, // mph
      precipitation: 0, // mm
      lastUpdate: new Date().toISOString()
    },
    color: '#00FF00'
  },
  {
    id: 'env_003',
    name: 'Noise Level Monitor - Wall Street',
    type: 'noise',
    category: 'environmental',
    location: { lat: 40.7064, lng: -74.0090, height: 6 },
    status: 'active',
    data: {
      decibelLevel: 78, // dB
      noiseCategory: 'moderate',
      peakLevel: 85, // dB
      lastUpdate: new Date().toISOString()
    },
    color: '#00FF00'
  },

  // Energy Sensors
  {
    id: 'energy_001',
    name: 'Smart Grid Substation - Midtown',
    type: 'power',
    category: 'energy',
    location: { lat: 40.7505, lng: -73.9934, height: 20 },
    status: 'active',
    data: {
      powerOutput: 15000, // kW
      voltage: 138000, // V
      loadPercentage: 78,
      efficiency: 94.2, // %
      lastUpdate: new Date().toISOString()
    },
    color: '#FF4500'
  },
  {
    id: 'energy_002',
    name: 'Solar Panel Array - Brooklyn Bridge',
    type: 'solar',
    category: 'energy',
    location: { lat: 40.7061, lng: -73.9969, height: 25 },
    status: 'active',
    data: {
      powerGenerated: 2500, // kW
      efficiency: 18.5, // %
      panelCount: 5000,
      lastUpdate: new Date().toISOString()
    },
    color: '#FF4500'
  },
  {
    id: 'energy_003',
    name: 'Wind Turbine - Governors Island',
    type: 'wind',
    category: 'energy',
    location: { lat: 40.6894, lng: -74.0168, height: 100 },
    status: 'active',
    data: {
      powerGenerated: 8000, // kW
      windSpeed: 15, // mph
      rotorSpeed: 12, // rpm
      lastUpdate: new Date().toISOString()
    },
    color: '#FF4500'
  },

  // Water Sensors
  {
    id: 'water_001',
    name: 'Water Quality Monitor - Hudson River',
    type: 'water_quality',
    category: 'water',
    location: { lat: 40.7142, lng: -74.0064, height: 2 },
    status: 'active',
    data: {
      ph: 7.2,
      turbidity: 5, // NTU
      dissolvedOxygen: 8.5, // mg/L
      temperature: 68, // °F
      lastUpdate: new Date().toISOString()
    },
    color: '#4169E1'
  },
  {
    id: 'water_002',
    name: 'Flood Sensor - Lower Manhattan',
    type: 'flood',
    category: 'water',
    location: { lat: 40.7033, lng: -74.0170, height: 1 },
    status: 'active',
    data: {
      waterLevel: 2.5, // feet
      floodRisk: 'low',
      tideLevel: 3.2, // feet
      lastUpdate: new Date().toISOString()
    },
    color: '#4169E1'
  },

  // Waste Management
  {
    id: 'waste_001',
    name: 'Smart Trash Bin - Central Park',
    type: 'waste',
    category: 'waste_management',
    location: { lat: 40.7829, lng: -73.9654, height: 1 },
    status: 'active',
    data: {
      fillLevel: 65, // %
      temperature: 75, // °F
      lastEmptied: '2024-01-15T10:30:00Z',
      lastUpdate: new Date().toISOString()
    },
    color: '#8B4513'
  },
  {
    id: 'waste_002',
    name: 'Recycling Center Monitor - Queens',
    type: 'recycling',
    category: 'waste_management',
    location: { lat: 40.7282, lng: -73.7949, height: 5 },
    status: 'active',
    data: {
      dailyVolume: 15000, // lbs
      recyclingRate: 78, // %
      energyRecovered: 2500, // kWh
      lastUpdate: new Date().toISOString()
    },
    color: '#8B4513'
  },

  // Public Safety
  {
    id: 'safety_001',
    name: 'Emergency Call Box - Times Square',
    type: 'emergency',
    category: 'public_safety',
    location: { lat: 40.7580, lng: -73.9855, height: 2 },
    status: 'active',
    data: {
      lastTested: '2024-01-10T14:00:00Z',
      batteryLevel: 95, // %
      signalStrength: 'excellent',
      lastUpdate: new Date().toISOString()
    },
    color: '#FF0000'
  },
  {
    id: 'safety_002',
    name: 'CCTV Camera - Grand Central',
    type: 'cctv',
    category: 'public_safety',
    location: { lat: 40.7527, lng: -73.9772, height: 12 },
    status: 'active',
    data: {
      recording: true,
      storageUsed: 45, // %
      motionDetected: false,
      lastUpdate: new Date().toISOString()
    },
    color: '#FF0000'
  },

  // Public Transportation
  {
    id: 'transit_001',
    name: 'Subway Platform Monitor - Penn Station',
    type: 'subway',
    category: 'transportation',
    location: { lat: 40.7505, lng: -73.9934, height: -20 },
    status: 'active',
    data: {
      passengerCount: 1250,
      trainFrequency: 3, // minutes
      platformCrowding: 'moderate',
      lastUpdate: new Date().toISOString()
    },
    color: '#FFD700'
  },
  {
    id: 'transit_002',
    name: 'Bus GPS Tracker - MTA Route 1',
    type: 'bus',
    category: 'transportation',
    location: { lat: 40.7128, lng: -74.006, height: 2 },
    status: 'active',
    data: {
      speed: 25, // mph
      passengerCount: 45,
      nextStop: 'City Hall',
      estimatedArrival: '5 min',
      lastUpdate: new Date().toISOString()
    },
    color: '#FFD700'
  },

  // Smart Buildings
  {
    id: 'building_001',
    name: 'Smart Building - Empire State',
    type: 'building',
    category: 'infrastructure',
    location: { lat: 40.7484, lng: -73.9857, height: 100 },
    status: 'active',
    data: {
      energyUsage: 8500, // kWh
      occupancy: 85, // %
      temperature: 72, // °F
      elevatorStatus: 'operational',
      lastUpdate: new Date().toISOString()
    },
    color: '#9370DB'
  },
  {
    id: 'building_002',
    name: 'Smart Streetlight - 5th Avenue',
    type: 'lighting',
    category: 'infrastructure',
    location: { lat: 40.7589, lng: -73.9851, height: 8 },
    status: 'active',
    data: {
      brightness: 80, // %
      motionDetected: true,
      energyConsumption: 0.5, // kWh
      lastUpdate: new Date().toISOString()
    },
    color: '#9370DB'
  },

  // Health & Wellness
  {
    id: 'health_001',
    name: 'Public Health Monitor - Central Park',
    type: 'health',
    category: 'public_health',
    location: { lat: 40.7829, lng: -73.9654, height: 3 },
    status: 'active',
    data: {
      uvIndex: 6,
      pollenCount: 'low',
      airQuality: 'good',
      lastUpdate: new Date().toISOString()
    },
    color: '#32CD32'
  }
];

// Sensor categories for filtering
export const sensorCategories = [
  { id: 'transportation', name: 'Transportation', color: '#FFD700' },
  { id: 'environmental', name: 'Environmental', color: '#00FF00' },
  { id: 'energy', name: 'Energy', color: '#FF4500' },
  { id: 'water', name: 'Water', color: '#4169E1' },
  { id: 'waste_management', name: 'Waste Management', color: '#8B4513' },
  { id: 'public_safety', name: 'Public Safety', color: '#FF0000' },
  { id: 'infrastructure', name: 'Infrastructure', color: '#9370DB' },
  { id: 'public_health', name: 'Public Health', color: '#32CD32' }
];

// Sensor types for detailed filtering
export const sensorTypes = [
  'traffic', 'camera', 'parking', 'air_quality', 'weather', 'noise',
  'power', 'solar', 'wind', 'water_quality', 'flood', 'waste', 'recycling',
  'emergency', 'cctv', 'subway', 'bus', 'building', 'lighting', 'health'
];

// Get sensors by category
export const getSensorsByCategory = (category) => {
  return citySensors.filter(sensor => sensor.category === category);
};

// Get sensors by type
export const getSensorsByType = (type) => {
  return citySensors.filter(sensor => sensor.type === type);
};

// Get sensor by ID
export const getSensorById = (id) => {
  return citySensors.find(sensor => sensor.id === id);
};

// Get sensors by status
export const getSensorsByStatus = (status) => {
  return citySensors.filter(sensor => sensor.status === status);
}; 