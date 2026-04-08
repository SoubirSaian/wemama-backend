import mongoose from "mongoose";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { IComment, ILike, IPost, TCommentPayload } from "./Post.interface";
import PostModel, { CommentModel, LikeModel } from "./Post.model";
import CommunityModel from "../Community/Community.model";
// import { ENUM_POST_STATUS } from "../../../utilities/enum";


const createPostService = async ( userDetails: IJwtPayload,payload: Partial<IPost>) => {
    
    const creatorId = userDetails.profileId;

    // const creatorObjectId = new mongoose.Types.ObjectId(creatorId);
    // console.log(creatorObjectId);

    //check if this user is a member or creator
    const community:any = await CommunityModel.findById(payload.community).lean();
    // console.log(community);

    // const isCreator = community?.creator.toString() === creatorId;
    // const isMember = community?.members.includes(creatorObjectId);
    // const isMember = community?.members.some((id: any) => id.toString() === creatorId)
    // console.log(isCreator,isMember);

    if(community?.creator.toString() !== creatorId && !community?.members.some((id: any) => id.toString() === creatorId)){
        throw new ApiError(403,"To make a post, you have to join the community first.");
    }

    const newPost = await PostModel.create({
        creator: creatorId,
        community: payload.community,
        content: payload.content,
        isAnonymous: payload.isAnonymous || false
    });

    if(!newPost){
      throw new ApiError(500,"Failed to create a new post.");
    }

    //update community post count
    await CommunityModel.findByIdAndUpdate(
        payload.community,
        { $inc: { totalPost: 1 } },
        { new: true }
    );

    return newPost;

    // if (
    //     community?.creator.toString() !== creatorId &&
    //     !community?.members.some((id: any) => id.toString() === creatorId)
    // ) {
    //     throw new ApiError(403, "To make a post, you have to join the community first.");
    // }

    // const community = await CommunityModel.findOne({
    // _id: payload.community,
    // isApproved: true,
    // $or: [
    //     { creator: creatorId },
    //     { members: creatorId }
    // ]
    // });

    // if (!community) {
    //     throw new ApiError(403, "Not allowed");
    // }
    
};

const toggleLikeService = async ( 
    userDetails: IJwtPayload,
    payload: {community:string,post:string,name:string}
) => {
    
    const creatorId = userDetails.profileId;
    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

    //check if user can like or not
    const community = await CommunityModel.findOne({
        _id: payload.community,
        isApproved: true,
        $or: [
            { creator: creatorObjectId },
            { members: creatorObjectId }
        ]
    }).lean();

    if (!community) {
        throw new ApiError(403, "You can not like this post. You have to join the community to make interaction.");
    }

    // check if already liked
    const existingLike = await LikeModel.findOne({
        creator: creatorId,
        post: payload.post
    });

    if (existingLike) {
        // 🔴 UNLIKE

        await LikeModel.deleteOne({ _id: existingLike._id });

        //decrease total like value
        await PostModel.findByIdAndUpdate(
            payload.post,
            { $inc: { totalLike: -1 } }
        );

        return {
            liked: false,
            message: "Post unliked"
        };

    } else {
        // 🔵 LIKE

        await LikeModel.create({
            creator: creatorId,
            post: payload.post,
            name: payload.name
        });

        await PostModel.findByIdAndUpdate(
            payload.post,
            { $inc: { totalLike: 1 } }
        );

        return {
            liked: true,
            message: "Post liked"
        };
    }

};

const makeComment = async ( userDetails: IJwtPayload,payload: TCommentPayload) => {
    
    const creatorId = userDetails.profileId;
    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

    //check if user can like or not
    const community = await CommunityModel.findOne({
        _id: payload.community,
        isApproved: true,
        $or: [
            { creator: creatorObjectId },
            { members: creatorObjectId }
        ]
    }).lean();

    if (!community) {
        throw new ApiError(403, "You can not comment this post. You have to join the community to make interaction.");
    }

    const newComment = await CommentModel.create({
        creator: creatorId,
        post: payload.post,
        parentComment: payload.parentComment || null,
        content: payload.content,
        name: payload.name,
        
    });

    if(!newComment){
      throw new ApiError(500,"Failed to add a new comment.");
    }

    //increase comment count by 1
    await PostModel.findByIdAndUpdate(
        payload.post,
        { $inc: { totalComment: 1 } },
        { new: true }
    );

    return newComment;
    
};

const getAllCommentService = async ( postId: string) => {
    
    // const creatorId = userDetails.profileId;
    const postObjectId = new mongoose.Types.ObjectId(postId);

    const post = await PostModel.findById(postId)
               .select({path:"creator", select: "name profileImage city"}).lean();

    const comments = await CommentModel.aggregate([

        // 1️⃣ Top-level comments
        {
            $match: {
                post: postObjectId,
                parentComment: null
            }
        },

        // 2️⃣ Sort
        {
            $sort: { createdAt: -1 }
        },

        // 3️⃣ Populate creator (parent)
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" },

        // 4️⃣ Get replies
        {
            $lookup: {
                from: "comments",
                let: { commentId: "$_id" },
                pipeline: [

                    {
                        $match: {
                            $expr: {
                                $eq: ["$parentComment", "$$commentId"]
                            }
                        }
                    },

                    // populate reply creator
                    {
                    $lookup: {
                        from: "users",
                        localField: "creator",
                        foreignField: "_id",
                        as: "creator"
                    }
                    },
                    { $unwind: "$creator" },

                    { $sort: { createdAt: 1 } },

                    // 🔥 shape reply data
                    {
                    $project: {
                        content: 1,
                        createdAt: 1,
                        "creator.name": 1,
                        "creator.profileImage": "$creator.profileImage" // map correctly
                    }
                    }

                ],
                as: "replies"
            }
        },

        // 🔥 shape parent comment data
        {
            $project: {
                content: 1,
                createdAt: 1,
                replies: 1,
                "creator.name": 1,
                "creator.profileImage": "$creator.profileImage"
            }
        }

    ]);

    return {
        post,
        comments
    };
    
};

const editCommentService = async (
  userDetails: IJwtPayload,
  commentId: string,
  payload: {content: string}
) => {

    const {profileId} = userDetails;

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 🔒 permission check
  if (comment.creator.toString() !== profileId.toString()) {
    throw new ApiError(403, "You can't edit this comment");
  }

  comment.content = payload.content;
  await comment.save();

  return comment;
};


//soft delete
const deleteCommentService = async (
  userId: string,
  role: string,
  commentId: string
) => {

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const post = await PostModel.findById(comment.post);

  // 🔒 permission check
  const isCreator = comment.creator.toString() === userId.toString();
  const isPostOwner = post?.creator.toString() === userId.toString();
  const isAdmin = role === "Admin" || role === "Super_Admin";

  if (!isCreator && !isPostOwner && !isAdmin) {
    throw new ApiError(403, "You can't delete this comment");
  }

  // ✅ Soft delete
  comment.isDeleted = true;
  comment.deletedAt = new Date();
  comment.content = "This comment has been deleted";

  await comment.save();

  return { message: "Comment deleted" };
};


//manage post


const pinPostService = async (userDetails: IJwtPayload,postId: string) => {

    const {profileId} = userDetails;

    //check if user can delete this or not
    const post: any = await PostModel.findById(postId)
         .populate({path: "community",select:"creator"});

    if(profileId !== post?.community?.creator.toString()){
        throw new ApiError(400,"You can not pin this post.");
    }

    post.isPinned = !post.isPinned;
    await post.save();

    if(!post){
        throw new ApiError(500,"Failed to pinned post");
    }

    return null;
    
}

const lockCommentService = async (userDetails: IJwtPayload,postId:string) => {

    const {profileId} = userDetails;

    //check if user can delete this or not
    const post: any = await PostModel.findById(postId)
         .populate({path: "community",select:"creator"});

    if(profileId !== post?.community?.creator.toString()){
        throw new ApiError(400,"You can not lock comment of this post.");
    }

    post.isCommentLocked = !post.isCommentLocked;
    await post.save();

    if(!post){
        throw new ApiError(500,"Failed to lock comment.");
    }

    return null;

}

const deletePostService = async (userDetails: IJwtPayload,postId: string) => {

    const {profileId} = userDetails;

    //check if user can delete this or not
    const post: any = await PostModel.findById(postId)
        .populate({path: "community",select:"creator"})
            .lean();

    if(profileId !== post?.community?.creator.toString()){
        throw new ApiError(400,"You can not delete this post.");
    }

    const deletedPost = await PostModel.findByIdAndDelete(postId).lean();

    if(!deletedPost){
        throw new ApiError(500,"Failed to delete post");
    }

    return null;

}




const PostServices = { 
    createPostService ,
    toggleLikeService,
    makeComment,
    getAllCommentService,
    pinPostService,
    lockCommentService,
    deletePostService
};
export default PostServices;