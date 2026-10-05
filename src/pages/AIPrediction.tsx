import React, { useState, useEffect, useRef } from 'react';
import { locations as defaultLocations } from '../data/mockData';
import {
  calculateRiskScore,
  getRiskLevel,
  getFeatureImportance,
} from '../services/riskCalculator';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AIPredictionProps {
  selectedLocation: string | null;
  onSelectLocation: (id: string) => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' };
    case 'HIGH': return { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C', dot: '#F97316' };
    case 'MODERATE': return { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04', dot: '#EAB308' };
    default: return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E' };
  }
};

const SliderRow: React.FC<{
  label: string; icon: string; value: number; min: number; max: number;
  unit: string; onChange: (v: number) => void; accentColor?: string;
}> = ({ label, icon, value, min, max, unit, onChange, accentColor = '#2563EB' }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{value} {unit}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor, cursor: 'pointer', height: '4px' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

const AIPrediction: React.FC<AIPredictionProps> = ({ selectedLocation, onSelectLocation }) => {
  const [locId, setLocId] = useState(selectedLocation ?? 'east-khasi-hills');
  const loc = defaultLocations.find(l => l.id === locId) ?? defaultLocations[0];

  const [rainfall, setRainfall] = useState(loc.rainfall);
  const [soilMoisture, setSoilMoisture] = useState(loc.soilMoisture);
  const [slope, setSlope] = useState(loc.slope);
  const [elevation, setElevation] = useState(loc.elevation);
  const [geoSusc, setGeoSusc] = useState<'Low' | 'Moderate' | 'High'>(loc.geologicalSusceptibility);
  const [histEvents, setHistEvents] = useState(loc.historicalEvents);
  const [isSimulating, setIsSimulating] = useState(false);
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const l = defaultLocations.find(d => d.id === locId) ?? defaultLocations[0];
    setRainfall(l.rainfall);
    setSoilMoisture(l.soilMoisture);
    setSlope(l.slope);
    setElevation(l.elevation);
    setGeoSusc(l.geologicalSusceptibility);
    setHistEvents(l.historicalEvents);
    onSelectLocation(locId);
  }, [locId]);

  const score = calculateRiskScore(rainfall, soilMoisture, slope, geoSusc, histEvents, elevation);
  const level = getRiskLevel(score);
  const rc = getRiskColor(level);
  const features = getFeatureImportance(rainfall, soilMoisture, slope, geoSusc, histEvents);

  const trendData = Array.from({ length: 12 }, (_, i) => {
    const base = Math.max(10, score - 35 + i * 3.2);
    return { time: `${i * 2}h`, score: Math.round(Math.min(base + (Math.random() - 0.5) * 3, 100)) };
  });
  trendData[trendData.length - 1] = { time: 'Now', score };

  const simulateRainfall = () => {
    if (isSimulating) {
      if (simRef.current) clearInterval(simRef.current);
      setIsSimulating(false);
      return;
    }
    setIsSimulating(true);
    let rf = 80; let sm = 50;
    setRainfall(rf); setSoilMoisture(sm);
    simRef.current = setInterval(() => {
      rf = Math.min(rf + 22, 260);
      sm = Math.min(sm + 9, 96);
      setRainfall(rf); setSoilMoisture(sm);
      if (rf >= 260) { if (simRef.current) clearInterval(simRef.current); setIsSimulating(false); }
    }, 1100);
  };

  useEffect(() => { return () => { if (simRef.current) clearInterval(simRef.current); }; }, []);

  const featureIcons: Record<string, string> = {
    'Rainfall': '🌧',
    'Soil Moisture': '💧',
    'Slope': '⛰',
    'Geological': '🪨',
    'Historical': '📜',
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '28px', color: '#0F172A' }}>
            AI Model Details
          </h1>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB',
          }}>Monsoon Scenario Simulator</span>
        </div>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          Adjust environmental conditions below to see how the AI model calculates landslide risk in real time.
        </p>
      </div>

      {/* Location Selector */}
      <div style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Location:</span>
        <select
          value={locId}
          onChange={e => setLocId(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0',
            fontSize: '14px', color: '#0F172A', backgroundColor: '#F8FAFC', cursor: 'pointer',
          }}
        >
          {defaultLocations.map(l => (
            <option key={l.id} value={l.id}>{l.name}, {l.state}</option>
          ))}
        </select>
        <button
          onClick={simulateRainfall}
          style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: '8px', border: 'none',
            backgroundColor: isSimulating ? '#EF4444' : '#2563EB',
            color: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
          }}
        >
          {isSimulating ? '⏹ Stop Simulation' : '▶ Simulate Heavy Rainfall'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: Sliders */}
        <div style={{
          flex: '1 1 300px', backgroundColor: '#FFF', border: '1px solid #E2E8F0',
          borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>
            🎛 Environmental Conditions
          </h3>
          <SliderRow label="Rainfall (24h)" icon="🌧" value={rainfall} min={0} max={300} unit="mm" onChange={setRainfall} accentColor="#3B82F6" />
          <SliderRow label="Soil Moisture" icon="💧" value={soilMoisture} min={0} max={100} unit="%" onChange={setSoilMoisture} accentColor="#06B6D4" />
          <SliderRow label="Slope Angle" icon="⛰" value={slope} min={5} max={60} unit="°" onChange={setSlope} accentColor="#8B5CF6" />
          <SliderRow label="Elevation" icon="📍" value={elevation} min={200} max={4000} unit="m" onChange={setElevation} accentColor="#F59E0B" />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              🪨 Geological Susceptibility
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Low', 'Moderate', 'High'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGeoSusc(g)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    border: `1.5px solid ${geoSusc === g ? '#2563EB' : '#E2E8F0'}`,
                    backgroundColor: geoSusc === g ? '#EFF6FF' : '#F8FAFC',
                    color: geoSusc === g ? '#2563EB' : '#64748B',
                    cursor: 'pointer', transition: 'all 0.12s ease',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Past Landslide Events" icon="📜" value={histEvents} min={0} max={20} unit="" onChange={setHistEvents} accentColor="#EF4444" />
        </div>

        {/* Right: Score + Attribution */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Score Card */}
          <div style={{
            backgroundColor: '#FFF', border: `1.5px solid ${rc.border}`,
            borderRadius: '14px', padding: '28px', textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: rc.dot, borderRadius: '14px 0 0 14px' }} />
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>AI Risk Score</div>
            <div style={{ fontSize: '80px', fontWeight: 800, color: rc.text, lineHeight: 1, marginBottom: '6px' }}>{score}</div>
            <div style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '12px' }}>out of 100</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
              color: rc.text, borderRadius: '20px', padding: '6px 16px',
              fontSize: '14px', fontWeight: 700,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: rc.dot, display: 'inline-block' }} />
              {level}
            </div>
            {/* Simple gauge bar */}
            <div style={{ marginTop: '20px', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${score}%`, backgroundColor: rc.dot,
                borderRadius: '4px', transition: 'width 0.4s ease, background-color 0.3s ease',
              }} />
            </div>
          </div>

          {/* Factor Attribution */}
          <div style={{
            backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
            padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>
              What's Driving the Risk?
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>Contribution of each factor to the risk score</p>
            {features.map(f => (
              <div key={f.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    {featureIcons[f.name] ?? '📊'} {f.name}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{f.weight}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${f.weight}%`, backgroundColor: '#2563EB',
                    borderRadius: '3px', transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
        padding: '24px', marginTop: '20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
          24-Hour Risk Trajectory
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Projected risk score based on current conditions</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={rc.dot} stopOpacity={0.2} />
                <stop offset="95%" stopColor={rc.dot} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px' }}
              formatter={(v: number) => [`${v}/100`, 'Risk Score']}
            />
            <Area type="monotone" dataKey="score" stroke={rc.dot} strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: rc.dot, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FEF08A', borderRadius: '8px', fontSize: '12px', color: '#92400E' }}>
        ⚠️ This is a demonstration prototype for SIH26001. Risk scores are AI-simulated and should not be used for real emergency decisions.
      </div>
    </div>
  );
};

export default AIPrediction;
