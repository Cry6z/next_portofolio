"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    title: "Midnight Drive",
    artist: "Synthwave Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    title: "Neon Horizon",
    artist: "Chill Chillhop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Cyber Drip",
    artist: "Ambient Vaporwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default 50% volume
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set up audio source and volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Audio playback error:", err);
        }
      });
    }
  };

  // Change Track
  const changeTrack = (direction: "next" | "prev") => {
    let nextIndex = currentTrackIndex;
    if (direction === "next") {
      nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
    setTrackProgress(0);
    setCurrentTime(0);

    // Cancel any pending playback triggers to avoid AbortError overlapping load requests
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Audio element source update and autoplay
    timeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (_) {}

        audioRef.current.src = TRACKS[nextIndex].url;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to autoplay next track:", err);
          }
        });
      }
    }, 50);
  };

  // Track Time Update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    setCurrentTime(current);
    if (total > 0) {
      setTrackProgress((current / total) * 100);
    }
  };

  // Track Loaded Metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Track Ended
  const handleTrackEnded = () => {
    changeTrack("next");
  };

  // Drag Progress Slider
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || duration === 0) return;
    const newProgress = Number(e.target.value);
    const newTime = (newProgress / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setTrackProgress(newProgress);
  };

  // Format Time (MM:SS)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Equalizer animation variants
  const eqBarVariants: Variants = {
    playing: (i: number) => ({
      scaleY: [1, 2.8, 0.6, 2.2, 1.3, 2.6, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: i * 0.12,
        ease: "easeInOut" as const,
      },
    }),
    paused: {
      scaleY: 0.15,
      transition: { duration: 0.4 },
    },
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 font-mono select-none">
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
      />

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ================= COLLAPSED DECK PILL ================= */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsExpanded(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex items-center gap-3 bg-background/80 border border-border-custom/80 text-foreground px-4 py-3 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer select-none transition-all duration-300 hover:border-foreground/45"
          >
            {/* Spinning Monochrome Disc */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center text-foreground shrink-0"
            >
              <Disc className="h-6 w-6" />
            </motion.div>

            {/* Glowing Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-4 w-6 shrink-0 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={eqBarVariants}
                  animate={isPlaying ? "playing" : "paused"}
                  className="w-1 bg-foreground rounded-full origin-bottom"
                  style={{ height: "100%" }}
                />
              ))}
            </div>

            {/* Expand Indicator */}
            <ChevronUp className="h-4 w-4 text-foreground/40" />

            {/* Float Tooltip */}
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -45 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-1/2 -translate-x-1/2 bg-background border border-border-custom text-foreground text-[10px] py-1 px-3 rounded shadow-md whitespace-nowrap"
              >
                {isPlaying ? `Playing: ${currentTrack.title}` : "Play Ambient Lo-Fi Beats"}
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ================= EXPANDED PREMIUM DECK ================= */
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-72 bg-background/85 border border-border-custom text-foreground p-5 rounded-2xl backdrop-blur-md shadow-[0_0_35px_rgba(0,0,0,0.35)]"
          >
            {/* Header Deck Panel */}
            <div className="flex items-center justify-between border-b border-border-custom/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-foreground animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">LO-FI PLAYER</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-foreground/10 text-foreground/60 hover:text-foreground rounded transition-all cursor-pointer border-none outline-none"
                aria-label="Collapse player"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Track Info Screen */}
            <div className="bg-foreground/5 border border-border-custom/40 rounded-xl p-3.5 mb-4 shadow-inner flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute right-3 top-3 flex items-end gap-0.5 h-6 w-8 overflow-hidden select-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={eqBarVariants}
                    animate={isPlaying ? "playing" : "paused"}
                    className="w-1 bg-foreground rounded-full origin-bottom"
                    style={{ height: "100%" }}
                  />
                ))}
              </div>

              <div className="text-xs font-bold text-foreground truncate pr-8 max-w-[160px]" title={currentTrack.title}>
                {currentTrack.title}
              </div>
              <div className="text-[9px] text-foreground/45 truncate max-w-[160px]">
                {currentTrack.artist}
              </div>
              <div className="flex justify-between items-center text-[8px] text-foreground/50 mt-3.5">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : "00:00"}</span>
              </div>
            </div>

            {/* Dynamic Slider Bar */}
            <div className="px-1 mb-4 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={trackProgress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-foreground outline-none focus:outline-none"
              />
            </div>

            {/* Central Controls */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <button
                type="button"
                onClick={() => changeTrack("prev")}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-full hover:bg-foreground/10 transition-colors cursor-pointer border-none outline-none"
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="h-11 w-11 bg-foreground/5 hover:bg-foreground/15 border border-border-custom text-foreground rounded-full flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:border-foreground/80 cursor-pointer outline-none shrink-0"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => changeTrack("next")}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-full hover:bg-foreground/10 transition-colors cursor-pointer border-none outline-none"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Volume Deck Panel */}
            <div className="flex items-center gap-3 border-t border-border-custom/50 pt-3">
              <Volume2 className="h-3.5 w-3.5 text-foreground/40 shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-foreground outline-none focus:outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
