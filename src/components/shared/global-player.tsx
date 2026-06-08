"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/lib/store";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart, Share2, MoreHorizontal, Maximize2
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
    // If no track is playing, we still show the player bar but empty
    return (
      <div className="h-[90px] border-t border-white/10 bg-[#0A0A0A] text-zinc-500 flex items-center justify-center text-xs px-6">
        Select a track from your library to start playing
      </div>
    );
  }

  return (
    <div className="h-[90px] border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between px-4 lg:px-6 relative z-50">
      
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
        <div className="h-14 w-14 rounded bg-zinc-800 overflow-hidden shrink-0 relative group">
          {currentTrack.coverUrl ? (
            <img src={currentTrack.coverUrl} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate hover:underline cursor-pointer">{currentTrack.title}</p>
          <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors ml-2 hidden sm:block">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center max-w-[45%] w-full px-4">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>

          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full max-w-[600px]">
          <span className="text-[10px] text-zinc-400 w-8 text-right">
            {formatTime((progress / 100) * duration)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="h-1 w-full rounded-full bg-zinc-800 appearance-none accent-white hover:accent-violet-500 cursor-pointer"
          />
          <span className="text-[10px] text-zinc-400 w-8 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-1/3 min-w-[150px] hidden md:flex">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={() => setMuted(!muted)} className="text-zinc-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
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
            className="h-1 w-20 rounded-full bg-zinc-800 appearance-none accent-white cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
