import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import authServices from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
    
    const result = await authServices.registerUserService(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "user registered successfully. Check your email for verification code.",
        data: result,
    });
});

const loginUser = catchAsync(async (req, res) => {
    
    const result = await authServices.loginUserService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "user logged In successfully.",
        data: result,
    });
});

const verifyCode = catchAsync(async (req, res) => {
    
    const result = await authServices.verifyCode(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Email verified successfully.",
        data: result,
    });
});

const sendVerifyCode = catchAsync(async (req, res) => {
    
    const result = await authServices.sendVerifyCodeService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Verification code sent successfully.",
        data: result,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    
    const result = await authServices.resetPasswordService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password reset successfully.",
        data: result,
    });
});

const AuthController = { 
    registerUser ,
    loginUser,
    verifyCode,
    sendVerifyCode,
    resetPassword

};
export default AuthController;