import { Button } from '@/components/ui/button';
import { Play, Mic, Bot, FileCheck, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@/context/GlobalContext';

const buttons = [
  { id: 'video', label: 'Video Presentación', icon: Play, action: 'modal' },
  { id: 'podcast', label: 'Podcast', icon: Mic, action: 'navigate', route: '/podcast' },
  { id: 'test', label: 'Test Interactivo', icon: FileCheck, action: 'modal' },
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto p-2 animate-fade-in">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button
            key={button.id}
            onClick={() => handleClick(button)}
            className="px-4 py-2 flex items-center justify-center transition-all duration-200 group transform hover:scale-105 cursor-pointer"
            style={{
              animationDelay: `${index * 150}ms`,
              background: 'none',
              border: 'none'
            }}
          >
            <span className="text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-200"
                  style={{
                    textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,1)',
                    filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.4))'
                  }}>
              {button.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
