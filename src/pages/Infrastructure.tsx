import React, { useState } from 'react';
import { infrastructureItems, locations } from '../data/mockData';
import type { InfrastructureItem } from '../types';
import RiskMap from '../components/map/RiskMap';

type FilterType = 'all' | InfrastructureItem['type'];

const typeLabels: Record<InfrastructureItem['type'], string> = {
  road: 'Roads',
  village: 'Villages',
  hospital: 'Hospitals',
  school: 'Schools',
  emergency: 'Emergency',
};

const typeEmoji: Record<InfrastructureItem['type'], string> = {
  road: '🚧',
  village: '🏠',
  hospital: '🏥',
  school: '🏫',
  emergency: '🚨',
};

const getRiskColors = (level: string) => {
  switch (level) {
    case 'CRITICAL': return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' };
    case 'HIGH':     return { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C', dot: '#F97316' };
    case 'MODERATE': return { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04', dot: '#EAB308' };
    default:         return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E' };
  }
};

const Infrastructure: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('road-1');

  const filteredAssets = filter === 'all'
    ? infrastructureItems
    : infrastructureItems.filter(i => i.type === filter);

  const selectedAsset = infrastructureItems.find(i => i.id === selectedAssetId) ?? infrastructureItems[0];
  const associatedLoc = locations.find(l => l.id === selectedAsset.locationId) ?? locations[0];
  const rc = getRiskColors(selectedAsset.riskLevel);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '28px 24px 16px' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          fontWeight: 700, fontSize: '26px', color: '#0F172A', marginBottom: '4px',
        }}>
          Infrastructure at Risk
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B' }}>
          {infrastructureItems.length} monitored assets — roads, villages, hospitals and emergency stations near high-risk zones.
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'road', 'village', 'hospital', 'school', 'emergency'] as FilterType[]).map(f => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                border: `1px solid ${isActive ? '#BFDBFE' : '#E2E8F0'}`,
                backgroundColor: isActive ? '#EFF6FF' : '#FFF',
                color: isActive ? '#2563EB' : '#64748B',
                cursor: 'pointer', transition: 'all .12s ease',
              }}
            >
              {f === 'all' ? `All (${infrastructureItems.length})` : `${typeEmoji[f as InfrastructureItem['type']]} ${typeLabels[f as InfrastructureItem['type']]}`}
            </button>
          );
        })}
      </div>

      {/* Main: map + asset panel */}
      <div style={{
        maxWidth: '1160px', margin: '0 auto', padding: '0 24px 40px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px',
        alignItems: 'start',
      }}>
        {/* Map */}
        <div>
          <RiskMap
            locations={[associatedLoc]}
            selectedLocation={associatedLoc.id}
            onSelectLocation={() => {}}
            onViewDetails={() => {}}
            height="520px"
          />
        </div>

        {/* Asset Intelligence Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Selected asset detail */}
          <div style={{
            backgroundColor: '#FFF', border: `1.5px solid ${rc.border}`,
            borderRadius: '14px', padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>
                  {typeEmoji[selectedAsset.type]} {typeLabels[selectedAsset.type].toUpperCase()}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{selectedAsset.name}</div>
              </div>
              <div style={{
                padding: '3px 10px', borderRadius: '20px',
                backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
                color: rc.text, fontSize: '11px', fontWeight: 700,
              }}>
                {selectedAsset.riskLevel}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px', lineHeight: 1.5 }}>
              {selectedAsset.details}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0',
              }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Location</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{associatedLoc.name}</span>
              </div>
              {selectedAsset.distance && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0',
                }}>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Distance to hazard</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{selectedAsset.distance} km</span>
                </div>
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', background: '#FFF7ED', borderRadius: '8px', border: '1px solid #FFEDD5',
              }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Area risk score</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#EA580C' }}>
                  {associatedLoc.riskScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Asset list */}
          <div style={{
            backgroundColor: '#FFF', border: '1px solid #E2E8F0',
            borderRadius: '14px', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,.05)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
              All Assets
            </div>
            <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredAssets.map(item => {
                const c = getRiskColors(item.riskLevel);
                const isActive = item.id === selectedAssetId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAssetId(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '10px', border: `1px solid ${isActive ? c.border : '#E2E8F0'}`,
                      backgroundColor: isActive ? c.bg : '#F8FAFC',
                      cursor: 'pointer', textAlign: 'left', transition: 'all .12s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeEmoji[item.type]}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{typeLabels[item.type]}</div>
                      </div>
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px',
                      backgroundColor: c.bg, border: `1px solid ${c.border}`,
                      color: c.text, fontSize: '10px', fontWeight: 700, flexShrink: 0,
                    }}>
                      {item.riskLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
