import React from 'react';
import { User } from 'better-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const UserAvatar = ({ user }: { user: User }) => {
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={user.image ?? ''} alt={user.name} />
      <AvatarFallback>{user.name}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
