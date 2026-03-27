import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import { AuthRequest } from "../../../interface/authRequest";
import UserServices from "./User.service";
import { get } from "http";



const getProfileDetail = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.getUserProfile(user);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile data retrieved successfully.",
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    //  const files = req.files as Express.Multer.File[];
    //  const file = req.file as Express.Multer.File;

    // const files = req.files as {
    // "profile-image"?: Express.Multer.File[] | undefined;
    // "description-image"?: Express.Multer.File[] | undefined;
    // };

    const files = req.files as {
        "profile-image"?: Express.Multer.File[];
        "description-image"?: Express.Multer.File[];
    };

    const profileImage = files["profile-image"] || [];
    const descriptionImages = files["description-image"] || [];

    const result = await UserServices.updateUserProfile(user ,profileImage,descriptionImages, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully.",
        data: result,
    });
});

const completeProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.completeUserProfile(user ,req.file, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile completed successfully.",
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.changePasswordService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully.",
        data: result,
    });
});

const addLocationController = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.addLocationService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Location Added successfully.",
        data: result,
    });
});

const getFriendProfileController = catchAsync(async (req, res) => {

    //  const { user } = req as AuthRequest;

    const result = await UserServices.getFriendProfileService(req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved friend profile.",
        data: result,
    });
});

const matchUserController = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.getUsersAroundMe(user,req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Searching user.",
        data: result,
    });
});

//dashboard

const dashboardGetUser = catchAsync(async (req, res) => {

    const result = await UserServices.getAllUserService(req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all users successfully.",
        data: result,
    });
});

const blockUser = catchAsync(async (req, res) => {

    const result = await UserServices.blockUserService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully.",
        data: result,
    });
});

const UserController = { 
    getProfileDetail,
    updateProfile,
    completeProfile,
    changePassword,
    addLocationController,
    getFriendProfileController,
    matchUserController,
    dashboardGetUser,
    blockUser
 };
export default UserController;