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
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const [isPolling, setIsPolling] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateToken = useMutation(api.users.UpdateToken);
  const lastMessageRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

  const GetWorkspaceData = useCallback(async () => {
    if (!id || !userDetail?._id || loading) return;
    
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      
      if (!result) {
        console.error('Workspace not found');
        return;
      }

      if (result.user !== userDetail._id) {
        console.error('Unauthorized access to workspace');
        return;
      }

      // Only update messages if they've actually changed
      if (result?.messages) {
        const messageArray = Array.isArray(result.messages) ? result.messages : [result.messages];
        const validMessages = messageArray.filter(msg => msg && msg.content);
        
        // Compare with current messages to prevent unnecessary updates
        const currentMessagesStr = JSON.stringify(messages);
        const newMessagesStr = JSON.stringify(validMessages);
        
        if (currentMessagesStr !== newMessagesStr) {
          setMessages(validMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      // Don't reset messages on error to prevent UI flicker
    }
  }, [convex, id, setMessages, userDetail?._id, loading, messages]);

  const saveMessagesToDatabase = async (updatedMessages) => {
    if (!userDetail?._id || !id) {
      toast.error('Missing user or workspace information');
      return;
    }

    try {
      const validMessages = updatedMessages.filter(msg => msg && msg.content);
      if (validMessages.length === 0) return;

      await UpdateMessages({
        workspaceId: id,
        user: userDetail._id,
        messages: validMessages,
      });
    } catch (error) {
      console.error('Error saving messages:', error);
      toast.error('Failed to save messages');
    }
  };

  const GetAiResponse = useCallback(async () => {
    if (!messages?.length || !userDetail?._id || loading) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user' || lastMessage.id === lastMessageRef.current) return;

    try {
      setLoading(true);
      lastMessageRef.current = lastMessage.id;

      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT,
      });

      if (!result?.data?.result) {
        throw new Error('Invalid AI response');
      }

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

      setUserDetail(prev => prev ? { ...prev, token: newTokenCount } : null);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error(error.message || 'Failed to get AI response');
      // Don't remove the user message on error, just show the error
    } finally {
      setLoading(false);
      lastMessageRef.current = null;
    }
  }, [messages, userDetail, setMessages, UpdateToken, setUserDetail, saveMessagesToDatabase, loading]);

  // Initial load
  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id, GetWorkspaceData]);

  // Handle AI responses
  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user' && !loading) {
        GetAiResponse();
      }
    }
  }, [messages, GetAiResponse, loading]);

  // Polling with cleanup
  useEffect(() => {
    if (id && userDetail?._id && !loading) {
      const startPolling = () => {
        if (!isPolling) {
          setIsPolling(true);
          pollingTimeoutRef.current = setTimeout(() => {
            GetWorkspaceData();
            setIsPolling(false);
          }, 2000);
        }
      };

      startPolling();
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [id, userDetail?._id, GetWorkspaceData, loading, isPolling]);

  const onGenerate = async (input) => {
    if (!input?.trim() || loading) return;
    
    if (!userDetail?.token || userDetail.token < 10) {
      toast.error("You don't have enough tokens to generate code");
      return;
    }

    try {
      const userMessage = { 
        role: 'user', 
        content: input.trim(),
        id: crypto.randomUUID()
      };
      
      const updatedMessages = Array.isArray(messages) ? [...messages, userMessage] : [userMessage];
      setMessages(updatedMessages);
      setUserInput('');
      await saveMessagesToDatabase(updatedMessages);
    } catch (error) {
      console.error('Error saving user message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="relative h-[83vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-10">
        {messages?.length > 0 && messages.map((msg, index) => (
          <div
            key={msg.id || index}
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
            <div className="flex flex-col">
              {msg.content}
            </div>
          </div>
        ))}
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
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (userInput && !loading) {
                    onGenerate(userInput);
                  }
                }
              }}
              disabled={loading}
            />
            {userInput && !loading && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 w-10 h-10 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
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