import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'better-auth';
import { LogOutIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import UserFilterModal from '../modals/UserFilterModal';
import FeatureFlag from '../modals/FeatureFlag';
import WebhookConfigModal from '../modals/WebhookConfigModal';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage aria-label={user.name} src={user.image ?? ''} alt={user.name} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        alignOffset={0}
        sideOffset={10}
        className="w-fit rounded-sm bg-black p-2 text-gray-200 border-none"
      >
        <p className="m-i cursor-pointer bg-black hover:bg-gray-800" onSelect={(e) => e.preventDefault()}>
          <UserFilterModal />
        </p>
        <p className="m-i cursor-pointer bg-black hover:bg-gray-800" onSelect={(e) => e.preventDefault()}>
          <WebhookConfigModal />
        </p>
        {isSuperAdmin && (
          <p className="m-i cursor-pointer bg-black hover:bg-gray-800" onSelect={(e) => e.preventDefault()}>
            <FeatureFlag />
          </p>
        )}
        <p
          className="m-i cursor-pointer bg-black hover:bg-gray-800"
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
        </p>
      </PopoverContent>
    </Popover>
  );
}
