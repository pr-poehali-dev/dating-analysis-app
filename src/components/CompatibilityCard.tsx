import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-pink-500 to-purple-500';
    if (score >= 60) return 'from-purple-500 to-blue-500';
    return 'from-blue-500 to-cyan-500';
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all animate-fade-in border-border/50 bg-card/95 backdrop-blur-sm">
      <div className="relative">
        <div className="flex items-center gap-4 p-6">
          <div className="relative">
            <img
              src={photo}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <div className={`absolute -top-2 -right-2 bg-gradient-to-br ${getScoreGradient(score.overall)} text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
              {score.overall}%
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-2xl mb-1">{name}</h3>
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Совпадение</span>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl h-10 px-5"
          >
            <Icon name="MessageCircle" size={18} />
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">💝 Интересы</span>
            <span className="font-semibold">{score.interests}%</span>
          </div>
          <Progress value={score.interests} className="h-1.5 bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">✨ Зодиак</span>
            <span className="font-semibold">{score.zodiac}%</span>
          </div>
          <Progress value={score.zodiac} className="h-1.5 bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">🧠 Психотип</span>
            <span className="font-semibold">{score.psychotype}%</span>
          </div>
          <Progress value={score.psychotype} className="h-1.5 bg-muted" />
        </div>

        {matchedInterests.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Общие интересы
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedInterests.map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-muted/50"
                >
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
