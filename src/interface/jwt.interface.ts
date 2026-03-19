

export interface IJwtPayload {
    authId: string;
    email: string;
    profileId: string
}

export interface IJwtAdminPayload {
    userId: string;
    email: string;
    role: string
}