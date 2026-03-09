import ApiError from "../../../error/ApiError";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../../../helper/emailHelper";
import generateVerifyCode from "../../../utilities/codeGenerator";
import { IAuth, TLoginUser } from "../auth/auth.interface";
import AuthModel from "../auth/auth.module";
import { IExpert, IExpertCredintial, ISession } from "./Expert.interface";
import {ExpertModel, SessionModel} from "./Expert.model";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { createToken } from "../../../helper/jwtHelper";
import config from "../../../config";
import { Secret, SignOptions } from "jsonwebtoken";
import { ENUM_SESSION_STATUS } from "../../../utilities/enum";

const expertRegisterationService = async (payload: IExpertCredintial) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { email, password, role } = payload;

        const emailExist = await AuthModel.exists({
            email: email.toLowerCase(), role: role
        });

        if (emailExist) {
            throw new ApiError(400, "This email already exists. Please Login.");
        }

        // Generate verification code
        const { code, expiredAt } = generateVerifyCode(10);

        const userDataPayload: Partial<IAuth> = {
            email: email.toLowerCase(),
            password,
            role,
            verificationCode: code,
        };

        // Create Auth user
        const user = await AuthModel.create([userDataPayload], { session });

        const createdUser = user[0];

        // Create Profile
        const profile = await ExpertModel.create(
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

    // const {email, password, role} = payload;

    // const emailExist = await ExpertModel.exists({ email: email.toLowerCase(), role: role });

    // if (emailExist) {
    //     throw new ApiError(400, 'This email already exists. Please use another email.');
    // }

    // // Generate verification code
    //     const { code, expiredAt } = generateVerifyCode(10);

    //     // Prepare user data
    //     const expertDataPayload: Partial<IAuth> = {
           
    //         email: email.toLowerCase(),
    //         password,
    //         role,
    //         verificationCode: code,
    //         // 5 minutes expiry
    //         // codeExpireIn: new Date(Date.now() + 5 * 60000), 
    //     };

    // const expertAuth = await AuthModel.create(expertDataPayload);

    // if(!expertAuth){
    //     throw new ApiError(500,"Failed to register new Expert.");
    // }

    // //send email with verification code
    // await sendVerificationEmail(email,{
    //     name: "User",
    //     code: code
    // });

    // return null;
};

const expertLoginService = async (payload: TLoginUser) => {

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

};

const completeExpertProfile = async (userDetails: IJwtPayload, file: Express.Multer.File | undefined, payload: Partial<IExpert>) => {
    const { authId, email, profileId } = userDetails;

    let updateData: any = { ...payload };

    if (file) {
        updateData.$push = {
            images: `uploads/profile-image/${file.filename}`
        };
    }

    const profile = await ExpertModel.findByIdAndUpdate(
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

const getExpertProfile = async () => {

}

//session

const createNewSession = async (payload: Partial<ISession>) => {
    const {expert, date, time, title, description, status} = payload;

    const newSession = await SessionModel.create({
        expert,
        date,
        time,
        title,
        description,
        status: status || ENUM_SESSION_STATUS.UPCOMING
    });

    if(!newSession){
        throw new ApiError(500,"Failed to create new session.");
    }

    return newSession;
}


const ExpertServices = { 
    expertRegisterationService,
    expertLoginService,
    completeExpertProfile,
    getExpertProfile
 };

export default ExpertServices;