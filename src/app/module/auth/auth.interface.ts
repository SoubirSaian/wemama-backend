import { Types } from "mongoose";

export interface IAuth {
    profile: Types.ObjectId;
    profileModel: string;
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
    role?: string;
}

export interface IResetPassword {
    email: string;
    newPassword: string;
    confirmPassword: string;
}