import { createContext } from 'react';

interface Action {
    actionType: 'deploy' | 'export';
    timeStamp: number;
}

export const ActionContext = createContext<{
    action: Action | null;
    setAction: (action: Action) => void;
}>({
    action: null,
    setAction: () => {},
})