import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import PostServices from "./Post.service";

const createPost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    let files: Express.Multer.File[] | undefined;

    if (Array.isArray(req.files)) {
        // upload.array()
        files = req.files;
  } else if (req.files && typeof req.files === "object") {
        // upload.fields()
        files = Object.values(req.files).flat();
  }

    const result = await PostServices.createPostService(user,files ,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "New post created successfully",
        data: result,
    });
});

const getAllPost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.getAllPostService(user,req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all my post successfully",
        data: result,
    });
});

const getNearbyPost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.getNearbyPostsService(user,req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all available post near me successfully",
        data: result,
    });
});

const getPostDetail = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await PostServices.getPostDetailService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all available post near me successfully",
        data: result,
    });
});

const acceptPostRequest = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.acceptPostService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post request accepted successfully",
        data: result,
    });
});

const PostController = { 
    createPost, getAllPost, getNearbyPost,getPostDetail, acceptPostRequest
 };
export default PostController;