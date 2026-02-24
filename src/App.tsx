import { useEffect, useState } from 'react'
import { usePeer } from './hooks/usePeer'
import { VideoTile } from './components/VideoTile'
import { ConnectPanel } from './components/ConnectPanel'
import { ControlBar } from './components/ControlBar'
import { cn } from './lib/utils'

const checkMobile = (userAgentString: string) => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgentString,
  )
}

export default function App() {
  const { myId, localStream, remoteStream, isCalling, callPeer, hangUp } =
    usePeer()
  const [isMuted, setIsMuted] = useState(true)
  const [isCamOff, setIsCamOff] = useState(false)
  const [isVideoPartial, setIsVideoPartial] = useState(false)

  const isMobile = checkMobile(navigator.userAgent)

  // Default: mic OFF — disable audio tracks as soon as stream is available
  useEffect(() => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = false))
  }, [localStream])

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled))
    setIsMuted((v) => !v)
  }

  const toggleCam = () => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled))
    setIsCamOff((v) => !v)
  }

  const resetMediaState = () => {
    // Reset mic to muted (default), cam to on
    localStream?.getAudioTracks().forEach((t) => (t.enabled = false))
    localStream?.getVideoTracks().forEach((t) => (t.enabled = true))
    setIsMuted(true)
    setIsCamOff(false)
  }

  const handleHangUp = () => {
    resetMediaState()
    hangUp()
  }

  // Reset mic/cam when remote peer disconnects
  useEffect(() => {
    if (!isCalling) {
      resetMediaState()
    }
  }, [isCalling])

  return (
    <div className='flex flex-col h-screen bg-zinc-950 text-white overflow-hidden'>
      {/* ── Header ── */}
      <header className='shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/6 bg-zinc-900/80 backdrop-blur-sm z-20'>
        <span className='text-sm font-semibold tracking-tight text-white'>
          P2P Meet
        </span>
        {isCalling && (
          <span className='text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-1 rounded-full animate-pulse'>
            ● Live
          </span>
        )}
      </header>

      {/* ── Video Area ── */}
      <main className='relative flex-1 overflow-hidden'>
        {remoteStream ? (
          /* ── Active call: remote full-screen, local PiP ── */
          <>
            {/* Remote — fills whole area */}
            <div
              className={cn('absolute inset-0', {
                'h-[calc(100dvh-52px)] w-auto aspect-9/16 mx-auto':
                  isVideoPartial,
                'w-full h-auto aspect-video my-auto': !isVideoPartial,
              })}
            >
              <VideoTile
                setIsVideoPartial={setIsVideoPartial}
                stream={remoteStream}
                label='Remote'
                featured
              />
            </div>

            {/* Local — picture-in-picture bottom-right */}
            <div
              className={cn(
                'absolute bottom-24 right-4 w-44 aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10',
                { 'h-40 w-auto aspect-3/4': isMobile },
              )}
            >
              <VideoTile stream={localStream} label='You' muted mirror />
            </div>
          </>
        ) : (
          /* ── Lobby: local video behind a centered panel ── */
          <>
            {/* Local video fills background */}
            <div className='absolute inset-0'>
              <VideoTile
                stream={localStream}
                label=''
                muted
                mirror
                placeholder='Starting camera…'
              />
            </div>

            {/* Dark overlay + ConnectPanel centered */}
            <div className='absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-10'>
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
        onHangUp={handleHangUp}
      />
    </div>
  )
}
