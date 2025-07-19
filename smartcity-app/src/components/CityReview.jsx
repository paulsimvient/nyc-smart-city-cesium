import React, { useState } from 'react';
import { citySensors, getSensorsByCategory } from '../data/citySensors';

// Helper function to filter sensors by location proximity
const getSensorsNearLocation = (sensors, targetLat, targetLng, radiusKm = 2) => {
  return sensors.filter(sensor => {
    const latDiff = Math.abs(sensor.location.latitude - targetLat);
    const lngDiff = Math.abs(sensor.location.longitude - targetLng);
    // Rough approximation: 1 degree ≈ 111 km
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
    return distance <= radiusKm;
  });
};

const CityReview = ({ onLocationSelect }) => {
  const [neighborhood, setNeighborhood] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Predefined neighborhoods with their coordinates and characteristics
  const neighborhoods = {
    'times square': {
      name: 'Times Square',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      characteristics: 'Tourist destination with high pedestrian traffic and entertainment venues',
      knownFor: 'Tourism, entertainment, high pedestrian traffic'
    },
    'hells kitchen': {
      name: 'Hell\'s Kitchen',
      coordinates: { lat: 40.7639, lng: -73.9924 },
      characteristics: 'Residential area with restaurants, theaters, and mixed-use development',
      knownFor: 'Restaurants, Broadway theaters, residential diversity'
    },
    'chelsea': {
      name: 'Chelsea',
      coordinates: { lat: 40.7465, lng: -73.9934 },
      characteristics: 'Art galleries, gay culture, and the High Line elevated park',
      knownFor: 'Art galleries, High Line, gay culture, residential'
    },
    'soho': {
      name: 'SoHo',
      coordinates: { lat: 40.7235, lng: -73.9990 },
      characteristics: 'Historic district with art galleries, boutiques, and cast-iron architecture',
      knownFor: 'Art galleries, shopping, historic architecture'
    },
    'greenwich village': {
      name: 'Greenwich Village',
      coordinates: { lat: 40.7338, lng: -73.9967 },
      characteristics: 'Bohemian neighborhood with historic charm and cultural institutions',
      knownFor: 'Bohemian culture, NYU, Washington Square Park'
    },
    'east village': {
      name: 'East Village',
      coordinates: { lat: 40.7265, lng: -73.9818 },
      characteristics: 'Alternative culture, music venues, and diverse dining scene',
      knownFor: 'Punk rock history, Ukrainian food, alternative culture'
    },
    'lower east side': {
      name: 'Lower East Side',
      coordinates: { lat: 40.7158, lng: -73.9870 },
      characteristics: 'Historic immigrant neighborhood with trendy bars and restaurants',
      knownFor: 'Immigrant history, nightlife, trendy restaurants'
    },
    'financial district': {
      name: 'Financial District',
      coordinates: { lat: 40.7075, lng: -74.0107 },
      characteristics: 'Financial center with Wall Street and historic landmarks',
      knownFor: 'Wall Street, financial institutions, historic sites'
    },
    'battery park city': {
      name: 'Battery Park City',
      coordinates: { lat: 40.7128, lng: -74.0160 },
      characteristics: 'Planned residential community with waterfront views',
      knownFor: 'Waterfront living, planned community, residential'
    },
    'tribeca': {
      name: 'TriBeCa',
      coordinates: { lat: 40.7163, lng: -74.0086 },
      characteristics: 'Trendy neighborhood with converted warehouses and upscale dining',
      knownFor: 'Converted lofts, upscale dining, film festival'
    },
    'chinatown': {
      name: 'Chinatown',
      coordinates: { lat: 40.7158, lng: -73.9970 },
      characteristics: 'Dense Asian community with authentic restaurants and markets',
      knownFor: 'Chinese culture, authentic food, markets'
    },
    'little italy': {
      name: 'Little Italy',
      coordinates: { lat: 40.7191, lng: -73.9973 },
      characteristics: 'Historic Italian neighborhood with traditional restaurants',
      knownFor: 'Italian culture, traditional restaurants, festivals'
    },
    'upper west side': {
      name: 'Upper West Side',
      coordinates: { lat: 40.7870, lng: -73.9754 },
      characteristics: 'Residential area with cultural institutions and Central Park access',
      knownFor: 'Lincoln Center, American Museum of Natural History, residential'
    },
    'upper east side': {
      name: 'Upper East Side',
      coordinates: { lat: 40.7736, lng: -73.9595 },
      characteristics: 'Affluent residential area with museums and luxury shopping',
      knownFor: 'Museum Mile, luxury shopping, residential'
    },
    'harlem': {
      name: 'Harlem',
      coordinates: { lat: 40.8116, lng: -73.9465 },
      characteristics: 'Historic African American neighborhood with rich cultural heritage',
      knownFor: 'African American culture, jazz history, cultural institutions'
    },
    'brooklyn heights': {
      name: 'Brooklyn Heights',
      coordinates: { lat: 40.6997, lng: -73.9939 },
      characteristics: 'Historic residential neighborhood with Manhattan skyline views',
      knownFor: 'Historic brownstones, Brooklyn Bridge views, residential'
    }
  };

  const generateReview = async () => {
    if (!neighborhood) return;
    
    setLoading(true);
    
    const neighborhoodData = neighborhoods[neighborhood.toLowerCase()];
    if (!neighborhoodData) {
      setReview('Neighborhood not found in database. Please try a different area.');
      setLoading(false);
      return;
    }

    // Analyze sensors in the area (within rough proximity)
    const nearbySensors = citySensors.filter(sensor => {
      const sensorLat = sensor.location.lat;
      const sensorLng = sensor.location.lng;
      const areaLat = neighborhoodData.coordinates.lat;
      const areaLng = neighborhoodData.coordinates.lng;
      
      // Rough distance calculation (simplified)
      const latDiff = Math.abs(sensorLat - areaLat);
      const lngDiff = Math.abs(sensorLng - areaLng);
      return latDiff < 0.02 && lngDiff < 0.02; // Within ~1 mile
    });

    try {
      // Create comprehensive analysis for OpenAI
      const analysisData = {
        neighborhood: neighborhoodData,
        existingSensors: nearbySensors,
        allSensors: citySensors,
        sensorCategories: ['transportation', 'environmental', 'energy', 'water', 'waste_management', 'public_safety', 'infrastructure', 'public_health']
      };

      const prompt = `You are a smart city planning AI expert. Analyze this neighborhood and provide specific sensor placement recommendations.

NEIGHBORHOOD: ${neighborhoodData.name}
CHARACTERISTICS: ${neighborhoodData.characteristics}
KNOWN FOR: ${neighborhoodData.knownFor}
COORDINATES: ${neighborhoodData.coordinates.lat}, ${neighborhoodData.coordinates.lng}

EXISTING SENSORS IN AREA (${nearbySensors.length} found):
${nearbySensors.map(sensor => `- ${sensor.name} (${sensor.type}, ${sensor.category})`).join('\n')}

SENSOR CATEGORIES AVAILABLE:
- Transportation: traffic lights, cameras, parking, buses, subways
- Environmental: air quality, weather, noise monitoring
- Energy: smart grid, solar panels, wind turbines
- Water: quality monitoring, flood sensors
- Waste Management: smart bins, recycling centers
- Public Safety: emergency boxes, CCTV cameras
- Infrastructure: smart buildings, streetlights
- Public Health: UV monitoring, pollen counts

Please provide:
1. Analysis of current sensor coverage gaps
2. Specific sensor placement recommendations with reasoning
3. Priority order for implementation
4. Expected benefits and impact
5. Cost considerations and ROI estimates

Format your response in markdown with clear sections. Be specific about sensor types, quantities, and placement reasoning.`;
      
      const response = await fetch('http://localhost:3002/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }
      
      const data = await response.json();
      const aiRecommendations = data.aiResponse || data.error || 'Failed to generate AI recommendations';
      
      setReview(aiRecommendations);
      
      // Save review to history
      setReviews(prev => [{
        id: Date.now(),
        neighborhood: neighborhoodData.name,
        review: aiRecommendations,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      setReview('Error: Could not connect to AI service. Please check your backend server.');
    }
    
    setLoading(false);
  };



  return (
    <div style={{ 
      background: '#181a20', 
      color: '#fff', 
      padding: '1rem',
      height: '100%',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
        OpenAI Sensor Placement Analysis
      </h2>
      <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
        Select a neighborhood to get AI-powered sensor placement recommendations based on current infrastructure gaps.
      </p>

      {/* Input Section */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Select Neighborhood:
        </label>
        <select
          value={neighborhood}
          onChange={(e) => {
            const selected = e.target.value;
            setNeighborhood(selected);
            
            // Fly to location when neighborhood is selected
            if (selected && neighborhoods[selected]) {
              const coords = neighborhoods[selected].coordinates;
              console.log(`Selected: ${neighborhoods[selected].name} at ${coords.lat}, ${coords.lng}`);
              
              if (onLocationSelect) {
                onLocationSelect(coords.lat, coords.lng);
              }
              
              // Fallback: use window function if available
              if (window.flyToLocation) {
                setTimeout(() => {
                  window.flyToLocation(coords.lat, coords.lng);
                }, 100);
              }

              // Place sensors on the map after flying
              setTimeout(() => {
                const nearbySensors = getSensorsNearLocation(citySensors, coords.lat, coords.lng, 2);
                console.log(`Placing ${nearbySensors.length} sensors near ${neighborhoods[selected].name}`);
                
                if (window.placeSensors) {
                  window.placeSensors(nearbySensors);
                }
              }, 2000); // Wait 2 seconds for camera to finish flying
            }
          }}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: '#23272f',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            marginBottom: '1rem'
          }}
        >
          <option value="">Choose a neighborhood...</option>
          {Object.keys(neighborhoods).map(key => (
            <option key={key} value={key}>
              {neighborhoods[key].name}
            </option>
          ))}
        </select>

        <button
          onClick={generateReview}
          disabled={!neighborhood || loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginBottom: '0.5rem'
          }}
        >
          {loading ? 'Analyzing with OpenAI...' : 'Get AI Sensor Recommendations'}
        </button>

        <button
          onClick={() => {
            if (neighborhood && neighborhoods[neighborhood]) {
              const coords = neighborhoods[neighborhood].coordinates;
              const nearbySensors = getSensorsNearLocation(citySensors, coords.lat, coords.lng, 2);
              console.log(`Placing ${nearbySensors.length} sensors near ${neighborhoods[neighborhood].name}`);
              
              if (window.placeSensors) {
                window.placeSensors(nearbySensors);
              }
            }
          }}
          disabled={!neighborhood}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: neighborhood ? 'pointer' : 'not-allowed',
            opacity: neighborhood ? 1 : 0.6,
            marginBottom: '0.5rem'
          }}
        >
          Place Sensors on Map
        </button>

        <button
          onClick={() => {
            if (neighborhood && neighborhoods[neighborhood]) {
              const coords = neighborhoods[neighborhood].coordinates;
              console.log(`Manual fly to: ${neighborhoods[neighborhood].name} at ${coords.lat}, ${coords.lng}`);
              
              if (window.flyToLocation) {
                window.flyToLocation(coords.lat, coords.lng);
              } else {
                console.error('flyToLocation function not available');
              }
            }
          }}
          disabled={!neighborhood}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: neighborhood ? 'pointer' : 'not-allowed',
            opacity: neighborhood ? 1 : 0.6,
            marginBottom: '0.5rem'
          }}
        >
          Fly to Location (Manual)
        </button>

        <button
          onClick={() => {
            console.log('Testing camera movement...');
            if (window.testCamera) {
              window.testCamera();
            } else {
              console.error('testCamera function not available');
            }
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#ff6b35',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Camera Movement
        </button>
      </div>

      {/* Current Review */}
      {review && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            OpenAI Analysis & Recommendations
          </h3>
          <div style={{
            background: '#23272f',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            {review}
          </div>
        </div>
      )}

      {/* Review History */}
      {reviews.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            Review History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.slice(0, 5).map(review => (
              <div
                key={review.id}
                style={{
                  background: '#23272f',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h4 style={{ margin: 0, color: '#FFD700' }}>
                    {review.neighborhood}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '0.9rem',
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {review.review.substring(0, 200)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityReview; 