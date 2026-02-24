import { useEffect, useRef } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  mirror?: boolean;
  placeholder?: string;
  featured?: boolean;
}

export function VideoTile({ stream, label, muted = false, mirror = false, placeholder, featured = false }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative w-full h-full bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border ${featured ? 'border-blue-500/40' : 'border-white/5'}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`w-full h-full object-cover ${mirror ? '-scale-x-100' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">👤</div>
          {placeholder && <p className="text-sm">{placeholder}</p>}
        </div>
      )}

      {/* label badge */}
      <span className="absolute bottom-3 left-3 text-xs font-medium text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}
