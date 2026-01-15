import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface CompatibilityScore {
  overall: number;
  interests: number;
  zodiac: number;
  psychotype: number;
}

interface CompatibilityCardProps {
  name: string;
  photo: string;
  score: CompatibilityScore;
  matchedInterests: string[];
}

export default function CompatibilityCard({ name, photo, score, matchedInterests }: CompatibilityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Отличная';
    if (score >= 60) return 'Хорошая';
    return 'Средняя';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex items-center gap-4 p-6 border-b">
        <img
          src={photo}
          alt={name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">Совместимость:</span>
            <span className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}%
            </span>
            <Badge variant="outline" className="ml-auto">
              {getScoreLabel(score.overall)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Heart" size={16} className="text-primary" />
                <span className="font-medium">Интересы</span>
              </div>
              <span className="text-muted-foreground">{score.interests}%</span>
            </div>
            <Progress value={score.interests} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={16} className="text-primary" />
                <span className="font-medium">Знаки зодиака</span>
              </div>
              <span className="text-muted-foreground">{score.zodiac}%</span>
            </div>
            <Progress value={score.zodiac} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Brain" size={16} className="text-primary" />
                <span className="font-medium">Психотип</span>
              </div>
              <span className="text-muted-foreground">{score.psychotype}%</span>
            </div>
            <Progress value={score.psychotype} className="h-2" />
          </div>
        </div>

        {matchedInterests.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Icon name="Sparkle" size={14} />
              Общие интересы:
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedInterests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
