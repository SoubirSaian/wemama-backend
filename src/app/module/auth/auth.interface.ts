import { Types } from "mongoose";

export interface IAuth {
    profile: Types.ObjectId;
    name?: string;
    phone?: string;
    email: string;
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