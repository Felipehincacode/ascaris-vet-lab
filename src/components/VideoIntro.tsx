import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkipForward } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';

export const VideoIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { videoState, setVideoState } = useGlobal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (videoRef.current && !videoState.finished) {
      videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      setVideoState(prev => ({ ...prev, playing: true }));
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoState(prev => ({ ...prev, progress }));
    }
  };

  const handleVideoEnd = () => {
    setShowTransition(true);
    setTimeout(() => {
      setVideoState({ playing: false, progress: 100, finished: true });
      onComplete();
    }, 1000);
  };

  const handleSkip = () => {
    setShowTransition(true);
    setTimeout(() => {
      setVideoState({ playing: false, progress: 100, finished: true });
      onComplete();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
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
        <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-4 px-4">
          <div className="w-full max-w-md">
            <Progress value={videoState.progress} className="h-1" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            className="gap-2 bg-card/80 backdrop-blur-sm"
          >
            Saltar intro
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
