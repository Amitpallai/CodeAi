import { createContext, Dispatch, SetStateAction } from "react";

interface UserDetail {
    _id: string;
    name: string;
    email: string;
    picture: string;
    token: number;
    // Add other user properties here as needed
}

export const UserDetailContext = createContext<{
    userDetail: UserDetail | null;
    setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}>({
    userDetail: null,
    setUserDetail: () => {},
})