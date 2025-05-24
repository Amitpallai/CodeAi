'use client';
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { UserDetailContext } from '../../../context/UserDetailContext';
import { MessagesContext } from '../../../context/MessageContext';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useSidebar } from '../ui/sidebar';

interface Option {
  name: string;
  icon: React.ElementType;
  path?: string;
}

function SideBarFooter() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { setMessages } = useContext(MessagesContext);
  const SignOut = useMutation(api.users.SignOut);
  const { toggleSidebar } = useSidebar();
  
  const options: Option[] = [
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
    },
  ];
  
  const handleSignOut = async () => {
    try {
      if (userDetail?._id) {
        // Call the SignOut mutation to reset token and set isActive to false
        await SignOut({ userId: userDetail._id as Id<"users"> });
      }
      
      // Clear all data from localStorage
      localStorage.clear();
      
      // Clear user context
      setUserDetail(null);
      
      // Clear messages
      setMessages([]);
      
      // Close the sidebar
      toggleSidebar();
      
      // Show success message
      toast.success('Signed out successfully');
      
      // Redirect to home page and reload
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const onOptionClock = (option: Option) => {
    if(option.path) {
      router.push(option.path);
    } else if (option.name === 'Sign Out') {
      handleSignOut();
    } else {
      console.log(option);
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClock(option)}
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