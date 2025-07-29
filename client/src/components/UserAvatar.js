import React from 'react';

const UserAvatar = ({ src, alt, size = 'w-8 h-8' }) => (
  <img src={src || '/avatar.png'} alt={alt || 'avatar'} className={`${size} rounded-full object-cover`} />
);

export default UserAvatar; 