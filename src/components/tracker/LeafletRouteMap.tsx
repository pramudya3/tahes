import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import { GPSPoint } from '../../types/index';

interface LeafletRouteMapProps {
  route: GPSPoint[];
  currentPosition: GPSPoint | null;
}

// Helper to auto-pan the map when new GPS positions arrive
function MapAutoPan({ position }: { position: GPSPoint | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
}

export const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({
  route,
  currentPosition,
}) => {
  const defaultCenter: [number, number] = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : route.length > 0
    ? [route[0].lat, route[0].lng]
    : [-6.2088, 106.8456]; // Jakarta fallback

  const polylinePositions: [number, number][] = route.map((pt) => [pt.lat, pt.lng]);
  const startPoint = route.length > 0 ? route[0] : null;

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <MapContainer
        center={defaultCenter}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MapAutoPan position={currentPosition} />

        {/* Start Point Marker (Green) */}
        {startPoint && (
          <CircleMarker
            center={[startPoint.lat, startPoint.lng]}
            radius={8}
            pathOptions={{
              fillColor: '#10B981',
              color: '#FFFFFF',
              weight: 2,
              fillOpacity: 1,
            }}
          />
        )}

        {/* Strava Orange Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#FC4C02',
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {/* Current Position Marker (Athlete Blue / Orange Pulse) */}
        {currentPosition && (
          <>
            <CircleMarker
              center={[currentPosition.lat, currentPosition.lng]}
              radius={currentPosition.accuracy ? Math.min(25, currentPosition.accuracy / 2) : 12}
              pathOptions={{
                fillColor: '#FC4C02',
                color: '#FC4C02',
                weight: 1,
                fillOpacity: 0.15,
              }}
            />
            <CircleMarker
              center={[currentPosition.lat, currentPosition.lng]}
              radius={7}
              pathOptions={{
                fillColor: '#FC4C02',
                color: '#FFFFFF',
                weight: 2.5,
                fillOpacity: 1,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};
