"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/lib/store";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart, Share2, MoreHorizontal, Maximize2, Mic2
} from "lucide-react";

export function GlobalPlayer() {
  const { currentTrack, isPlaying, volume, progress, togglePlay, setVolume, setProgress } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => togglePlay());
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, togglePlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const handleTimeUpdate = () => {
    if (audioRef.current && duration > 0) {
      setProgress((audioRef.current.currentTime / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) {
    return (
      <div className="h-[96px] border-t border-white/5 bg-zinc-950/80 backdrop-blur-2xl text-zinc-500 flex items-center justify-center text-xs px-6 z-50">
        <Mic2 className="h-4 w-4 mr-2 opacity-50" />
        Select a track from your library to start playing
      </div>
    );
  }

  return (
    <div className="h-[96px] border-t border-white/10 bg-zinc-950/70 backdrop-blur-3xl flex items-center justify-between px-4 lg:px-8 relative z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => togglePlay()}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
        <div className="h-16 w-16 rounded-xl bg-zinc-900 overflow-hidden shrink-0 relative group shadow-lg ring-1 ring-white/10">
          {currentTrack.coverUrl ? (
            <img src={currentTrack.coverUrl} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse-glow" />
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
          >
            <Maximize2 className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-zinc-100 truncate hover:underline hover:text-violet-400 cursor-pointer transition-colors">{currentTrack.title}</p>
          <p className="text-[13px] text-zinc-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
        </div>
        <button className="text-zinc-500 hover:text-violet-500 transition-colors ml-4 hidden sm:block">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center max-w-[45%] w-full px-4">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-violet-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
          </button>

          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full max-w-[500px] group">
          <span className="text-[11px] font-medium text-zinc-500 w-10 text-right font-mono">
            {formatTime((progress / 100) * duration)}
          </span>
          <div className="relative flex-1 h-1.5 flex items-center">
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 group-hover:from-violet-400 group-hover:to-indigo-300 transition-colors rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                {/* Thumb Dot */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2" />
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-zinc-500 w-10 text-left font-mono">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="flex items-center justify-end gap-5 w-1/3 min-w-[150px] hidden md:flex">
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Mic2 className="h-4 w-4" />
        </button>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <button onClick={() => setMuted(!muted)} className="text-zinc-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <div className="relative w-24 h-1.5 flex items-center group">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (Number(e.target.value) > 0) setMuted(false);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-300 group-hover:bg-violet-400 transition-colors rounded-full"
                style={{ width: `${(muted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
