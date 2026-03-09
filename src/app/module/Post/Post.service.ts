import mongoose from "mongoose";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { IComment, ILike, IPost } from "./Post.interface";
import PostModel, { LikeModel } from "./Post.model";
import { ENUM_POST_STATUS } from "../../../utilities/enum";
import { title } from "process";
import { is } from "zod/v4/locales";

const createPostService = async ( userDetails: IJwtPayload,payload: Partial<IPost>) => {
    
    const creatorId = userDetails.profileId;

    const newPost = await PostModel.create({
        creator: creatorId,
        community: payload.community,
        content: payload.content,
        isAnonymous: payload.isAnonymous || false
    });

    if(!newPost){
      throw new ApiError(500,"Failed to create a new post.");
    }

    return newPost;
    
};

const giveLike = async ( userDetails: IJwtPayload,payload: Partial<ILike>) => {
    
    const creatorId = userDetails.profileId;

    const newLike = await LikeModel.create({
        creator: creatorId,
        post: payload.post,
        name: payload.name,
      
    });

    if(!newLike){
      throw new ApiError(500,"Failed to give new Like.");
    }

    return newLike;
    
};

const makeComment = async ( userDetails: IJwtPayload,payload: Partial<IComment>) => {
    
    const creatorId = userDetails.profileId;

    const newComment = await PostModel.create({
        creator: creatorId,
        post: payload.post,
        comment: payload.comment || null,
        content: payload.content,
        name: payload.name,
        
    });

    if(!newComment){
      throw new ApiError(500,"Failed to create a new comment.");
    }

    return newComment;
    
};




const PostServices = { 
    createPostService ,
    giveLike,
    makeComment,
};
export default PostServices;