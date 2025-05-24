'use client';
import { UserDetailContext } from '../../../context/UserDetailContext';
import { api } from '../../../convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSidebar } from '../ui/sidebar';
import { Id } from '../../../convex/_generated/dataModel';

interface Workspace {
  _id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    id: string;
  }>;
}

function WorkspaceHistory() {
  const { userDetail } = useContext(UserDetailContext);
  const [workspaceList, setWorkSpaceList] = useState<Workspace[]>([]);
  const convex = useConvex();
  const { toggleSidebar } = useSidebar();

  const GetAllWorkspace = useCallback(async () => {
    if (!userDetail?._id) return;
    
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail._id as Id<"users">,
    });
    setWorkSpaceList(result);
  }, [convex, userDetail?._id]);

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }
  }, [userDetail, GetAllWorkspace]);

  const getPreviewText = (messages: Workspace['messages']) => {
    if (!messages || messages.length === 0) return 'New conversation';
    
    // Get all user messages
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) return 'New conversation';
    
    // Join all user messages with a separator
    const allUserMessages = userMessages.map(msg => {
      const content = msg.content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }).join(' | ');
    
    return allUserMessages;
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList.map((workspace) => (
          <Link key={workspace._id} href={'/workspace/' + workspace._id}>
            <div 
              onClick={toggleSidebar} 
              className="text-sm text-gray-400 mt-1 font-light hover:text-white cursor-pointer p-2 hover:bg-black rounded-lg transition-colors"
            >
              {getPreviewText(workspace.messages)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;