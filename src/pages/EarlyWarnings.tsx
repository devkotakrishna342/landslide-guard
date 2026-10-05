import React, { useState } from 'react';
import type { Alert, Page } from '../types';

interface EarlyWarningsProps {
  alerts: Alert[];
  onUpdateAlert: (id: string, status: Alert['status']) => void;
  onNavigate: (page: Page) => void;
  onSelectLocation: (id: string) => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444', label: '🔴 CRITICAL' };
    case 'HIGH': return { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C', dot: '#F97316', label: '🟠 HIGH' };
    case 'MODERATE': return { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04', dot: '#EAB308', label: '🟡 MODERATE' };
    default: return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E', label: '🟢 LOW' };
  }
};

const reasonMap: Record<string, string> = {
  'east-khasi-hills': 'Heavy rainfall + high soil moisture + steep slope',
  'tawang': 'Heavy rainfall and steep terrain in high altitude zones',
  'cherrapunji': 'Extreme rainfall — one of world\'s highest rainfall zones',
  'shillong': 'Moderate rainfall on moderately steep slopes',
};

const actionMap: Record<string, string> = {
  'east-khasi-hills': 'Alert nearby communities and restrict traffic on NH-6.',
  'tawang': 'Monitor NH-13 and caution local transport. Pre-position rescue teams.',
  'cherrapunji': 'Issue public advisory and activate local emergency response teams.',
  'shillong': 'Continue monitoring. No immediate action needed.',
};

const EarlyWarnings: React.FC<EarlyWarningsProps> = ({ alerts, onUpdateAlert, onNavigate, onSelectLocation }) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [actionId, setActionId] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.riskLevel === filter);

  const handleTakeAction = (id: string) => {
    setActionId(id);
    setDispatched(false);
    setDispatching(false);
  };

  const handleDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setDispatched(true);
    }, 1800);
  };

  const activeAlert = alerts.find(a => a.id === actionId);

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '28px', color: '#0F172A', marginBottom: '6px' }}>
          Early Warning Alerts
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          Important areas that need attention. Act promptly on Critical and High risk alerts.
        </p>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE'] as const).map(f => {
          const isActive = filter === f;
          const colors: Record<string, { active: string; activeBg: string; activeBorder: string }> = {
            ALL: { active: '#2563EB', activeBg: '#EFF6FF', activeBorder: '#BFDBFE' },
            CRITICAL: { active: '#DC2626', activeBg: '#FEF2F2', activeBorder: '#FECACA' },
            HIGH: { active: '#EA580C', activeBg: '#FFF7ED', activeBorder: '#FFEDD5' },
            MODERATE: { active: '#CA8A04', activeBg: '#FEFCE8', activeBorder: '#FEF08A' },
          };
          const c = colors[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                border: `1px solid ${isActive ? c.activeBorder : '#E2E8F0'}`,
                backgroundColor: isActive ? c.activeBg : '#FFF',
                color: isActive ? c.active : '#64748B',
                cursor: 'pointer', transition: 'all 0.12s ease',
              }}
            >
              {f === 'ALL' ? `All Alerts (${alerts.length})` : `${f.charAt(0) + f.slice(1).toLowerCase()} (${alerts.filter(a => a.riskLevel === f).length})`}
            </button>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8', fontSize: '14px' }}>
            No alerts in this category.
          </div>
        )}
        {filtered.map(alert => {
          const rc = getRiskColor(alert.riskLevel);
          return (
            <div
              key={alert.id}
              style={{
                backgroundColor: '#FFF', border: `1.5px solid ${rc.border}`,
                borderRadius: '14px', padding: '24px',
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: rc.dot, borderRadius: '14px 0 0 14px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px',
                      backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
                      color: rc.text, fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em',
                    }}>{rc.label}</span>
                    {alert.status === 'ACKNOWLEDGED' && (
                      <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                        Acknowledged
                      </span>
                    )}
                    {alert.status === 'RESOLVED' && (
                      <span style={{ fontSize: '11px', color: '#16A34A', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                        Resolved
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                    {alert.locationName}, {alert.state}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>Updated {alert.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '42px', fontWeight: 800, color: rc.text, lineHeight: 1 }}>{alert.riskScore}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Risk Score / 100</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <div style={{ flex: '1 1 200px', backgroundColor: '#FFFBEB', border: '1px solid #FEF08A', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why?</div>
                  <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5 }}>
                    {reasonMap[alert.locationId] || alert.triggers?.join(' + ') || 'Multiple environmental factors'}
                  </div>
                </div>
                <div style={{ flex: '1 1 200px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Recommended</div>
                  <div style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: 1.5 }}>
                    {actionMap[alert.locationId] || 'Monitor closely and follow district emergency protocols.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { onSelectLocation(alert.locationId); onNavigate('map'); }}
                  style={{
                    padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC', color: '#374151', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget.style.backgroundColor = '#E2E8F0'); }}
                  onMouseLeave={e => { (e.currentTarget.style.backgroundColor = '#F8FAFC'); }}
                >
                  🗺 View Map
                </button>
                <button
                  onClick={() => handleTakeAction(alert.id)}
                  style={{
                    padding: '8px 18px', borderRadius: '8px', border: 'none',
                    backgroundColor: '#2563EB', color: '#FFF', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  ⚡ Take Action
                </button>
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => onUpdateAlert(alert.id, 'ACKNOWLEDGED')}
                    style={{
                      padding: '8px 18px', borderRadius: '8px',
                      border: '1.5px solid #E2E8F0', backgroundColor: '#FFF',
                      color: '#64748B', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ✓ Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Take Action Modal */}
      {actionId && activeAlert && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, padding: '24px',
        }}
          onClick={() => { setActionId(null); setDispatched(false); }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFF', borderRadius: '16px', padding: '32px',
              maxWidth: '440px', width: '100%',
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.25)',
            }}
          >
            {dispatched ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Alert Dispatched</h3>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>
                  Notifications sent to district administration, emergency teams, and communities via SMS and radio.
                </p>
                <button
                  onClick={() => { setActionId(null); setDispatched(false); onUpdateAlert(activeAlert.id, 'ACKNOWLEDGED'); }}
                  style={{ padding: '10px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: '#FFF', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  Send Alert — {activeAlert.locationName}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                  This will notify relevant authorities and communities about the {activeAlert.riskLevel.toLowerCase()} risk situation.
                </p>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alert Channels</div>
                  {[
                    { icon: '📱', label: 'SMS Alert', desc: 'To district officers & SDRF' },
                    { icon: '📻', label: 'Public Radio', desc: 'All India Radio NE stations' },
                    { icon: '🏛', label: 'District Administration', desc: 'DC Office & disaster cell' },
                    { icon: '🚨', label: 'Emergency Teams', desc: 'Fire & rescue, NDRF local' },
                  ].map(ch => (
                    <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '20px' }}>{ch.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{ch.label}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{ch.desc}</div>
                      </div>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>Ready</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setActionId(null)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', backgroundColor: '#FFF', color: '#374151', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispatch}
                    disabled={dispatching}
                    style={{
                      flex: 2, padding: '10px', borderRadius: '8px', border: 'none',
                      backgroundColor: dispatching ? '#93C5FD' : '#2563EB',
                      color: '#FFF', fontWeight: 600, fontSize: '14px',
                      cursor: dispatching ? 'wait' : 'pointer', transition: 'background 0.15s',
                    }}
                  >
                    {dispatching ? '⏳ Sending...' : '⚡ Send Alert Now'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarlyWarnings;
