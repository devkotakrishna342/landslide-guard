import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../../types';
import Terrain3D from '../3d/Terrain3D';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  X,
  CloudRain,
  Droplets,
  Mountain,
  Activity,
  Shield,
  Building2,
} from 'lucide-react';
import { getRiskColor } from '../../services/riskCalculator';

interface PresentationDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onSelectLocation: (id: string) => void;
}

export const presentationScenes = [
  {
    step: 1,
    title: 'CONTINUOUS TERRAIN MONITORING',
    subtitle: 'North-East India Regional Overview',
    location: 'North-East India',
    state: 'NER Regional Grid',
    rainfall: 42,
    moisture: 44,
    slope: 38,
    riskScore: 24,
    riskLevel: 'LOW' as const,
    focusId: 'east-khasi-hills',
    narration: 'Satellite, radar, and in-situ environmental sensors continuously monitor the North-Eastern Region. Baselines are stable and green across all 8 states.',
    infrastructure: [],
    alertActive: false,
    recommendedAction: null,
  },
  {
    step: 2,
    title: 'MONSOON PRECIPITATION SURGE',
    subtitle: 'Heavy Rainfall Detected over Meghalaya',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 120,
    moisture: 68,
    slope: 38,
    riskScore: 43,
    riskLevel: 'MODERATE' as const,
    focusId: 'east-khasi-hills',
    narration: 'Doppler Radar telemetry detects high-intensity monsoon convective cell moving over East Khasi Hills. 24-hour rainfall rapidly surges from 42mm to 120mm.',
    infrastructure: [],
    alertActive: false,
    recommendedAction: null,
  },
  {
    step: 3,
    title: 'SOIL PORE SATURATION ELEVATION',
    subtitle: 'Sub-surface Moisture Exceeds Critical Limits',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 65,
    riskLevel: 'HIGH' as const,
    focusId: 'east-khasi-hills',
    narration: 'In-situ piezometers & SMAP satellite radiometer confirm volumetric soil saturation crossing 91%. Excessive pore pressure significantly reduces shear resistance.',
    infrastructure: [],
    alertActive: false,
    recommendedAction: null,
  },
  {
    step: 4,
    title: 'AI DETECTS SLOPE INSTABILITY',
    subtitle: 'Risk Escalates: 24 LOW → 43 MODERATE → 72 HIGH → 87 CRITICAL',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Ensemble XGBoost + LSTM model recalculates multivariate risk vectors in real-time. Instability threshold breached: score escalates to 87/100 CRITICAL.',
    infrastructure: [],
    alertActive: true,
    recommendedAction: null,
  },
  {
    step: 5,
    title: 'CAMERA FLIES TO EAST KHASI HILLS',
    subtitle: 'Autonomous GIS Hotspot Teleport',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'System automatically centers GIS coordinates on focal hazard scarp (25.5788° N, 91.8933° E) at 1,480m elevation.',
    infrastructure: [],
    alertActive: true,
    recommendedAction: null,
  },
  {
    step: 6,
    title: 'TERRAIN ZONE HIGHLIGHTED',
    subtitle: 'Pulsing Critical Hazard Aura',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Hazard buffer polygon expands with flashing critical red aura, identifying high shear stress and rotational slip geometry.',
    infrastructure: [],
    alertActive: true,
    recommendedAction: null,
  },
  {
    step: 7,
    title: 'AFFECTED INFRASTRUCTURE IDENTIFIED',
    subtitle: 'Corridors Exposed: NH-10 Highway & Mawmluh Village',
    location: 'East Khasi Hills & Cherrapunji',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Spatial proximity analysis identifies NH-10 highway corridor within 1.8km hazard buffer and Mawmluh settlement (1,200 residents) in downstream runout zone.',
    infrastructure: [
      { name: 'NH-10 Highway Corridor', type: 'Major Road', exposure: 'HIGH', dist: '1.8 km' },
      { name: 'Mawmluh Village Settlement', type: 'Residential', exposure: 'CRITICAL', dist: '0.9 km' },
    ],
    alertActive: true,
    recommendedAction: null,
  },
  {
    step: 8,
    title: 'EARLY WARNING GENERATED',
    subtitle: 'Decision-Support Alert Dispatch Initiated',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Automated Common Alerting Protocol (CAP) payload dispatched to State Disaster Management Authority (SDMA) and District Magistrates.',
    infrastructure: [
      { name: 'NH-10 Highway Corridor', type: 'Major Road', exposure: 'HIGH', dist: '1.8 km' },
      { name: 'Mawmluh Village Settlement', type: 'Residential', exposure: 'CRITICAL', dist: '0.9 km' },
    ],
    alertActive: true,
    recommendedAction: 'Issue traffic restrictions & evacuation preparedness.',
  },
  {
    step: 9,
    title: 'DECISION-SUPPORT RECOMMENDATIONS ISSUED',
    subtitle: 'Action Directives for Regional Administration',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Action Engine directives: 1. Highway inspection on NH-10. 2. Evacuation preparedness for Mawmluh. 3. NDRF rescue battalions placed on active standby.',
    infrastructure: [
      { name: 'NH-10 Highway Corridor', type: 'Major Road', exposure: 'HIGH', dist: '1.8 km' },
      { name: 'Mawmluh Village Settlement', type: 'Residential', exposure: 'CRITICAL', dist: '0.9 km' },
    ],
    alertActive: true,
    recommendedAction: '1. Road Inspection  2. Community Advisory  3. NDRF Standby',
  },
  {
    step: 10,
    title: 'EARLY WARNING GENERATED — SUMMARY',
    subtitle: 'EAST KHASI HILLS: 87 / 100 CRITICAL',
    location: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall: 168,
    moisture: 91,
    slope: 38,
    riskScore: 87,
    riskLevel: 'CRITICAL' as const,
    focusId: 'east-khasi-hills',
    narration: 'Early Warning Successfully Generated. Automated AI intelligence provides vital lead time to protect lives and infrastructure before slope failure.',
    infrastructure: [
      { name: 'NH-10 Highway Corridor', type: 'Major Road', exposure: 'HIGH', dist: '1.8 km' },
      { name: 'Mawmluh Village Settlement', type: 'Residential', exposure: 'CRITICAL', dist: '0.9 km' },
    ],
    alertActive: true,
    recommendedAction: 'Decision-support recommendation generated & acknowledged.',
  },
];

export const PresentationDemoModal: React.FC<PresentationDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectLocation,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = presentationScenes[currentStepIndex];

  useEffect(() => {
    if (!isOpen) return;

    onSelectLocation(scene.focusId);

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= presentationScenes.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 3600);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, onSelectLocation, scene.focusId]);

  if (!isOpen) return null;

  const handlePausePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, presentationScenes.length - 1));
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onSelectLocation('east-khasi-hills');
  };

  const riskColor = getRiskColor(scene.riskLevel);

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] text-slate-100 flex flex-col overflow-hidden animate-fade-in select-none">
      {/* 1. TOP CINEMATIC HEADER WITH CONTROLS (Requested in Section 16) */}
      <div className="h-16 px-6 border-b border-white/[0.08] bg-[#07111F]/80 backdrop-blur-2xl flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-heading tracking-tight">
                LANDSLIDEGUARD PRESENTATION MODE
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded">
                SCENE {scene.step} / {presentationScenes.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Autonomous 45-Second AI & GIS Disaster Demonstration for Hackathon Judges
            </p>
          </div>
        </div>

        {/* Presentation Controls: PAUSE, SKIP, RESET, EXIT (Requested in Section 16) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePausePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1728] border border-white/[0.1] text-xs font-bold text-slate-200 hover:bg-white/[0.06] transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1728] border border-white/[0.1] text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>SKIP</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1728] border border-white/[0.1] text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>RESET</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-black hover:bg-rose-600/30 transition-all ml-2"
          >
            <X className="w-4 h-4" />
            <span>EXIT PRESENTATION</span>
          </button>
        </div>
      </div>

      {/* 2. PROGRESS TIMELINE BAR */}
      <div className="w-full bg-[#07111F] flex h-1.5">
        {presentationScenes.map((s, idx) => (
          <div
            key={s.step}
            onClick={() => {
              setCurrentStepIndex(idx);
              setIsPlaying(false);
            }}
            className={`h-full flex-1 cursor-pointer transition-all duration-300 ${
              idx === currentStepIndex
                ? 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,1)]'
                : idx < currentStepIndex
                ? 'bg-blue-600'
                : 'bg-white/[0.06]'
            }`}
          />
        ))}
      </div>

      {/* 3. MAIN CINEMATIC STAGE: SPLIT-SCREEN 3D TERRAIN + STORY NARRATIVE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        {/* LEFT 65% (8 cols): 3D TERRAIN VISUALIZATION */}
        <div className="lg:col-span-8 h-full relative">
          <Terrain3D selectedLocationId={scene.focusId} onSelectHotspot={onSelectLocation} />

          {/* Critical Aura Overlay if alert active */}
          {scene.alertActive && (
            <div className="absolute inset-0 pointer-events-none border-4 border-rose-500/30 critical-flash-border z-10" />
          )}
        </div>

        {/* RIGHT 35% (4 cols): CINEMATIC STORYTELLING & DATA FEED */}
        <div className="lg:col-span-4 h-full bg-[#07111F]/95 border-l border-white/[0.08] p-6 flex flex-col justify-between overflow-y-auto space-y-4 backdrop-blur-xl">
          <div className="space-y-4">
            {/* Scene Subtitle Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                SCENE {scene.step}: {scene.subtitle}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {scene.state}
              </span>
            </div>

            {/* Scene Main Heading */}
            <h2 className="text-2xl font-black text-white font-heading tracking-tight leading-snug">
              {scene.title}
            </h2>

            {/* Narrative Story Description */}
            <div className="bg-[#0B1728] border border-white/[0.08] p-4 rounded-2xl text-xs text-slate-200 leading-relaxed shadow-lg font-sans">
              {scene.narration}
            </div>

            {/* Risk Gauge Bar */}
            <div className="glass-panel p-4 bg-[#0B1728] border-white/[0.08] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono">AI INSTABILITY SCORE:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono" style={{ color: riskColor }}>
                    {scene.riskScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  <span
                    className="ml-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{
                      color: riskColor,
                      borderColor: `${riskColor}50`,
                      backgroundColor: `${riskColor}15`,
                    }}
                  >
                    {scene.riskLevel}
                  </span>
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${scene.riskScore}%`,
                    backgroundColor: riskColor,
                  }}
                />
              </div>
            </div>

            {/* Telemetry Sensor Readouts */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-[#0B1728] p-2.5 rounded-xl border border-white/[0.06]">
                <p className="text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-blue-400" /> RAIN
                </p>
                <p className="text-white font-bold mt-1">{scene.rainfall} mm</p>
              </div>
              <div className="bg-[#0B1728] p-2.5 rounded-xl border border-white/[0.06]">
                <p className="text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-400" /> MOISTURE
                </p>
                <p className="text-white font-bold mt-1">{scene.moisture}%</p>
              </div>
              <div className="bg-[#0B1728] p-2.5 rounded-xl border border-white/[0.06]">
                <p className="text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <Mountain className="w-3 h-3 text-orange-400" /> SLOPE
                </p>
                <p className="text-white font-bold mt-1">{scene.slope}°</p>
              </div>
            </div>

            {/* Exposed Infrastructure (Scene 7 onwards) */}
            {scene.infrastructure.length > 0 && (
              <div className="glass-panel p-3.5 bg-[#0B1728] border-rose-500/30 space-y-2">
                <p className="text-[10px] font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> High Hazard Exposure Zones:
                </p>
                <div className="space-y-1.5">
                  {scene.infrastructure.map(item => (
                    <div
                      key={item.name}
                      className="bg-[#07111F] p-2 rounded-lg border border-white/[0.04] flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <p className="text-white font-bold">{item.name}</p>
                        <p className="text-[9px] text-slate-400">{item.type} • Dist: {item.dist}</p>
                      </div>
                      <span className="text-rose-400 font-bold text-[10px]">{item.exposure}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Action (Scene 8 onwards) */}
            {scene.recommendedAction && (
              <div className="bg-emerald-950/20 border border-emerald-500/40 p-3.5 rounded-2xl space-y-1 text-xs">
                <p className="text-emerald-400 font-black flex items-center gap-1.5 font-mono text-[10px] uppercase">
                  <Shield className="w-3.5 h-3.5" /> Decision-Support Recommendation:
                </p>
                <p className="text-slate-200 font-medium">
                  {scene.recommendedAction}
                </p>
              </div>
            )}
          </div>

          {/* Quick jump to live map / warning at end */}
          <div className="pt-2 border-t border-white/[0.08] flex gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('map');
              }}
              className="flex-1 py-2.5 rounded-xl bg-blue-600/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-blue-600/30 transition-all text-center"
            >
              EXPLORE GIS MAP
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('warnings');
              }}
              className="flex-1 py-2.5 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-600/30 transition-all text-center"
            >
              EARLY WARNINGS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationDemoModal;
