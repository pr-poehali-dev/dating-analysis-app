import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { Post } from './BlogPost';

interface CreatePostProps {
  userPhoto: string;
  userName: string;
  userId: string;
  onCreatePost: (post: Post) => void;
}

export default function CreatePost({ userPhoto, userName, userId, onCreatePost }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ type: 'image' | 'video'; url: string }[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        setMediaFiles(prev => [...prev, { type, url }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePost = () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId,
      userName,
      userPhoto,
      content: content.trim(),
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      likes: 0,
      comments: 0,
      timestamp: new Date()
    };

    onCreatePost(newPost);
    setContent('');
    setMediaFiles([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="p-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <img
            src={userPhoto}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <Button
            variant="outline"
            className="flex-1 justify-start text-muted-foreground"
            onClick={() => setIsOpen(true)}
          >
            Что нового?
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Icon name="Image" size={20} className="text-primary" />
          </Button>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userPhoto}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{userName}</p>
          <p className="text-xs text-muted-foreground">Создание поста</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <Icon name="X" size={18} />
        </Button>
      </div>

      <Textarea
        placeholder="Что нового?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-3 border-none focus-visible:ring-0 resize-none"
      />

      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {file.type === 'image' ? (
                <img src={file.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={file.url} className="w-full h-full object-cover" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => document.getElementById('post-file-upload')?.click()}
        >
          <Icon name="Image" size={18} className="text-primary" />
          <span className="text-sm">Фото/Видео</span>
        </Button>
        <input
          id="post-file-upload"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          className="ml-auto bg-gradient-to-r from-primary to-secondary"
          size="sm"
          onClick={handlePost}
          disabled={!content.trim() && mediaFiles.length === 0}
        >
          Опубликовать
        </Button>
      </div>
    </Card>
  );
}
