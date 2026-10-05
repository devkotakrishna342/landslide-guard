import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Layers,
  ShieldAlert,
  Users,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface StageDetail {
  id: number;
  step: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  glowColor: string;
  techStack: string;
  latency: string;
  summary: string;
  inputs: string[];
  outputs: string[];
  specs: { title: string; desc: string }[];
}

const pipelineStages: StageDetail[] = [
  {
    id: 1,
    step: 'STAGE 01',
    name: 'DATA SOURCES',
    badge: 'INGESTION',
    icon: Database,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-blue-500/20',
    techStack: 'IMD API • Sentinel Hub • NASA Earthdata • In-situ Piezometers',
    latency: '< 15 mins polling',
    summary: 'Automated multi-modal environmental telemetry ingestion streaming weather radar, satellite indices, and IoT piezometers.',
    inputs: ['IMD Rain Gauge telemetry (15-min rainfall)', 'NASA SMAP 9km radiometer (topsoil moisture)', 'Sentinel-1A SAR radar frames', 'ISRO CartoDEM elevation rasters'],
    outputs: ['Raw sensor ingestion queue', 'GeoTIFF raster tiles', 'Time-stamped IoT event logs'],
    specs: [
      { title: 'Rainfall Telemetry', desc: '15-minute continuous gauge logs from IMD stations across 8 NER states.' },
      { title: 'SMAP Moisture Index', desc: 'Volumetric soil moisture content estimating sub-surface pore saturation.' },
      { title: 'InSAR Radar Interferograms', desc: 'Repeat-pass interferometry detecting mm-level surface creep displacement.' },
    ],
  },
  {
    id: 2,
    step: 'STAGE 02',
    name: 'FEATURE ENGINEERING',
    badge: 'PIPELINE',
    icon: RefreshCw,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-cyan-500/20',
    techStack: 'Python GDAL • NumPy • GeoPandas • Rasterio',
    latency: '< 450 ms',
    summary: 'Spatial normalization, coordinate alignment to 10m grid, slope curvature derivation, and antecedent precipitation index calculation.',
    inputs: ['Raw GeoTIFF raster arrays', 'Digital elevation model coordinates', 'Rainfall precipitation time series'],
    outputs: ['Normalized multivariate feature matrix (N x 14)', 'Slope gradient tensor', 'Antecedent moisture index (API)'],
    specs: [
      { title: 'Slope Gradient Derivation', desc: '3D gradient vector computation capturing critical angles exceeding 30° thresholds.' },
      { title: 'Antecedent Saturation (7-Day)', desc: 'Decay-weighted cumulative rainfall formula measuring soil pore water buildup.' },
      { title: 'Noise Cleaning & Imputation', desc: 'Outlier filtering for sensor glitches using Kalman filtration.' },
    ],
  },
  {
    id: 3,
    step: 'STAGE 03',
    name: 'AI / ML ENGINE',
    badge: 'INFERENCE',
    icon: Cpu,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    glowColor: 'shadow-purple-500/20',
    techStack: 'XGBoost • PyTorch LSTM • SHAP Kernel • ONNX Runtime',
    latency: '< 120 ms',
    summary: 'Ensemble machine learning model combining gradient boosted classification with recurrent LSTM time-series forecasting and SHAP explainability.',
    inputs: ['14-dimensional feature vector', 'Historical landslide susceptibility weights', 'Antecedent rainfall time-series'],
    outputs: ['Instantaneous slope failure probability (0–100)', '24-hour predictive risk trajectory', 'SHAP feature importance ranking'],
    specs: [
      { title: 'XGBoost Classifier', desc: 'Physics-informed decision trees trained on historical NER landslide catalog.' },
      { title: 'LSTM Recurrent Network', desc: 'Models temporal decay and forecasts 24-hour antecedent pore pressure curve.' },
      { title: 'SHAP Explainability Engine', desc: 'Quantifies exact percentage contribution for rainfall, moisture, and slope.' },
    ],
  },
  {
    id: 4,
    step: 'STAGE 04',
    name: 'GIS RISK LAYER',
    badge: 'GEOSPATIAL',
    icon: Layers,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    glowColor: 'shadow-orange-500/20',
    techStack: 'Mapbox GL JS • WebGL 3D • Leaflet GeoJSON • Vector Tiles',
    latency: '60 FPS render',
    summary: 'Dynamic rendering of 3D terrain elevation, color-coded risk polygons, infrastructure proximity buffers, and pulsing hazard scarps.',
    inputs: ['AI risk scores (0–100)', 'Hazard polygon coordinates', 'Highway & settlement shapefiles'],
    outputs: ['Interactive 3D digital terrain model', 'Color-coded hazard buffer polygons', 'Proximity exposure analysis'],
    specs: [
      { title: '3D Elevation & Hillshade', desc: 'High-pitch perspective terrain exaggeration highlighting steep scarp slopes.' },
      { title: 'Polygon Hazard Buffers', desc: 'Dynamic vector polygons scaling with risk score intensity and pore saturation.' },
      { title: 'Asset Proximity Overlay', desc: 'Identifies national highways, schools, and settlements within hazard radius.' },
    ],
  },
  {
    id: 5,
    step: 'STAGE 05',
    name: 'EARLY WARNING',
    badge: 'DECISION SUPPORT',
    icon: ShieldAlert,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    glowColor: 'shadow-rose-500/20',
    techStack: 'Automated Threshold Engine • Rule Engine • CAP Protocol',
    latency: '< 80 ms trigger',
    summary: 'Automated anomaly threshold breakers trigger multi-tier warning states (Low, Moderate, High, Critical) and generate contextual directives.',
    inputs: ['Risk Score > 75 (Critical Threshold)', 'Population exposure index', 'Highway blockage probability'],
    outputs: ['Early Warning Event Incident Object', 'Action Directive Recommendations', 'Common Alerting Protocol (CAP) payload'],
    specs: [
      { title: 'Automated Threshold Breaker', desc: 'Instantly fires when composite slope stability index crosses 75/100 threshold.' },
      { title: 'Decision-Support Action Engine', desc: 'Generates specific field directives: road inspection, community advisory, NDRF standby.' },
      { title: 'Audit Trail & Incident Log', desc: 'Immutable timestamped incident record for emergency operations accountability.' },
    ],
  },
  {
    id: 6,
    step: 'STAGE 06',
    name: 'EMERGENCY ACTION',
    badge: 'DISPATCH',
    icon: Users,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-emerald-500/20',
    techStack: 'SMS Gateway • Siren Controllers • SDMA Dashboard • Mobile App',
    latency: '< 3 seconds broadcast',
    summary: 'Multi-channel broadcast pushed to Ministry of DoNER, State Disaster Management Authorities (SDMA), District Magistrates, NDRF, and village councils.',
    inputs: ['CAP-compliant XML payload', 'Target district recipient list', 'Localized vernacular advisory text'],
    outputs: ['Multi-channel SMS alerts', 'Siren node triggers', 'District Magistrate dashboard updates'],
    specs: [
      { title: 'State SDMA Gateway', desc: 'Direct XML telemetry feed into State Emergency Operations Center console.' },
      { title: 'District Magistrate Directive', desc: 'Authorizes precautionary traffic restrictions on arterial highway corridors.' },
      { title: 'Community Alert Dispatch', desc: 'SMS and siren notifications to village councils in downstream runout zones.' },
    ],
  },
];

const SystemArchitecture: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<number>(3); // Default AI/ML Engine
  const activeStage = pipelineStages.find(s => s.id === selectedStageId) || pipelineStages[2];
  const Icon = activeStage.icon;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-heading">
                  END-TO-END SYSTEM ARCHITECTURE PIPELINE
                </h1>
                <span className="text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  v2.4-NER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full disaster intelligence lifecycle: Ingestion → Feature Pipeline → AI Inference → GIS Visualizer → Early Warning → Emergency Action.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1728] border border-white/[0.08] px-3.5 py-2 rounded-xl text-xs font-mono">
          System Architecture: <span className="text-cyan-400 font-bold">SIH26001 Certified</span>
        </div>
      </div>

      {/* 1. ANIMATED 6-STAGE PIPELINE (Requested in Section 21) */}
      <div className="glass-panel-elevated p-6 bg-[#07111F]/95 border-white/[0.1] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Interactive Operational Pipeline Flowchart (Click any stage to inspect):
          </p>
          <span className="text-[10px] font-mono text-cyan-400">Continuous 15-min Loop</span>
        </div>

        {/* 6 Stage Interactive Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isSelected = selectedStageId === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`glass-panel p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 relative border ${
                  isSelected
                    ? `${stage.borderColor} bg-[#0B1728] shadow-2xl scale-[1.03] ring-2 ring-cyan-400/40 z-10`
                    : 'bg-[#0B1728]/70 border-white/[0.06] hover:border-white/[0.2] hover:bg-[#0B1728]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400">{stage.step}</span>
                    <div className={`w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center ${stage.color}`}>
                      <StageIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    {stage.badge}
                  </p>
                  <h4 className="text-xs font-black text-white font-heading mt-1 leading-snug">
                    {stage.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>{stage.latency}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </div>

                {/* Flow Connector Arrow */}
                {idx < pipelineStages.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-5 h-5 rounded-full bg-[#030712] border border-white/[0.15] flex items-center justify-center text-slate-400 shadow-md">
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DRILL-DOWN TECHNICAL SPECIFICATIONS FOR SELECTED STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Deep Dive Summary & Specs (8 cols) */}
        <div className="lg:col-span-8 glass-panel-elevated p-6 bg-[#07111F]/90 border-white/[0.1] shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center ${activeStage.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {activeStage.step} • {activeStage.badge}
                </span>
                <h3 className="text-xl font-black text-white font-heading">{activeStage.name}</h3>
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <p className="text-[9px] text-slate-400">PROCESSING LATENCY</p>
              <p className="text-cyan-400 font-bold text-sm">{activeStage.latency}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {activeStage.summary}
          </p>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Core Technical Capabilities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeStage.specs.map(s => (
                <div key={s.title} className="bg-[#0B1728] border border-white/[0.06] p-3 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-cyan-400">{s.title}</p>
                  <p className="text-[11px] text-slate-300 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inputs & Outputs Data Schema (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 bg-[#07111F]/90 border-white/[0.08] shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4 font-mono text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> STAGE INPUT SCHEMA:
              </p>
              <div className="space-y-1.5">
                {activeStage.inputs.map((inp, i) => (
                  <div key={i} className="bg-[#0B1728] p-2 rounded-lg border border-white/[0.04] text-slate-300 text-[11px]">
                    ↳ {inp}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> STAGE OUTPUT SCHEMA:
              </p>
              <div className="space-y-1.5">
                {activeStage.outputs.map((out, i) => (
                  <div key={i} className="bg-[#0B1728] p-2 rounded-lg border border-white/[0.04] text-emerald-300 text-[11px]">
                    ✓ {out}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
            Tech Stack: <span className="text-slate-200">{activeStage.techStack}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
