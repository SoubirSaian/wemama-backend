import { join } from "path";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { ICommunity } from "./Community.interface";
import CommunityModel from "./Community.model";

const createCommunityService = async (userDetails: IJwtPayload,file: Express.Multer.File | undefined,payload: Partial<ICommunity>) => {

    const {profileId} = userDetails;

    let imageUrl = "";
    if (file) {
        imageUrl = `/uploads/community-image/${file.filename}`;
    }

    const community = await CommunityModel.create({
        creator: profileId,
        name: payload.name,
        img: imageUrl,
        members: [profileId], // Add the creator as the first member
    });

    if (!community) {
        throw new ApiError(400, "Failed to create new community.");
    }

    return community;
};

const getMyCommunityService = async (userDetails: IJwtPayload) => {

    const {profileId} = userDetails;

    const communities = await CommunityModel.aggregate([
        { 
            $match: { creator: profileId } 
        },
        {
            $lookup: {
            from: "posts", // collection name of Post model
            localField: "_id",
            foreignField: "community",
            as: "posts"
            }
        },
        {
            $addFields: {
            memberCount: { $size: "$members" },
            postCount: { $size: "$posts" }
            }
        },
        {
            $project: {
            name: 1,
            image: 1,
            creator: 1,
            memberCount: 1,
            postCount: 1,
            createdAt: 1
            }
        }
        ]);
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

const getSingleCommunityServices = async (userDetails: IJwtPayload) => {

    //get a community details
    //alongside with all post, post like and comment

}

const CommunityServices = { 
    createCommunityService,
    getMyCommunityService,
    joinCommunityService,
    getSingleCommunityServices
 };

export default CommunityServices;