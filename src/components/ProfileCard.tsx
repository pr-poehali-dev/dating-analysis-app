import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  interests: string[];
  zodiacSign: string;
  psychotype: string;
  location: string;
  compatibility?: number;
}

interface ProfileCardProps {
  profile: Profile;
  onLike?: () => void;
  onDislike?: () => void;
  showActions?: boolean;
}

export default function ProfileCard({ profile, onLike, onDislike, showActions = true }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden animate-scale-in shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
      <div className="relative h-[500px]">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        {profile.compatibility && (
          <div className="absolute top-6 right-6 bg-primary/95 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{profile.compatibility}%</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-white">
          <h2 className="text-4xl font-bold mb-2">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center gap-2 text-base opacity-90 mb-3">
            <Icon name="MapPin" size={16} />
            <span>{profile.location}</span>
          </div>
          <p className="text-white/80 leading-relaxed line-clamp-2">{profile.bio}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <Badge variant="secondary" className="bg-muted text-foreground px-3 py-1.5 text-sm">
            ✨ {profile.zodiacSign}
          </Badge>
          <Badge variant="secondary" className="bg-muted text-foreground px-3 py-1.5 text-sm">
            🧠 {profile.psychotype}
          </Badge>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Интересы</p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-border/50 hover:border-primary/50 transition-colors"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 border-2 border-border/50 hover:bg-destructive hover:text-white hover:border-destructive transition-all rounded-2xl"
              onClick={onDislike}
            >
              <Icon name="X" size={28} />
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-2xl shadow-lg shadow-primary/20"
              onClick={onLike}
            >
              <Icon name="Heart" size={28} className="fill-white" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
