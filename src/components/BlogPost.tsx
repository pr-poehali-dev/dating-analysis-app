import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  comments: number;
  timestamp: Date;
}

interface BlogPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function BlogPost({ post, onLike, onComment }: BlogPostProps) {
  const [liked, setLiked] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(post.id);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'только что';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    return `${days} д назад`;
  };

  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="p-4 flex items-center gap-3">
        <img
          src={post.userPhoto}
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.userName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.timestamp)}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Icon name="MoreVertical" size={18} />
        </Button>
      </div>

      {post.media && post.media.length > 0 && (
        <div className="relative bg-black aspect-square">
          {post.media[currentMediaIndex].type === 'image' ? (
            <img
              src={post.media[currentMediaIndex].url}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={post.media[currentMediaIndex].url}
              controls
              className="w-full h-full object-cover"
            />
          )}
          
          {post.media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8"
                onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))}
                disabled={currentMediaIndex === 0}
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8"
                onClick={() => setCurrentMediaIndex(Math.min(post.media!.length - 1, currentMediaIndex + 1))}
                disabled={currentMediaIndex === post.media.length - 1}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {post.media.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentMediaIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLike}
          >
            <Icon
              name="Heart"
              size={22}
              className={liked ? 'fill-red-500 text-red-500' : ''}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onComment?.(post.id)}
          >
            <Icon name="MessageCircle" size={22} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Icon name="Send" size={22} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
            <Icon name="Bookmark" size={22} />
          </Button>
        </div>

        <p className="font-semibold text-sm mb-2">
          {post.likes + (liked ? 1 : 0)} отметок "Нравится"
        </p>

        <p className="text-sm">
          <span className="font-semibold mr-2">{post.userName}</span>
          {post.content}
        </p>

        {post.comments > 0 && (
          <Button
            variant="link"
            className="h-auto p-0 text-muted-foreground hover:text-foreground mt-1"
            onClick={() => onComment?.(post.id)}
          >
            Посмотреть все комментарии ({post.comments})
          </Button>
        )}
      </div>
    </Card>
  );
}
