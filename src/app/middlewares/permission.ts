import { NextFunction, Request, Response } from "express";
import UserModel from "../module/User/User.model";
import ApiError from "../../error/ApiError";
import { IJwtPayload } from "../../interface/jwt.interface";
import { ExpertModel, SessionModel } from "../module/Expert/Expert.model";
import { ENUM_USER_ROLE } from "../../utilities/enum";

//middleware to check subscription plan
export const checkSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { profileId } = req.user as IJwtPayload; // assuming auth middleware attaches user

  // const user: any = await UserModel.findById(profileId).lean();

  // if (!user) {
  //   throw new ApiError(404, "User not found to check subscription plan.");
  // }

  // // 1️⃣ If user has subscription
  // if (user?.subscription?.isSubscribed) {
  //   return next();
  // }

  // // 3️⃣ Limit reached
  // throw new ApiError(403, "Please buy subscription plan to unlock everything.");
};

//middleware to check expert is verified or not
export const checkVerifiedExpert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { profileId } = req.user as IJwtPayload; // assuming auth middleware attaches user

  // const expert: any = await ExpertModel.findById(profileId)
  //   .populate({path:"auth",select:"role"})
  //     .lean();

  // if (!expert) {
  //   throw new ApiError(404, "Expert not found to check verification.");
  // }

  // if (expert.auth.role !== ENUM_USER_ROLE.EXPART) {
  //   throw new ApiError(400, "Please Sign up as an Expert to start this operation.");
  // }

  // // 1️⃣ If user has subscription
  // if (expert?.isApproved) {
  //   next();
  // }

  // // 3️⃣ Limit reached
  // throw new ApiError(403, "Please ask admin to approve your expert account. Without Admin's approval you can not add a new session.");
};

//middleware to check matching count
export const checkMatchLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { profileId } = req.user as IJwtPayload; // assuming auth middleware attaches user

  // const user = await UserModel.findById(profileId);

  // if (!user) {
  //   throw new ApiError(404, "User not found to check subscription plan.");
  // }

  // // 1️⃣ If user has subscription
  // if (user?.subscription?.isSubscribed) {
  //   return next();
  // }

  // // 2️⃣ Check matchCount
  // if (user.matchCount < 3) {

  //   // increase match count
  //   await UserModel.findByIdAndUpdate(profileId, {
  //     $inc: { matchCount: 1 }
  //   });

  //    next();
  // }

  // // 3️⃣ Limit reached
  // throw new ApiError(403, "You have reached your limit. Please buy subscription plan for unlimited matching.");
};

//middleware to check matching count
export const checkSessionApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { sessionId } = req.params;

  const now = new Date();

  const session:any = await SessionModel.findById(sessionId)
    .select("title time date isApproved")
    .lean();

  if (!session) {
    throw new ApiError(404, "Session not found.");
  }

  // ❌ Not approved
  if (!session.isApproved) {
    throw new ApiError(
      403,
      "Your session is not approved yet. Please contact admin."
    );
  }

  // ❌ Too early
  if (now < session?.time) {
    throw new ApiError(
      403,
      "You cannot start the session before scheduled time."
    );
  }

  // ✅ Allowed
  next();
};

// const user = await UserModel.findOneAndUpdate(
//   {
//     _id: profileId,
//     matchCount: { $lt: 3 }
//   },
//   {
//     $inc: { matchCount: 1 }
//   },
//   { new: true }
// );

// export const checkMatchLimit = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { profileId } = req.user as any;

//   // Step 1: check if user has subscription
//   const subscribedUser = await UserModel.findOne({
//     _id: profileId,
//     "subscription.isSubscribed": true,
//   });

//   if (subscribedUser) {
//     return next();
//   }

//   // Step 2: user is NOT subscribed → apply limit
//   const user = await UserModel.findOneAndUpdate(
//     {
//       _id: profileId,
//       matchCount: { $lt: 3 },
//     },
//     {
//       $inc: { matchCount: 1 },
//     },
//     { new: true }
//   );

//   // Step 3: if null → limit reached
//   if (!user) {
//     throw new ApiError(403, "You have reached your limit.");
//   }

//   return next();
// };