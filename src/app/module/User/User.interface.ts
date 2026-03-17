import { Types } from "mongoose";

export interface IUser {
    auth: Types.ObjectId;
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
        subscribedAt: Date;
        expiredAt: Date;
    };
    matchCount: number
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
  address: string;
  children: Object[];
  DOB: Date;
  state: string;
  city :string;
  bio?: string;
  interesteds: string[];
  mumStage?: string;
  distanceKm: number;
}

// export interface IUserRole {

// }