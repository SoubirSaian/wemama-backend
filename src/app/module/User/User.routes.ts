import express from "express";
import {auth,authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./User.validation";
import UserController from "./User.controller";
import {uploadProfile} from "../../middlewares/multerMiddleware";


const userRouter = express.Router();


userRouter.patch("/update-profile",
    // auth(["Supplier","Customer"]),
    uploadProfile.array('profile-image', 4),
    validateRequest(UserValidations.updateprofileValidation),
    UserController.updateProfile
);

userRouter.patch("/complete-profile",
    // auth(["Supplier","Customer"]),
    uploadProfile.single('profile-image'),
    validateRequest(UserValidations.completeProfileValidation),
    UserController.updateProfile
);

userRouter.patch("/change-password",
    // auth(["Supplier","Customer"]),
    validateRequest(UserValidations.changePasswordValidation),
    UserController.changePassword
);

//dashboard

userRouter.get("/get-al-user",
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