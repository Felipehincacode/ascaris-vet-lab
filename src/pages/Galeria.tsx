import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Users, BookOpen, Image as ImageIcon } from 'lucide-react';

interface ImageMetadata {
  id: string;
  title: string;
  organ: string;
  classification: string;
  size: string;
  severity: string;
  date: string;
  observations: string;
}

const galleryImages: ImageMetadata[] = [
  {
    id: 'higado_01',
    title: 'Lesiones hepáticas - Manchas de leche',
    organ: 'Hígado',
    classification: 'Manchas de leche (>5mm)',
    size: '8-12 mm',
    severity: 'Moderada',
    date: '2024-01-15',
    observations: 'Múltiples lesiones difusas en lóbulo derecho',
  },
  {
    id: 'pulmon_01',
    title: 'Neumonía intersticial',
    organ: 'Pulmón',
    classification: 'Neumonía intersticial con hemorragias',
    size: 'Áreas multifocales',
    severity: 'Alta',
    date: '2024-01-20',
    observations: 'Consolidación del parénquima pulmonar',
  },
  {
    id: 'intestino_01',
    title: 'Enteritis proliferativa',
    organ: 'Intestino delgado',
    classification: 'Enteritis proliferativa',
    size: 'Segmento de 15 cm',
    severity: 'Moderada',
    date: '2024-02-05',
    observations: 'Engrosamiento mucoso evidente',
  },
];

const teamMembers = [
  { name: 'Dr. Juan Pérez', role: 'Investigador Principal', specialty: 'Patología Veterinaria' },
  { name: 'Dra. María González', role: 'Co-investigadora', specialty: 'Parasitología' },
  { name: 'Dr. Carlos Ramírez', role: 'Asistente de Investigación', specialty: 'Medicina Veterinaria' },
];

const publications = [
  {
    title: 'Caracterización macroscópica de lesiones por A. suum en cerdos de beneficio',
    year: '2024',
    journal: 'Revista Colombiana de Ciencias Veterinarias',
  },
  {
    title: 'Prevalencia y distribución de lesiones hepáticas en plantas de beneficio',
    year: '2023',
    journal: 'Veterinaria Tropical',
  },
];

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Gallery Section */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Galería Fotográfica</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <Card
                key={image.id}
                className="overflow-hidden cursor-pointer hover:shadow-elegant transition-all duration-300 group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-hero opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold mb-2">{image.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Órgano: {image.organ}</p>
                    <p>Clasificación: {image.classification}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Equipo de Investigación</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-hero mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-heading font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.specialty}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Publications Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Publicaciones</h2>
          </div>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-heading font-semibold mb-2">{pub.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{pub.year}</span>
                  <span>•</span>
                  <span>{pub.journal}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Image Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-hero opacity-20" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Órgano</p>
                <p className="font-semibold">{selectedImage?.organ}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-semibold">{selectedImage?.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Clasificación</p>
                <p className="font-semibold">{selectedImage?.classification}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tamaño</p>
                <p className="font-semibold">{selectedImage?.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Severidad</p>
                <p className="font-semibold">{selectedImage?.severity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-semibold">{selectedImage?.id}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Observaciones</p>
              <p className="text-sm">{selectedImage?.observations}</p>
            </div>
            <Button className="w-full gap-2">
              <Download className="w-4 h-4" />
              Descargar Imagen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Galeria;
