import React from 'react';
import type { Page, LocationData } from '../types';
import RiskMap from '../components/map/RiskMap';

interface LiveRiskMapProps {
  locations: LocationData[];
  selectedLocation: string | null;
  onSelectLocation: (id: string) => void;
  onNavigate: (page: Page) => void;
}

const getRiskColors = (level: string) => {
  switch (level) {
    case 'CRITICAL': return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' };
    case 'HIGH':     return { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C', dot: '#F97316' };
    case 'MODERATE': return { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04', dot: '#EAB308' };
    default:         return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E' };
  }
};

const LiveRiskMap: React.FC<LiveRiskMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onNavigate,
}) => {
  const selected = locations.find(l => l.id === selectedLocation) ?? null;
  const rc = selected ? getRiskColors(selected.riskLevel) : null;

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      {/* Page header */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '28px 24px 16px' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          fontWeight: 700, fontSize: '26px', color: '#0F172A', marginBottom: '4px',
        }}>
          Landslide Risk Map
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B' }}>
          Current landslide risk across monitored areas in North-East India. Click a marker to see details.
        </p>
      </div>

      {/* Map + side panel */}
      <div style={{
        maxWidth: '1160px', margin: '0 auto', padding: '0 24px 40px',
        display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        {/* MAP — takes most of the width */}
        <div style={{ flex: '1 1 560px' }}>
          <RiskMap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            onViewDetails={(id) => onSelectLocation(id)}
            height="calc(100vh - 210px)"
          />
        </div>

        {/* SIDE PANEL — legend + selected info */}
        <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Risk legend */}
          <div style={{
            backgroundColor: '#FFF', border: '1px solid #E2E8F0',
            borderRadius: '12px', padding: '18px',
            boxShadow: '0 1px 3px rgba(0,0,0,.05)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '12px' }}>
              Risk Legend
            </div>
            {[
              { label: 'Critical', desc: 'Immediate action required', color: '#EF4444', bg: '#FEF2F2' },
              { label: 'High',     desc: 'Close monitoring needed',   color: '#F97316', bg: '#FFF7ED' },
              { label: 'Moderate', desc: 'Watch and prepare',         color: '#EAB308', bg: '#FEFCE8' },
              { label: 'Low',      desc: 'Normal conditions',         color: '#22C55E', bg: '#F0FDF4' },
            ].map(l => (
              <div key={l.label} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '7px 10px', borderRadius: '8px',
                backgroundColor: l.bg, marginBottom: '6px',
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: l.color, flexShrink: 0, display: 'inline-block',
                }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{l.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected location card */}
          {selected && rc ? (
            <div style={{
              backgroundColor: '#FFF', border: `1.5px solid ${rc.border}`,
              borderRadius: '12px', padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,.05)',
            }}>
              {/* Name + risk level */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{selected.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{selected.state}</div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: '20px',
                  backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
                  color: rc.text, fontSize: '11px', fontWeight: 700,
                }}>
                  {selected.riskLevel}
                </div>
              </div>

              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800, color: rc.text, lineHeight: 1 }}>
                  {selected.riskScore}
                </span>
                <span style={{ fontSize: '16px', color: '#94A3B8' }}>/100</span>
              </div>

              {/* Metrics */}
              {[
                { label: 'Rainfall',      value: `${selected.rainfall} mm` },
                { label: 'Soil Moisture', value: `${selected.soilMoisture}%` },
                { label: 'Slope',         value: `${selected.slope}°` },
              ].map(m => (
                <div key={m.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 10px', backgroundColor: '#F8FAFC',
                  borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>{m.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{m.value}</span>
                </div>
              ))}

              {/* Action */}
              <button
                onClick={() => onNavigate('warnings')}
                style={{
                  marginTop: '10px', width: '100%', padding: '9px',
                  borderRadius: '8px', border: 'none',
                  backgroundColor: '#2563EB', color: '#FFF',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                View Alert Details →
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFF', border: '1px solid #E2E8F0',
              borderRadius: '12px', padding: '20px',
              textAlign: 'center', color: '#94A3B8', fontSize: '13px',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📍</div>
              Click a marker on the map to see risk details.
            </div>
          )}

          {/* Summary counts */}
          <div style={{
            backgroundColor: '#FFF', border: '1px solid #E2E8F0',
            borderRadius: '12px', padding: '18px',
            boxShadow: '0 1px 3px rgba(0,0,0,.05)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
              Summary
            </div>
            {[
              { label: 'Critical', count: locations.filter(l => l.riskLevel === 'CRITICAL').length, color: '#EF4444', bg: '#FEF2F2' },
              { label: 'High',     count: locations.filter(l => l.riskLevel === 'HIGH').length,     color: '#F97316', bg: '#FFF7ED' },
              { label: 'Moderate', count: locations.filter(l => l.riskLevel === 'MODERATE').length, color: '#EAB308', bg: '#FEFCE8' },
              { label: 'Low',      count: locations.filter(l => l.riskLevel === 'LOW').length,      color: '#22C55E', bg: '#F0FDF4' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#374151' }}>{s.label} Risk</span>
                <span style={{ padding: '2px 10px', borderRadius: '12px', backgroundColor: s.bg, color: s.color, fontSize: '13px', fontWeight: 700 }}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRiskMap;
