import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import PostServices from "./Post.service";

const createPost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.createPostService(user,req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "New post created successfully",
        data: result,
    });
});

const toggleLike = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result:any = await PostServices.toggleLikeService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result?.message,
        data: result,
    });
});

const makeComment = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.makeComment(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You have added a comment.",
        data: result,
    });
});

const getALLComment = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await PostServices.getAllCommentService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all  comment.",
        data: result,
    });
});

//manage post

const pinPost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.pinPostService(user,req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post pinned.",
        data: result,
    });
});

const lockComment = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.lockCommentService(user,req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment locked.",
        data: result,
    });
});

const deletePost = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await PostServices.deletePostService(user,req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post deleted.",
        data: result,
    });
});

//dashboard

const dashboardPinPost = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await PostServices.dashboardPinPostService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post pinned.",
        data: result,
    });
});

const dashboardLockComment = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await PostServices.dashboardLockCommentService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment locked.",
        data: result,
    });
});

const dashboardDeletePost = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await PostServices.dashboardDeletePostService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post deleted.",
        data: result,
    });
});

const PostController = { 
    createPost,
    toggleLike,
    makeComment,
    getALLComment,
    pinPost,
    lockComment,
    deletePost,
    dashboardPinPost,
    dashboardLockComment,
    dashboardDeletePost
 };
export default PostController;