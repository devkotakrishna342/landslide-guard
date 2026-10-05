import { useState, useCallback } from 'react';
import type { Page, Alert, LocationData } from './types';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LiveRiskMap from './pages/LiveRiskMap';
import AIPrediction from './pages/AIPrediction';
import EarlyWarnings from './pages/EarlyWarnings';
import RiskAnalysis from './pages/RiskAnalysis';
import HistoricalEvents from './pages/HistoricalEvents';
import Infrastructure from './pages/Infrastructure';
import SatelliteIntelligence from './pages/SatelliteIntelligence';
import SystemArchitecture from './pages/SystemArchitecture';
import Settings from './pages/Settings';
import { locations as defaultLocations } from './data/mockData';
import { initialAlerts } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [locations] = useState<LocationData[]>(defaultLocations);
  const [isLiveTelemetry, setIsLiveTelemetry] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleSelectLocation = useCallback((id: string) => {
    setSelectedLocation(id);
  }, []);

  const handleUpdateAlert = useCallback((id: string, status: Alert['status']) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const activeAlertCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectLocation={handleSelectLocation}
            locations={locations}
            isLiveTelemetry={isLiveTelemetry}
            onToggleLiveTelemetry={() => setIsLiveTelemetry(!isLiveTelemetry)}
            onStartDemo={() => setShowDemoModal(true)}
            onOpenBroadcast={() => setShowBroadcastModal(true)}
          />
        );
      case 'map':
        return (
          <LiveRiskMap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            onNavigate={handleNavigate}
          />
        );
      case 'prediction':
        return (
          <AIPrediction
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
          />
        );
      case 'warnings':
        return (
          <EarlyWarnings
            alerts={alerts}
            onUpdateAlert={handleUpdateAlert}
            onNavigate={handleNavigate}
            onSelectLocation={handleSelectLocation}
          />
        );
      case 'analysis':
        return <RiskAnalysis />;
      case 'historical':
        return <HistoricalEvents />;
      case 'infrastructure':
        return <Infrastructure />;
      case 'satellite':
        return <SatelliteIntelligence />;
      case 'architecture':
        return <SystemArchitecture />;
      case 'settings':
        return <Settings />;
      case 'how-it-works':
        return null; // Rendered inside Layout to pass onNavigate
      default:
        return null;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onSelectLocation={handleSelectLocation}
      selectedLocation={selectedLocation}
      locations={locations}
      alerts={activeAlertCount}
      isLiveTelemetry={isLiveTelemetry}
      onToggleLiveTelemetry={() => setIsLiveTelemetry(!isLiveTelemetry)}
      showDemoModal={showDemoModal}
      onOpenDemo={() => setShowDemoModal(true)}
      onCloseDemo={() => setShowDemoModal(false)}
      showBroadcastModal={showBroadcastModal}
      onOpenBroadcast={() => setShowBroadcastModal(true)}
      onCloseBroadcast={() => setShowBroadcastModal(false)}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
