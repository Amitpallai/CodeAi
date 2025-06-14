'use client';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { Button } from '../ui/button';
import Colors from '../../data/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import Link from 'next/link';
import { Download, Rocket } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import { ActionContext } from '../../context/ActionContext';
import SignInDialog from './SignInDialog';

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const [openDialog, setOpenDialog] = useState(false);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const onActionBtn = (actionType) => {
    setAction({
      actionType,
      timeStamp: new Date().getTime()
    });
  };
  return (
    <div className="p-4 flex justify-between items-center">
      <div className='flex items-center gap-2'>
        {userDetail?.name && (
          <SidebarTrigger onClick={() => toggleSidebar()} />
        )}
        <h1 className='text-2xl font-bold italic' >CodeAi</h1>
      </div>
      {!userDetail?.name ? (
        <div className="flex gap-5">

          <Button variant="ghost" onClick={() => setOpenDialog(true)} >Sign In</Button>

          <Button
            onClick={() => setOpenDialog(true)}
            className="text-white"
            style={{
              backgroundColor: "#2ba6ff",
            }}>
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex gap-5 items-center">
          {pathname.includes('/workspace/') && (
            <>
              <Button variant="ghost" onClick={() => onActionBtn('export')}>
                <Download /> Export
              </Button>
              <Button
                onClick={() => onActionBtn('deploy')}
                className="text-white"
                style={{
                  backgroundColor:"#2ba6ff",
                }}
              >
                <Rocket /> Deploy
              </Button>
            </>
          )}
          {userDetail && (
            <Image
              onClick={toggleSidebar}
              src={userDetail?.picture}
              alt="userImage"
              width={30}
              height={30}
              className="rounded-full cursor-pointer object-cover"
            />
          )}
        </div>
      )}
      <SignInDialog openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
    </div>
  );
}

export default Header;
