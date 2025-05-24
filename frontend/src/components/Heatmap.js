import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Colored Circle Layer Component (represents barangay areas)
function BarangayCircles({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const layers = [];
    const maxCount = Math.max(...points.map(p => p.count));

    points.forEach(point => {
      // Calculate color intensity based on case count
      const intensity = point.count / maxCount;
      const radius = Math.max(200, intensity * 800); // Minimum 200m radius
      
      // Color based on intensity (red scale)
      const opacity = Math.max(0.3, intensity);
      const color = `rgba(255, ${Math.floor(255 * (1 - intensity))}, 0, ${opacity})`;
      
      const circle = L.circle([point.lat, point.lng], {
        radius: radius,
        fillColor: color,
        color: '#ff0000',
        weight: 2,
        opacity: 0.8,
        fillOpacity: opacity
      }).addTo(map);

      layers.push(circle);
    });

    return () => {
      layers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, points]);

  return null;
}

// Enhanced Marker Component with animal type info
function EnhancedMarkers({ points }) {
  return (
    <>
      {points.map((point, idx) => (
        <Marker
          key={idx}
          position={[point.lat, point.lng]}
          icon={L.divIcon({
            className: 'enhanced-label',
            html: `<div style="
              background: rgba(255, 255, 255, 0.95);
              color: #333;
              border: 2px solid #ff0000;
              border-radius: 8px;
              padding: 4px 8px;
              font-size: 11px;
              font-weight: bold;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              pointer-events: none;
              min-width: 60px;
            ">
              <div style="color: #ff0000; font-size: 14px;">${point.count}</div>
              <div style="font-size: 9px; color: #666;">${point.barangay}</div>
            </div>`,
            iconSize: [80, 40],
            iconAnchor: [40, 20],
          })}
        >
          <Popup maxWidth={300}>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {point.barangay}
              </h3>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total Cases: </strong>
                <span style={{ color: '#ff0000', fontSize: '16px', fontWeight: 'bold' }}>
                  {point.count}
                </span>
              </div>
              
              {point.animals && Object.keys(point.animals).length > 0 && (
                <div>
                  <strong>Animal Types:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {Object.entries(point.animals).map(([animal, count]) => (
                      <li key={animal} style={{ marginBottom: '2px' }}>
                        <strong>{animal}:</strong> {count} case{count !== 1 ? 's' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {point.animal_breakdown && (
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: '#666',
                  borderTop: '1px solid #eee',
                  paddingTop: '5px'
                }}>
                  {point.animal_breakdown}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// Legend Component
function MapLegend({ points }) {
  if (points.length === 0) return null;
  
  const maxCount = Math.max(...points.map(p => p.count));
  const minCount = Math.min(...points.map(p => p.count));
  
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Case Density</h4>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: 'rgba(255, 0, 0, 0.8)',
          marginRight: '8px',
          borderRadius: '50%'
        }}></div>
        <span>High ({maxCount} cases)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: 'rgba(255, 128, 0, 0.5)',
          marginRight: '8px',
          borderRadius: '50%'
        }}></div>
        <span>Medium</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: 'rgba(255, 255, 0, 0.3)',
          marginRight: '8px',
          borderRadius: '50%'
        }}></div>
        <span>Low ({minCount} case{minCount !== 1 ? 's' : ''})</span>
      </div>
    </div>
  );
}

export default function Heatmap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/heatmap/') // Using your updated endpoint
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setPoints(data);
        setLoading(false);
        console.log('Heatmap data:', data);
      })
      .catch(err => {
        console.error('Heatmap fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div>Loading heatmap data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#ff0000'
      }}>
        <div>Error loading heatmap: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[13.935, 121.52]} // Center on Sariaya
        zoom={12}
        minZoom={11}
        maxZoom={16}
        scrollWheelZoom={true}
        style={{ height: '600px', width: '100%' }}
        maxBounds={[
          [13.85, 121.45], // Southwest corner
          [14.02, 121.60]  // Northeast corner
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BarangayCircles points={points} />
        <EnhancedMarkers points={points} />
      </MapContainer>
      <MapLegend points={points} />
    </div>
  );
}