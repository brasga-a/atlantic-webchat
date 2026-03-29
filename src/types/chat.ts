export type ChatContact = {
    id: string;
    name: string;
    username: string;
    status: string;
    avatar: string;
    lastMessage?: string;
};

export type User = {
    name: string;
    username: string;
    avatar: string;
    bio?: string;
};
