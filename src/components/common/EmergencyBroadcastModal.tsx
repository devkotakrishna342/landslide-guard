import React, { useState } from 'react';
import { X, Send, Radio, CheckCircle2, AlertTriangle } from 'lucide-react';
import { alertRecipients } from '../../data/mockData';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({ isOpen, onClose }) => {
  const [broadcasting, setBroadcasting] = useState(false);
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState(
    '🚨 EMERGENCY BROADCAST: Critical Landslide Early Warning issued for East Khasi Hills (Score 87/100). Evacuation preparedness & highway traffic restrictions recommended.'
  );

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setBroadcasting(true);
    alertRecipients.forEach((r, idx) => {
      setTimeout(() => {
        setDispatchedIds(prev => [...prev, r.id]);
        if (idx === alertRecipients.length - 1) {
          setBroadcasting(false);
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="glass-panel-elevated max-w-xl w-full p-6 bg-[#07111F] border-rose-500/50 shadow-2xl rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-heading">
                  EMERGENCY DISASTER BROADCAST GATEWAY
                </h2>
                <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  CAP v1.2
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct multi-channel alert dispatch to emergency responder networks</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            Broadcast Payload Message
          </label>
          <textarea
            value={selectedMessage}
            onChange={e => setSelectedMessage(e.target.value)}
            rows={3}
            className="w-full bg-[#0B1728] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-rose-500/60 font-sans"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Configured Dispatch Channels
          </p>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {alertRecipients.map(r => {
              const isDone = dispatchedIds.includes(r.id);
              return (
                <div
                  key={r.id}
                  className="bg-[#0B1728] border border-white/[0.06] rounded-xl p-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <div>
                      <p className="font-bold text-white">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.method}</p>
                    </div>
                  </div>
                  <div>
                    {isDone ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SENT
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">READY</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0B1728] border border-white/[0.06] p-2.5 rounded-xl text-[10px] text-amber-400 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Prototype simulation: clearly marked simulated data for SIH26001. No external sirens activated.</span>
        </div>

        <button
          onClick={handleBroadcast}
          disabled={broadcasting || dispatchedIds.length === alertRecipients.length}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50 active:scale-95"
        >
          <Send className="w-4 h-4" />
          {dispatchedIds.length === alertRecipients.length
            ? '✅ ALL EMERGENCY BROADCAST CHANNELS DISPATCHED'
            : broadcasting
            ? 'BROADCASTING EMERGENCY ALERTS...'
            : 'TRANSMIT MULTI-CHANNEL EMERGENCY BROADCAST NOW'}
        </button>
      </div>
    </div>
  );
};

export default EmergencyBroadcastModal;
