'use client';
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '../components/custom/Header';
import { MessagesContext } from '../../context/MessageContext';
import { UserDetailContext } from '../../context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { SidebarProvider } from '../components/ui/sidebar';
import AppSideBar from '../components/custom/AppSidebar';
import { ActionContext } from '../../context/ActionContext';
import { useRouter } from 'next/navigation';

interface UserDetail {
    _id: string;
    name: string;
    email: string;
    picture: string;
    token: number;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    id: string;
}

function Provider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [action, setAction] = useState<{ actionType: 'deploy' | 'export'; timeStamp: number } | null>(null);
  const router = useRouter();
  const convex = useConvex();

  const IsAuthenticated = useCallback(async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if(!user) {
        router.push('/')
        return
      }
      // Fetch user from the database
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result as UserDetail);
    }
  }, [router, convex]);

  useEffect(() => {
    IsAuthenticated();
  }, [IsAuthenticated]);

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY as string}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen={false}>
                  <AppSideBar />
                  <main className="w-full">
                    <Header />
                    {children}
                  </main>
                </SidebarProvider>
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;