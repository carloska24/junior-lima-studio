import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import type { PortfolioItem } from '@/types/studio';

interface StoryViewerProps {
  stories: PortfolioItem[];
  initialStoryIndex?: number;
  onClose: () => void;
  onNextCategory?: () => void;
  onPrevCategory?: () => void;
}

export function StoryViewer({
  stories,
  initialStoryIndex = 0,
  onClose,
  onNextCategory,
  onPrevCategory,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay
  const [progress, setProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const pausedAt = useRef<number>(0);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory.type === 'VIDEO';
  const STORY_DURATION = currentStory.duration || 5000;

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (onNextCategory) {
      onNextCategory();
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onNextCategory, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (onPrevCategory) {
      onPrevCategory();
    }
  }, [currentIndex, onPrevCategory]);

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => {
      const nextState = !prev;
      if (videoRef.current) {
        if (nextState) videoRef.current.pause();
        else videoRef.current.play();
      }
      if (nextState) pausedAt.current = Date.now();
      else {
        const now = Date.now();
        startTime.current += now - pausedAt.current;
      }
      return nextState;
    });
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  // Reset state on index change
  useEffect(() => {
    setProgress(0);
    setIsPaused(false);
    setIsVideoLoading(isVideo);
    startTime.current = Date.now();
    pausedAt.current = 0;
  }, [currentIndex, isVideo]);

  // Image Timer Logic
  useEffect(() => {
    if (isVideo || isPaused) {
      if (progressInterval.current) cancelAnimationFrame(progressInterval.current);
      return;
    }

    const animateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      const percentage = (elapsed / STORY_DURATION) * 100;

      if (percentage >= 100) {
        if (progressInterval.current) cancelAnimationFrame(progressInterval.current);
        handleNext();
      } else {
        setProgress(percentage);
        progressInterval.current = requestAnimationFrame(animateProgress);
      }
    };

    progressInterval.current = requestAnimationFrame(animateProgress);

    return () => {
      if (progressInterval.current) cancelAnimationFrame(progressInterval.current);
    };
  }, [currentIndex, isPaused, isVideo, STORY_DURATION, handleNext]);

  // Video Events
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !isPaused) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleVideoEnded = () => {
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background Blur (Desktop) */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${currentStory.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative w-full md:max-w-[450px] h-full md:h-[90vh] bg-midnight-950 md:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header: Progress Bars & Close */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 md:pt-4 bg-linear-to-b from-black/80 to-transparent">
          <div className="flex gap-1 mb-3">
            {stories.map((_, idx) => (
              <div key={idx} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: idx < currentIndex ? '100%' : '0%' }}
                  animate={{
                    width:
                      idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                  }}
                  transition={{ duration: 0, ease: 'linear' }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center overflow-hidden">
                <span className="font-serif text-gold-400 text-xs font-bold">JL</span>
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">
                {currentStory.category}
              </span>
              <span className="text-white/60 text-xs">• {idxToTimeAgo(currentIndex)}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mute Button (Shown only for video) */}
              {isVideo && (
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:text-gold-400 transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-gold-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className="flex-1 relative cursor-pointer bg-black"
          onPointerDown={handleTogglePause}
          onPointerUp={handleTogglePause}
          onPointerLeave={() => isPaused && handleTogglePause()} // Resume on leave if paused via hold
        >
          <AnimatePresence mode="wait">
            {isVideo && currentStory.videoUrl ? (
              <motion.div
                key={`video-${currentStory.id}`}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={currentStory.videoUrl}
                  poster={currentStory.imageUrl}
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                  muted={isMuted} // Controlled mute state
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  onWaiting={() => setIsVideoLoading(true)}
                  onCanPlay={() => setIsVideoLoading(false)}
                />
              </motion.div>
            ) : (
              <motion.img
                key={`img-${currentStory.id}`}
                src={currentStory.imageUrl}
                alt={currentStory.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0.8, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Gradient Overlay Bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

          {/* Caption / Title */}
          <div className="absolute bottom-0 inset-x-0 p-8 pb-12 z-10">
            <motion.div
              key={`text-${currentStory.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-serif text-white mb-2 shadow-black drop-shadow-lg">
                {currentStory.title}
              </h3>
              {currentStory.description && (
                <p className="text-offwhite-200 text-sm line-clamp-2 drop-shadow-md">
                  {currentStory.description}
                </p>
              )}
            </motion.div>
          </div>

          {/* Unified Interaction Layer (Swipe, Tap, Hold) */}
          <div
            className="absolute inset-0 z-10"
            onTouchStart={e => {
              const clientX = e.touches[0].clientX;

              // Logic for Hold-to-Pause
              if (!isPaused) handleTogglePause(); // Pause on touch down

              // Store start data for gesture detection
              e.currentTarget.dataset.startX = String(clientX);
              e.currentTarget.dataset.startTime = String(Date.now());
            }}
            onTouchEnd={e => {
              const startX = Number(e.currentTarget.dataset.startX || 0);
              const startTime = Number(e.currentTarget.dataset.startTime || 0);
              const endX = e.changedTouches[0].clientX;
              const endTime = Date.now();
              const screenWidth = window.innerWidth;

              // Resume on touch up
              if (isPaused) handleTogglePause();

              const deltaX = endX - startX;
              const duration = endTime - startTime;
              const isSwipe = Math.abs(deltaX) > 50; // Threshold for swipe
              const isShortTap = duration < 250; // Threshold for tap vs hold

              // 1. Handle Swipe
              if (isSwipe) {
                if (deltaX > 0)
                  handlePrev(); // Swipe Right -> Prev
                else handleNext(); // Swipe Left -> Next
                return;
              }

              // 2. Handle Tap (Only if it wasn't a long hold/drag)
              if (isShortTap) {
                // Left 30% goes back, Right 70% goes forward
                if (endX < screenWidth * 0.3) {
                  handlePrev();
                } else {
                  handleNext();
                }
              }
              // If it was a long hold (duration >= 250), we do nothing here (just resumed playback)
            }}
            // Mouse equivalents for desktop testing
            onMouseDown={e => {
              if (!isPaused) handleTogglePause();
              e.currentTarget.dataset.startTime = String(Date.now());
            }}
            onMouseUp={e => {
              if (isPaused) handleTogglePause();
              const startTime = Number(e.currentTarget.dataset.startTime || 0);
              if (Date.now() - startTime < 250) {
                const width = e.currentTarget.clientWidth;
                if (e.nativeEvent.offsetX < width * 0.3) handlePrev();
                else handleNext();
              }
            }}
            onMouseLeave={() => {
              if (isPaused) handleTogglePause();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper fake para "tempo atrás"
function idxToTimeAgo(idx: number): string {
  const times = ['2h', '5h', '1d', '2d', '1sem'];
  return times[idx % times.length];
}
