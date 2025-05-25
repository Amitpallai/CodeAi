'use client';
import { UserDetailContext } from '../../context/UserDetailContext';
import { api } from '../../convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useSidebar } from '../ui/sidebar';
import {  MessageSquare } from 'lucide-react';

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [workspaceList, setWorkSpaceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const convex = useConvex();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail?._id,
      });
      // Sort workspaces by creation date, newest first
      const sortedWorkspaces = result?.sort((a, b) =>
        new Date(b._creationTime) - new Date(a._creationTime)
      );
      setWorkSpaceList(sortedWorkspaces || []);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateMessage = (message) => {
    if (!message) return 'New chat';
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h2 className="font-medium text-lg">Your Chats</h2>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 mt-2">Loading chats...</div>
      ) : workspaceList?.length === 0 ? (
        <div className="text-sm text-gray-400 mt-2">No chat history</div>
      ) : (
        <div className="space-y-2">
          {workspaceList.map((workspace) => (
            <Link
              key={workspace._id}
              href={'/workspace/' + workspace._id}
              className="block"
            >
              <div
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 lowercase">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 group-hover:text-white truncate">
                      {truncateMessage(workspace?.messages[0]?.content)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspaceHistory;
