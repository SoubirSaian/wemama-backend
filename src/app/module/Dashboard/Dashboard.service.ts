import ApiError from "../../../error/ApiError";
import { TLoginUser } from "../auth/auth.interface";
import AdminModel from "./Admin.model";
import { IAdmin, IAdminResetPassword } from "./Dashboard.interface";
import config from "../../../config";
import { JwtPayload,Secret, SignOptions } from "jsonwebtoken";
import { createToken } from "../../../helper/jwtHelper";
import { IChangePassword } from "../User/User.interface";
import generateVerifyCode from "../../../utilities/codeGenerator";
import { sendVerificationEmail } from "../../../helper/emailHelper";
import deleteOldFile from "../../../utilities/deleteFile";
import { get } from "http";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";



const registerAdminService = async (payload:Partial<IAdmin>) => {
    const {name, email,password,phone} = payload;

    const admin = await AdminModel.create({
        name: name,
        email: email?.toLowerCase(),
        password: password,
        phone: phone
    });

    if(!admin){
        throw new ApiError(500,"Failed to create new Admin");
    }

    return {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
    }
}

const loginAdminService = async (payload: TLoginUser) => {

    const {email,password} = payload;

    // Service logic goes here
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
        throw new ApiError(404, 'This admin does not exist.');
    }
    
    if (admin.isBlocked) {
        throw new ApiError(403, 'This admin is blocked. Please contact Super Admin');
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

    if(password !== admin.password){
        throw new ApiError(403,'Password do not match.');
    }


    //generate token
    const tokenPayload = {
        userId: admin?._id as string,
        role: admin?.role,
        email: admin?.email
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );


    const newUser : object = {
        name: admin?.name,
        email: admin?.email,
        phone: admin?.phone,
        role: admin.role,
        
    }

    return { newUser,accessToken};
}

const adminVerifyCode = async (payload:{email: string, verifyCode: string}) => {
    const { email, verifyCode } = payload;

    const admin = await AdminModel.findOne({ email: email.toLowerCase() }).select("profile email role verificationCode isEmailVerified");

    if (!admin) {
        throw new ApiError(404, 'Admin not found to verify otp');
    }

    // if (user.codeExpireIn < new Date(Date.now())) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Verify code is expired');
    // }

    if (verifyCode !== admin.verificationCode) {
        throw new ApiError(400, "Code doesn't match");
    }

    // const result = await UserModel.findOneAndUpdate(
    //     { email: email },
    //     { isVerified: true },
    //     { new: true, runValidators: true }
    // );

    admin.verificationCode = '';
    admin.isEmailVerified = true;
    await admin.save();

    

    // if (!result) {
    //     throw new AppError(
    //         httpStatus.SERVICE_UNAVAILABLE,
    //         'Server temporary unable please try again letter'
    //     );
    // }

    //generate token
    const tokenPayload = {
        userId: admin?._id as string,
        role: admin?.role,
        email: admin?.email
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );

    const newUser : object = {
        name: admin?.name,
        email: admin?.email,
        // phone: admin?.phone,
        role: admin.role,
        
    }

    return { newUser,accessToken};
};

const adminSendVerifyCodeService = async (payload:{email: string}) => {
    const { email } = payload;

    const admin = await AdminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
        throw new ApiError(404, 'Admin not found to send otp.');
    }

    const {code, expiredAt} = generateVerifyCode(10);

    
    admin.verificationCode = code;

    await admin.save();

    await sendVerificationEmail(email,{
        name: admin.name,
        code: code
    });

    return code;
}

const getAllAdminService = async (query: Record<string,unknown>) => {
    let {page, searchText} = query;
    
    if(searchText){
        const searchedAdmin = await AdminModel.find({
           
             name: { $regex: searchText as string, $options: "i" } ,
             role: ENUM_ADMIN_ROLE.ADMIN
        }).lean();
        
        return searchedAdmin;
    }
    
    //add pagination later  
    page =  Number(page) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    const [ allAdmin, totalAdmin ] = await Promise.all([
        AdminModel.find({role: ENUM_ADMIN_ROLE.ADMIN})
            .sort({ createdAt: -1 })
                .skip(skip).limit(limit)
                    .lean(),
        AdminModel.countDocuments({role: ENUM_ADMIN_ROLE.ADMIN}),
    ]);

    const totalPages = Math.ceil(totalAdmin / limit);
     

    return {
        meta:{ page,limit: 10,totalAdmin, totalPages },
        allAdmin
    };

    // const allAdmin = await AdminModel.find({}).select("name email phone image role isBlockd createdAt").lean();     
    // return allAdmin;
}

const getAdminDetailsService = async (userDetails: JwtPayload) => {

    const {userId} = userDetails;   

    const admin = await AdminModel.findById(userId).select("name email phone image role createdAt").lean();  

    if(!admin){
        throw new ApiError(500,"Failed to get admin details.");
    }   
    return admin;
}


const adminResetPasswordService = async (payload: IAdminResetPassword) => {
    const { email,newPassword } = payload;
    // const {email} = userDetails;

    const admin = await AdminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
        throw new ApiError(404, 'This admin does not exist to reset password');
    }

    if (admin.isBlocked) {
        throw new ApiError(403, 'This user is blocked. Cannot reset password');
    }

    //hash new password
    // const newHashedPassword = await bcrypt.hash(
    //     payload.password,
    //     Number(config.bcrypt_salt_rounds)
    // );

    admin.password = newPassword;
    await admin.save();

    //generate new token after password reset
    const tokenPayload = {
        userId: admin?._id as string,
        role: admin?.role,
        email: admin?.email
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

    return {user:{name:admin.name,email:admin.email,role:admin.role}, accessToken };
};

const editProfileService = async (
    userDetails: JwtPayload,
    file: Express.Multer.File | undefined,
    payload: Partial<IAdmin>
) => {

    const {userId} = userDetails;

    if(!userId){
        throw new ApiError(400,"Admin id is required to edit admin profile");
    }

    const admin = await AdminModel.findById(userId);

    // Handle image update
    if (file) {
        if (admin.image) { deleteOldFile(admin.image as string); }

        admin.image = `uploads/admin-image/${file.filename}`;
    }

    if(payload.name) admin.name = payload.name;
    if(payload.phone) admin.phone = payload.phone;

    await admin.save();
    
    return {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        image: admin.image,
        // role: admin.role
    };
    
}

const changeAdminPasswordService = async (userDetails: JwtPayload, payload: IChangePassword) => {
    // Service logic goes here
    const { userId } = userDetails;
    const { currentPassword, newPassword } = payload;

    const admin =  await AdminModel.findById(userId).select('+password');
    if(!admin){
        throw new ApiError(404,'Admin not found to change password');
    }

    // const isPasswordMatched = await user.isPasswordMatched(oldPassword);
    // if(!isPasswordMatched){
    //     throw new ApiError(400,'Old password is incorrect');
    // }

    if(admin.password !== currentPassword){
        throw new ApiError(400,'Old password is incorrect');
    }

    admin.password = newPassword;

    await admin.save();

    return null;
}

const deleteAdminService = async (id: string) => {
    // const {userId} = userDetails;
    // if(!userId){
    //     throw new ApiError(400,"User id is required to delete account");
    // }

    const deletedAccount = await AdminModel.findByIdAndDelete(id);

    //delete admi image
    deleteOldFile(deletedAccount.image);

    if(!deletedAccount){
        throw new ApiError(500,"Failed to delete admin account.");
    }

    return null;
}

const blockAdminService = async (id: string) => {
    // const {userId} = query;
    
    // if(!userId){
    //     throw new ApiError(400,"Admin id is required to block a admin");
    // }

    const admin = await AdminModel.findById(id);

    //block unblock admin
    admin.isBlocked = !admin.isBlocked;
    await admin.save();

    let msg = admin.isBlockd ? 'Admin is blocked successfully.' : 'Admin is unblocked.';

    return {admin:{name: admin.name,isBlocked: admin.isBlocked}, msg };
}




const DashboardService = {
    registerAdminService,
    loginAdminService,
    adminVerifyCode,
    adminSendVerifyCodeService,
    getAllAdminService,
    getAdminDetailsService,
    adminResetPasswordService,
    editProfileService,
    changeAdminPasswordService,
    deleteAdminService,
    blockAdminService,
   
}

export default DashboardService;

