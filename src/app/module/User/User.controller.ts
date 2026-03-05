import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import { AuthRequest } from "../../../interface/authRequest";
import UserServices from "./User.service";



const updateProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.updateUserProfile(user ,req.file, req.body);
    
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

//dashboard

const dashboardGetUser = catchAsync(async (req, res) => {

    const result = await UserServices.getAllUserService();
    
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
    updateProfile,
    completeProfile,
    changePassword,
    dashboardGetUser,
    blockUser
 };
export default UserController;