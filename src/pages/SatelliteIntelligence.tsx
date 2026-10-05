import React, { useState } from 'react';
import {
  Satellite,
  Eye,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const satelliteLayers = [
  {
    id: 'insar',
    name: 'Sentinel-1 InSAR Deformation',
    resolution: '20m Interferogram',
    satellite: 'Sentinel-1A (C-Band Radar)',
    description: 'Interferometric Synthetic Aperture Radar mm-scale displacement tracking active scarp shear.',
    lastCaptured: '18 mins ago',
    badge: 'RADAR InSAR',
    displacement: '+8.4 cm / 14 days',
    vegChange: '-14.2%',
    risk: 'HIGH',
  },
  {
    id: 'optical',
    name: 'Sentinel-2 Multispectral Optical',
    resolution: '10m / Pixel',
    satellite: 'Sentinel-2B (ESA)',
    description: 'High-resolution true-color surface reflectance for land cover change & visible scar delineation.',
    lastCaptured: '32 mins ago',
    badge: 'OPTICAL',
    displacement: '+4.1 cm / 14 days',
    vegChange: '-18.5%',
    risk: 'HIGH',
  },
  {
    id: 'dem',
    name: 'CartoDEM 30m Terrain Elevation',
    resolution: '30m / Mesh',
    satellite: 'Cartosat-1 (ISRO)',
    description: '3D digital elevation model capturing steep gullies, drainage slope concavity & micro-relief.',
    lastCaptured: '1 hour ago',
    badge: 'ISRO DEM',
    displacement: 'Static Elevation',
    vegChange: 'N/A',
    risk: 'MODERATE',
  },
  {
    id: 'moisture',
    name: 'SMAP Passive Soil Moisture Index',
    resolution: '9km Radiometer',
    satellite: 'SMAP (NASA)',
    description: 'Surface volumetric water content (0-5cm) indicating critical pore pressure saturation.',
    lastCaptured: '45 mins ago',
    badge: 'NASA SMAP',
    displacement: 'Hydraulic head +12%',
    vegChange: 'N/A',
    risk: 'CRITICAL',
  },
];

const SatelliteIntelligence: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('insar');
  const [sliderPos, setSliderPos] = useState(52);
  const [isScanningActive, setIsScanningActive] = useState(true);

  const layer = satelliteLayers.find(l => l.id === activeLayer) || satelliteLayers[0];

  return (
    <div className="space-y-5 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Satellite className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-heading">
                  SATELLITE INTELLIGENCE & TERRAIN SCAN
                </h1>
                <span className="text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  PROTOTYPE IMAGERY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multispectral Sentinel-2, Sentinel-1 InSAR radar deformation & ISRO CartoDEM digital elevation models.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#0B1728] border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">Orbital Sensor:</span>
            <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT: 70% SATELLITE COMPARISON SLIDER & 30% AI TERRAIN INTERPRETATION (Requested in Section 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT ~70% (8 cols): LARGE SATELLITE IMAGERY WITH BEFORE/AFTER SLIDER */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel-elevated p-4 bg-[#07111F]/90 border-white/[0.1] shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  PRE VS POST MONSOON TERRAIN DISPLACEMENT SLIDER
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Sector: East Khasi Hills (25.5788° N, 91.8933° E) • Sentinel-1 InSAR Interferogram
                </p>
              </div>

              <button
                onClick={() => setIsScanningActive(!isScanningActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border font-mono ${
                  isScanningActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-[#0B1728] text-slate-400 border-white/[0.08]'
                }`}
              >
                {isScanningActive ? 'SCANNING LASER ON' : 'PAUSE SCAN'}
              </button>
            </div>

            {/* Interactive Image Split Container */}
            <div className="relative h-[420px] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#030712] select-none shadow-2xl group">
              {/* Layer 1: POST-MONSOON InSAR DISPLACEMENT (Underneath) */}
              <div
                className="absolute inset-0 bg-cover bg-center flex flex-col justify-between p-5"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.4), rgba(3, 7, 18, 0.85)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')`,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-rose-500/25 text-rose-300 border border-rose-500/40 text-[10px] font-black px-3 py-1 rounded-xl backdrop-blur-md font-mono">
                    POST-DELUGE InSAR DEFORMATION (POST-EVENT)
                  </span>
                  <div className="bg-[#030712]/85 backdrop-blur-md border border-white/[0.1] px-3 py-1.5 rounded-xl text-right font-mono">
                    <p className="text-[8px] text-slate-400">DISPLACEMENT RATE</p>
                    <p className="text-rose-400 font-bold text-xs">+8.4 cm / 14 days</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-[#030712]/90 backdrop-blur-md p-3 rounded-xl border border-white/[0.1] max-w-sm">
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Radar Backscatter Anomaly
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Active rotational slope scarp expanding along NH-10 highway corridor.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Lat: 25.5788° N • Lng: 91.8933° E</span>
                </div>
              </div>

              {/* Layer 2: PRE-MONSOON BASELINE (Clipped by sliderPos) */}
              <div
                className="absolute inset-0 bg-cover bg-center flex flex-col justify-between p-5 border-r-2 border-cyan-400 shadow-2xl transition-all"
                style={{
                  width: `${sliderPos}%`,
                  backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.35), rgba(3, 7, 18, 0.85)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80')`,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-3 py-1 rounded-xl backdrop-blur-md font-mono">
                    BASELINE PRE-MONSOON STABILITY (PRE-EVENT)
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-[#030712]/90 backdrop-blur-md p-3 rounded-xl border border-white/[0.1] max-w-sm">
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Intact Forest Canopy Cover
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Stable baseline slope condition before monsoon deluge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated Laser Radar Scanning Line (Requested in Section 17) */}
              {isScanningActive && <div className="radar-scan-line" />}

              {/* Interactive Range Drag Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={e => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>

            {/* Slider control status */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 font-mono">
              <span>◄ Pre-Monsoon Baseline</span>
              <span className="text-cyan-400 font-bold">Interactive Split View: {sliderPos}%</span>
              <span>Post-Monsoon InSAR Scar ►</span>
            </div>
          </div>

          {/* 4 Multi-spectral Satellite Layers Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {satelliteLayers.map(l => {
              const isActive = l.id === activeLayer;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                      : 'bg-[#07111F] border-white/[0.08] text-slate-400 hover:text-white hover:bg-[#0B1728]'
                  }`}
                >
                  <p className="text-[10px] font-mono font-bold text-cyan-400">{l.badge}</p>
                  <p className="text-xs font-bold text-white mt-1 leading-snug">{l.name}</p>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">{l.resolution}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT ~30% (4 cols): AI TERRAIN INTERPRETATION (Requested in Section 17) */}
        <div className="lg:col-span-4 glass-panel-elevated p-6 bg-[#07111F]/95 border-white/[0.1] shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                AI TERRAIN INTERPRETATION
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {layer.lastCaptured}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white font-heading">
                Potential Instability Detected
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated change detection algorithm applied to synthetic aperture radar interferometry and NDVI canopy indices.
              </p>
            </div>

            {/* Core Metrics Box (Requested in Section 17) */}
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#0B1728] border border-white/[0.08] p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">SURFACE DISPLACEMENT</p>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{layer.displacement}</p>
                </div>
                <span className="text-rose-400 text-xs font-bold bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded">
                  CREEP
                </span>
              </div>

              <div className="bg-[#0B1728] border border-white/[0.08] p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">VEGETATION LOSS (NDVI)</p>
                  <p className="text-base font-bold text-orange-400 mt-0.5">{layer.vegChange}</p>
                </div>
                <span className="text-orange-400 text-xs font-bold bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded">
                  SCARP
                </span>
              </div>

              <div className="bg-[#0B1728] border border-white/[0.08] p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">SLOPE INSTABILITY RISK</p>
                  <p className="text-base font-black text-rose-400 mt-0.5">{layer.risk} HAZARD</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              </div>
            </div>

            {/* Geotechnical Interpretation Card */}
            <div className="bg-[#0B1728] border border-white/[0.06] p-4 rounded-xl text-xs text-slate-300 space-y-2">
              <p className="font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5" /> RADAR INTERFEROGRAM INTERPRETATION
              </p>
              <p className="leading-relaxed text-[11px]">
                Coherence loss along the south-facing escarpment confirms active rotational shearing. Slope toe erosion observed adjacent to highway Km 42.
              </p>
            </div>
          </div>

          <div className="bg-[#030712] border border-white/[0.06] p-3 rounded-xl text-[10px] text-amber-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Prototype simulated satellite data based on Sentinel-1 & Sentinel-2 mission benchmarks.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteIntelligence;
