import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'better-auth';
import { LogOutIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import UserFilterModal from '../modals/UserFilterModal';
import FeatureFlag from '../modals/FeatureFlag';
import { useDbPropsCtx } from '@/app/_context/DbProps';

export function UserDropDown({
  user,
  mobileNav,
  toggleMobileNav,
}: {
  user: User;
  mobileNav: boolean;
  toggleMobileNav: () => void;
}) {
  const router = useRouter();
  const { isSuperAdmin } = useDbPropsCtx();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage aria-label={user.name} src={user.image ?? ''} alt={user.name} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit rounded-sm bg-black text-gray-200 border-none">
        <DropdownMenuItem className="cursor-pointer bg-black hover:bg-gray-800" onSelect={(e) => e.preventDefault()}>
          <UserFilterModal />
        </DropdownMenuItem>
        {isSuperAdmin && (
          <DropdownMenuItem className="cursor-pointer bg-black hover:bg-gray-800" onSelect={(e) => e.preventDefault()}>
            <FeatureFlag />
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer bg-black hover:bg-gray-800"
          onClick={async () => {
            await authClient.signOut();
            if (mobileNav) {
              toggleMobileNav();
            }
            router.refresh();
          }}
        >
          <LogOutIcon strokeWidth={2} size={25} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
