import { Button } from '@/components/ui/button';
import { Play, Mic, Bot, FileCheck, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@/context/GlobalContext';

const buttons = [
  { id: 'video', label: 'Video Presentación', icon: Play, action: 'modal' },
  { id: 'podcast', label: 'Podcast', icon: Mic, action: 'navigate', route: '/podcast' },
  { id: 'ia', label: 'IA Entrenada', icon: Bot, action: 'navigate', route: '/ia' },
  { id: 'test', label: 'Test Interactivo', icon: FileCheck, action: 'modal' },
  { id: 'galeria', label: 'Galería', icon: ImageIcon, action: 'navigate', route: '/galeria' },
];

export const ButtonGrid = () => {
  const navigate = useNavigate();
  const { setModalState } = useGlobal();

  const handleClick = (button: typeof buttons[0]) => {
    if (button.action === 'navigate' && button.route) {
      navigate(button.route);
    } else if (button.action === 'modal') {
      if (button.id === 'video') {
        setModalState(prev => ({ ...prev, videoPresentation: true }));
      } else if (button.id === 'test') {
        navigate('/test');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto p-8 animate-fade-in">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={button.id}
            onClick={() => handleClick(button)}
            variant="outline"
            className="h-32 flex-col gap-3 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-elegant transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-base font-medium">{button.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
