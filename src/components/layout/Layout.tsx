import React, { useState } from 'react';
import type { Page, LocationData } from '../../types';
import HowItWorks from '../../pages/HowItWorks';
import PresentationDemoModal from '../common/PresentationDemoModal';
import EmergencyBroadcastModal from '../common/EmergencyBroadcastModal';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSelectLocation: (id: string) => void;
  selectedLocation: string | null;
  locations: LocationData[];
  alerts: number;
  isLiveTelemetry: boolean;
  onToggleLiveTelemetry: () => void;
  showDemoModal: boolean;
  onOpenDemo: () => void;
  onCloseDemo: () => void;
  showBroadcastModal: boolean;
  onOpenBroadcast: () => void;
  onCloseBroadcast: () => void;
  children: React.ReactNode;
}

const mainNavItems: { page: Page; label: string }[] = [
  { page: 'dashboard', label: 'Home' },
  { page: 'map', label: 'Risk Map' },
  { page: 'warnings', label: 'Alerts' },
  { page: 'analysis', label: 'Insights' },
];

const moreNavItems: { page: Page; label: string; icon: string }[] = [
  { page: 'satellite', label: 'Satellite Monitoring', icon: '🛰' },
  { page: 'historical', label: 'Historical Data', icon: '📜' },
  { page: 'infrastructure', label: 'Infrastructure', icon: '🛣' },
  { page: 'how-it-works', label: 'How It Works', icon: 'ℹ️' },
  { page: 'prediction', label: 'AI Model Details', icon: '🤖' },
  { page: 'settings', label: 'Settings', icon: '⚙️' },
];

const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  onSelectLocation,
  selectedLocation,
  locations,
  alerts,
  showDemoModal,
  onCloseDemo,
  showBroadcastModal,
  onCloseBroadcast,
  children,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMoreOpen(false);
    setMobileOpen(false);
  };

  const isMoreActive = moreNavItems.some(i => i.page === currentPage);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      {/* TOP NAVBAR */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '32px' }}>
          {/* Logo */}
          <button
            onClick={() => handleNav('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>🛡️</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: '#0F172A', letterSpacing: '-0.01em' }}>LandslideGuard</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>North-East India · Early Warning</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flexGrow: 1 }}>
            {mainNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: currentPage === item.page ? 600 : 500,
                  backgroundColor: currentPage === item.page ? '#EFF6FF' : 'transparent',
                  color: currentPage === item.page ? '#2563EB' : '#475569',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (currentPage !== item.page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { if (currentPage !== item.page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
              >
                {item.label}
              </button>
            ))}

            {/* More Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: isMoreActive ? 600 : 500,
                  backgroundColor: isMoreActive ? '#EFF6FF' : 'transparent',
                  color: isMoreActive ? '#2563EB' : '#475569',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!isMoreActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { if (!isMoreActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
              >
                More
                <span style={{ fontSize: '10px', marginTop: '1px' }}>{moreOpen ? '▲' : '▼'}</span>
              </button>
              {moreOpen && (
                <>
                  <div onClick={() => setMoreOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
                    backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
                    padding: '8px', minWidth: '200px',
                  }}>
                    {moreNavItems.map(item => (
                      <button
                        key={item.page}
                        onClick={() => handleNav(item.page)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                          fontSize: '14px', fontWeight: 500, textAlign: 'left',
                          backgroundColor: currentPage === item.page ? '#EFF6FF' : 'transparent',
                          color: currentPage === item.page ? '#2563EB' : '#374151',
                          transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={e => { if (currentPage !== item.page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F8FAFC'; }}
                        onMouseLeave={e => { if (currentPage !== item.page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Alert bell */}
            <button
              onClick={() => handleNav('warnings')}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
            >
              <span style={{ fontSize: '20px' }}>🔔</span>
              {alerts > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  backgroundColor: '#EF4444', color: '#FFF', fontSize: '10px', fontWeight: 700,
                  minWidth: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                }}>{alerts}</span>
              )}
            </button>
            {/* Profile */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: '8px',
              backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', backgroundColor: '#2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: '#FFF', fontWeight: 600
              }}>DC</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Officer</span>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >☰</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#FFF', padding: '12px 24px' }}>
            {[...mainNavItems, ...moreNavItems].map(item => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px',
                  border: 'none', background: currentPage === item.page ? '#EFF6FF' : 'transparent',
                  color: currentPage === item.page ? '#2563EB' : '#374151',
                  borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  marginBottom: '2px',
                }}
              >
                {'icon' in item ? `${(item as typeof moreNavItems[0]).icon} ` : ''}{item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        {currentPage === 'how-it-works' ? (
          <HowItWorks onNavigate={onNavigate} />
        ) : (
          children
        )}
      </main>

      {/* Slim Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0',
        padding: '20px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>
            🛡️ <strong>LandslideGuard</strong> — AI-powered landslide early warning for North-East India
          </span>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            AI decision-support prototype · Not for operational emergency use
          </span>
        </div>
      </footer>

      {/* Modals */}
      <PresentationDemoModal
        isOpen={showDemoModal}
        onClose={onCloseDemo}
        locations={locations}
        onSelectLocation={onSelectLocation}
        onNavigate={onNavigate}
      />
      <EmergencyBroadcastModal
        isOpen={showBroadcastModal}
        onClose={onCloseBroadcast}
        locations={locations}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default Layout;
