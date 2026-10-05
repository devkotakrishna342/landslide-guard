import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../../types';
import { locations } from '../../data/mockData';
import {
  Bell,
  Search,
  User,
  X,
  ChevronRight,
  AlertTriangle,
  Radio,
  Clock,
  Play,
  Square,
  Activity,
  ShieldAlert,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onSelectLocation: (id: string) => void;
  alerts: number;
  isLiveTelemetry: boolean;
  onToggleLiveTelemetry: () => void;
  onStartDemo: () => void;
  onOpenBroadcast: () => void;
}

const liveNotifications = [
  { id: 1, level: 'CRITICAL' as const, msg: 'Critical risk breach — East Khasi Hills (87/100)', time: '23:15 IST', color: 'text-rose-400' },
  { id: 2, level: 'CRITICAL' as const, msg: 'Continuous heavy rainfall — Cherrapunji (79/100)', time: '22:48 IST', color: 'text-rose-400' },
  { id: 3, level: 'HIGH' as const, msg: 'Slope movement anomaly — Tawang (72/100)', time: '22:30 IST', color: 'text-orange-400' },
  { id: 4, level: 'HIGH' as const, msg: 'Rainfall threshold approaching — Gangtok', time: '21:55 IST', color: 'text-amber-400' },
  { id: 5, level: 'HIGH' as const, msg: 'Pore pressure update — Itanagar', time: '21:20 IST', color: 'text-orange-400' },
];

const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onSelectLocation,
  alerts,
  isLiveTelemetry,
  onToggleLiveTelemetry,
  onStartDemo,
  onOpenBroadcast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = searchQuery.trim().length > 0
    ? locations.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-16 bg-[#030712]/90 border-b border-white/[0.08] flex items-center justify-between px-6 z-30 flex-shrink-0 backdrop-blur-2xl">
      {/* Left: Instant Geo-Search */}
      <div className="relative flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search hill zones, highways, districts..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="w-full bg-[#07111F] border border-white/[0.08] text-slate-200 placeholder-slate-400 rounded-xl pl-10 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {showSearch && filtered.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 glass-panel-elevated bg-[#0B1728] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.06]">
            {filtered.map(loc => (
              <button
                key={loc.id}
                onMouseDown={() => {
                  onSelectLocation(loc.id);
                  onNavigate('map');
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.06] transition-colors text-left"
              >
                <div>
                  <p className="text-xs font-bold text-white font-heading">{loc.name}</p>
                  <p className="text-[10px] text-slate-400">{loc.state}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-extrabold ${
                    loc.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                    loc.riskLevel === 'HIGH' ? 'text-orange-400' :
                    loc.riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {loc.riskScore} / 100
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center/Right: Action Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Live Telemetry Toggle */}
        <button
          onClick={onToggleLiveTelemetry}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isLiveTelemetry
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25'
              : 'bg-[#0B1728] text-slate-300 border border-white/[0.08] hover:bg-white/[0.06]'
          }`}
        >
          {isLiveTelemetry ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          <span>{isLiveTelemetry ? 'STOP TELEMETRY' : 'LIVE TELEMETRY'}</span>
          {isLiveTelemetry && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        </button>

        {/* Start Presentation Demo CTA */}
        <button
          onClick={onStartDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black hover:from-blue-500 hover:to-cyan-400 transition-all shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>PRESENTATION DEMO</span>
        </button>

        {/* Emergency Broadcast CTA */}
        <button
          onClick={onOpenBroadcast}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/15 border border-rose-500/40 text-rose-400 text-xs font-black hover:bg-rose-600/25 transition-all active:scale-95"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>EMERGENCY BROADCAST</span>
        </button>

        {/* Time / Telemetry sync */}
        <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0B1728] border border-white/[0.06] px-2.5 py-1 rounded-lg text-[10px] font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">TELEMETRY SYNCED</span>
          </div>
        </div>

        {/* Notifications Drawer */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#0B1728] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.06] transition-colors"
            title="System Alerts"
            aria-label="System Alerts"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {alerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-[#030712] animate-pulse">
                {alerts}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-panel-elevated bg-[#0B1728]/95 border border-white/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
                <h3 className="text-xs font-black text-white flex items-center gap-2 font-heading">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Live Operational Warnings
                </h3>
                <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                {liveNotifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-white/[0.04] transition-colors">
                    <p className={`text-xs font-semibold ${n.color}`}>{n.msg}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Admin Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-full flex items-center justify-center ring-2 ring-cyan-500/20 shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-none">Command Admin</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">NER Disaster Center</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
