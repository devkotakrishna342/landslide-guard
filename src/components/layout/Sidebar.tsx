import React from 'react';
import type { Page } from '../../types';
import {
  LayoutDashboard,
  Map,
  Brain,
  AlertTriangle,
  BarChart3,
  Clock,
  Building2,
  Settings,
  Shield,
  Activity,
  Satellite,
  Cpu,
  ChevronLeft,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  activeAlertCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavSection {
  title: string;
  items: {
    page: Page;
    icon: React.ElementType;
    label: string;
    badge?: boolean;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'MONITOR',
    items: [
      { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { page: 'map', icon: Map, label: 'Live Risk Map' },
    ],
  },
  {
    title: 'PREDICT',
    items: [
      { page: 'prediction', icon: Brain, label: 'AI Prediction' },
    ],
  },
  {
    title: 'RESPOND',
    items: [
      { page: 'warnings', icon: AlertTriangle, label: 'Early Warnings', badge: true },
    ],
  },
  {
    title: 'ANALYSE',
    items: [
      { page: 'analysis', icon: BarChart3, label: 'Risk Analytics' },
      { page: 'historical', icon: Clock, label: 'Historical Events' },
      { page: 'satellite', icon: Satellite, label: 'Satellite Intelligence' },
    ],
  },
  {
    title: 'EXPOSURE',
    items: [
      { page: 'infrastructure', icon: Building2, label: 'Infrastructure' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { page: 'architecture', icon: Cpu, label: 'Architecture' },
      { page: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  activeAlertCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`h-full bg-[#030712]/95 border-r border-white/[0.08] flex flex-col flex-shrink-0 z-40 relative backdrop-blur-2xl transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in whitespace-nowrap">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-white tracking-tight font-heading">LANDSLIDE</span>
                <span className="text-sm font-black text-cyan-400 tracking-tight font-heading">GUARD</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-300/90 font-mono">
                  NER EDITION
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map(section => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">
                {section.title}
              </div>
            )}
            {section.items.map(({ page, icon: Icon, label, badge }) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => onNavigate(page)}
                  title={isCollapsed ? label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-between'
                  } px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 via-cyan-500/15 to-transparent text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Left animated accent line on active */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-glow" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors flex-shrink-0 ${
                        isActive
                          ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                  </div>

                  {!isCollapsed && badge && activeAlertCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm shadow-rose-500/40">
                      {activeAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Branding */}
      <div className="p-3.5 border-t border-white/[0.08] bg-[#07111F]/60">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} text-slate-400 text-xs font-medium`}>
          <Activity className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-slate-300">Ministry of DoNER</span>}
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 font-mono">
            <span>SIH26001</span>
            <span className="text-emerald-400">● Live AI Grid</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
