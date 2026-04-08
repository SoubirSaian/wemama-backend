import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import CommunityServices from "./Community.service";

const createCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;
    console.log(user,req.file,req.body);

    const result = await CommunityServices.createCommunityService(user, req.file, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Community created successfully.",
        data: result,
    });
});

const joinCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.joinCommunityService(user, req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You have joined a community.",
        data: result,
    });
});

const getMyCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.getMyCommunityService(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved my community.",
        data: result,
    });
});

const editCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.editCommunityProfile(user, req.file, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Community edited.",
        data: result,
    });
});

const getSingleCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.getSingleCommunityServices(user, req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a community with content.",
        data: result,
    });
});

const getAllJoinedCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.getAllJoinedCommunityServices(user, req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all joined community.",
        data: result,
    });
});

const searchCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.searchCommunity(user, req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Community searched.",
        data: result,
    });
});

const communitySuggestion = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.getCommunitySuggestion(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Suggested community.",
        data: result,
    });
});

//dashboard

const deleteCommunity = catchAsync(async (req, res) => {

    // const { user } = req as AuthRequest;

    const result = await CommunityServices.deleteCommunity( req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Community deleted.",
        data: result,
    });
});

const approveCommunity = catchAsync(async (req, res) => {

    // const { user } = req as AuthRequest;

    const result = await CommunityServices.approveCommunity(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Community approved.",
        data: result,
    });
});

const CommunityController = { 
    createCommunity,
    joinCommunity,
    editCommunity,
    getMyCommunity,
    getAllJoinedCommunity,
    getSingleCommunity,
    searchCommunity,
    communitySuggestion,
    approveCommunity,
    deleteCommunity
 };

export default CommunityController;