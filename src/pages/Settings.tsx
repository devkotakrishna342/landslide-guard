import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState<'high' | 'moderate' | 'low'>('high');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');
  const [language, setLanguage] = useState<'english'>('english');

  const row = (label: string, sublabel: string, control: React.ReactNode) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid #F1F5F9', gap: '16px', flexWrap: 'wrap',
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{sublabel}</div>}
      </div>
      {control}
    </div>
  );

  const selectStyle: React.CSSProperties = {
    padding: '7px 14px', borderRadius: '8px', border: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC', fontSize: '13px', fontWeight: 600,
    color: '#0F172A', cursor: 'pointer', appearance: 'auto',
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Header */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          fontWeight: 700, fontSize: '26px', color: '#0F172A', marginBottom: '4px',
        }}>
          Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
          Configure your alert preferences and display options.
        </p>

        {/* Settings card */}
        <div style={{
          backgroundColor: '#FFF', border: '1px solid #E2E8F0',
          borderRadius: '16px', padding: '24px 24px 4px',
          boxShadow: '0 1px 3px rgba(0,0,0,.05)', marginBottom: '20px',
        }}>
          {/* Notifications toggle */}
          {row(
            'Notifications',
            'Receive alerts when risk levels change.',
            <button
              onClick={() => setNotifications(n => !n)}
              style={{
                width: 48, height: 26, borderRadius: '13px', border: 'none',
                backgroundColor: notifications ? '#2563EB' : '#CBD5E1',
                cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0,
              }}
              aria-label="Toggle notifications"
            >
              <span style={{
                position: 'absolute', top: '3px',
                left: notifications ? '25px' : '3px',
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: '#FFF', transition: 'left .2s',
                boxShadow: '0 1px 3px rgba(0,0,0,.2)',
              }} />
            </button>
          )}

          {/* Alert threshold */}
          {row(
            'Alert threshold',
            'Minimum risk level to trigger an alert.',
            <select
              value={alertThreshold}
              onChange={e => setAlertThreshold(e.target.value as typeof alertThreshold)}
              style={selectStyle}
            >
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          )}

          {/* Map style */}
          {row(
            'Map style',
            'Choose how the risk map looks.',
            <select
              value={mapStyle}
              onChange={e => setMapStyle(e.target.value as typeof mapStyle)}
              style={selectStyle}
            >
              <option value="standard">Standard</option>
              <option value="satellite">Satellite</option>
            </select>
          )}

          {/* Language */}
          {row(
            'Language',
            'Display language.',
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as typeof language)}
              style={selectStyle}
            >
              <option value="english">English</option>
            </select>
          )}
        </div>

        {/* System status */}
        <div style={{
          backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '18px' }}>🟢</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#15803D' }}>All systems operational</div>
            <div style={{ fontSize: '12px', color: '#16A34A' }}>Data pipeline · AI model · Alert service · Map service</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: '20px', padding: '14px 16px',
          backgroundColor: '#FFFBEB', border: '1px solid #FEF08A',
          borderRadius: '10px',
        }}>
          <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This is an AI decision-support prototype using simulated sensor data.
            Predictions must be validated by authorized disaster management agencies before operational use.
          </p>
        </div>

        {/* Technical details — collapsed */}
        <details style={{ marginTop: '20px' }}>
          <summary style={{
            fontSize: '13px', fontWeight: 600, color: '#2563EB',
            cursor: 'pointer', padding: '10px 0', listStyle: 'none',
          }}>
            ▶ Technical Information (SIH26001)
          </summary>
          <div style={{
            marginTop: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: '10px', padding: '16px', fontSize: '12px', color: '#64748B', lineHeight: 1.7,
          }}>
            <p><strong style={{ color: '#374151' }}>Problem ID:</strong> SIH26001</p>
            <p><strong style={{ color: '#374151' }}>Problem:</strong> AI-Based Early Warning and Landslide Risk Monitoring — North Eastern Region</p>
            <p><strong style={{ color: '#374151' }}>Ministry:</strong> Ministry of Development of North Eastern Region (DoNER)</p>
            <p><strong style={{ color: '#374151' }}>Data sources:</strong> IMD weather stations · ISRO satellite data (simulated) · OpenStreetMap</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default Settings;
