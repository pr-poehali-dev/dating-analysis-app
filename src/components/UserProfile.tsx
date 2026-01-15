import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface UserProfileProps {
  profile: {
    name: string;
    age: number;
    photo: string;
    bio: string;
    interests: string[];
    zodiacSign: string;
    psychotype: string;
    location: string;
  };
  editable?: boolean;
  onSave?: (updatedProfile: any) => void;
}

export default function UserProfile({ profile, editable = false, onSave }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="relative h-80">
          <img
            src={formData.photo}
            alt={formData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            {editable && !isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="backdrop-blur-sm bg-white/90"
              >
                <Icon name="Edit" size={16} />
                <span className="ml-2">Редактировать</span>
              </Button>
            )}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {isEditing ? (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Имя</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Возраст</label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">О себе</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Местоположение</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave} className="flex-1">
                  <Icon name="Check" size={18} />
                  <span className="ml-2">Сохранить</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="flex-1"
                >
                  <Icon name="X" size={18} />
                  <span className="ml-2">Отмена</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {formData.name}, {formData.age}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="MapPin" size={18} />
                  <span>{formData.location}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{formData.bio}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-accent/50 border-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon name="Sparkles" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Знак зодиака</p>
                      <p className="font-semibold">{formData.zodiacSign}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-accent/50 border-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon name="Brain" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Психотип</p>
                      <p className="font-semibold">{formData.psychotype}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Heart" size={18} className="text-primary" />
                  <h3 className="font-semibold">Интересы</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
