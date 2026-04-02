import { Types } from "mongoose";

export interface IUser {
    auth: Types.ObjectId;
    agoraUid: number;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    images: string[];
    location: object
    address: string;
    children: Object[];
    DOB: Date;
    state: string;
    city: string;
    country: string;
    bio: string;
    interesteds: string[];
    mumStage: string;
    subscription: {
        isSubscribed: boolean;
        planPrice: string;
        subscribedAt: Date;
        expiredAt: Date;
    };
    matchCount: number;
    streakCount: number;
    lastCheckInDate: Date;
}





export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IAddLocation {
    address?: string;
    latitude: number;
    longitude: number;
}

export interface NearbyUserResult {
  _id: Types.ObjectId;
  name: string;
  email: string,
  profileImage: string;
  images: string[];
  location: object;
  address: string;
  children: Object[];
  DOB: Date;
  state: string;
  city :string;
  bio?: string;
  interesteds: string[];
  mumStage?: string;
  matchCount: number;
  distanceKm: number;
}

// export interface IUserRole {

// }