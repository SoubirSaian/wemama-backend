import { join } from "path";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { ICommunity } from "./Community.interface";
import CommunityModel from "./Community.model";
import mongoose from "mongoose";
import PostModel from "../Post/Post.model";

const createCommunityService = async (
    userDetails: IJwtPayload,
    file: Express.Multer.File | undefined,
    payload: {name:string}
) => {

    const {profileId} = userDetails;
    console.log(payload);

    let imageUrl = "";
    if (file) {
        imageUrl = `/uploads/community-image/${file.filename}`;
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

        // 2️⃣ Sort
        {
            $sort: { createdAt: -1 }
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
                totalComment: 1,
                isLiked: 1,
                // myLike: 0,
                createdAt: 1,
                "creator.name": 1,
                "creator.state": 1,
                "creator.city": 1
            }
        }

    ];

    const [community,allPost] = await Promise.all([
        CommunityModel.findById(communityId).lean(),
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

const searchCommunity = async (userDetails: IJwtPayload, query: Record<string,unknown>) => {

   const {profileId} = userDetails;

//    import mongoose from "mongoose";
   const profileObjectId = new mongoose.Schema.Types.ObjectId(profileId)

    const communities = await CommunityModel.find({
        members: profileObjectId
    }).lean();

    return communities;

}

const getCommunitySuggestion = async (userDetails:IJwtPayload) => {

    const {profileId} = userDetails;

    const profileObjectId = new mongoose.Types.ObjectId(profileId)

    const communities = await CommunityModel.find({
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

    const [community,allPost] = await Promise.all([
        CommunityModel.findById(communityId).lean(),
        PostModel.find({community: communityId})
            .populate({path: "creator", select: "name profileImage"})
            .select("content isPinned isCommentLocked")
            .sort({createdAt: -1})
            .lean()
    ]);

    return {community,allPost};
}

const deleteCommunity = async (communityId:string) => {

    const deleteCommunity = await CommunityModel.findByIdAndDelete(communityId);

    if (!deleteCommunity) {
        throw new ApiError(400, "Failed to delete  community.");
    }

    return null;
}

const approveCommunity = async (communityId:string) => {

    const community = await CommunityModel.findById(communityId).select("name isApproved");

    //approve community
    community.isApproved = !community.isApproved;

    await community.save();

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