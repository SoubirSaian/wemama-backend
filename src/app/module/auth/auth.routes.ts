import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import AuthValidations from "./auth.validation";
import AuthController from "./auth.controller";


const authRouter = express.Router();

authRouter.post("/register-user",
    validateRequest(AuthValidations.registerUserValidationSchema) , 
    AuthController.registerUser
);

authRouter.post("/login-user",
    validateRequest(AuthValidations.loginValidationSchema)  ,
    AuthController.loginUser
);

authRouter.post("/verify-code",
    validateRequest(AuthValidations.verifyCodeValidation)  ,
    AuthController.verifyCode
);

authRouter.post("/send-verify-code",
    validateRequest(AuthValidations.sendVerifyCodeValidation)  ,
    AuthController.sendVerifyCode
);

authRouter.patch("/reset-password",
    validateRequest(AuthValidations.resetPasswordValidation)  ,
    AuthController.resetPassword
);


export default authRouter;