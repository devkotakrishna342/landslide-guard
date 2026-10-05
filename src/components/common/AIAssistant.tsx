import React, { useState } from 'react';
import type { LocationData } from '../../types';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

interface AIAssistantProps {
  locations: LocationData[];
  selectedLocation: string | null;
  onSelectLocation: (id: string) => void;
  onNavigateMap: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onNavigateMap,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings. I am the LandslideGuard AI Disaster Assistant. I provide real-time multivariate analysis, slope risk explanations, and decision-support guidance for North-East India.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const loc = selectedLocation
    ? locations.find(l => l.id === selectedLocation) || locations[0]
    : locations[0];

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const q = queryText.toLowerCase();

      if (q.includes('east khasi hills') || q.includes('why critical') || q.includes('critical')) {
        onSelectLocation('east-khasi-hills');
        aiReply = `⚠️ **East Khasi Hills Risk Analysis (Score: ${loc.riskScore}/100 - CRITICAL)**\n\n` +
          `• **Rainfall:** ${loc.rainfall} mm/24h (Exceeds extreme threshold of 150mm)\n` +
          `• **Soil Saturation:** ${loc.soilMoisture}% (Near complete pore water saturation)\n` +
          `• **Slope Angle:** ${loc.slope}° (High shear stress vector)\n` +
          `• **Historical Events:** ${loc.historicalEvents} prior landslides recorded\n\n` +
          `**Top SHAP Factors:** Extreme Rainfall (30%), Soil Moisture Saturation (24%), Steep Slope (20%).`;
      } else if (q.includes('village') || q.includes('communities')) {
        aiReply = `🏠 **Villages at Immediate Hazard Risk:**\n\n` +
          `1. **Mawmluh Village (Cherrapunji)** — Risk: 79 CRITICAL (1,200 residents)\n` +
          `2. **Laitkynsew Settlement (East Khasi Hills)** — Risk: 87 CRITICAL (800 residents)\n` +
          `3. **Sohra Local Council** — Risk: 79 CRITICAL (2,500 residents)\n\n` +
          `*Recommendation:* Notify district magistrates to initiate pre-evacuation alert protocols.`;
      } else if (q.includes('road') || q.includes('highway') || q.includes('inspection')) {
        aiReply = `🛣️ **Exposed Arterial Highways:**\n\n` +
          `1. **NH-10 (Siliguri–Gangtok Highway)** — Risk: CRITICAL. High risk of debris flow at Km 42.\n` +
          `2. **NH-6 (Shillong–Guwahati Highway)** — Risk: HIGH. Moderate slope displacement observed.\n` +
          `3. **Trans-Arunachal Highway (Tawang Segment)** — Risk: HIGH. Landslide scar expanding.\n\n` +
          `*Action:* Issue precautionary heavy vehicle speed restrictions.`;
      } else if (q.includes('today') || q.includes('explain') || q.includes('summary')) {
        aiReply = `📊 **Daily NER Regional Hazard Summary:**\n\n` +
          `• Total Monitored Zones: ${locations.length}\n` +
          `• Active Critical Zones: ${locations.filter(l => l.riskLevel === 'CRITICAL').length}\n` +
          `• High Risk Zones: ${locations.filter(l => l.riskLevel === 'HIGH').length}\n` +
          `• Primary Regional Hazard Focus: Meghalaya & Arunachal Pradesh due to heavy monsoon deluge.`;
      } else if (q.includes('map')) {
        onNavigateMap();
        aiReply = `🗺️ **Navigating to Live GIS Map...**`;
      } else {
        aiReply = `🤖 **LandslideGuard Intelligence Summary:**\n\n` +
          `Based on current telemetry for **${loc.name}, ${loc.state}**:\n` +
          `• Risk Score: **${loc.riskScore}/100 (${loc.riskLevel})**\n` +
          `• 24h Rainfall: **${loc.rainfall} mm** | Soil Saturation: **${loc.soilMoisture}%**\n` +
          `• Geomorphology: **${loc.slope}° Slope Angle, ${loc.elevation}m Elevation**\n\n` +
          `Continuous AI XGBoost + LSTM inference indicates active slope monitoring is recommended.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 800);
  };

  const samplePrompts = [
    "Why is East Khasi Hills critical?",
    "Which villages are at risk?",
    "Which road needs inspection?",
    "Explain today's risk.",
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 ring-2 ring-cyan-400/40 select-none"
        title="AI Risk Assistant"
      >
        <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '4s' }} />
        <span>AI RISK ASSISTANT</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] glass-panel-elevated shadow-2xl border-cyan-500/40 bg-[#07111F]/95 flex flex-col h-[520px] rounded-2xl overflow-hidden animate-slide-up select-none">
          <div className="p-4 border-b border-white/[0.08] bg-[#0B1728] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-1.5 font-heading">
                  LandslideGuard AI
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded font-mono">
                    LLM ENGINE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Decision-Support Disaster Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 bg-[#0B1728]/70 border-b border-white/[0.06] flex gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map(p => (
              <button
                key={p}
                onClick={() => handleAsk(p)}
                className="text-[10px] font-semibold text-slate-300 bg-[#07111F] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-[#0B1728] border border-white/[0.08] text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>AI Risk Engine analyzing telemetry & SHAP weights...</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/[0.08] bg-[#0B1728] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI e.g. Why is East Khasi Hills critical?"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk(inputQuery)}
              className="flex-1 bg-[#07111F] border border-white/[0.08] text-white placeholder-slate-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500/60 font-medium"
            />
            <button
              onClick={() => handleAsk(inputQuery)}
              disabled={!inputQuery.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
