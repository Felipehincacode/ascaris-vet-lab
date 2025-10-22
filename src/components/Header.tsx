import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';

const tabs = [
  { id: 'inicio', label: 'Inicio', route: '/' },
  { id: 'podcast', label: 'Podcast', route: '/podcast' },
  { id: 'test', label: 'Test', route: '/test' },
  { id: 'galeria', label: 'Galería / Sobre', route: '/galeria' },
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setVideoState } = useGlobal();

  const handleRestartIntro = () => {
    setVideoState({ playing: false, progress: 0, finished: false });
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={location.pathname === tab.route ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(tab.route)}
                className="text-sm"
              >
                {tab.label}
              </Button>
            ))}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartIntro}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reiniciar Intro</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
