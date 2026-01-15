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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Icon name="Heart" size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LoveMatch
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Умный алгоритм подбора по интересам, психотипам и знакам зодиака
          </p>
        </header>

        <Tabs defaultValue="discover" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Icon name="Compass" size={18} />
              <span>Поиск</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              <span>Совпадения</span>
              {matches.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  {matches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon name="User" size={18} />
              <span>Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="animate-scale-in">
            {mockProfiles.length > 0 ? (
              <div className="max-w-lg mx-auto">
                <ProfileCard
                  profile={mockProfiles[currentProfileIndex]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {currentProfileIndex + 1} из {mockProfiles.length}
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
              <div className="grid gap-6">
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
