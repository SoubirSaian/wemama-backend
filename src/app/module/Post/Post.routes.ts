import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import PostValidations from "./Post.validation";
import PostController from "./Post.controller";
import { uploadPostImage } from "../../../helper/multer";


const postRouter = express.Router();

postRouter.post("/create-post",
//     auth(),
    uploadPostImage.array("post-image", 4),
    validateRequest(PostValidations.postZodSchema),
    PostController.createPost
);

postRouter.get("/get-my-post",
//     auth(),
    validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.getAllPost
);

postRouter.get("/get-nearby-post",
//     auth(),
    validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.getNearbyPost
);

postRouter.get("/get-post-detail/:id",
//     auth(),
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.getPostDetail
);

postRouter.post("/accept-post-request",
//     auth(),
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.acceptPostRequest
);

//dashboard

postRouter.post("/dashboard-all-posts",
//     auth(),
    // validateRequest(PostValidations.getAllPostsZodSchema),
    PostController.acceptPostRequest
);



export default postRouter