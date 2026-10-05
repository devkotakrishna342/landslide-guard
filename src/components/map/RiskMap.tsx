/**
 * RiskMap.tsx — Imperative Leaflet map with OpenStreetMap tiles.
 *
 * WHY IMPERATIVE (not React-Leaflet declarative)?
 *  - Full control over invalidateSize(), popup opening, and fullscreen.
 *  - Avoids React-Leaflet "MapContainer must have height" issues.
 *  - Lets us programmatically open a popup when navigating from Alerts.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { LocationData } from '../../types';
import L from 'leaflet';

// ── Fix Vite asset path issue with default Leaflet icons ──────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Kept for backward compat with LiveRiskMap & Infrastructure imports ────────
export interface MapLayers {
  riskZones?: boolean;
  historicalLandslides?: boolean;
  roads?: boolean;
  villages?: boolean;
  rainfall?: boolean;
  terrain?: boolean;
  satellite?: boolean;
  heatmap?: boolean;
}

interface RiskMapProps {
  locations: LocationData[];
  selectedLocation: string | null;
  onSelectLocation: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onNavigatePredict?: () => void;
  onNavigateWarning?: () => void;
  layers?: MapLayers;
  is3DTerrain?: boolean;
  /** Height override — defaults to 'calc(100vh - 180px)' */
  height?: string;
}

// ── Color helpers ─────────────────────────────────────────────────────────────
function markerColor(level: string): string {
  switch (level) {
    case 'CRITICAL': return '#EF4444';
    case 'HIGH':     return '#F97316';
    case 'MODERATE': return '#EAB308';
    default:         return '#22C55E';
  }
}

function labelTextColor(level: string): string {
  switch (level) {
    case 'CRITICAL': return '#DC2626';
    case 'HIGH':     return '#EA580C';
    case 'MODERATE': return '#854D0E';
    default:         return '#15803D';
  }
}

function badgeBg(level: string): string {
  switch (level) {
    case 'CRITICAL': return '#FEF2F2';
    case 'HIGH':     return '#FFF7ED';
    case 'MODERATE': return '#FEFCE8';
    default:         return '#F0FDF4';
  }
}

// ── Popup HTML builder ────────────────────────────────────────────────────────
function buildPopupHTML(loc: LocationData): string {
  const color   = markerColor(loc.riskLevel);
  const txtCol  = labelTextColor(loc.riskLevel);
  const bg      = badgeBg(loc.riskLevel);
  return `
    <div style="font-family:'Inter',-apple-system,sans-serif;font-size:13px;color:#0F172A;min-width:220px;padding:4px 2px;">
      <div style="font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;">${loc.state}</div>
      <div style="font-size:17px;font-weight:800;color:#0F172A;margin-bottom:10px;">${loc.name}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;background:${bg};border:1px solid ${color}33;border-radius:10px;padding:8px 12px;margin-bottom:10px;">
        <div>
          <div style="font-size:9px;font-weight:700;color:#64748B;text-transform:uppercase;">Risk Score</div>
          <div style="font-size:28px;font-weight:900;color:${txtCol};line-height:1;font-family:monospace;">${loc.riskScore}<span style="font-size:13px;color:#94A3B8;font-weight:500;">/100</span></div>
        </div>
        <div style="background:${color};color:#fff;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.04em;">${loc.riskLevel}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:6px;text-align:center;">
          <div style="font-size:9px;color:#64748B;font-weight:600;margin-bottom:2px;">Rainfall</div>
          <div style="font-size:12px;font-weight:700;color:#0F172A;">${loc.rainfall} mm</div>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:6px;text-align:center;">
          <div style="font-size:9px;color:#64748B;font-weight:600;margin-bottom:2px;">Moisture</div>
          <div style="font-size:12px;font-weight:700;color:#0F172A;">${loc.soilMoisture}%</div>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:6px;text-align:center;">
          <div style="font-size:9px;color:#64748B;font-weight:600;margin-bottom:2px;">Slope</div>
          <div style="font-size:12px;font-weight:700;color:#0F172A;">${loc.slope}°</div>
        </div>
      </div>
      <div style="font-size:11px;color:#64748B;text-align:center;padding:4px 0;border-top:1px solid #F1F5F9;">
        Click map or marker to dismiss
      </div>
    </div>
  `;
}

// ── Main Component ────────────────────────────────────────────────────────────
const RiskMap: React.FC<RiskMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onViewDetails,
  layers = {},
  height = 'calc(100vh - 180px)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markersRef   = useRef<Map<string, L.Marker>>(new Map());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // ── Build / destroy map ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [27.5, 93.5],
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    // OSM tiles — no API key required
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // CRITICAL: call invalidateSize after a tick so the container is painted
    setTimeout(() => {
      map.invalidateSize();
      setMapReady(true);
    }, 80);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      setMapReady(false);
    };
  }, []); // run once on mount

  // ── Re-draw markers whenever locations or selectedLocation changes ──────────
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Remove all old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current.clear();

    if (layers.riskZones === false) return; // hidden

    locations.forEach(loc => {
      const color = markerColor(loc.riskLevel);
      const isSelected = loc.id === selectedLocation;

      // Custom div icon — colored circle with risk score
      const icon = L.divIcon({
        className: '',
        iconSize: [isSelected ? 48 : 40, isSelected ? 48 : 40],
        iconAnchor: [isSelected ? 24 : 20, isSelected ? 24 : 20],
        html: `
          <div style="
            width:${isSelected ? 48 : 40}px;
            height:${isSelected ? 48 : 40}px;
            border-radius:50%;
            background:${color};
            border:${isSelected ? '4px solid #fff' : '2.5px solid #fff'};
            box-shadow:0 0 0 ${isSelected ? '3px' : '1.5px'} ${color}, 0 4px 12px rgba(0,0,0,.25);
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-weight:900;
            font-size:${isSelected ? 14 : 12}px;
            font-family:system-ui,monospace;
            cursor:pointer;
            transition:all .2s;
          ">${loc.riskScore}</div>
        `,
      });

      const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 });
      marker.bindPopup(buildPopupHTML(loc), {
        maxWidth: 280,
        autoPan: true,
        closeButton: true,
      });
      marker.on('click', () => onSelectLocation(loc.id));
      marker.addTo(map);
      markersRef.current.set(loc.id, marker);
    });
  }, [locations, selectedLocation, mapReady, layers.riskZones, onSelectLocation]);

  // ── Fly to + open popup when selectedLocation changes ─────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapReady || !selectedLocation) return;
    const loc = locations.find(l => l.id === selectedLocation);
    if (!loc) return;
    const map = mapRef.current;
    map.flyTo([loc.lat, loc.lng], 10, { duration: 1.1, easeLinearity: 0.5 });
    // Open popup after fly animation
    setTimeout(() => {
      const marker = markersRef.current.get(selectedLocation);
      if (marker) marker.openPopup();
    }, 1200);
  }, [selectedLocation, mapReady, locations]);

  // ── Fullscreen toggle ──────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      }).catch(() => {
        // Fallback: just expand visually via CSS
        setIsFullscreen(true);
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      });
    }
  }, []);

  // Sync fullscreen state with browser ESC key
  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // ── Invalidate size on window resize ──────────────────────────────────────
  useEffect(() => {
    const onResize = () => mapRef.current?.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Risk legend items ──────────────────────────────────────────────────────
  const legend = [
    { label: 'Critical', color: '#EF4444' },
    { label: 'High',     color: '#F97316' },
    { label: 'Moderate', color: '#EAB308' },
    { label: 'Low',      color: '#22C55E' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : height,
        borderRadius: isFullscreen ? '0' : '12px',
        overflow: 'hidden',
        background: '#e8eaed',
        border: isFullscreen ? 'none' : '1px solid #E2E8F0',
        boxShadow: isFullscreen ? 'none' : '0 1px 4px rgba(0,0,0,.06)',
      }}
    >
      {/* The actual map DOM node */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading overlay */}
      {!mapReady && (
        <div style={{
          position: 'absolute', inset: 0, background: '#F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, flexDirection: 'column', gap: '12px',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid #2563EB', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '13px', color: '#64748B' }}>Loading map…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Floating Controls ── */}
      {mapReady && (
        <>
          {/* Fullscreen button — top-right */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Map'}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 1000,
              background: '#fff', border: '1px solid #E2E8F0',
              borderRadius: '8px', padding: '7px 12px',
              fontSize: '13px', fontWeight: 600, color: '#374151',
              cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,.1)',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            {isFullscreen ? '✕ Exit Full Screen' : '⛶ Full Screen'}
          </button>

          {/* Risk legend — bottom-right */}
          <div style={{
            position: 'absolute', bottom: 28, right: 10, zIndex: 1000,
            background: 'rgba(255,255,255,0.95)', border: '1px solid #E2E8F0',
            borderRadius: '10px', padding: '10px 14px',
            boxShadow: '0 1px 4px rgba(0,0,0,.1)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>Risk Level</div>
            {legend.map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: l.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RiskMap;
