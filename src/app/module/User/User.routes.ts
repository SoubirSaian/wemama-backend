import express from "express";
import {auth,authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./User.validation";
import UserController from "./User.controller";
import {uploadProfile} from "../../middlewares/multerMiddleware";


const userRouter = express.Router();


userRouter.get("/get-profile-detail",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    UserController.getProfileDetail
);

// userRouter.patch("/update-profile",
//     // auth(["Supplier","Customer"]),
//     authorizeUser,
//     uploadProfile.array('profile-image', 4),
//     validateRequest(UserValidations.updateprofileValidation),
//     UserController.updateProfile
// );

userRouter.patch("/update-profile",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    // uploadProfile.single('profile-image'),
    // uploadProfile.array('description-image', 4),
    uploadProfile.fields([
        { name: "profile-image", maxCount: 1 },
        { name: "description-image", maxCount: 4 }
    ]),
    validateRequest(UserValidations.updateprofileValidation),
    UserController.updateProfile
);

userRouter.post("/complete-profile",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    uploadProfile.single('profile-image'),
    validateRequest(UserValidations.completeProfileValidation),
    UserController.completeProfile
);

userRouter.patch("/change-password",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    validateRequest(UserValidations.changePasswordValidation),
    UserController.changePassword
);

userRouter.post("/add-location",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    validateRequest(UserValidations.addLocationValidation),
    UserController.addLocationController
);

userRouter.get("/match-user",
    // auth(["Supplier","Customer"]),
    authorizeUser,
    validateRequest(UserValidations.searchUserQueryValidation),
    UserController.matchUserController
);

//dashboard

userRouter.get("/get-all-user",
    // auth(["Supplier","Customer"]),
    // validateRequest(UserValidations.addBankDetailValidation),
    UserController.dashboardGetUser
);

userRouter.get("/block-user/:id",
    // auth(["Supplier","Customer"]),
    // validateRequest(UserValidations.addBankDetailValidation),
    UserController.blockUser
);


export default userRouter;