import { createContext } from "react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    id: string;
}

export const MessagesContext = createContext<{
    messages: Message[];
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}>({
    messages: [],
    setMessages: () => {},
})