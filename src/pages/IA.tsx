import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

const quickSuggestions = [
  '¿Qué son las manchas de leche?',
  'Explica la clasificación de lesiones hepáticas',
  '¿Cómo afecta A. suum al pulmón?',
  'Metodología del estudio',
];

const IA = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hola, soy la IA entrenada con los datos del proyecto de caracterización macroscópica. Puedo responder preguntas sobre las lesiones, metodología y hallazgos. ¿En qué puedo ayudarte?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulated AI response (replace with actual API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'manchas de leche':
          'Las "manchas de leche" son lesiones macroscópicas características del hígado producidas por la migración larvaria de Ascaris suum. Se presentan como áreas blanquecinas difusas mayores a 5 mm de diámetro. (Fuente: Anexo 1, sección Clasificación Macroscópica)',
        'lesiones hepáticas':
          'La clasificación distingue: Puntos blancos (1-3 mm), Manchas de leche (>5 mm), y Granulomas calcificados. Cada categoría representa diferentes estadios de la respuesta inflamatoria. (Fuente: Anexo 1)',
        pulmón:
          'Las larvas atraviesan el pulmón durante su migración, causando neumonía intersticial y hemorragias multifocales. Esto puede resultar en consolidación del parénquima y áreas de atelectasia. (Fuente: Anexo 1, Hallazgos Pulmonares)',
        metodología:
          'El estudio es observacional, descriptivo transversal, realizado en plantas de beneficio. Incluye registro fotográfico estandarizado de hígado, pulmón e intestino, con fichas de caracterización macroscópica. (Fuente: Anexo 1, Diseño del Estudio)',
      };

      const matchedKey = Object.keys(responses).find((key) =>
        userMessage.toLowerCase().includes(key)
      );

      const response = matchedKey
        ? responses[matchedKey]
        : 'Basándome en el material del proyecto, puedo ayudarte con información sobre las lesiones macroscópicas, metodología del estudio, clasificación de hallazgos y procedimientos de registro fotográfico. ¿Podrías reformular tu pregunta?';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          source: matchedKey ? 'Anexo 1' : undefined,
        },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-subtle">
      <div className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        {/* Header */}
        <div className="bg-card rounded-t-xl p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-semibold">IA del Proyecto</h2>
              <p className="text-sm text-muted-foreground">
                Entrenada con datos del estudio
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 bg-card px-4" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.source && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      <span>{message.source}</span>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="bg-card px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Sugerencias:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-card rounded-b-xl p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-hero"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IA;
