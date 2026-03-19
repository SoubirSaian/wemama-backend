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
import { ENUM_SESSION_STATUS, ENUM_USER_ROLE } from "../../../utilities/enum";

//website Expert
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
            role: role || ENUM_USER_ROLE.EXPART,
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

    const {email,password, role} = payload;

    // Service logic goes here
    const user = await AuthModel.findOne({ email: email.toLowerCase(), role: role });

    if (!user) {
        throw new ApiError(404, 'This user does not exist. Please Signup.');
    }
    
    if (user.isBlocked) {
        throw new ApiError(403, 'This user is blocked.{lease contact to admin.');
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

const completeExpertProfile = async (
    userDetails: IJwtPayload, 
    files: {
        signature?: Express.Multer.File[];
        licenseProof?: Express.Multer.File[];
    },
    payload: Partial<IExpert>
) => {

    const { authId, email, profileId } = userDetails;

    let updateData: any = { ...payload };


    //handle expert signature
    if (files?.signature?.length) {
            updateData.signature = `uploads/expert-file/${files.signature[0].filename}`;
    }

    //handle expert license proof
    if (files?.licenseProof?.length) {
            updateData.license.proof = `uploads/expert-file/${files.licenseProof[0].filename}`;
    }

    const profile = await ExpertModel.findByIdAndUpdate(
        profileId,
        updateData,
        { new: true }
    );

    if (!profile) {
        throw new ApiError(500, "Failed to complete profile.");
    }

    return profile;
}

const updateExpertProfile = async () => {

}

const getExpertProfile = async (userDetails: IJwtPayload) => {
    const {profileId} = userDetails;

    const profile = await ExpertModel.findById(profileId).lean();

    if(!profile){
        throw new ApiError(404,"Expert profile not found.");
    }

    return profile;
}

//session Website
const createNewSession = async (userDetails: IJwtPayload,payload: Partial<ISession>) => {
    const {profileId} = userDetails;
    const { date, time, title, description, status} = payload;

    const newSession = await SessionModel.create({
        expert: profileId,
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


const getMySessions = async (userDetails: IJwtPayload,query: Record<string,unknown>) => {
    const {profileId} = userDetails;
    const {sessionStatus} = query;
    let filter: any = {

        expert : profileId
    };

    if(sessionStatus){
        filter.status = sessionStatus;
    }

    const sessions = await SessionModel.find(filter).populate({ path: "expert", select: "name email image"}).lean();

    return sessions;
}

const getTodaySessions = async (userDetails: IJwtPayload) => {
    const {profileId} = userDetails;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const sessions = await SessionModel.find({
        expert: profileId,
        date: { $gte: startOfDay, $lt: endOfDay },
        // status: ENUM_SESSION_STATUS.UPCOMING
    })
    // .populate({ path: "expert", select: "name email image profession" })
            .lean();

    return sessions;
}

//start live session
const startLiveSession = async (userDetails: IJwtPayload,id: string) => {
    const {profileId} = userDetails;

    const session = await SessionModel.findById(id);

    //change session status
    session.status = ENUM_SESSION_STATUS.ONGOING;

    await session.save();

    return session;
}

//finish live session
const FinishLiveSession = async (userDetails: IJwtPayload,id: string) => {
    const {profileId} = userDetails;

    const session = await SessionModel.findById(id);

    //change session status
    session.status = ENUM_SESSION_STATUS.COMPLETED;

    await session.save();

    return session;
}

//create session report
const createSessionReport = async () => {
    
}

const getSessionReport = async () => {

}
const deleteSessionReport = async () => {

}

//session app
const getALLExpertSessions = async (query: Record<string,unknown>) => {
    const {sessionStatus} = query;
    let filter: Record<string, unknown> = {isApproved: true};

    if(sessionStatus){
        filter.status = sessionStatus;
    }

    const sessions = await SessionModel.find(filter).populate({ path: "expert", select: "name email image profession"}).lean();

    return sessions;
}

//dashboard

//session

//get all session request
const getAllSessionRequestService = async () => {

    const sessions = await SessionModel.find({isApproved: false}).populate({ path: "expert", select: "name email profession"}).lean();

    return sessions;
}

//approve session 
const approveSessionRequestService = async (id:string) => {

    const session = await SessionModel.findByIdAndUpdate(id,{isApproved: true},{new: true});

    if(!session.isApproved){
        throw new ApiError(500,"Failed to approve session.");
    }

    return session;
}

// delete session
const deleteSessionService = async (id: string) => {

    const deletedSession = await SessionModel.findByIdAndDelete(id).lean();

    if(!deletedSession){
        throw new ApiError(500,"Failed to delete session.");
    }

    return null;
}

const getALLSessionService = async () => {

    const sessions = await SessionModel.find({isApproved: true}).populate({ path: "expert", select: "name email image profession"}).lean();

    return sessions;
}

//Expert

const getALLExpertRequestService = async (query: Record<string,unknown>) => {
    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [experts, totalExpert] = await Promise.all([

        ExpertModel.find({isApproved: false})
           .sort({createdAt: -1})
               .skip(skip).limit(limit)
                   .lean(),
    
        ExpertModel.countDocuments({})
    ])

    const totalPage = Math.ceil(totalExpert / limit);

    return {
        meta:{page,limit: 10,total: totalExpert, totalPage},
        experts
    };

    
}

const getALLExpertService = async (query: Record<string,unknown>) => {
    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [experts, totalExpert] = await Promise.all([

        ExpertModel.find({isApproved: true})
           .sort({createdAt: -1})
               .skip(skip).limit(limit)
                   .lean(),
    
        ExpertModel.countDocuments({})
    ])

    const totalPage = Math.ceil(totalExpert / limit);

    return {
        meta:{page,limit: 10,total: totalExpert, totalPage},
        experts
    };
   
}

const getSingleExpertService = async (id: string) => {

    const expert = await ExpertModel.findById(id).lean();

    return expert;
}

const approveExpertService = async (id: string) => {

    const expert: any = await ExpertModel.findByIdAndUpdate(id,{
        isApproved: true
    },{new: true}).lean();

    if(!expert.isApproved){
        throw new ApiError(500,"Failed to approve the Expert.");
    }

    return expert;
}

const deleteExpertService = async (id: string) => {

    const deletedExpert = await ExpertModel.findByIdAndDelete(id).lean();

    if(!deletedExpert){
        throw new ApiError(500,"Failed to delete Expart.")
    }

    return null;
}

const blockExpertService = async (id: string) => {

    const blockedExpert: any = await AuthModel.findByIdAndUpdate(id,{
        isBlocked: true
    },{new: true}).lean();

    if(!blockedExpert.isBlocked){
        throw new ApiError(500,"Failed to block the Expart.")
    }

    return null;
}



const ExpertServices = { 
    expertRegisterationService,
    expertLoginService,
    completeExpertProfile,
    updateExpertProfile,
    getExpertProfile,
    createNewSession,
    getMySessions,
    getTodaySessions,
    getAllSessionRequestService,
    approveSessionRequestService,
    deleteSessionService,
    getALLSessionService,
    getALLExpertRequestService,
    getALLExpertService,
    getSingleExpertService,
    approveExpertService,
    deleteExpertService,
    blockExpertService
 };

export default ExpertServices;