import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkipForward } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';

const subtitles = [
  { start: 0, end: 2, text: 'Caracterización macroscópica de las lesiones causadas por la migración larvaria de Ascaris suum.' },
  { start: 2, end: 4, text: 'Objetivo general' },
  { start: 4, end: 5, text: 'Caracterizar las lesiones macroscópicas causadas por la migración larvaria de Ascaris suum observadas en 150 cerdos faenados durante los años 2024 y 2025 en la Central Ganadera y Supercerdo.' },
];

export const VideoIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { videoState, setVideoState } = useGlobal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gyroPosition, setGyroPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (videoRef.current && !videoState.finished) {
      videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      setVideoState(prev => ({ ...prev, playing: true }));
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setGyroPosition({
          x: e.gamma * 2,
          y: e.beta * 2
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoState(prev => ({ ...prev, progress }));

      const currentTime = videoRef.current.currentTime;
      const subtitle = subtitles.find(sub => currentTime >= sub.start && currentTime < sub.end);
      setCurrentSubtitle(subtitle ? subtitle.text : '');
    }
  };

  const handleVideoEnd = () => {
    setShowTransition(true);
    setTimeout(() => {
      setVideoState({ playing: false, progress: 100, finished: true });
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    setShowTransition(true);
    setTimeout(() => {
      setVideoState({ playing: false, progress: 100, finished: true });
      onComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-10"></div>
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          showTransition ? 'opacity-0' : 'opacity-100'
        }`}
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
      >
        <source src="/intro-video.mp4" type="video/mp4" />
        Su navegador no soporta el elemento de video.
      </video>




      {!showTransition && (
        <div className="absolute inset-0 flex items-center justify-center px-4 z-40">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white cursor-pointer px-2 sm:px-4 text-center leading-tight"
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              textShadow: '4px 4px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,1)',
              lineHeight: '1.1',
              maxWidth: '90vw',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              x: mousePosition.x + gyroPosition.x,
            }}
            transition={{
              opacity: { duration: 1 },
              y: { duration: 0.8, ease: "easeOut" },
              x: { type: "spring", stiffness: 300, damping: 30 }
            }}
            whileHover={{
              scale: 1.05,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.8)',
              transition: { duration: 0.3 }
            }}
            drag
            dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          >
            Caracterización macroscópica<br />
            de las lesiones causadas<br />
            por la migración larvaria<br />
            de Ascaris suum.
          </motion.h1>
        </div>
      )}

    </div>
  );
};
