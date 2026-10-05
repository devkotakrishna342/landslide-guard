import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', incidents: 2 },
  { month: 'Feb', incidents: 1 },
  { month: 'Mar', incidents: 4 },
  { month: 'Apr', incidents: 7 },
  { month: 'May', incidents: 14 },
  { month: 'Jun', incidents: 38 },
  { month: 'Jul', incidents: 52 },
  { month: 'Aug', incidents: 48 },
  { month: 'Sep', incidents: 35 },
  { month: 'Oct', incidents: 12 },
  { month: 'Nov', incidents: 5 },
  { month: 'Dec', incidents: 3 },
];

const stateData = [
  { state: 'Meghalaya', risk: 82 },
  { state: 'Arunachal', risk: 74 },
  { state: 'Manipur', risk: 68 },
  { state: 'Mizoram', risk: 63 },
  { state: 'Nagaland', risk: 58 },
  { state: 'Assam', risk: 45 },
  { state: 'Tripura', risk: 32 },
  { state: 'Sikkim', risk: 28 },
];

const trendData = [
  { day: 'Aug 05', score: 42 }, { day: 'Aug 08', score: 48 }, { day: 'Aug 11', score: 55 },
  { day: 'Aug 14', score: 60 }, { day: 'Aug 17', score: 67 }, { day: 'Aug 20', score: 72 },
  { day: 'Aug 23', score: 71 }, { day: 'Aug 26', score: 75 }, { day: 'Aug 29', score: 80 },
  { day: 'Sep 01', score: 83 }, { day: 'Sep 04', score: 87 },
];

const getBarColor = (score: number) => {
  if (score >= 75) return '#EF4444';
  if (score >= 60) return '#F97316';
  if (score >= 40) return '#EAB308';
  return '#22C55E';
};

const CustomBarCell = (props: any) => {
  const { x, y, width, height, value } = props;
  return <rect x={x} y={y} width={width} height={height} rx={4} fill={getBarColor(value)} />;
};

const RiskAnalysis: React.FC = () => {
  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '28px', color: '#0F172A', marginBottom: '6px' }}>
          Landslide Insights
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          Understand when and where landslide risk is highest across North-East India.
        </p>
      </div>

      {/* Insight Banner */}
      <div style={{
        backgroundColor: '#EFF6FF', border: '1.5px solid #BFDBFE',
        borderRadius: '12px', padding: '16px 20px', marginBottom: '32px',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E40AF', marginBottom: '2px' }}>Key Insight</div>
          <p style={{ fontSize: '14px', color: '#1E3A8A', lineHeight: 1.6, margin: 0 }}>
            <strong>June–September shows the highest landslide activity</strong> due to intense monsoon rainfall saturating slopes across North-East India. Meghalaya and Arunachal Pradesh consistently show the highest risk levels.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>

        {/* Chart 1: Monthly Activity */}
        <div style={{
          backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
          padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: '4px' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
              📅 Landslide Activity by Month
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Number of incidents across North-East India</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val: number) => [`${val} incidents`, 'Activity']}
              />
              <Bar dataKey="incidents" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <CustomBarCell key={`cell-${index}`} value={entry.incidents > 30 ? 85 : entry.incidents > 15 ? 65 : 35} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#FEF2F2', borderRadius: '8px', fontSize: '12px', color: '#991B1B' }}>
            ⚠️ Peak risk period: June to September (monsoon season)
          </div>
        </div>

        {/* Chart 2: Risk by State */}
        <div style={{
          backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
          padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
            🗺 Risk by State
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Average risk score across monitored areas</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stateData.map(s => {
              const color = getBarColor(s.risk);
              return (
                <div key={s.state}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{s.state}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: color }}>{s.risk}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${s.risk}%`, backgroundColor: color,
                      borderRadius: '4px', transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart 3: Trend Over Time */}
      <div style={{
        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '14px',
        padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
              📈 Risk Trend Over Time
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Overall risk score for East Khasi Hills — last 30 days</p>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626' }}>↑ 24% since Aug 1</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(val: number) => [`${val} / 100`, 'Risk Score']}
            />
            <Area type="monotone" dataKey="score" stroke="#EF4444" strokeWidth={2.5} fill="url(#riskGradient)" dot={{ fill: '#EF4444', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#FFFBEB', borderRadius: '8px', fontSize: '12px', color: '#92400E' }}>
          💡 Continued heavy rainfall is forecast for the next 48 hours, which may push the risk score above 90.
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
