import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import PostValidations from "./Post.validation";
import PostController from "./Post.controller";
// import { uploadPostImage } from "../../../helper/multer";


const postRouter = express.Router();


postRouter.post("/create-new-post",
    authorizeUser,
    validateRequest(PostValidations.createPostValidation),
    PostController.createPost
);

postRouter.post("/toggle-like",
    authorizeUser,
    validateRequest(PostValidations.giveLikeValidation),
    PostController.toggleLike
);

postRouter.post("/add-comment",
    authorizeUser,
    validateRequest(PostValidations.makeCommentValidation),
    PostController.makeComment
);

postRouter.get("/get-all-comment/:id",
    // authorizeUser,
    // validateRequest(PostValidations.makeCommentValidation),
    PostController.getALLComment
);

//manage post

postRouter.post("/pin-post/:id",
    authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.pinPost
);

postRouter.post("/lock-comment/:id",
    authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.lockComment
);

postRouter.delete("/delete-post/:id",
    authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.deletePost
);

//dashboard post

postRouter.post("/dashboard-pin-post/:id",
    // authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.dashboardPinPost
);

postRouter.post("/dashboard-lock-comment/:id",
    // authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.dashboardLockComment
);

postRouter.delete("/dashboard-delete-post/:id",
    // authorizeUser,
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.dashboardDeletePost
);



export default postRouter