'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

interface SectionQAProps {
  section: 'skills' | 'projects' | 'experience' | 'education';
  suggestedQuestions: string[];
}

export function SectionQA({ section, suggestedQuestions }: SectionQAProps) {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (q: string) => {
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer('');
    setQuestion(q);

    try {
      const response = await fetch('/api/section-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, question: q, language }),
      });

      if (!response.ok) throw new Error('Failed to get answer');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setAnswer(fullText);
      }
    } catch (err) {
      setAnswer('Error al obtener respuesta. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const labels = {
    es: {
      ask: 'Preguntame',
      placeholder: 'Escribe tu pregunta...',
      suggested: 'Preguntas sugeridas:',
    },
    en: {
      ask: 'Ask me',
      placeholder: 'Type your question...',
      suggested: 'Suggested questions:',
    },
  };

  const l = labels[language as keyof typeof labels] || labels.es;

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        {l.ask}
        <Sparkles className="h-3 w-3 text-primary" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              'absolute z-50 mt-2 right-0',
              'w-[320px] p-4 rounded-xl',
              'bg-background/95 backdrop-blur-md',
              'border shadow-lg'
            )}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Suggested questions */}
            {!answer && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">{l.suggested}</p>
                <div className="space-y-1">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => askQuestion(q)}
                      disabled={isLoading}
                      className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Answer */}
            {(answer || isLoading) && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Q: {question}</p>
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  {isLoading && !answer ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Pensando...
                    </div>
                  ) : (
                    answer
                  )}
                </div>
              </div>
            )}

            {/* Custom question input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askQuestion(question)}
                placeholder={l.placeholder}
                className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                size="icon"
                onClick={() => askQuestion(question)}
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
