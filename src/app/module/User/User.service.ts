import ApiError from "../../../error/ApiError";
import { Express } from "express";
import {  IChangePassword, IUser } from "./User.interface";
import UserModel from "./User.model";
import { JwtPayload } from "jsonwebtoken";
import deleteOldFile from "../../../utilities/deleteFile";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { email } from "zod";
import AuthModel from "../auth/auth.module";


const updateUserProfile = async (userDetails: IJwtPayload,files: Express.Multer.File[],payload: Partial<IUser> ) => {

  const { profileId } = userDetails;

  const { name, DOB, state, city, bio, children, currentImages } = payload as any;

  const profile = await UserModel.findById(profileId);

  if (!profile) {
    throw new ApiError(404, "User profile not found to update.");
  }

  let updatedImages: string[] = [];

  if( files && files.length > 4){

      const existingImages: string[] = profile.images || [];
    
      // Images client wants to keep
      const keptImages: string[] = currentImages || [];
    
      // Newly uploaded images
      const newImages =
        files?.map((file) => `uploads/profile-image/${file.filename}`) || [];
    
      // Find images removed by user
      const removedImages = existingImages.filter(
        (img) => !keptImages.includes(img)
      );
    
      // Delete removed images from server
      removedImages.forEach((imgPath) => {
        deleteOldFile(imgPath);
      });
    
      // Final image list
       updatedImages = [...keptImages, ...newImages];
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
      images: updatedImages,
    },
    { new: true, runValidators: true }
  );

  return updatedProfile;
};

const completeUserProfile = async (userDetails: IJwtPayload, file: Express.Multer.File | undefined, payload: Partial<IUser>) => {
    const { authId, email, profileId } = userDetails;

    let updateData: any = { ...payload };

    if (file) {
        updateData.$push = {
            images: `uploads/profile-image/${file.filename}`
        };
    }

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