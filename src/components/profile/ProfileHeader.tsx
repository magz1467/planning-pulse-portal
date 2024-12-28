import { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  user: User | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
    </>
  );
};