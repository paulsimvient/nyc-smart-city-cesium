import React, { useState, useEffect } from 'react';
import { citySensors, sensorCategories, getSensorsByCategory } from '../data/citySensors';

const SensorDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sensors, setSensors] = useState(citySensors);

  // Filter sensors based on category and search term
  useEffect(() => {
    let filteredSensors = citySensors;
    
    if (selectedCategory !== 'all') {
      filteredSensors = getSensorsByCategory(selectedCategory);
    }
    
    if (searchTerm) {
      filteredSensors = filteredSensors.filter(sensor =>
        sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setSensors(filteredSensors);
  }, [selectedCategory, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00FF00';
      case 'inactive': return '#FF0000';
      case 'maintenance': return '#FFA500';
      default: return '#808080';
    }
  };

  const formatLastUpdate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const renderSensorData = (sensor) => {
    const data = sensor.data;
    
    switch (sensor.type) {
      case 'traffic':
        return (
          <div>
            <div>Flow: {data.currentFlow} vpm</div>
            <div>Speed: {data.averageSpeed} mph</div>
            <div>Congestion: {data.congestionLevel}</div>
          </div>
        );
      case 'air_quality':
        return (
          <div>
            <div>PM2.5: {data.pm25} μg/m³</div>
            <div>CO₂: {data.co2} ppm</div>
            <div>AQI: {data.airQualityIndex}</div>
          </div>
        );
      case 'weather':
        return (
          <div>
            <div>Temp: {data.temperature}°F</div>
            <div>Humidity: {data.humidity}%</div>
            <div>Wind: {data.windSpeed} mph</div>
          </div>
        );
      case 'power':
        return (
          <div>
            <div>Output: {data.powerOutput} kW</div>
            <div>Load: {data.loadPercentage}%</div>
            <div>Efficiency: {data.efficiency}%</div>
          </div>
        );
      case 'parking':
        return (
          <div>
            <div>Available: {data.availableSpots}/{data.totalSpots}</div>
            <div>Occupancy: {data.occupancyRate}%</div>
          </div>
        );
      default:
        return (
          <div>
            {Object.entries(data).slice(0, 3).map(([key, value]) => (
              <div key={key}>{key}: {value}</div>
            ))}
          </div>
        );
    }
  };

  return (
    <div style={{ 
      background: '#181a20', 
      color: '#fff', 
      padding: '1rem',
      height: '100%',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
          Smart City Sensors ({sensors.length})
        </h2>
        
        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search sensors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: '#23272f',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#fff'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.5rem',
              background: '#23272f',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#fff'
            }}
          >
            <option value="all">All Categories</option>
            {sensorCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sensor Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {sensors.map(sensor => (
          <div
            key={sensor.id}
            style={{
              background: '#23272f',
              border: `2px solid ${sensor.color}`,
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}
          >
            {/* Status indicator */}
            <div
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(sensor.status)
              }}
            />
            
            {/* Sensor header */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ 
                margin: '0 0 0.25rem 0', 
                fontSize: '1rem',
                color: sensor.color
              }}>
                {sensor.name}
              </h3>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#888',
                textTransform: 'capitalize'
              }}>
                {sensor.type.replace('_', ' ')} • {sensor.category.replace('_', ' ')}
              </div>
            </div>
            
            {/* Sensor data */}
            <div style={{ 
              fontSize: '0.9rem',
              marginBottom: '0.5rem'
            }}>
              {renderSensorData(sensor)}
            </div>
            
            {/* Last update */}
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#666',
              borderTop: '1px solid #444',
              paddingTop: '0.5rem'
            }}>
              Last update: {formatLastUpdate(sensor.data.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {sensors.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#888'
        }}>
          No sensors found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default SensorDashboard; 