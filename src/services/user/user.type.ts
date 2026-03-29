export type UserType = {
    name: string;
    username: string;
    // avatar: string;
    // bio?: string;
};

export type UserUpdateProfile = {
    name?: string;
    username?: string;
}

export type VerifyUsername = {
    username: string;
}

export type VerifyUsernameResponse = {
    available: boolean;
}

export type UserResponse = {
    status: number;
    message: string;
};