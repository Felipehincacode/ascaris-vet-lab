import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGlobal } from '@/context/GlobalContext';

export const VideoModal = () => {
  const { modalState, setModalState } = useGlobal();

  return (
    <Dialog
      open={modalState.videoPresentation}
      onOpenChange={(open) =>
        setModalState((prev) => ({ ...prev, videoPresentation: open }))
      }
    >
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Presentación del Proyecto</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-muted rounded-b-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            src="/video_presentation.mp4"
          >
            Su navegador no soporta el elemento de video.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
