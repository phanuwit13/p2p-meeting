import { useState } from 'react';

interface ConnectPanelProps {
  myId: string;
  onCall: (peerId: string) => void;
}

export function ConnectPanel({ myId, onCall }: ConnectPanelProps) {
  const [peerId, setPeerId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!myId) return;
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (peerId.trim()) onCall(peerId.trim());
  };

  return (
    <div className="bg-zinc-900 border border-white/8 rounded-2xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">
      {/* My ID section */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Your Meeting ID</p>

        <div className="flex items-center gap-2 bg-zinc-800 border border-white/6 rounded-xl px-4 py-3">
          <code className="flex-1 text-blue-400 font-mono text-xs break-all leading-relaxed min-w-0">
            {myId || 'Connecting…'}
          </code>
          <button
            onClick={handleCopy}
            disabled={!myId}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <p className="text-[12px] text-zinc-600">Share this with the person you want to call.</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/6" />

      {/* Call section */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Join a call</p>
        <input
          type="text"
          placeholder="Paste their Meeting ID…"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCall()}
          className="w-full bg-zinc-800 border border-white/6 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
        />
        <button
          onClick={handleCall}
          disabled={!peerId.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors"
        >
          Join Call
        </button>
      </div>
    </div>
  );
}
