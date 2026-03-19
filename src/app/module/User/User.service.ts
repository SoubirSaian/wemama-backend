import mongoose, { Types, PipelineStage } from 'mongoose';
import ApiError from "../../../error/ApiError";
import {  IAddLocation, IChangePassword, IUser, NearbyUserResult } from "./User.interface";
import UserModel from "./User.model";
import { JwtPayload } from "jsonwebtoken";
import deleteOldFile from "../../../utilities/deleteFile";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { email } from "zod";
import AuthModel from "../auth/auth.module";
import { syncImages } from "../../../helper/multyImages";
import { get } from "http";
import { ConversationModel } from '../Chat/Chat.model';
import { add } from 'winston';

const getUserProfile = async (userDetails: IJwtPayload) => {
    const { profileId } = userDetails;

    const profile = await UserModel.findById(profileId).lean();

    if (!profile) {
        throw new ApiError(404, "User profile not found.");
    }

    return profile;
}

const updateUserProfile = async (
  userDetails: IJwtPayload,
  profileImage: any,
  descriptionImages: any,
  payload: Partial<IUser> 
) => {

  const { profileId } = userDetails;

  const { name, DOB, state, city, bio, children, currentImages } = payload as any;
  // console.log(profileImage);
  // console.log(descriptionImages);
  const profile = await UserModel.findById(profileId);

  if (!profile) {
    throw new ApiError(404, "User profile not found to update.");
  }

  // const updatedImages = syncImages(
  //   profile.images || [],
  //   currentImages,
  //   files,
  //   "uploads/profile-image"
  // );
  const removedImages: string[] = profile.images || [];
  let newImages: string[] = [];
  let newProfileImage;
  // console.log("newImages:", newImages);
  // console.log("removedImages:", removedImages);
  //update profile image
  if (profileImage) {
      newProfileImage = `uploads/profile-image/${profileImage?.filename}`;   
      //delete old image
      deleteOldFile(profile.profileImage);
  }

  //update description image
  if(descriptionImages && descriptionImages.length > 0 ){
    // console.log("enterd");
    // map new uploaded images
    newImages = descriptionImages?.map((file: any) => `uploads/description-image/${file.filename}`);
    // console.log(newImages);
    //delete old image
    removedImages.forEach((img) => {
      deleteOldFile(img);
    });
  }


  const updatedProfile = await UserModel.findByIdAndUpdate(
    profileId,
    {
      name,
      DOB,
      state,
      city,
      bio,
      children,
      profileImage: profileImage ? newProfileImage : profile.profileImage,
      images: newImages.length > 0 ? newImages : profile.images // if new images uploaded use them, otherwise keep old images
    },
    { new: true, runValidators: true }
  );

  return updatedProfile;
};

const completeUserProfile = async (userDetails: IJwtPayload, file: Express.Multer.File | undefined, payload: Partial<IUser>) => {
    const { authId, email, profileId } = userDetails;

    let updateData: any = { ...payload };

    if (file) {
        updateData.profileImage =  `uploads/profile-image/${file.filename}`;
    }

    // console.log(updateData);
    // console.log(typeof profileImage, profileImage);

    const profile = await UserModel.findByIdAndUpdate(
        profileId,
        updateData,
        { new: true }
    );

    if (!profile) {
        throw new ApiError(500, "Failed to complete profile.");
    }

    // await AuthModel.findByIdAndUpdate(userId, { profile: profile._id });

    // return {
    //     name: profile.name,
    //     email: profile.email,
    // };
    return profile;

}

const addLocationService = async (userDetails: JwtPayload,payload: IAddLocation) => {
    // Service logic goes here
    const {profileId} = userDetails;
    const {address, latitude,longitude} = payload;

    const profile = await UserModel.findById(profileId);

    if(address) profile.address = address;

    if(latitude && longitude){
      profile.location.coordinates = [Number(longitude),Number(latitude)];
      await profile.save();
    }

    if(!profile){
      throw new ApiError(400,"Failed to add location.");
    }

    return {
      name: profile.name,
      address: profile?.address,
      location: profile?.location
    }
   
}


// const addBankDetailService = async (userDetails: JwtPayload,payload: IBankDetail) => {
//     // Service logic goes here
//     const {profileId,role} = userDetails;
//   // console.log(payload);

//     let profile : ICustomer| ISupplier | null = null;

//     switch (role) {
//         case ENUM_USER_ROLE.CUSTOMER:
//              profile = await CustomerModel.findByIdAndUpdate(profileId,{
//               $set: payload
//              } , {new: true});
//             break;

//         case ENUM_USER_ROLE.SUPPLIER:
//             profile = await SupplierModel.findByIdAndUpdate(profileId, {
//               $set: payload
//             }, {new: true});
//             break;
             
//         default:{
//             // const _exhaustiveCheck: never = role;
//             throw new ApiError(400, "Invalid user role");
//         }

//     }
//     // console.log(profile);
//     if(!profile){
//         throw new ApiError(500,'Failed to add location in the profile');
//     }  

//     return { name:profile.name,email:profile.email, location: profile.location };
// }

const changePasswordService = async (userDetails: IJwtPayload, payload: IChangePassword) => {
    // Service logic goes here
    const { authId } = userDetails;
    const { currentPassword, newPassword } = payload;

    const user =  await AuthModel.findById(authId).select('+password');
    if(!user){
        throw new ApiError(404,'User not found');
    }

    // const isPasswordMatched = await user.isPasswordMatched(oldPassword);
    // if(!isPasswordMatched){
    //     throw new ApiError(400,'Old password is incorrect');
    // }
    if(user.password !== currentPassword){
        throw new ApiError(400,'Old password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return null;
}


/**
 * Service: Get users within a radius (default 10km) using $geoNear
 * - Excludes the logged-in user
 * - Excludes any user who already exists in ANY conversation (Pending or Accepted)
 * - Returns distance in km (rounded to 2 decimals)
 * - Supports pagination
 */
export const getUsersAroundMe = async (
  userDetails: IJwtPayload, query: Record<string,unknown>
  
): Promise<NearbyUserResult[]> => {

    const {profileId} = userDetails;
    const {longitude,latitude} = query;

    let radiusKm = 500;
    const profileObjId = new Types.ObjectId(profileId);

  // 1. Get excluded users (as ObjectIds from the beginning)
  const excludedParticipantIds = await ConversationModel.distinct(
    "participants",
    { participants: profileObjId }
  );

  // Remove self & convert everything to ObjectId
  const finalExcludedIds = excludedParticipantIds
    .filter(id => !id.equals(profileObjId))
    .map(id => new Types.ObjectId(id));

  // Add self explicitly (belt & suspenders)
  finalExcludedIds.push(profileObjId);
  console.log("Excluded IDs:", finalExcludedIds);
  // 3. Aggregation pipeline with $geoNear (MUST be the first stage)
  const pipeline: PipelineStage[] = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: 'distanceMeters',
        maxDistance: radiusKm * 1000,
        spherical: true,
        query: {
          _id: { $nin: finalExcludedIds }     // ← only one condition, very safe
        },
      },
    },
    {
      $addFields: {
        distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 2] },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        profilImage: 1,
        images: 1,
        address: 1,
        children: 1,
        DOB: 1,
        state: 1,
        city: 1,
        bio: 1,
        interesteds: 1,
        mumStage: 1,
        matchCount: 1,
        distanceKm: 1,
        // Add any other fields you want (e.g. interesteds, city, state, subscription, etc.)
      },
    },
    { $sort: { distanceMeters: 1 } },   // closest first
    // { $skip: skip },
    // { $limit: limit },
  ];

  const nearbyUsers = await UserModel.aggregate<NearbyUserResult>(pipeline);

  return nearbyUsers;
};

//block user
const blockUser = async () => {

    //5km raduius

    //excluding already exist friend

    //return new mum
}

//increase matchCount of user by 1
const checkMatchCount = async (userDetails: IJwtPayload) => {
  const { profileId } = userDetails; 

  const user = await UserModel.findById(profileId).select("subscription matchCount");

  if (!user) {
    throw new ApiError(404, "User not found to check user's match count.");
  }

  // 1️⃣ If user has subscription
  if (user?.subscription?.isSubscribed) {
     return null;
  }else{

    // 2️⃣ Check matchCount
    if (user.matchCount < 3) {
  
      // increase match count
      await UserModel.findByIdAndUpdate(profileId, {
        $inc: { matchCount: 1 }
      });
  
      return null;
    }else{

      // 3️⃣ Limit reached
      throw new ApiError(403, "You have reached your limit. Please buy subscription plan for unlimited matching.");
    }
  }

}


//dashboard

const getAllUserService = async (query: Record<string,unknown>) => {
    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [users, totalUser] = await Promise.all([

        UserModel.find({})
           .sort({createdAt: -1})
               .skip(skip).limit(limit)
                   .lean(),
    
        UserModel.countDocuments({})
    ])

    const totalPage = Math.ceil(totalUser / limit);

    return {
        meta:{page,limit: 10,total: totalUser, totalPage},
        users
    };
}

const blockUserService = async (id: string) => {
    
    // if(!userId){
    //     throw new ApiError(400,"User id is required to block a user");
    // }

    const user = await AuthModel.findById(id);

    if(!user){
        throw new ApiError(404,"User not found to block.");
    }

    user.isBlocked = !user.isBlocked;

    let msg = user.isBlocked ? "User has been blocked successfully." : "User has been unblocked successfully.";

    await user.save();

    return {
        user: { name: user.name, email: user.email, isBlocked: user.isBlocked },
        msg
    };
}

const deleteUser = async (userDetails: IJwtPayload) => {

  const {authId, profileId} = userDetails;
    
    // if(!userId){
    //     throw new ApiError(400,"User id is required to block a user");
    // }

    const user = await AuthModel.findByIdAndDelete(authId);
    const auth = await UserModel.findByIdAndDelete(authId);

    return null

}

const UserServices = {
    getUserProfile,
    updateUserProfile, 
    completeUserProfile,
    addLocationService,
    // addBankDetailService,
    changePasswordService ,
    getUsersAroundMe,
    checkMatchCount,
    getAllUserService,
    blockUserService
};
export default UserServices;