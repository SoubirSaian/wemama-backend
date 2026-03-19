
export interface IAdmin {
    name: string;
    email: string;
    phone?: string;
    image: string;
    password: string;
    role: string;
    verificationCode: string;
    isEmailVerified?: boolean;
    isBlocked: boolean;
}

export interface IAdminResetPassword{
    email: string,
    newPassword: string,
    confirmPassword: string
}