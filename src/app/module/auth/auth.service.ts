import config from "../../../config";
import ApiError from "../../../error/ApiError";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../../../helper/emailHelper";
import { createToken } from "../../../helper/jwtHelper";
import generateVerifyCode from "../../../utilities/codeGenerator";
import { IUser } from "../User/User.interface";
import UserModel from "../User/User.model";
import { JwtPayload, Secret,SignOptions } from "jsonwebtoken";
import { IAuth, IResetPassword, TLoginUser } from "./auth.interface";
import { IJwtPayload } from "../../../interface/jwt.interface";
import AuthModel from "./auth.module";
import { profile } from "console";



const registerUserService = async (payload: IAuth) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { email, password } = payload;

        const emailExist = await AuthModel.exists({
            email: email.toLowerCase()
        });

        if (emailExist) {
            throw new ApiError(400, "This email already exists. Please Login.");
        }

        // Generate verification code
        const { code, expiredAt } = generateVerifyCode(10);

        const userDataPayload: Partial<IAuth> = {
            email: email.toLowerCase(),
            password,
            verificationCode: code,
        };

        // Create Auth user
        const user = await AuthModel.create([userDataPayload], { session });

        const createdUser = user[0];

        // Create Profile
        const profile = await UserModel.create(
            [
                {
                    auth: createdUser._id,
                    email: email.toLowerCase(),
                },
            ],
            { session }
        );

        const createdProfile = profile[0];

        // Update auth with profile id
        createdUser.profile = createdProfile._id;
        await createdUser.save({ session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Send email AFTER commit
        await sendVerificationEmail(email, {
            name: "User",
            code: code,
        });

        const newUser = {
            email: email,
        };

        return newUser;

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        throw error;
    }
};

const loginUserService = async (payload: TLoginUser) => {

    const {email,password} = payload;

    // Service logic goes here
    const user = await AuthModel.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, 'This user does not exist');
    }
    
    if (user.isBlocked) {
        throw new ApiError(403, 'This user is blocked');
    }
    // if (!user.isVerified) {
    //     throw new ApiError(
    //         403,
    //         'You are not verified user . Please verify your email'
    //     );
    // }

    // checking if the password is correct ----
    // if (user.password && !(await UserModel.isPaswordMatched(password, user.password))) {
    //     throw new ApiError(403, 'Password do not match');
    // }

    // if(!comparePassword(password,user.password)){
    //     throw new ApiError(403,'Password do not match');
    // }

    if(password !== user.password){
        throw new ApiError(403,'Password do not match.');
    }


    //generate token
    const tokenPayload: IJwtPayload = {
        authId: user?._id as string,
        email: user?.email,
        profileId: user.profile as string
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );


    const newUser : object = {
        // name: user?.name,
        email: user?.email,
        // phone: user?.phone,
        // role: user.role,
        
    }

    return {user: newUser,accessToken};
}

const verifyCode = async (payload:{email: string, verifyCode: string}) => {
    const { email, verifyCode } = payload;

    const user = await AuthModel.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, 'User not found to verify otp');
    }

    // if (user.codeExpireIn < new Date(Date.now())) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Verify code is expired');
    // }

    if (verifyCode !== user.verificationCode) {
        throw new ApiError(400, "Code doesn't match");
    }

    // const result = await UserModel.findOneAndUpdate(
    //     { email: email },
    //     { isVerified: true },
    //     { new: true, runValidators: true }
    // );

    user.verificationCode = '';
    user.isEmailVerified = true;
    await user.save();

    

    // if (!result) {
    //     throw new AppError(
    //         httpStatus.SERVICE_UNAVAILABLE,
    //         'Server temporary unable please try again letter'
    //     );
    // }

    // Create JWT tokens
    const tokenPayload: IJwtPayload = {
        authId: user?._id,
        email: user?.email,
        profileId: user?.profile
    };

    const accessToken: string =  createToken(
            tokenPayload,
            config.jwt.secret as Secret,
            config.jwt.expires_in as SignOptions["expiresIn"]
        );

    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.jwt_refresh_secret as string,
    //     config.jwt_refresh_expires_in as string
    // );

    return  {user,accessToken};
};

const sendVerifyCodeService = async (payload:{email: string}) => {
    const { email } = payload;

    const user = await AuthModel.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, 'User not found to send otp.');
    }

    const {code, expiredAt} = generateVerifyCode(10);

    
    user.verificationCode = code;

    await user.save();

    await sendVerificationEmail(email,{
        name: "User",
        code: code
    });

    return null;
}

// reset password
const resetPasswordService = async (payload: IResetPassword) => {
    const { email, newPassword } = payload;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, 'This user does not exist to reset password');
    }

    if (user.isBlocked) {
        throw new ApiError(403, 'This user is blocked. Cannot reset password');
    }

    //hash new password
    // const newHashedPassword = await bcrypt.hash(
    //     payload.password,
    //     Number(config.bcrypt_salt_rounds)
    // );

    user.password = newPassword;
    await user.save();

    //generate new token after password reset
    const tokenPayload: IJwtPayload = {
        authId: user?._id as string,
        email: user?.email,
        profileId: user?.profile as string
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );

    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.jwt_refresh_secret as string,
    //     config.jwt_refresh_expires_in as string
    // );

    return {user:{name:user.name,email:user.email}, accessToken };
};



const AuthServices = { 
    registerUserService,
    loginUserService,
    verifyCode,
    sendVerifyCodeService,
    resetPasswordService
};
export default AuthServices;