import React from 'react';
import type { Page } from '../types';

interface HowItWorksProps {
  onNavigate: (page: Page) => void;
}

const steps = [
  {
    number: '01',
    icon: '🌧',
    title: 'Weather Data Collection',
    desc: 'Real-time data is collected from 500+ weather stations across North-East India, recording rainfall, temperature, humidity, and wind speed every 15 minutes.',
    detail: 'Sources include IMD stations, AWS (Automatic Weather Stations), and community-operated rain gauges.',
    color: '#EFF6FF',
    border: '#BFDBFE',
    numberColor: '#2563EB',
  },
  {
    number: '02',
    icon: '🛰',
    title: 'Satellite & Terrain Data',
    desc: 'Satellite imagery from ISRO\'s Resourcesat and Sentinel-2 provides slope maps, land cover classification, and soil moisture readings.',
    detail: 'A Digital Elevation Model (DEM) helps identify steep slopes that are more vulnerable to landslides.',
    color: '#F0FDF4',
    border: '#BBF7D0',
    numberColor: '#16A34A',
  },
  {
    number: '03',
    icon: '🤖',
    title: 'AI Risk Analysis',
    desc: 'A machine learning model analyzes all the data — rainfall, soil moisture, slope, elevation, and historical patterns — to calculate a risk score from 0 to 100.',
    detail: 'The model is updated every 15 minutes. A score above 70 triggers a High alert; above 80 triggers a Critical alert.',
    color: '#FFF7ED',
    border: '#FFEDD5',
    numberColor: '#EA580C',
  },
  {
    number: '04',
    icon: '🗺',
    title: 'Risk Map Update',
    desc: 'The calculated risk scores are displayed on a live map, colour-coded from Green (Low) to Red (Critical), making it easy to see at a glance where action is needed.',
    detail: 'Maps cover all 8 states of North-East India with district-level precision.',
    color: '#F5F3FF',
    border: '#DDD6FE',
    numberColor: '#7C3AED',
  },
  {
    number: '05',
    icon: '⚠️',
    title: 'Early Warning Dispatch',
    desc: 'When risk crosses a threshold, alerts are automatically sent to district officials, emergency response teams, and communities via SMS, radio, and the LandslideGuard app.',
    detail: 'Response time from detection to alert delivery: under 2 minutes.',
    color: '#FEF2F2',
    border: '#FECACA',
    numberColor: '#DC2626',
  },
];

const dataSources = [
  { icon: '🌡', label: 'Rainfall', desc: '168 mm / 24h triggers high-risk threshold' },
  { icon: '💧', label: 'Soil Moisture', desc: 'Saturation above 85% significantly raises risk' },
  { icon: '⛰', label: 'Slope Angle', desc: 'Slopes above 30° are more susceptible to slides' },
  { icon: '📍', label: 'Elevation', desc: 'High-altitude zones have different vulnerability profiles' },
  { icon: '📜', label: 'Historical Events', desc: 'Past landslide records inform future risk prediction' },
  { icon: '🌿', label: 'Vegetation Cover', desc: 'Less vegetation = less root stability = higher risk' },
];

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px 60px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#0F172A', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          How LandslideGuard Works
        </h1>
        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          A simple 5-step process that turns raw data into life-saving early warnings — every 15 minutes, automatically.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            <div style={{
              backgroundColor: '#FFF', border: `1.5px solid ${step.border}`,
              borderRadius: '14px', padding: '24px',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)',
              display: 'flex', gap: '20px', alignItems: 'flex-start',
            }}>
              {/* Step Number */}
              <div style={{
                flexShrink: 0, width: '52px', height: '52px', borderRadius: '12px',
                backgroundColor: step.color, border: `1.5px solid ${step.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{step.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: step.numberColor, letterSpacing: '0.08em' }}>STEP {step.number}</span>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '17px', color: '#0F172A', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, marginBottom: '8px' }}>{step.desc}</p>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>ℹ️ {step.detail}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '24px', margin: '-4px 0' }}>↓</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Data Sources */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0',
        borderRadius: '14px', padding: '28px',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '32px',
      }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '18px', color: '#0F172A', marginBottom: '6px' }}>
          What Data Does LandslideGuard Use?
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
          Six key factors are combined by the AI model to assess landslide risk.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {dataSources.map(ds => (
            <div key={ds.label} style={{
              padding: '14px', backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0', borderRadius: '10px',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{ds.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{ds.label}</div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{ds.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        backgroundColor: '#FFFBEB', border: '1px solid #FEF08A',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '32px',
      }}>
        <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
          ⚠️ <strong>Important:</strong> LandslideGuard is an AI-based decision-support prototype developed for the Smart India Hackathon 2026 (Problem ID: SIH26001). It is not a certified operational system. Data shown is simulated for demonstration purposes. Alerts should be verified through official government channels before taking emergency action.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '20px' }}>Ready to explore the platform?</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              padding: '12px 24px', borderRadius: '10px', border: 'none',
              backgroundColor: '#2563EB', color: '#FFF', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
            🏠 Go to Home
          </button>
          <button
            onClick={() => onNavigate('map')}
            style={{
              padding: '12px 24px', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', backgroundColor: '#FFF',
              color: '#374151', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            🗺 View Risk Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
