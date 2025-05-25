'use client';
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { UserDetailContext } from '../../context/UserDetailContext';
import { toast } from 'sonner';
import { useSidebar } from '../ui/sidebar';

function SideBarFooter() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();

  const handleSignOut = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    // Clear user from context
    setUserDetail(null);
    // Show success message
    toast.success('Signed out successfully');
    // Redirect to home/sign in page
    router.push('/');

    toggleSidebar(false);
  };

  const options = [
    {
      name: 'Settings',
      icon: Settings,
    },
    {
      name: 'Help Center',
      icon: HelpCircle,
    },
    {
      name: 'My Subscription',
      icon: Wallet,
      path: '/pricing',
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      onClick: handleSignOut,
    },
  ];

  const onOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClick(option)}
          key={index}
          variant="ghost"
          className="w-full flex justify-start my-3"
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
