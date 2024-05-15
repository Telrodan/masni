export interface AuthData {
    email: string;
    password: string;
}

export interface ResetPasswordData {
    password: string;
    passwordConfirm: string;
    resetToken: string;
}
