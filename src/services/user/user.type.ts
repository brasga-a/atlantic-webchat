export type UserType = {
    id: string;
    name: string;
    username: string;
    email?: string;
    avatar_url?: string;
    status?: string;
};

export type UserUpdateProfile = {
    name?: string;
    username?: string;
    email?: string;
}

export type VerifyUsername = {
    username: string;
}

export type VerifyEmail = {
    email: string;
}

export type VerifyResponse = {
    available: boolean;
}

export type VerifyUsernameResponse = {
    available: boolean;
}

export type UserResponse = {
    status: number;
    message: string;
};