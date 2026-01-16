import { useState } from 'react';
import ProfileCard, { Profile } from '@/components/ProfileCard';
import CompatibilityCard from '@/components/CompatibilityCard';
import UserProfile from '@/components/UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Анна',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    bio: 'Люблю путешествия, кофе по утрам и хорошую музыку. Работаю дизайнером, мечтаю посетить Японию.',
    interests: ['Путешествия', 'Дизайн', 'Музыка', 'Йога', 'Фотография'],
    zodiacSign: 'Близнецы',
    psychotype: 'ENFP',
    location: 'Москва'
  },
  {
    id: '2',
    name: 'Мария',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
    bio: 'Книжный червь и любитель кино. Обожаю вечера с друзьями и долгие прогулки по городу.',
    interests: ['Книги', 'Кино', 'Психология', 'Фотография', 'Кулинария'],
    zodiacSign: 'Рак',
    psychotype: 'INFJ',
    location: 'Санкт-Петербург'
  },
  {
    id: '3',
    name: 'Елена',
    age: 30,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
    bio: 'Программист и творческая личность. В свободное время занимаюсь живописью и изучаю новые технологии.',
    interests: ['Программирование', 'Искусство', 'Музыка', 'Йога', 'Путешествия'],
    zodiacSign: 'Дева',
    psychotype: 'INTJ',
    location: 'Москва'
  }
];

const currentUser: Profile = {
  id: 'user',
  name: 'Алексей',
  age: 29,
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  bio: 'Предприниматель и любитель активного образа жизни. Интересуюсь психологией, читаю много книг и путешествую при любой возможности.',
  interests: ['Книги', 'Путешествия', 'Спорт', 'Психология', 'Музыка'],
  zodiacSign: 'Лев',
  psychotype: 'ENTJ',
  location: 'Москва'
};

function calculateCompatibility(user: Profile, profile: Profile) {
  const commonInterests = user.interests.filter(interest => 
    profile.interests.includes(interest)
  );
  
  const interestScore = Math.round((commonInterests.length / user.interests.length) * 100);
  
  const zodiacCompatibility: Record<string, number> = {
    'Близнецы': 85,
    'Рак': 70,
    'Дева': 75
  };
  
  const psychotypeCompatibility: Record<string, number> = {
    'ENFP': 90,
    'INFJ': 80,
    'INTJ': 85
  };
  
  const zodiacScore = zodiacCompatibility[profile.zodiacSign] || 60;
  const psychotypeScore = psychotypeCompatibility[profile.psychotype] || 70;
  
  const overall = Math.round((interestScore + zodiacScore + psychotypeScore) / 3);
  
  return {
    overall,
    interests: interestScore,
    zodiac: zodiacScore,
    psychotype: psychotypeScore,
    matchedInterests: commonInterests
  };
}

export default function Index() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches, setMatches] = useState<Profile[]>([]);

  const handleLike = () => {
    const likedProfile = mockProfiles[currentProfileIndex];
    setMatches([...matches, likedProfile]);
    
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handleDislike = () => {
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const currentProfile = mockProfiles[currentProfileIndex];
  const compatibility = calculateCompatibility(currentUser, currentProfile);
  const profileWithCompatibility = { ...currentProfile, compatibility: compatibility.overall };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2 tracking-tight">
            WIN
          </h1>
          <p className="text-muted-foreground text-sm">
            Найди свою вторую половинку
          </p>
        </header>

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50 p-1 h-14">
            <TabsTrigger value="discover" className="flex items-center justify-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white rounded-xl transition-all">
              <Icon name="Flame" size={20} />
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center justify-center gap-1.5 relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white rounded-xl transition-all">
              <Icon name="Heart" size={20} />
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full min-w-[20px] text-center">
                  {matches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center justify-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white rounded-xl transition-all">
              <Icon name="User" size={20} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="animate-scale-in">
            {mockProfiles.length > 0 ? (
              <div className="w-full">
                <ProfileCard
                  profile={profileWithCompatibility}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
                <div className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  {Array.from({ length: mockProfiles.length }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentProfileIndex ? 'bg-primary w-6' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Icon name="Check" size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Все профили просмотрены!</h3>
                <p className="text-muted-foreground">Проверьте раздел совпадений</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches" className="animate-scale-in">
            {matches.length > 0 ? (
              <div className="grid gap-4">
                {matches.map((match) => {
                  const compatibility = calculateCompatibility(currentUser, match);
                  return (
                    <CompatibilityCard
                      key={match.id}
                      name={match.name}
                      photo={match.photo}
                      score={compatibility}
                      matchedInterests={compatibility.matchedInterests}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Icon name="Heart" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Пока нет совпадений</h3>
                <p className="text-muted-foreground">
                  Начните просматривать профили в разделе "Поиск"
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="animate-scale-in">
            <UserProfile
              profile={currentUser}
              editable={true}
              onSave={(updated) => console.log('Profile updated:', updated)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}