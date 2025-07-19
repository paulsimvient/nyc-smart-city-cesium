import { useState } from 'react';
import MapComponent from './components/Map';
import SensorDashboard from './components/SensorDashboard';
import CityReview from './components/CityReview';
import './App.css';

// Load Cesium from CDN for the fly function
const loadCesium = () => {
  return new Promise((resolve) => {
    if (window.Cesium) {
      resolve(window.Cesium);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.131/Build/Cesium/Cesium.js';
    script.onload = () => {
      resolve(window.Cesium);
    };
    document.head.appendChild(script);
  });
};

console.log('=== SMARTCITY APP IS RUNNING ===');

function App() {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map', 'sensors', or 'review'
  const [mapViewer, setMapViewer] = useState(null);

  const handleMapViewerReady = (viewer) => {
    setMapViewer(viewer);
  };

  const handleLocationSelect = async (lat, lng) => {
    if (mapViewer && window.Cesium) {
      try {
        mapViewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, 2000),
          orientation: {
            heading: window.Cesium.Math.toRadians(0.0),
            pitch: window.Cesium.Math.toRadians(-30.0),
          },
          duration: 2
        });
        console.log(`Flying to: ${lat}, ${lng}`);
      } catch (error) {
        console.error('Error flying to location:', error);
      }
    } else {
      console.log('Map viewer or Cesium not ready');
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('http://localhost:3002/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResponse(data.aiResponse || data.error);
    } catch (err) {
      setAiResponse('Error connecting to backend');
    }
    setLoading(false);
  };

  return (
    <div style={{ height: '100vh', background: '#23272f', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="4"/><rect x="7" y="7" width="10" height="10" rx="2" fill="#23272f"/></svg>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem' }}>Smart City Operator</h1>
      </header>
      <main style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <section style={{ width: '240px', minWidth: 240, padding: '0.75rem', background: '#23272f', borderRight: '1px solid #333', overflow: 'auto', height: '100%' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveView('map')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: activeView === 'map' ? '#444' : '#181a20',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              3D Map
            </button>
            <button
              onClick={() => setActiveView('sensors')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: activeView === 'sensors' ? '#444' : '#181a20',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Sensors
            </button>
            <button
              onClick={() => setActiveView('review')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: activeView === 'review' ? '#444' : '#181a20',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              AI Review
            </button>
          </div>

          {activeView === 'map' ? (
            <>
              <form onSubmit={handlePromptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label htmlFor="prompt" style={{ fontWeight: 600 }}>Operator Prompt</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={4}
                  style={{ background: '#181a20', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: 8 }}
                  placeholder="e.g. Increase traffic on Main St, make it rain downtown, schedule a parade at 5pm..."
                  required
                />
                <button type="submit" style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 6, padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }} disabled={loading}>
                  {loading ? 'Processing...' : 'Send to AI'}
                </button>
              </form>
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Response</h2>
                <div style={{ background: '#181a20', color: '#fff', borderRadius: 6, padding: 12, minHeight: 60, border: '1px solid #333' }}>
                  {aiResponse || <span style={{ color: '#888' }}>AI response will appear here.</span>}
                </div>
              </div>
            </>
          ) : activeView === 'sensors' ? (
            <SensorDashboard />
          ) : (
            <CityReview onLocationSelect={handleLocationSelect} />
          )}
        </section>
        <section style={{ flex: 1, position: 'relative', height: '100%' }}>
          <MapComponent onViewerReady={handleMapViewerReady} />
        </section>
        
                <section style={{ 
          width: '240px', 
          minWidth: 240,
          background: '#181a20',
          borderLeft: '1px solid #333',
          padding: '0.75rem',
          overflow: 'auto',
          height: '100%'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Smart City Analytics</h2>
          <div style={{ 
            background: '#23272f', 
            border: '1px solid #444', 
            borderRadius: '8px', 
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Real-time Data</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
              Sensor data and analytics will be displayed here when sensors are placed on the map.
            </p>
          </div>
          
          <div style={{ 
            background: '#23272f', 
            border: '1px solid #444', 
            borderRadius: '8px', 
            padding: '1rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>System Status</h3>
            <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
              <div style={{ marginBottom: '0.5rem' }}>🟢 Map System: Online</div>
              <div style={{ marginBottom: '0.5rem' }}>🟢 AI Service: Connected</div>
              <div style={{ marginBottom: '0.5rem' }}>🟢 Sensor Network: Active</div>
              <div>🟢 Data Processing: Ready</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
