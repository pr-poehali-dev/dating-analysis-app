import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AIImageEditorProps {
  imageUrl: string;
  onImageEdited: (url: string) => void;
  onClose: () => void;
}

export default function AIImageEditor({ imageUrl, onImageEdited, onClose }: AIImageEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleEdit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 1024, 1024);

      const imageData = canvas.toDataURL('image/png');

      const response = await fetch('https://functions.poehali.dev/a0e2e88b-8b59-469c-a8b7-4ff23cac1a91', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          prompt: prompt.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка редактирования');
      }

      setEditedImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка редактирования');
    } finally {
      setLoading(false);
    }
  };

  const handleUseImage = () => {
    if (editedImage) {
      onImageEdited(editedImage);
      onClose();
    }
  };

  return (
    <Card className="p-4 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Редактирование изображения</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <Icon name="X" size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <img 
            src={editedImage || imageUrl} 
            alt="Edit" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div>
          <Input
            placeholder="Что изменить?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Например: "Добавь солнечные очки" или "Сделай фон синим"
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleEdit}
            disabled={loading || !prompt.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="Wand2" size={18} className="mr-2" />
                Применить
              </>
            )}
          </Button>

          {editedImage && (
            <Button onClick={handleUseImage} variant="outline">
              <Icon name="Check" size={18} className="mr-2" />
              Сохранить
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
