import React, { useState } from 'react';
import { historicalEvents, monthlyLandslideData, locations } from '../data/mockData';
import type { Page } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalEventsProps {
  onNavigate?: (page: Page) => void;
  onSelectLocation?: (id: string) => void;
}

const damageColors: Record<string, { bg: string; border: string; text: string }> = {
  Severe: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
  High: { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C' },
  Moderate: { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04' },
};

const states = ['all', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim', 'Assam', 'Nagaland'];
const severities = ['all', 'Severe', 'High', 'Moderate'];

const HistoricalEvents: React.FC<HistoricalEventsProps> = ({ onNavigate, onSelectLocation }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredEvents = historicalEvents.filter(ev => {
    const matchYear = ev.year === selectedYear;
    const matchState = selectedState === 'all' || ev.state === selectedState;
    const matchSeverity = selectedSeverity === 'all' || ev.damage === selectedSeverity;
    return matchYear && matchState && matchSeverity;
  });

  const handleFlyToEvent = (locName: string) => {
    const match = locations.find(l => l.name.toLowerCase().includes(locName.toLowerCase()));
    if (match && onSelectLocation) onSelectLocation(match.id);
    if (onNavigate) onNavigate('map');
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '28px', color: '#0F172A', marginBottom: '6px' }}>
          Historical Data
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          Review past landslide events across North-East India to understand patterns and recurring risk areas.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: '📋', label: 'Recorded Events', value: '1,284', note: 'GSI Records' },
          { icon: '📅', label: 'Peak Hazard Season', value: 'Jun–Sep', note: 'Southwest Monsoon' },
          { icon: '📍', label: 'Most Affected', value: 'Meghalaya', note: '384 Landslides' },
        ].map(s => (
          <div key={s.label} style={{
            backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px',
            padding: '18px 20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>{s.icon}</span>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
        padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
          📅 Monthly Landslide Frequency
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Typical distribution of incidents across the year</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyLandslideData} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(val: number) => [`${val}`, 'Incidents']}
            />
            <Bar dataKey="count" name="Incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#EFF6FF', borderRadius: '8px', fontSize: '12px', color: '#1E40AF' }}>
          💡 Peak in July with 82 recorded events — coincides with highest monsoon rainfall in the region.
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
        padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Year Slider */}
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>📅 Year</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB' }}>{selectedYear}</span>
            </div>
            <input
              type="range" min={2018} max={2025} value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563EB' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              <span>2018</span><span>2025</span>
            </div>
          </div>

          {/* State Filter */}
          <div style={{ flex: '2 1 280px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>🗺 State</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {states.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    border: `1px solid ${selectedState === st ? '#BFDBFE' : '#E2E8F0'}`,
                    backgroundColor: selectedState === st ? '#EFF6FF' : '#F8FAFC',
                    color: selectedState === st ? '#2563EB' : '#64748B',
                    cursor: 'pointer', transition: 'all 0.12s ease',
                  }}
                >
                  {st === 'all' ? 'All States' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div style={{ flex: '1 1 160px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>⚠️ Severity</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {severities.map(sv => (
                <button
                  key={sv}
                  onClick={() => setSelectedSeverity(sv)}
                  style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    border: `1px solid ${selectedSeverity === sv ? '#FECACA' : '#E2E8F0'}`,
                    backgroundColor: selectedSeverity === sv ? '#FEF2F2' : '#F8FAFC',
                    color: selectedSeverity === sv ? '#DC2626' : '#64748B',
                    cursor: 'pointer', transition: 'all 0.12s ease',
                  }}
                >
                  {sv === 'all' ? 'All' : sv}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
        padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>
            Recorded Events — {selectedYear}
          </h3>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{filteredEvents.length} incidents found</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px' }}>
            No events found for selected filters.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {filteredEvents.map((ev, i) => {
              const dc = damageColors[ev.damage] ?? damageColors.Moderate;
              return (
                <div key={i} style={{
                  backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: '10px', padding: '16px',
                  transition: 'all 0.15s ease', cursor: 'default',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>
                        {ev.month} {ev.year} · {ev.state}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{ev.location}</div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      backgroundColor: dc.bg, border: `1px solid ${dc.border}`, color: dc.text, flexShrink: 0,
                    }}>{ev.damage}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', marginBottom: '12px' }}>
                    👥 {ev.casualties} casualties / displaced
                  </p>
                  <button
                    onClick={() => handleFlyToEvent(ev.location)}
                    style={{
                      width: '100%', padding: '7px', borderRadius: '7px', border: '1.5px solid #BFDBFE',
                      backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#DBEAFE')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                  >
                    📍 View on Map
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalEvents;
