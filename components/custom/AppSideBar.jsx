import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '../ui/sidebar';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MessageCircleCodeIcon } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import SideBarFooter from './SideBarFooter';
import { useRouter } from 'next/navigation';

function AppSideBar() {
  const router = useRouter();
  return (

    <Sidebar>
      <SidebarHeader className="p-5">
        <Button className="mt-5" onClick={() => router.push('/')}>
          <MessageCircleCodeIcon /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter></SideBarFooter>
      </SidebarFooter>
    </Sidebar>

  );
}

export default AppSideBar;
