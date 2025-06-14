'use client';
import React, { useContext, useEffect, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import Lookup from '../../data/Lookup';
import { MessagesContext } from '../../context/MessagesContext';
import Prompt from '../../data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { countToken } from './ChatView';
import { UserDetailContext } from '../../context/UserDetailContext';
import { toast } from 'sonner';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '../../context/ActionContext';
import { Loader } from "../ui/loader";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    (action?.actionType == 'deploy' || action?.actionType == 'export') &&
      setActiveTab('preview');
  }, [action]);

  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const UpdateToken = useMutation(api.users.UpdateToken);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      if (!result) {
        throw new Error('Workspace not found');
      }
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === 'user' && !loading) {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    if (loading) return; // Prevent multiple calls
    
    if (userDetail?.token < 10) {
      toast.error("You don't have enough token to generate code");
      return;
    }

    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + ' ' + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post('/api/gen-ai-code', {
        prompt: PROMPT,
      });

      if (!result?.data?.files) {
        throw new Error('No code generated');
      }

      const aiResp = result.data;
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergedFiles);
      
      await UpdateFiles({
        workspaceId: id,
        files: aiResp?.files,
      });

      const tokenCount = countToken(JSON.stringify(aiResp));
      const token = Number(userDetail?.token) - Number(tokenCount);
      const updatedUser = { ...userDetail, token };
      setUserDetail(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      await UpdateToken({
        token,
        userId: userDetail?._id,
      });

      setActiveTab('preview');
      toast.success('Code generated successfully!');
    } catch (error) {
      console.error('Error generating code:', error);
      // Remove the last user message if code generation fails
      setMessages(messages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab('code')}
            className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2  rounded-full'} `}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab('preview')}
            className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2  rounded-full'} `}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        key={JSON.stringify(files)}
        files={files}
        template="react"
        theme={'dark'}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{ externalResources: ['https://cdn.tailwindcss.com'] }}
      >
        <SandpackLayout>
          {activeTab == 'code' ? (
            <>
              <SandpackFileExplorer style={{ height: '80vh' }} />
              <SandpackCodeEditor style={{ height: '80vh' }} />
            </>
          ) : (
            <>
              <SandpackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="p-10 bg-gray-900 bg-opacity-80 absolute top-0 w-full h-full flex justify-center items-center">
          <Loader size="lg" text="Generating your files..." />
        </div>
      )}
    </div>
  );
}

export default CodeView;