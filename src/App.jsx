import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import Modal from 'react-modal';

console.log('=== SMARTCITY APP IS RUNNING ===');

Modal.setAppElement('#root');

function MapClickHandler({ onMapClick }) {
  useMapEvent('click', (e) => {
    console.log('Map clicked!', e.latlng);
    onMapClick(e);
  });
  return null;
}

function App() {
  const [sensors, setSensors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLatLng, setModalLatLng] = useState(null);
  const [sensorForm, setSensorForm] = useState({
    number: 1,
    area: '',
    state: '',
    type: '',
    details: '',
  });

  useEffect(() => {
    // Load sensors from backend on mount
    fetch('http://localhost:3002/api/sensors')
      .then(res => res.json())
      .then(data => setSensors(data.sensors || []));
  }, []);

  const handleMapClick = (e) => {
    setModalLatLng(e.latlng);
    setModalOpen(true);
    console.log('Modal should open now');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSensorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSensorSubmit = async (e) => {
    e.preventDefault();
    const newSensors = Array.from({ length: Number(sensorForm.number) }, (_, i) => ({
      ...sensorForm,
      lat: modalLatLng.lat,
      lng: modalLatLng.lng,
      id: Date.now() + i,
    }));
    // Save to backend
    await fetch('http://localhost:3002/api/sensors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensors: newSensors }),
    });
    setSensors((prev) => [...prev, ...newSensors]);
    setModalOpen(false);
    setSensorForm({ number: 1, area: '', state: '', type: '', details: '' });
    console.log('Modal closed after submit');
  };

  useEffect(() => {
    console.log('Modal open state:', modalOpen);
  }, [modalOpen]);

  return (
    <div style={{ minHeight: '100vh', background: '#23272f', color: '#fff', fontFamily: 'sans-serif' }}>
      <main style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)', width: '100vw' }}>
        <section style={{ flex: 1, position: 'relative', minHeight: '600px', height: '100%' }}>
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="smartcity-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[40.7128, -74.006]}>
              <Popup>City Center</Popup>
            </Marker>
            {sensors.map(sensor => (
              <Marker key={sensor.id} position={[sensor.lat, sensor.lng]}>
                <Popup>
                  <b>Type:</b> {sensor.type}<br/>
                  <b>Area:</b> {sensor.area}<br/>
                  <b>State:</b> {sensor.state}<br/>
                  <b>Details:</b> {sensor.details}<br/>
                  <b>Number:</b> {sensor.number}
                </Popup>
              </Marker>
            ))}
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Add Sensor"
            style={{
              overlay: { backgroundColor: 'rgba(0,0,0,0.7)' },
              content: { background: '#23272f', color: '#fff', maxWidth: 400, margin: 'auto', borderRadius: 8 }
            }}
          >
            <h2>Add Sensor(s)</h2>
            <form onSubmit={handleSensorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>Number of Sensors
                <input type="number" name="number" min="1" max="100" value={sensorForm.number} onChange={handleFormChange} style={{ width: '100%' }} required />
              </label>
              <label>Area
                <input type="text" name="area" value={sensorForm.area} onChange={handleFormChange} style={{ width: '100%' }} required />
              </label>
              <label>State
                <select name="state" value={sensorForm.state} onChange={handleFormChange} required style={{ width: '100%' }}>
                  <option value="">Select State</option>
                  <option value="NY">NY</option>
                  <option value="CA">CA</option>
                  <option value="TX">TX</option>
                  <option value="FL">FL</option>
                  <option value="IL">IL</option>
                </select>
              </label>
              <label>Type of Sensor
                <select name="type" value={sensorForm.type} onChange={handleFormChange} required style={{ width: '100%' }}>
                  <option value="">Select Type</option>
                  <option value="Traffic">Traffic</option>
                  <option value="Weather">Weather</option>
                  <option value="Pollution">Pollution</option>
                  <option value="Noise">Noise</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>Details
                <textarea name="details" value={sensorForm.details} onChange={handleFormChange} rows={3} style={{ width: '100%' }} />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#444' }}>Cancel</button>
                <button type="submit" style={{ background: '#646cff' }}>Add</button>
              </div>
            </form>
          </Modal>
        </section>
      </main>
    </div>
  );
}

export default App; 