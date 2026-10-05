import React from 'react';
import type { MapLayers } from './RiskMap';
import { Eye, Layers } from 'lucide-react';

interface MapLegendProps {
  layers: MapLayers;
  onToggleLayer: (layer: keyof MapLayers) => void;
}

const riskLevels = [
  { range: '0–25', level: 'LOW', color: '#22c55e' },
  { range: '26–50', level: 'MODERATE', color: '#eab308' },
  { range: '51–75', level: 'HIGH', color: '#f97316' },
  { range: '76–100', level: 'CRITICAL', color: '#ef4444' },
];

const layerItems: { key: keyof MapLayers; label: string }[] = [
  { key: 'riskZones', label: 'Risk Zones Vector' },
  { key: 'historicalLandslides', label: 'Historical Scars' },
  { key: 'roads', label: 'Roads & Highways' },
  { key: 'villages', label: 'Settlement Grid' },
  { key: 'rainfall', label: 'Rainfall Heatmap' },
  { key: 'terrain', label: 'DEM / Slope Vector' },
  { key: 'satellite', label: '🛰️ Satellite Map' },
];

const MapLegend: React.FC<MapLegendProps> = ({ layers, onToggleLayer }) => {
  return (
    <div className="glass-panel p-4 space-y-4 w-56 shadow-2xl backdrop-blur-2xl border-slate-800/90 text-xs">
      {/* Risk Levels */}
      <div>
        <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-2.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Risk Level Spectrum</span>
        </div>
        <div className="space-y-1.5">
          {riskLevels.map(r => (
            <div key={r.level} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-2.5 py-1.5 border border-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="font-extrabold" style={{ color: r.color }}>{r.level}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800/80" />

      {/* Layer Controls */}
      <div>
        <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-2.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Raster & GIS Layers</span>
        </div>
        <div className="space-y-1.5">
          {layerItems.map(item => (
            <label
              key={item.key}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                layers[item.key]
                  ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                  : 'bg-slate-900/40 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-medium text-[11px]">{item.label}</span>
              <input
                type="checkbox"
                checked={layers[item.key]}
                onChange={() => onToggleLayer(item.key)}
                className="w-3.5 h-3.5 accent-blue-500 rounded cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
