import { useState, useEffect } from 'react';
import { VideoIntro } from '@/components/VideoIntro';
import { ButtonGrid } from '@/components/ButtonGrid';
import { useGlobal } from '@/context/GlobalContext';

const Inicio = () => {
  const { videoState } = useGlobal();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (videoState.finished) {
      setShowContent(true);
    }
  }, [videoState.finished]);

  if (!videoState.finished && !showContent) {
    return <VideoIntro onComplete={() => setShowContent(true)} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/last-frame.jpg)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      <div className="relative z-10 w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Caracterización Macroscópica
          </h1>
          <p className="text-xl text-muted-foreground">
            Migración larvaria de <em>Ascaris suum</em>
          </p>
        </div>
        <ButtonGrid />
      </div>
    </div>
  );
};

export default Inicio;
