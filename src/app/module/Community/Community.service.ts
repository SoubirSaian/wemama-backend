import { join } from "path";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { ICommunity } from "./Community.interface";
import notification from "../../../helper/sendNotification";
import CommunityModel from "./Community.model";
import mongoose from "mongoose";
import PostModel, { CommentModel, LikeModel } from "../Post/Post.model";
import { ENUM_NOTIFICATION_TYPE } from "../../../utilities/enum";

const createCommunityService = async (
    userDetails: IJwtPayload,
    file: Express.Multer.File | undefined,
    payload: {name:string}
) => {

    const {profileId} = userDetails;
    console.log(payload);

    let imageUrl = "";
    if (file) {
        imageUrl = `uploads/community-image/${file.filename}`;
    }
    console.log(imageUrl);
    const community = await CommunityModel.create({
        creator: profileId,
        name: payload?.name,
        image: imageUrl,
        //members: [profileId], // Add the creator as the first member
    });

    if (!community) {
        throw new ApiError(400, "Failed to create new community.");
    }

    return community;
};

const getMyCommunityService = async (userDetails: IJwtPayload) => {

    const {profileId} = userDetails;
    // console.log(profileId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);
    // console.log(profileObjectId);

    // const communities = await CommunityModel.aggregate([
    //     { 
    //         $match: { 
    //             creator: profileId , 
    //             isApproved: true
    //         } 
    //     },
    //     {
    //         $lookup: {
    //             from: "posts", // collection name of Post model
    //             localField: "_id",
    //             foreignField: "community",
    //             as: "posts"
    //         }
    //     },
    //     {
    //         $addFields: {
    //             memberCount: { $size: "$members" },
    //             postCount: { $size: "$posts" }
    //         }
    //     },
    //     {
    //         $project: {
    //             name: 1,
    //             image: 1,
    //             creator: 1,
    //             memberCount: 1,
    //             postCount: 1,
    //             createdAt: 1
    //         }
    //     }
    // ]);

    const communities = await CommunityModel.find({creator: profileId, isApproved:true}).lean();
    // console.log(communities);

    return communities;
}

const joinCommunityService = async (userDetails: IJwtPayload,query: Record<string,unknown>) => {

    const {profileId} = userDetails;
    const {communityId} = query;

    const joinedCommunity = await CommunityModel.findById(communityId);

    joinedCommunity?.members.push(profileId);

    joinedCommunity.totalMember += joinedCommunity.totalMember;

    await joinedCommunity?.save();

    if (!joinedCommunity) {
        throw new ApiError(400, "Failed to join the community.");
    }

    return joinedCommunity;

}

//get single community service
const getSingleCommunityServices = async (userDetails:IJwtPayload,communityId: string) => {

    const communityObjectId = new mongoose.Types.ObjectId(communityId);
    const profileObjectId = new mongoose.Types.ObjectId(userDetails?.profileId);

    const pipeline:any = [
        // 1️⃣ Match community
        {
            $match: {
                community: communityObjectId
            }
        },

        // 3️⃣ Sort logic (IMPORTANT)
        {
            $sort: {
                isPinned: -1,     // 🔥 pinned first (true = 1)
                createdAt: -1     // latest first
            }
        },

        // 3️⃣ Populate creator (manual populate)
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },

        // 4️⃣ Add "isLiked" field (IMPORTANT PART)
        {
            $lookup: {
                from: "likes",
                let: { postId: "$_id" },
                pipeline: [
                    {
                    $match: {
                        $expr: {
                        $and: [
                            { $eq: ["$post", "$$postId"] },
                            {
                            $eq: [
                                "$creator",
                                profileObjectId
                            ]
                            }
                        ]
                        }
                    }
                    }
                ],
            as: "myLike"
            }
        },

        // 5️⃣ Convert to boolean
        {
            $addFields: {
                isLiked: { $gt: [{ $size: "$myLike" }, 0] }
            }
        },

        // 6️⃣ Clean response
        {
            $project: {
                content: 1,
                totalLike: 1,
                isPinned: 1,
                isLiked: 1,
                // myLike: 0,
                createdAt: 1,
                "creator.name": 1,
                "creator.profileImage": 1,
                // "creator.state": 1,
                "creator.city": 1
            }
        }

    ];

    const [community,allPost] = await Promise.all([
        CommunityModel.findById(communityId).select("-members").lean(),
        PostModel.aggregate(pipeline)
    ]);

    return {community,allPost};

}

const getAllJoinedCommunityServices = async (userDetails: IJwtPayload, query: Record<string,unknown>) => {

   const {profileId} = userDetails;
   const {searchText} = query;

   if(searchText){

        const communities = await CommunityModel.find({
            name: { $regex: searchText, $options: "i" },
            isApproved: true
        }).lean();

        return communities;
   }

   const profileObjectId = new mongoose.Types.ObjectId(profileId)
//    console.log(profileObjectId);

    const communities = await CommunityModel.find({
        members: profileObjectId,
        isApproved: true
    }).lean();
    
    return communities;
    // members: {$in: [profileObjectId] },

}

const searchCommunity = async ( userDetails: IJwtPayload ,query: Record<string,unknown>) => {
   const {profileId} = userDetails;
   const {searchText} = query;

   const profileObjectId = new mongoose.Types.ObjectId(profileId);


    const communities = await CommunityModel.aggregate([

        // 1️⃣ Search by name + approved
        {
            $match: {
                name: { $regex: searchText, $options: "i" },
                isApproved: true
            }
        },

        // 2️⃣ Add isCreator
        {
            $addFields: {
                isCreator: {
                    $eq: ["$creator", profileObjectId]
                }
            }
        },

        // 3️⃣ Add isMember
        {
            $addFields: {
                isMember: {
                    $in: [profileObjectId, "$members"]
                }
            }
        },

        // 4️⃣ Optional: shape response
        {
            $project: {
                name: 1,
                image: 1,
                totalMember: 1,
                totalPost: 1,
                isCreator: 1,
                isMember: 1,
                createdAt: 1
            }
        }

    ]);

    return communities;

}

const getCommunitySuggestion = async (userDetails:IJwtPayload) => {

    const {profileId} = userDetails;

    const profileObjectId = new mongoose.Types.ObjectId(profileId)

    const communities = await CommunityModel.find({
        creator: {$ne: profileObjectId },
        members: { $nin: [profileObjectId] },
        isApproved: true
    }).lean();

    return communities;

}

const editCommunityProfile = async (
    userDetails: IJwtPayload,
    file: Express.Multer.File | undefined,
    payload: {communityId?: string,name?: string}
) => {

    const {profileId} = userDetails;

    let imageUrl = "";
    if (file) {
        imageUrl = `/uploads/community-image/${file.filename}`;
    }

    const community = await CommunityModel.findByIdAndUpdate(payload.communityId,{
        name: payload?.name,
        image: imageUrl,
         // Add the creator as the first member
    },{new: true});

    if (!community) {
        throw new ApiError(400, "Failed to edit  community.");
    }

    return community;

}


//dashboard
const getALLCommunityService = async (query: Record<string,unknown>) => {

    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [communities, totalCount] = await Promise.all([

        CommunityModel.find({isApproved: true})
                    .sort({createdAt: -1})
                        .skip(skip).limit(limit)
                           .lean(),
    
        CommunityModel.countDocuments({isApproved:true}).lean()
    ])

    const totalPage = Math.ceil(totalCount / limit);

    return {
        meta:{page,limit: 10,total: totalCount, totalPage},
        communities
    };
   
}

const getALLCommunityRequestService = async (query: Record<string,unknown>) => {

    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [communities, totalCount] = await Promise.all([

        CommunityModel.find({isApproved: false})
            .populate({path: "creator", select: "name"})
                .select("name")
                    .sort({createdAt: -1})
                        .skip(skip).limit(limit)
                           .lean(),
    
        CommunityModel.countDocuments({isApproved:false}).lean()
    ])

    const totalPage = Math.ceil(totalCount / limit);

    return {
        meta:{page,limit: 10,total: totalCount, totalPage},
        communities
    };
   
}

const getSingleCommunityDetails = async (communityId:string) => {

    const communityObjectId = new mongoose.Types.ObjectId(communityId)

    const pipeline: any = [

        // 1️⃣ Match community
        {
            $match: {
                community: communityObjectId
            }
        },

        // 2️⃣ Populate creator
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" },

        // 3️⃣ Sort logic (IMPORTANT)
        {
            $sort: {
                isPinned: -1,     // 🔥 pinned first (true = 1)
                createdAt: -1     // latest first
            }
        },

        // 4️⃣ Shape response
        {
            $project: {
                content: 1,
                isPinned: 1,
                isCommentLocked: 1,
                createdAt: 1,
                "creator.name": 1,
                "creator.profileImage": "$creator.profileImage"
            }
        }

    ];

    const [community,allPost] = await Promise.all([
        CommunityModel.findById(communityId).select("-members").lean(),
        PostModel.aggregate(pipeline)
    ]);

    return {community,allPost};
}



const deleteCommunity = async (communityId: string) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  const communityObjectId = new mongoose.Types.ObjectId(communityId);

  try {

    // 🔹 Step 1: delete community
    const community = await CommunityModel.findByIdAndDelete(
      communityObjectId,
      { session }
    );

    if (!community) {
      throw new ApiError(500, "Failed to delete community.");
    }

    // 🔹 Step 2: get postIds (lightweight)
    const posts = await PostModel.aggregate([
      { $match: { community: communityObjectId } },
      { $project: { _id: 1 } }
    ]).session(session);

    const postIds = posts.map(p => p._id);

    // 🔹 Step 3: parallel delete
    await Promise.all([
      LikeModel.deleteMany({ post: { $in: postIds } }).session(session),
      CommentModel.deleteMany({ post: { $in: postIds } }).session(session),
      PostModel.deleteMany({ community: communityObjectId }).session(session),
    ]);

    await session.commitTransaction();
    session.endSession();

    return null;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("community deletion error:", error);
    throw new ApiError(500,"Failed to delete community.");
  }
};

const approveCommunity = async (communityId:string) => {

    const community = await CommunityModel.findById(communityId).select("creator name isApproved");

    //approve community
    community.isApproved = !community.isApproved;

    await community.save();

    //send notification to community creator
    await notification.createNotification({
        toId: community?.creator,
        toModel: "User",
        title: `Admin approved your new community.`,
        type: ENUM_NOTIFICATION_TYPE.APPROVE_COMMUNITY,
        referenceId: community?._id || communityId,
        referenceModel: "Community",
      });

    let msg = community.isApproved ? "Community is approved" : "Community is disapproved."

    return {
        community,
        msg
    }

}

const CommunityServices = { 
    createCommunityService,
    getMyCommunityService,
    joinCommunityService,
    getSingleCommunityServices,
    getAllJoinedCommunityServices,
    searchCommunity,
    getCommunitySuggestion, 
    editCommunityProfile,
    getALLCommunityService,
    getALLCommunityRequestService,
    getSingleCommunityDetails,
    deleteCommunity,
    approveCommunity,
 };

export default CommunityServices;