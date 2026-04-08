import { Types } from "mongoose";

export interface IPost {
  creator: Types.ObjectId;
  community: Types.ObjectId;
  content: string;
  totalLike: number;
  totalComment: number
  isAnonymous: boolean;
  isPinned: boolean;
  isCommentLocked: boolean;
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
  parentComment: Types.ObjectId;
  content: string;
  post: Types.ObjectId;
  createdAt: Date;
}


export type TCommentPayload  = {
  community: Types.ObjectId;
  post: Types.ObjectId;
  parentComment: Types.ObjectId;
  content: string;
  name : string;
}