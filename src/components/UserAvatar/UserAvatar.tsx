import React from 'react';
import './UserAvatar.css';

interface UserAvatarProps {
  username: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, size = 40 }) => {
  // Get the first letter and make it uppercase
  const firstLetter = username.charAt(0).toUpperCase();
  
  // Generate a random color based on the username to ensure consistency
  const generateColor = (str: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9',
      '#D7DBDD', '#AED6F1', '#A9DFBF', '#F9E79F'
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const backgroundColor = generateColor(username);

  return (
    <div 
      className="user-avatar" 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        fontSize: `${size * 0.4}px`
      }}
    >
      <div 
        className="avatar-circle"
        style={{ backgroundColor }}
      >
        {firstLetter}
      </div>
    </div>
  );
};

export default UserAvatar;