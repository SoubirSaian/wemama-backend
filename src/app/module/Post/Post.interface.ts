import { Types } from "mongoose";

export interface IPost {
  creator: Types.ObjectId;
  community: Types.ObjectId;
  content: string;
  isAnonymous: boolean;

}

export interface ILike {
  creator: Types.ObjectId;
  post: Types.ObjectId;
  name: string;
  createdAt: Date;

}
export interface IComment {
  creator: Types.ObjectId;
  name : string;
  comment?: Types.ObjectId;
  content: string;
  post: Types.ObjectId;
  createdAt: Date;
}

export interface INearbyPostParams {
  // userId: string;
  latitude: number;
  longitude: number;
  radiusKm: number; // 30 or 50
}