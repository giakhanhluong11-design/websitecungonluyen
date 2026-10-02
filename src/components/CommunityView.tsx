import React, { useState } from 'react';
import { CommunityHubView } from './community/CommunityHubView';
import { ChuyenChungMinhView } from './community/ChuyenChungMinhView';
import { ConnectView } from './community/ConnectView';
import { ConnectDetailView } from './community/ConnectDetailView';
import { UserProfileModal } from './community/UserProfileModal';
import { ConnectPost } from '../types';

export const CommunityView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'hub' | 'chuyen_chung_minh' | 'ket_noi' | 'connect_detail'>('hub');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<ConnectPost | null>(null);

  const handleNavigate = (view: 'hub' | 'chuyen_chung_minh' | 'ket_noi' | 'connect_detail') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (post: ConnectPost) => {
    setSelectedPost(post);
    handleNavigate('connect_detail');
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <>
      {currentView === 'hub' && (
        <CommunityHubView onNavigate={handleNavigate} onUserClick={handleUserClick} />
      )}
      
      {currentView === 'chuyen_chung_minh' && (
        <ChuyenChungMinhView onBack={() => handleNavigate('hub')} onUserClick={handleUserClick} />
      )}
      
      {currentView === 'ket_noi' && (
        <ConnectView 
          onBack={() => handleNavigate('hub')} 
          onUserClick={handleUserClick} 
          onPostClick={handlePostClick}
        />
      )}

      {currentView === 'connect_detail' && selectedPost && (
        <ConnectDetailView
          post={selectedPost}
          onBack={() => handleNavigate('ket_noi')}
          onUserClick={handleUserClick}
        />
      )}

      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
          onConnectClick={(post) => {
            setSelectedUserId(null); // close modal
            handlePostClick(post); // navigate to connect_detail
          }}
          onCommunityPostClick={(post) => {
            setSelectedUserId(null); // close modal
            handleNavigate('chuyen_chung_minh'); // jump to ChuyenChungMinhView (we don't have detail view yet)
          }}
        />
      )}
    </>
  );
};
