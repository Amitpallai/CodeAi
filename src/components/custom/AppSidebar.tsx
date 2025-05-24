import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { MessageCircleCodeIcon } from 'lucide-react';
import WorkspaceHistory from './WorkSpaceHistory';
import SideBarFooter from './SideBarFooter';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

function AppSideBar() {
  const router = useRouter();
 
  return (
    <Sidebar className='h-full'>
      <SidebarHeader className="p-5">
        <Button onClick={() => router.push('/')} className="mt-5">
          <MessageCircleCodeIcon /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;