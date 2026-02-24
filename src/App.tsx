import { useState } from 'react';
import { usePeer } from './hooks/usePeer';
import { VideoTile } from './components/VideoTile';
import { ConnectPanel } from './components/ConnectPanel';
import { ControlBar } from './components/ControlBar';

export default function App() {
  const { myId, localStream, remoteStream, isCalling, callPeer, hangUp } = usePeer();
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((v) => !v);
  };

  const toggleCam = () => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCamOff((v) => !v);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* ── Header ── */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/6 bg-zinc-900/80 backdrop-blur-sm z-20">
        <span className="text-sm font-semibold tracking-tight text-white">P2P Meet</span>
        {isCalling && (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-1 rounded-full animate-pulse">
            ● Live
          </span>
        )}
      </header>

      {/* ── Video Area ── */}
      <main className="relative flex-1 overflow-hidden">
        {remoteStream ? (
          /* ── Active call: remote full-screen, local PiP ── */
          <>
            {/* Remote — fills whole area */}
            <div className="absolute inset-0">
              <VideoTile stream={remoteStream} label="Remote" featured />
            </div>

            {/* Local — picture-in-picture bottom-right */}
            <div className="absolute bottom-24 right-4 w-44 aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10">
              <VideoTile stream={localStream} label="You" muted mirror />
            </div>
          </>
        ) : (
          /* ── Lobby: local video behind a centered panel ── */
          <>
            {/* Local video fills background */}
            <div className="absolute inset-0">
              <VideoTile
                stream={localStream}
                label=""
                muted
                mirror
                placeholder="Starting camera…"
              />
            </div>

            {/* Dark overlay + ConnectPanel centered */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-10">
              <ConnectPanel myId={myId} onCall={callPeer} />
            </div>
          </>
        )}
      </main>

      {/* ── Control Bar ── */}
      <ControlBar
        isMuted={isMuted}
        isCamOff={isCamOff}
        isCalling={isCalling}
        onToggleMute={toggleMute}
        onToggleCam={toggleCam}
        onHangUp={hangUp}
      />
    </div>
  );
}