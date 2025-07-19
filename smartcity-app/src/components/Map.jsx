import React, { useEffect, useRef } from 'react';

// Load Cesium from CDN as per official documentation
const loadCesium = () => {
  return new Promise((resolve) => {
    if (window.Cesium) {
      resolve(window.Cesium);
      return;
    }

    // Load Cesium CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.131/Build/Cesium/Widgets/widgets.css';
    document.head.appendChild(link);

    // Load Cesium JS
    const script = document.createElement('script');
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.131/Build/Cesium/Cesium.js';
    script.onload = () => {
      resolve(window.Cesium);
    };
    document.head.appendChild(script);
  });
};

const MapComponent = ({ onViewerReady }) => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;
    
    // Prevent multiple instances
    if (viewerRef.current) {
      console.log('Cesium viewer already exists, skipping initialization');
      return;
    }
    
    console.log('Initializing Cesium viewer...');

    loadCesium().then((Cesium) => {
      // Your access token can be found at: https://ion.cesium.com/tokens.
      // This is the default access token from your ion account
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjFjM2FkZC0zM2ZjLTRlNjgtOGE1My02ODcwMDBlM2M2MjQiLCJpZCI6MTkwODM4LCJpYXQiOjE3NTEzMTA3NDh9.WiwRYUZTufwygXTvc7lKO1cvetjtMknBdJUKWew5_qY';

      // Initialize the Cesium Viewer
      const viewer = new Cesium.Viewer(cesiumContainer.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
      });

      // Set dark theme
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.showGroundAtmosphere = false;
      viewer.scene.globe.baseColor = Cesium.Color.BLACK;

      // Set initial camera position to New York City (without flying)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 2000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-30.0),
        }
      });

      // Add Cesium OSM Buildings, a global 3D buildings layer
      Cesium.createOsmBuildingsAsync().then((buildingTileset) => {
        viewer.scene.primitives.add(buildingTileset);
      });

      // Add smart city markers
      const smartCityCenter = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 100),
        point: {
          pixelSize: 15,
          color: Cesium.Color.CYAN,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: 'Smart City Center',
          font: '14pt sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: 1,
          pixelOffset: new Cesium.Cartesian2(0, -40),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      const trafficHub = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-74.008, 40.714, 100),
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: 'Traffic Hub',
          font: '12pt sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: 1,
          pixelOffset: new Cesium.Cartesian2(0, -30),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      const energyGrid = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-74.004, 40.710, 100),
        point: {
          pixelSize: 10,
          color: Cesium.Color.GREEN,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: 'Energy Grid',
          font: '12pt sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: 1,
          pixelOffset: new Cesium.Cartesian2(0, -30),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      viewerRef.current = viewer;
      console.log('Cesium viewer initialized successfully');
      
      // Wait a moment for viewer to be fully ready
      setTimeout(() => {
        // Notify parent component that viewer is ready
        if (onViewerReady) {
          onViewerReady(viewer);
        }
        console.log('Cesium viewer is now fully ready for camera operations');
      }, 1000);
      
      // Add fly function to window for debugging
      window.flyToLocation = (lat, lng) => {
        console.log(`Attempting to fly to: ${lat}, ${lng}`);
        console.log('Viewer exists:', !!viewer);
        console.log('Cesium exists:', !!window.Cesium);
        
        if (viewer && window.Cesium) {
          try {
            // Stop any current camera movement
            viewer.camera.cancelFlight();
            
            // Convert lat/lng to Cartesian3 coordinates
            const destination = window.Cesium.Cartesian3.fromDegrees(lng, lat, 2000);
            console.log('Destination created:', destination);
            
            // Create direction vector (looking down at an angle)
            const direction = new window.Cesium.Cartesian3(
              -0.5,  // Looking slightly west
              -0.5,  // Looking slightly south  
              -0.7   // Looking down
            );
            window.Cesium.Cartesian3.normalize(direction, direction);
            
            // Create up vector (pointing up)
            const up = new window.Cesium.Cartesian3(0, 0, 1);
            
            // Fly to location with proper orientation
            viewer.camera.flyTo({
              destination: destination,
              orientation: {
                direction: direction,
                up: up
              },
              duration: 3.0,
              easingFunction: window.Cesium.EasingFunction.QUADRATIC_IN_OUT,
              complete: () => {
                console.log('Fly completed successfully');
                console.log('New camera position:', viewer.camera.position);
              },
              cancel: () => {
                console.log('Fly was cancelled');
              }
            });
            
            console.log('Fly command executed successfully');
          } catch (error) {
            console.error('Error flying to location:', error);
          }
        } else {
          console.error('Viewer or Cesium not available');
          console.log('Viewer:', viewer);
          console.log('Cesium:', window.Cesium);
        }
      };

      // Add test function to verify camera movement
      window.testCamera = () => {
        console.log('Testing camera movement...');
        if (viewer && window.Cesium) {
          const testDestination = window.Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 1000);
          
          // Create direction vector for test
          const direction = new window.Cesium.Cartesian3(
            0.7,   // Looking east
            0.7,   // Looking north
            -0.5   // Looking down
          );
          window.Cesium.Cartesian3.normalize(direction, direction);
          
          const up = new window.Cesium.Cartesian3(0, 0, 1);
          
          viewer.camera.flyTo({
            destination: testDestination,
            orientation: {
              direction: direction,
              up: up
            },
            duration: 2.0,
            easingFunction: window.Cesium.EasingFunction.QUADRATIC_IN_OUT
          });
          console.log('Test camera movement executed');
        }
      };

      // Add function to place sensors on map
      window.placeSensors = (sensors) => {
        if (viewer && window.Cesium) {
          // Clear existing sensors
          viewer.entities.removeAll();
          
          sensors.forEach(sensor => {
            const entity = viewer.entities.add({
              position: window.Cesium.Cartesian3.fromDegrees(
                sensor.location.longitude, 
                sensor.location.latitude, 
                10
              ),
              point: {
                pixelSize: 15,
                color: getSensorColor(sensor.type),
                outlineColor: window.Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
              },
              label: {
                text: sensor.name,
                font: '12pt sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new window.Cesium.Cartesian2(0, -30),
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
              }
            });
          });
        }
      };

      // Helper function to get sensor color based on type
      const getSensorColor = (type) => {
        const colors = {
          'traffic': window.Cesium.Color.RED,
          'air_quality': window.Cesium.Color.GREEN,
          'noise': window.Cesium.Color.YELLOW,
          'weather': window.Cesium.Color.BLUE,
          'parking': window.Cesium.Color.ORANGE,
          'lighting': window.Cesium.Color.CYAN,
          'waste': window.Cesium.Color.PURPLE,
          'water': window.Cesium.Color.AQUA,
          'energy': window.Cesium.Color.LIME,
          'security': window.Cesium.Color.MAGENTA
        };
        return colors[type] || window.Cesium.Color.WHITE;
      };
    });

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        console.log('Destroying Cesium viewer...');
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={cesiumContainer} 
        style={{ 
          width: '100%', 
          height: '100%', 
          background: '#23272f' 
        }}
      />
      
      {/* Sensor Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Sensor Types:</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'red', marginRight: '5px' }}></div>
          Traffic
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'green', marginRight: '5px' }}></div>
          Air Quality
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'yellow', marginRight: '5px' }}></div>
          Noise
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'blue', marginRight: '5px' }}></div>
          Weather
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'orange', marginRight: '5px' }}></div>
          Parking
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'cyan', marginRight: '12px' }}></div>
          Lighting
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'purple', marginRight: '5px' }}></div>
          Waste
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'aqua', marginRight: '5px' }}></div>
          Water
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'lime', marginRight: '5px' }}></div>
          Energy
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'magenta', marginRight: '5px' }}></div>
          Security
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 