import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoIntro } from '@/components/VideoIntro';
import { ButtonGrid } from '@/components/ButtonGrid';
import { useGlobal } from '@/context/GlobalContext';

const Inicio = () => {
  const { videoState } = useGlobal();
  const [showContent, setShowContent] = useState(false);
  const [gyroPosition, setGyroPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (videoState.finished) {
      setShowContent(true);
    }
  }, [videoState.finished]);

  useEffect(() => {
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setGyroPosition({
          x: e.gamma * 0.5,
          y: e.beta * 0.5
        });
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, []);

  if (!videoState.finished && !showContent) {
    return <VideoIntro onComplete={() => setShowContent(true)} />;
  }

  return (
    <motion.div
      className="h-screen flex flex-col justify-between bg-cover bg-center relative transition-all duration-1000 overflow-hidden"
      style={{
        backgroundImage: 'url(/last-frame.jpg)',
        backgroundPosition: `calc(50% + ${gyroPosition.x}px) calc(50% + ${gyroPosition.y}px)`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative z-10 w-full animate-fade-in pt-4 flex items-center justify-center flex-1">
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-xl md:text-2xl font-heading font-bold text-black mb-1"
              style={{
                textShadow: '3px 3px 6px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.8), 1px 1px 3px rgba(255,255,255,1)',
                WebkitTextStroke: '1px rgba(255,255,255,0.3)'
              }}>
            Caracterización Macroscópica
          </h1>
          <p className="text-sm md:text-base text-black"
             style={{
               textShadow: '2px 2px 4px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.7)'
             }}>
            Migración larvaria de <em>Ascaris suum</em>
          </p>
        </motion.div>
      </div>
      <div className="relative z-10 w-full animate-fade-in pb-4 flex items-center justify-center flex-1">
        <ButtonGrid />
      </div>
    </motion.div>
  );
};

export default Inicio;
