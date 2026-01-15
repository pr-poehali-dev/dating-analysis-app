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
}

interface ProfileCardProps {
  profile: Profile;
  onLike?: () => void;
  onDislike?: () => void;
  showActions?: boolean;
}

export default function ProfileCard({ profile, onLike, onDislike, showActions = true }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden animate-scale-in hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-96">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Icon name="MapPin" size={14} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={18} className="text-primary" />
            <span className="font-medium text-sm">Знак зодиака:</span>
            <Badge variant="secondary" className="ml-auto">
              {profile.zodiacSign}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Icon name="Brain" size={18} className="text-primary" />
            <span className="font-medium text-sm">Психотип:</span>
            <Badge variant="secondary" className="ml-auto">
              {profile.psychotype}
            </Badge>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Heart" size={18} className="text-primary" />
            <span className="font-medium text-sm">Интересы:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all"
              onClick={onDislike}
            >
              <Icon name="X" size={24} />
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={onLike}
            >
              <Icon name="Heart" size={24} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
