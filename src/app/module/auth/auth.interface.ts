import { Types } from "mongoose";

export interface IAuth {
    profile: Types.ObjectId;
    email: string;
    name?: string;
    role: string;
    password: string;
    verificationCode: string;
    isEmailVerified: boolean;
    isBlocked: boolean;
}

export interface TLoginUser {
    email: string;
    password: string;
}

export interface IResetPassword {
    email: string;
    newPassword: string;
    confirmPassword: string;
}