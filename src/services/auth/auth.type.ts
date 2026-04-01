export type SignInInput = {
    identifier: string,
    password: string
}

export type SignUpInput = {
    username: string,
    email: string,
    password: string,
    confirm_password: string,
}

export type AuthResponse = {
    status: number;
    message: string;
};