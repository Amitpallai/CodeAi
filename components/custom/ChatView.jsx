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
  const [userInput, setUserInput] = useState( );
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateToken = useMutation(api.users.UpdateToken);

  const GetWorkspaceData = useCallback(async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      if (result?.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
    }
  }, [convex, id, setMessages]);

  const saveMessagesToDatabase = async (updatedMessages) => {
    try {
      if (!userDetail?._id) {
        toast.error('User ID is missing');
        return;
      }

      await UpdateMessages({
        user: userDetail._id,
        workspaceId: id,
        messages: updatedMessages,
      });
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const GetAiResponse = useCallback(async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      console.log({ PROMPT });
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT,
      });
      console.log(result.data.result);
      const aiResp = {
        role: 'assistant',
        content: result.data.result,
        id: crypto.randomUUID()
      };
      const updatedMessages = [...messages, aiResp];
      setMessages(updatedMessages);

      // Save AI response to database
      await saveMessagesToDatabase(updatedMessages);

      console.log("LEN", countToken(JSON.stringify(aiResp)));
      const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
      setUserDetail((prev) => prev ? { ...prev, token: token } : null);
      await UpdateToken({
        token: token,
        userId: userDetail?._id
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  }, [messages, userDetail, setMessages, UpdateToken, setUserDetail, saveMessagesToDatabase]);

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

  const onGenerate = async (input) => {
    if (userDetail?.token && userDetail?.token < 10) {
      toast("You don't have enough token to generate code");
      return;
    }

    try {
      const userMessage = { 
        role: 'user', 
        content: input,
        id: crypto.randomUUID()
      };
      const updatedMessages = [...messages, userMessage];
      
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
                backgroundColor: Colors.CHAT_BACKGROUND,
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
              backgroundColor: Colors.CHAT_BACKGROUND,
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
            backgroundColor: Colors.BACKGROUND,
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
