import React, { useState } from 'react';
import type { Page, LocationData } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onSelectLocation: (id: string) => void;
  locations: LocationData[];
  isLiveTelemetry: boolean;
  onToggleLiveTelemetry: () => void;
  onStartDemo: () => void;
  onOpenBroadcast: () => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' };
    case 'HIGH': return { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C', dot: '#F97316' };
    case 'MODERATE': return { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04', dot: '#EAB308' };
    default: return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E' };
  }
};

const stepColors = ['#EFF6FF', '#F0FDF4', '#FFF7ED', '#F5F3FF', '#FEF2F2'];
const stepTextColors = ['#2563EB', '#16A34A', '#EA580C', '#7C3AED', '#DC2626'];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, locations }) => {
  const [mapHovered, setMapHovered] = useState<string | null>(null);

  // Primary threat is always the highest risk location
  const threat = locations.reduce((a, b) => (a.riskScore > b.riskScore ? a : b));
  const rc = getRiskColor(threat.riskLevel);

  const hotspots = locations.filter(l => l.riskLevel === 'CRITICAL' || l.riskLevel === 'HIGH').slice(0, 4);

  const howItWorksSteps = [
    { icon: '🌧', label: 'Weather Data', desc: 'Real-time rainfall, temperature and wind from 500+ stations' },
    { icon: '🛰', label: 'Satellite & Terrain', desc: 'Slope maps, land cover and soil data from ISRO satellites' },
    { icon: '🤖', label: 'AI Risk Analysis', desc: 'Machine learning model calculates risk score every 15 minutes' },
    { icon: '🗺', label: 'Risk Map', desc: 'Areas colour-coded from Low to Critical risk across NE India' },
    { icon: '⚠️', label: 'Early Warning', desc: 'Alerts sent to district officers, communities and emergency teams' },
  ];

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '40px 24px 60px' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 52px)', color: '#0F172A', letterSpacing: '-0.03em',
          marginBottom: '16px', lineHeight: 1.15,
        }}>
          AI-Powered Landslide<br />Early Warning
        </h1>
        <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.65 }}>
          Monitor landslide risk, understand the danger, and take action before disaster strikes.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('map')}
            style={{
              padding: '14px 28px', borderRadius: '10px', border: 'none',
              backgroundColor: '#2563EB', color: '#FFF', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.35)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            🗺 View Risk Map
          </button>
          <button
            onClick={() => onNavigate('warnings')}
            style={{
              padding: '14px 28px', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', backgroundColor: '#FFF',
              color: '#374151', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget.style.backgroundColor = '#F8FAFC'); (e.currentTarget.style.borderColor = '#CBD5E1'); }}
            onMouseLeave={e => { (e.currentTarget.style.backgroundColor = '#FFF'); (e.currentTarget.style.borderColor = '#E2E8F0'); }}
          >
            ⚠️ View Active Alerts
          </button>
        </div>
      </div>

      {/* ── CURRENT RISK CARD ────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFF', border: `1.5px solid ${rc.border}`,
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)',
        marginBottom: '32px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle colored strip on left */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: rc.dot, borderRadius: '16px 0 0 16px' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          {/* Left: Risk Score */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>Current Risk</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '72px', fontWeight: 800, color: rc.text, lineHeight: 1, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", letterSpacing: '-0.04em' }}>
                {threat.riskScore}
              </span>
              <span style={{ fontSize: '24px', color: '#94A3B8', fontWeight: 500 }}>/100</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
              color: rc.text, borderRadius: '8px', padding: '6px 14px',
              fontSize: '14px', fontWeight: 700, letterSpacing: '0.04em',
              marginBottom: '12px',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: rc.dot, display: 'inline-block' }} />
              {threat.riskLevel}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>{threat.name}</div>
            <div style={{ fontSize: '14px', color: '#64748B' }}>{threat.state}</div>
          </div>

          {/* Center: 3 factors */}
          <div style={{ flex: '1 1 300px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: '🌧', label: 'Heavy Rainfall', value: `${threat.rainfall} mm / 24h` },
              { icon: '💧', label: 'Soil Moisture', value: `${threat.soilMoisture}%` },
              { icon: '⛰', label: 'Slope', value: `${threat.slope}°` },
            ].map((f) => (
              <div key={f.label} style={{
                flex: '1 1 120px', backgroundColor: '#F8FAFC', borderRadius: '12px',
                border: '1px solid #E2E8F0', padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{f.value}</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div style={{
          marginTop: '24px', padding: '16px 20px', backgroundColor: '#FFFBEB',
          border: '1px solid #FEF08A', borderRadius: '10px',
        }}>
          <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
            <strong>Why is the risk high?</strong> Heavy rainfall has saturated the soil on steep slopes, increasing the possibility of landslide activity in {threat.name}.
          </p>
        </div>

        {/* What to do */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>What should we do?</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {[
              'Restrict traffic on high-risk roads',
              'Alert nearby communities and villages',
              'Keep emergency response teams ready',
            ].map(action => (
              <li key={action} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0, display: 'inline-block' }} />
                {action}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onNavigate('warnings')}
            style={{
              padding: '10px 22px', borderRadius: '8px',
              border: '1.5px solid #BFDBFE', backgroundColor: '#EFF6FF',
              color: '#2563EB', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget.style.backgroundColor = '#DBEAFE'); }}
            onMouseLeave={e => { (e.currentTarget.style.backgroundColor = '#EFF6FF'); }}
          >
            View Recommended Actions →
          </button>
        </div>
      </div>

      {/* ── RISK MAP PREVIEW ─────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '16px',
        padding: '28px', marginBottom: '32px',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '20px', color: '#0F172A', marginBottom: '4px' }}>Risk Overview</h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Current risk levels across monitored areas in North-East India</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: '1.5px solid #BFDBFE', backgroundColor: '#EFF6FF',
              color: '#2563EB', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Open Full Map →
          </button>
        </div>

        {/* Hotspot cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {locations.slice(0, 6).map(loc => {
            const c = getRiskColor(loc.riskLevel);
            return (
              <div
                key={loc.id}
                onMouseEnter={() => setMapHovered(loc.id)}
                onMouseLeave={() => setMapHovered(null)}
                onClick={() => onNavigate('map')}
                style={{
                  padding: '16px', borderRadius: '10px', cursor: 'pointer',
                  border: `1px solid ${mapHovered === loc.id ? c.border : '#E2E8F0'}`,
                  backgroundColor: mapHovered === loc.id ? c.bg : '#F8FAFC',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{loc.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{loc.state}</div>
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: '20px',
                    backgroundColor: c.bg, border: `1px solid ${c.border}`,
                    color: c.text, fontSize: '11px', fontWeight: 700,
                  }}>{loc.riskLevel}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: c.text, lineHeight: 1 }}>{loc.riskScore}</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>/100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Low', color: '#22C55E' }, { label: 'Moderate', color: '#EAB308' },
            { label: 'High', color: '#F97316' }, { label: 'Critical', color: '#EF4444' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: l.color, display: 'inline-block' }} />
              <span style={{ fontSize: '13px', color: '#64748B' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '16px',
        padding: '32px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '20px', color: '#0F172A', marginBottom: '6px' }}>How It Works</h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
          LandslideGuard combines rainfall, soil moisture, terrain and historical data to identify areas where landslide risk may increase.
        </p>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'stretch', flexWrap: 'wrap' }}>
          {howItWorksSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{
                flex: '1 1 140px', textAlign: 'center', padding: '20px 16px',
                backgroundColor: stepColors[i], borderRadius: '12px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{step.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: stepTextColors[i], marginBottom: '6px' }}>{step.label}</div>
                <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
              {i < howItWorksSteps.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#CBD5E1', fontSize: '20px', padding: '0 2px', flexShrink: 0 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button
            onClick={() => onNavigate('how-it-works')}
            style={{
              background: 'none', border: 'none', color: '#2563EB', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            Learn more about our methodology →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
