import { Mic, MicOff, Phone, Video, VideoOff } from 'lucide-react'

interface ControlBarProps {
  isMuted: boolean
  isCamOff: boolean
  isCalling: boolean
  onToggleMute: () => void
  onToggleCam: () => void
  onHangUp: () => void
}

interface CtrlBtnProps {
  onClick: () => void
  icon: React.ReactNode
  active?: boolean
  danger?: boolean
}

function CtrlBtn({ onClick, icon, active, danger }: CtrlBtnProps) {
  const base =
    'flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl cursor-pointer select-none transition-all active:scale-95'
  const variant = danger
    ? 'bg-red-600 hover:bg-red-500'
    : active
      ? 'bg-red-500/15 hover:bg-red-500/25'
      : 'bg-white/8 hover:bg-white/12'

  return (
    <button className={`${base} ${variant}`} onClick={onClick}>
      {icon}
    </button>
  )
}

export function ControlBar({
  isMuted,
  isCamOff,
  isCalling,
  onToggleMute,
  onToggleCam,
  onHangUp,
}: ControlBarProps) {
  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-zinc-900/90 border border-white/8 rounded-2xl px-3 py-2.5 shadow-2xl backdrop-blur-xl'>
      <CtrlBtn
        onClick={onToggleMute}
        icon={isMuted ? <MicOff /> : <Mic />}
        active={isMuted}
      />
      <CtrlBtn
        onClick={onToggleCam}
        icon={isCamOff ? <VideoOff /> : <Video />}
        active={isCamOff}
      />
      {isCalling && (
        <>
          <div className='w-px h-8 bg-white/10 mx-1' />
          <CtrlBtn onClick={onHangUp} icon={<Phone />} danger />
        </>
      )}
    </div>
  )
}
