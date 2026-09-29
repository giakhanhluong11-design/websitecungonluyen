import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  avatar?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, className = "w-10 h-10" }) => {
  if (!avatar) {
    return <img src="/avatars/default.svg" alt="Avatar" className={`rounded-full object-cover ${className}`} />;
  }
  
  // If it's a URL or local path
  if (avatar.startsWith('http') || avatar.startsWith('/')) {
    return <img src={avatar} alt="Avatar" className={`rounded-full object-cover ${className}`} />;
  }

  // Fallback for old emoji avatars (just in case)
  return (
    <div className={`flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-full ${className}`}>
      <span className="leading-none" style={{ fontSize: '1.5rem' }}>{avatar}</span>
    </div>
  );
};
