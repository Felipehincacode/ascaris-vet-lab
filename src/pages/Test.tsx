import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  type: 'mcq' | 'vf' | 'short' | 'hotspot';
  text: string;
  options?: string[];
  answer_index?: number;
  answer_boolean?: boolean;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    text: '¿Cuál es el órgano donde clásicamente se describen las "manchas de leche" asociadas a la migración larvaria de Ascaris suum?',
    options: ['Pulmón', 'Hígado', 'Intestino grueso', 'Riñón'],
    answer_index: 1,
    explanation:
      'Las "manchas de leche" y "puntos blancos" son lesiones macroscópicas características del hígado por migración larvaria de A. suum.',
  },
  {
    id: 2,
    type: 'mcq',
    text: 'Según la clasificación macroscópica, ¿cómo se denomina una lesión hepática bien delimitada de 1–3 mm de diámetro?',
    options: ['Mancha de leche', 'Punto blanco', 'Granuloma calcificado', 'Pústula'],
    answer_index: 1,
    explanation:
      'En el anexo se distingue "puntos blancos" (~1–3 mm) de "manchas de leche" (>5 mm).',
  },
  {
    id: 3,
    type: 'vf',
    text: 'La migración larvaria de Ascaris suum puede producir neumonía intersticial en cerdos.',
    answer_boolean: true,
    explanation:
      'El paso larval por pulmón puede causar neumonía intersticial y hemorragias multifocales.',
  },
  {
    id: 4,
    type: 'mcq',
    text: 'En estudios regionales citados en el proyecto, ¿qué aspecto reforzó la necesidad de caracterizar lesiones por A. suum?',
    options: [
      'Ausencia total del parásito',
      'Alta prevalencia documentada en algunas granjas y el impacto económico por decomisos',
      'Que solo afecta aves',
      'Que es exclusivo de jabalíes',
    ],
    answer_index: 1,
    explanation:
      'Estudios locales mostraron prevalencias relevantes y pérdidas por decomisos.',
  },
  {
    id: 5,
    type: 'mcq',
    text: '¿Qué acción reglamentaria suele derivarse de la identificación de lesiones hepáticas compatibles con migración larvaria en plantas de beneficio?',
    options: [
      'Ninguna, se continúa con el proceso normal',
      'Decomiso de las vísceras afectadas (vísceras rojas y blancas)',
      'Vacunación inmediata del animal en línea',
      'Traslado del animal a otro predio',
    ],
    answer_index: 1,
    explanation:
      'La normativa referenciada indica decomisos de vísceras afectadas como medida sanitaria.',
  },
  {
    id: 6,
    type: 'mcq',
    text: '¿Qué alteración macroscópica intestinal se asocia frecuentemente con infecciones por A. suum según el proyecto?',
    options: [
      'Enteritis proliferativa',
      'Úlcera gástrica crónica',
      'Hiperplasia del páncreas',
      'Cirrosis intestinal',
    ],
    answer_index: 0,
    explanation:
      'Se registraron hallazgos de enteritis proliferativa con engrosamiento mucoso.',
  },
];

const Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
  };

  const isCorrect = () => {
    const userAnswer = answers[question.id];
    if (question.type === 'mcq') {
      return userAnswer === question.answer_index;
    }
    if (question.type === 'vf') {
      return userAnswer === question.answer_boolean;
    }
    return false;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (q.type === 'mcq' && answer === q.answer_index) correctCount++;
      if (q.type === 'vf' && answer === q.answer_boolean) correctCount++;
    });
    setScore(correctCount);
    setTestFinished(true);
    
    // Save to localStorage
    localStorage.setItem('test_result', JSON.stringify({
      score: correctCount,
      total: questions.length,
      percentage: (correctCount / questions.length) * 100,
      date: new Date().toISOString(),
    }));
  };

  const exportResults = () => {
    const percentage = (score / questions.length) * 100;
    const csvContent = `Pregunta,Tu Respuesta,Respuesta Correcta,Correcto\n${questions
      .map((q, i) => {
        const userAnswer = answers[q.id];
        const correct = q.type === 'mcq' 
          ? userAnswer === q.answer_index
          : userAnswer === q.answer_boolean;
        return `"${q.text}","${userAnswer}","${q.type === 'mcq' ? q.options?.[q.answer_index || 0] : q.answer_boolean}","${correct ? 'Sí' : 'No'}"`;
      })
      .join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_resultados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: 'Resultados exportados',
      description: 'El archivo CSV ha sido descargado.',
    });
  };

  if (testFinished) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    if (percentage >= 90) message = '¡Excelente dominio del tema!';
    else if (percentage >= 70) message = 'Buen conocimiento, sigue mejorando.';
    else message = 'Revisa el material y vuelve a intentarlo.';

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
        <Card className="w-full max-w-2xl p-8 animate-scale-in">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">Test Completado</h2>
            <div className="text-6xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              {percentage.toFixed(0)}%
            </div>
            <p className="text-xl mb-2">
              {score} de {questions.length} respuestas correctas
            </p>
            <p className="text-muted-foreground mb-8">{message}</p>

            <div className="space-y-4">
              <Button onClick={exportResults} className="w-full gap-2">
                <Download className="w-4 h-4" />
                Exportar Resultados (CSV)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setTestFinished(false);
                  setScore(0);
                }}
                className="w-full"
              >
                Volver a Intentar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-2xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-heading font-semibold text-sm text-muted-foreground">
              Pregunta {currentQuestion + 1} de {questions.length}
            </h3>
            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-xl font-heading font-semibold mb-6">{question.text}</h2>

        {question.type === 'mcq' && (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'vf' && (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswer(value === 'true')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">
                Verdadero
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">
                Falso
              </Label>
            </div>
          </RadioGroup>
        )}

        {showExplanation && (
          <div
            className={`mt-6 p-4 rounded-lg border-l-4 ${
              isCorrect()
                ? 'bg-green-500/10 border-green-500'
                : 'bg-red-500/10 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect() ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect() ? '¡Correcto!' : 'Incorrecto'}
                </p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {!showExplanation ? (
            <Button
              onClick={() => setShowExplanation(true)}
              disabled={answers[question.id] === undefined}
              className="flex-1 bg-gradient-hero"
            >
              Verificar Respuesta
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1 bg-gradient-hero">
              {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Finalizar Test'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Test;
