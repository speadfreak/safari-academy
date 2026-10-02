'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'

interface Props {
  src: string
  poster?: string
  className?: string
  title?: string
}

/**
 * Lightweight, lazy-loading video player.
 * - Only loads the video when the user clicks play (saves bandwidth).
 * - Uses poster image as placeholder until playback.
 * - Compressed H.264 + faststart MP4s for instant seeking.
 * - Custom controls (play/pause, mute, fullscreen) with smooth UX.
 */
export function LazyVideo({ src, poster, className = '', title }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [started, setStarted] = useState(false)

  const togglePlay = async () => {
    const v = ref.current
    if (!v) return
    if (!started) setStarted(true)
    if (v.paused) {
      try {
        v.muted = false
        setMuted(false)
        await v.play()
        setPlaying(true)
      } catch {
        // autoplay might be blocked; try muted
        v.muted = true
        setMuted(true)
        await v.play()
        setPlaying(true)
      }
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const fullscreen = () => {
    const c = containerRef.current
    if (!c) return
    if (document.fullscreenElement) document.exitFullscreen()
    else c.requestFullscreen?.()
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      <video
        ref={ref}
        src={started ? src : undefined}
        poster={poster}
        preload="none"
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />
      {/* Center play button overlay (when not playing) */}
      {!playing && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40 transition"
        >
          <span className="grid place-items-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#FFD500] text-[#06130B] shadow-2xl pulse-glow">
            <Play className="h-7 w-7 md:h-9 md:w-9 ml-1" fill="currentColor" />
          </span>
        </button>
      )}
      {/* Custom controls (when playing) */}
      {playing && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-[#FFD500]" aria-label="Pause">
            <Pause className="h-5 w-5" fill="currentColor" />
          </button>
          <button onClick={toggleMute} className="text-white hover:text-[#FFD500]" aria-label="Mute">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button onClick={fullscreen} className="text-white hover:text-[#FFD500] ml-auto" aria-label="Fullscreen">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      )}
      {title && !playing && (
        <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold drop-shadow-lg">{title}</div>
      )}
    </div>
  )
}
