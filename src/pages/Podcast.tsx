import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';

const Podcast = () => {
  const navigate = useNavigate();
  const { podcastState, setPodcastState } = useGlobal();
  const audioRef = useRef<HTMLAudioElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState(0.8);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(0);


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

  const nextVideo = () => {
    setCurrentVideo(prev => {
      const next = (prev + 1) % 2;
      if (next === 0) {
        setOpacity1(1);
        setOpacity2(0);
      } else {
        setOpacity1(0);
        setOpacity2(1);
      }
      return next;
    });
  };

  const prevVideo = () => {
    setCurrentVideo(prev => {
      const next = prev === 0 ? 1 : 0;
      if (next === 0) {
        setOpacity1(1);
        setOpacity2(0);
      } else {
        setOpacity1(0);
        setOpacity2(1);
      }
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => {
        const next = (prev + 1) % 2;
        if (next === 0) {
          setOpacity1(1);
          setOpacity2(0);
        } else {
          setOpacity1(0);
          setOpacity2(1);
        }
        return next;
      });
    }, 10000); // Cambia cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.play();
    }
    if (video2Ref.current) {
      video2Ref.current.play();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => {
        setPodcastState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration || 0
        }));
      };

      const handleLoadedMetadata = () => {
        setPodcastState(prev => ({
          ...prev,
          duration: audio.duration || 0
        }));
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);


  return (
    <div className="min-h-screen relative">
      <video
        ref={video1Ref}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-2000"
        style={{ opacity: opacity1 }}
        src="/videos fondo podcast1.mp4"
        muted
        loop
        playsInline
      />
      <video
        ref={video2Ref}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-2000"
        style={{ opacity: opacity2 }}
        src="/videos fondo podcast2.mp4"
        muted
        loop
        playsInline
      />
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-white/10 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2"
                style={{
                  textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,1)',
                  WebkitTextStroke: '1px rgba(0,0,0,0.3)'
                }}>
              Podcast
            </h1>
            <p className="text-lg text-white"
               style={{
                 textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.7)'
               }}>
              Ascaris al desnudo
            </p>
          </div>
          {/* Reproductor minimalista */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevVideo}
                className="hover:bg-white/10 text-white"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg"
              >
                {podcastState.playing ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextVideo}
                className="hover:bg-white/10 text-white"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <span className="text-white text-sm"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                {formatTime(podcastState.currentTime)}
              </span>
              <Slider
                value={[podcastState.currentTime]}
                min={0}
                max={podcastState.duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1 max-w-xs"
              />
              <span className="text-white text-sm"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                {formatTime(podcastState.duration)}
              </span>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src="/PODCAST.m4a" />
      </div>
    </div>
  );
};

export default Podcast;
