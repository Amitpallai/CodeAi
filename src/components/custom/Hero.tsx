'use client';
import { MessagesContext } from '../../../context/MessageContext';
import { UserDetailContext } from '../../../context/UserDetailContext';
import Colors from '../../../data/Colors';
import Lookup from '../../../data/Lookup';
import { ArrowRight, Link } from 'lucide-react';
import React, { useContext, useState } from 'react';
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Id } from '../../../convex/_generated/dataModel';

function Hero() {
  const [userInput, setUserInput] = useState<string>('');
  const { setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input: string) => {
    if (!userDetail?._id) {
      setOpenDialog(true);
      return;
    }

    if (!userDetail?.token || userDetail.token < 10) {
      toast.error("You don't have enough tokens to generate code");
      return;
    }

    try {
      const msg = {
        role: 'user' as const,
        content: input,
        id: Date.now().toString(),
      };

      // Create workspace with initial message
      const workspaceId = await CreateWorkspace({
        user: userDetail._id as Id<"users">,
        messages: [msg],
      });

      if (!workspaceId) {
        toast.error('Failed to create workspace');
        return;
      }

      // Set messages in context after successful creation
      setMessages([msg]);
      setUserInput('');

      // Navigate to the workspace
      router.push('/workspace/' + workspaceId);
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace');
    }
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-42 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div
        className="p-5 border rounded-xl max-w-2xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (userInput.trim()) {
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

      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup.SUGGSTIONS.map((suggestion: string, index: number) => (
          <h2
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
            onClick={() => onGenerate(suggestion)}
          >
            {suggestion}
          </h2>
        ))}
      </div>

      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
}

export default Hero;