import React, { useState } from 'react';
import { CommunityHubView } from './community/CommunityHubView';
import { ChuyenChungMinhView } from './community/ChuyenChungMinhView';
import { ConnectView } from './community/ConnectView';
import { UserProfileModal } from './community/UserProfileModal';

export const CommunityView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'hub' | 'chuyen_chung_minh' | 'ket_noi'>('hub');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleNavigate = (view: 'hub' | 'chuyen_chung_minh' | 'ket_noi') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <ConnectView onBack={() => handleNavigate('hub')} onUserClick={handleUserClick} />
      )}

      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </>
  );
};
