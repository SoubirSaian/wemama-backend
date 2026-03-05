import ApiError from "../../../error/ApiError";
import { Express } from "express";
import {  IChangePassword, IUser } from "./User.interface";
import UserModel from "./User.model";
import { JwtPayload } from "jsonwebtoken";
import deleteOldFile from "../../../utilities/deleteFile";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { email } from "zod";
import AuthModel from "../auth/auth.module";



const updateUserProfile = async (userDetails: IJwtPayload,file: Express.Multer.File | undefined,payload: Partial<IUser>) => {
  const { profileId } = userDetails;

  // Fetch user and profile in parallel
  const user = await UserModel.findByIdAndUpdate(profileId,{ 
        image: file ? `uploads/profile-image/${file.filename}` : '',
        ...payload
    }, { new: true });
   

  if (!user ) {
    throw new ApiError(404, "Profile not found to update.");
  }

//   // Update fields
//   const { name, phone } = payload;

//   if (name) {
//     user.name = name;
//   }

//   if (phone) {
//     user.phone = phone;
//   }

//   // Handle image update
//   if (file) {

//     if (user.image) deleteOldFile(user.image as string);

//     user.image = `uploads/profile-image/${file.filename}`;
//   }

  // Save both
//   await user.save();

  // Return a unified response
  return user;
};

const completeUserProfile = async (userDetails: IJwtPayload, file: Express.Multer.File | undefined, payload: Partial<IUser>) => {
    const { authId, email, profileId } = userDetails;

    const profile = await UserModel.findByIdAndUpdate(profileId, {
        ...payload,
        image: file ? `uploads/profile-image/${file.filename}` : undefined
    });

    if (!profile) {
        throw new ApiError(500, "Failed to complete profile.");
    }

    // await AuthModel.findByIdAndUpdate(userId, { profile: profile._id });

    return {
        name: profile.name,
        email: profile.email,
    };

}

// const addLocationService = async (userDetails: JwtPayload,payload: IAddLocation) => {
//     // Service logic goes here
//     const {profileId,role} = userDetails;
//    const {location} = payload;

//     let profile : ICustomer| ISupplier | null = null;

//     switch (role) {

//         case ENUM_USER_ROLE.CUSTOMER:
//              profile = await CustomerModel.findByIdAndUpdate(profileId, {location: location}, {new: true});
//             break;

//         case ENUM_USER_ROLE.SUPPLIER:
//             profile = await SupplierModel.findByIdAndUpdate(profileId, {location: location}, {new: true});
//             break;
             
//         default:{
//             // const _exhaustiveCheck: never = role;
//             throw new ApiError(400, "Invalid user role");
//         }

//     }

//     if(!profile){
//         throw new ApiError(500,'Failed to add location in the profile');
//     }  

//     return { name:profile.name,email:profile.email, location: profile.location };
// }


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


//dashboard

const getAllUserService = async () => {
    const users = await UserModel.find({}).lean();
    return users;
}

const blockUserService = async (userId: string) => {
    
    if(!userId){
        throw new ApiError(400,"User id is required to block a user");
    }

    const user = await UserModel.findById(userId);

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

const UserServices = {
    updateUserProfile, 
    completeUserProfile,
    // addLocationService,
    // addBankDetailService,
    changePasswordService ,

    getAllUserService,
    blockUserService
};
export default UserServices;