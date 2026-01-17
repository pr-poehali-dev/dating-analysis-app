import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AIImageGeneratorProps {
  onImageGenerated: (url: string) => void;
  onClose: () => void;
}

export default function AIImageGenerator({ onImageGenerated, onClose }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/0f2bbad1-ec1e-4bec-a6ad-0c9351d00fd9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации');
      }

      setGeneratedImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка генерации');
    } finally {
      setLoading(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      onClose();
    }
  };

  return (
    <Card className="p-4 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Генерация изображения</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <Icon name="X" size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Опишите изображение..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Например: "Закат на пляже с пальмами"
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={18} className="mr-2" />
                Создать
              </>
            )}
          </Button>

          {generatedImage && (
            <Button onClick={handleUseImage} variant="outline">
              <Icon name="Check" size={18} className="mr-2" />
              Использовать
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
