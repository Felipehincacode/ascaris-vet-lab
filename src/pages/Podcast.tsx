import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';

const Podcast = () => {
  const { podcastState, setPodcastState } = useGlobal();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPodcastState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleLoadedMetadata = () => {
      setPodcastState(prev => ({ ...prev, duration: audio.duration }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [setPodcastState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [podcastState.playing]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (podcastState.playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPodcastState(prev => ({ ...prev, playing: !prev.playing }));
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl p-8 shadow-elegant animate-scale-in">
          {/* Artwork */}
          <div className="aspect-square w-full max-w-sm mx-auto mb-8 rounded-xl bg-gradient-hero flex items-center justify-center overflow-hidden shadow-glow">
            <div className="w-full h-full bg-muted/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-24 h-24 text-primary-foreground opacity-50" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-2">
              Episodio 1: Introducción y Hallazgos
            </h2>
            <p className="text-muted-foreground">
              Conversación sobre metodologías y resultados principales
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[podcastState.currentTime]}
              min={0}
              max={podcastState.duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatTime(podcastState.currentTime)}</span>
              <span>{formatTime(podcastState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(-10)}
              className="hover:bg-primary/10"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-gradient-hero shadow-glow"
            >
              {podcastState.playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(10)}
              className="hover:bg-primary/10"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>

        <audio ref={audioRef} src="/podcast_episode_01.mp3" />
      </div>
    </div>
  );
};

export default Podcast;
