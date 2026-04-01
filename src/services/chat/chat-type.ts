export type CreateChat = {
    identifier: string;
}

export type CreateChatResponse = {
    message: string;
    chat_id: string;
}

export type LastMessage = {
    content: string,
    sender_id: string,
    created_at: string,
}

export type Chat = {
    id: string,
    last_message: LastMessage | null,
    name: string,
    username: string | null,
    contact_id: string | null,
    status: string,
    avatar_url: string | null,
    type: string,
    created_at: string,
    updated_at: string,
}
export type ChatResponse = {
    message: string;
    status: number;
}

export type MessageType = {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    type: string;
    reply_to_id: string | null;
    edited_at?: string | null;
    deleted_at?: string | null;
    created_at: string;
}