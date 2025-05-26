'use client';
import { MessagesContext } from '../../context/MessagesContext';
import { UserDetailContext } from '../../context/UserDetailContext';
import { api } from '../../convex/_generated/api';
import Colors from '../../data/Colors';
import Lookup from '../../data/Lookup';
import Prompt from '../../data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';
import { Loader } from '../ui/loader';

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateToken = useMutation(api.users.UpdateToken);

  const GetWorkspaceData = useCallback(async () => {
    try {
      if (!id || !userDetail?._id) return;
      
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      console.log('Workspace data:', result); // Debug log
      
      if (!result) {
        console.error('Workspace not found');
        return;
      }

      if (result.user !== userDetail._id) {
        console.error('Unauthorized access to workspace');
        return;
      }

      if (result?.messages) {
        const messageArray = Array.isArray(result.messages) ? result.messages : [result.messages];
        setMessages(messageArray.filter(msg => msg && msg.content)); // Filter out invalid messages
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      setMessages([]);
    }
  }, [convex, id, setMessages, userDetail?._id]);

  const saveMessagesToDatabase = async (updatedMessages) => {
    try {
      if (!userDetail?._id || !id) {
        toast.error('Missing user or workspace information');
        return;
      }

      const validMessages = updatedMessages.filter(msg => msg && msg.content);
      if (validMessages.length === 0) {
        console.error('No valid messages to save');
        return;
      }

      const result = await UpdateMessages({
        workspaceId: id,
        user: userDetail._id,
        messages: validMessages,
      });

      console.log('Messages updated successfully:', result);
    } catch (error) {
      console.error('Error saving messages:', error);
      GetWorkspaceData();
    }
  };

  const GetAiResponse = useCallback(async () => {
    if (!messages?.length || !userDetail?._id) return;

    try {
      setLoading(true);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'user') return;

      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      console.log('Sending prompt:', PROMPT);
      
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT,
      });


      const aiResp = {
        role: 'assistant',
        content: result.data.result,
        id: crypto.randomUUID()
      };

      const updatedMessages = [...messages, aiResp];
      
      setMessages(updatedMessages);

      await saveMessagesToDatabase(updatedMessages);

      const tokenCount = countToken(JSON.stringify(aiResp));
      const newTokenCount = Number(userDetail?.token) - Number(tokenCount);
      
      if (newTokenCount < 0) {
        throw new Error('Insufficient tokens');
      }

      await UpdateToken({
        token: newTokenCount,
        userId: userDetail._id
      });

      setUserDetail((prev) => prev ? { ...prev, token: newTokenCount } : null);
    } catch (error) {
      console.error('Error getting AI response:', error);
      GetWorkspaceData();
    } finally {
      setLoading(false);
    }
  }, [messages, userDetail, setMessages, UpdateToken, setUserDetail, saveMessagesToDatabase, GetWorkspaceData]);

  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id, GetWorkspaceData]);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === 'user') {
        GetAiResponse();
      }
    }
  }, [messages, GetAiResponse]);

  useEffect(() => {
    if (id && userDetail?._id) {
      const refreshInterval = setInterval(() => {
        GetWorkspaceData();
      }, 2000);

      return () => clearInterval(refreshInterval);
    }
  }, [id, userDetail?._id, GetWorkspaceData]);

  const onGenerate = async (input) => {
    if (!input?.trim()) return;
    
    if (userDetail?.token && userDetail?.token < 10) {
      toast("You don't have enough token to generate code");
      return;
    }

    try {
      const userMessage = { 
        role: 'user', 
        content: input.trim(),
        id: crypto.randomUUID()
      };
      const updatedMessages = Array.isArray(messages) ? [...messages, userMessage] : [userMessage];
      
      // Update local state
      setMessages(updatedMessages);
      setUserInput('');

      // Save to database
      await saveMessagesToDatabase(updatedMessages);
    } catch (error) {
      console.error('Error saving user message:', error);
    }
  };
  return (
    <div className="relative h-[83vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-10">
        {messages?.length > 0 && messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-start justify-start leading-7"
              style={{
                backgroundColor: "#272727",
              }}
            >
               {msg.role === 'user' && (
              <Image 
                src={userDetail?.picture || ''} 
                alt="userImage" 
                width={30} 
                height={30} 
                className="rounded-full" 
              />
            )}
            
            {msg?.role == 'user' ? <div className="flex flex-col">
              {msg?.content}
            </div> : <div className="flex flex-col">
              {msg?.content}
            </div>}

          </div>
        ))
        }
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-center justify-start"
            style={{
              backgroundColor:"#272727",
            }}
          >
            <Loader size="sm" text="Generating response..." />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            onClick={toggleSidebar}
            src={userDetail?.picture || ''}
            alt="userImage"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
          />
        )}
        <div
          className="p-5 border rounded-xl max-w-2xl w-full mt-3"
          style={{
            backgroundColor:"#151515",
          }}
        >
           <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-28 max-h-50 resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (userInput) {
                  onGenerate(userInput);
                }
              }
            }}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 w-10 h-10 rounded-md cursor-pointer"
            />
          )}
        </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
