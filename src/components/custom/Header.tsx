'use client';
import React, { useContext, useState } from 'react';
import { Button } from '../ui/button';
import Colors from '../../../data/Colors';
import { Download, Rocket } from 'lucide-react';
import { useSidebar, SidebarTrigger } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import { ActionContext } from '../../../context/ActionContext';
import { UserDetailContext } from '../../../context/UserDetailContext';
import Image from 'next/image';
import SignInDialog from './SignInDialog';

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { setAction } = useContext(ActionContext);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [openDialog, setOpenDialog] = useState(false);

  const onActionBtn = (actionType: 'deploy' | 'export') => {
    setAction({
      actionType,
      timeStamp: new Date().getTime()
    });
  };

  return (
    <div className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {userDetail && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <SidebarTrigger />
          </Button>
        )}
        <h1 className='text-3xl font-bold italic'>bolt</h1>
      </div>
      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost" onClick={() => setOpenDialog(true)}>Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
            onClick={() => setOpenDialog(true)}
          >
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
                  backgroundColor: Colors.BLUE,
                }}
              >
                <Rocket /> Deploy
              </Button>
            </>
          )}
          {userDetail && (
            <Image
              onClick={toggleSidebar}
              src={userDetail.picture}
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