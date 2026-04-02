import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import AgoraServices from "./Agora.service";
import ExpertServices from "./Expert.service";

const expertRegistration = catchAsync(async (req, res) => {

    const result = await ExpertServices.expertRegisterationService(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Expert registered successfully. Check your email for OTP.",
        data: result,
    });
});

const expertLogin = catchAsync(async (req, res) => {

    const result = await ExpertServices.expertLoginService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert logged in successfully",
        data: result,
    });
});

const expertCompleteProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

     const files = req.files as {
        signature?: Express.Multer.File[];
        licenseProof?: Express.Multer.File[];
    };

    const result = await ExpertServices.completeExpertProfile(
        user,
        files,
        req.body
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert profile completed successfully.",
        data: result,
    });
});

const expertupdateProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await ExpertServices.updateExpertProfile(user,req.file,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert profile updated successfully.",
        data: result,
    });
});

const getExpertprofile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await ExpertServices.getExpertProfile(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert profile retrieved successfully.",
        data: result,
    });
});

//website

const createNewSession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await ExpertServices.createNewSession(user,req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "New Session added successfully.",
        data: result,
    });
});

const getMySession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await ExpertServices.getMySessions(user,req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all my sessions.",
        data: result,
    });
});

const getTodaySession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await ExpertServices.getTodaySessions(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all today sessions.",
        data: result,
    });
});


//agora

const startAgoraLiveSession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await AgoraServices.startLiveSession(user,req.params.sessionId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You have started a new live session.",
        data: result,
    });
});

const joinAgoraLiveSession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await AgoraServices.joinLiveSession(user,req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You have joined a new live session.",
        data: result,
    });
});

const endAgoraLiveSession = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await AgoraServices.FinishLiveSession(user,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You have ended the live session.",
        data: result,
    });
});


// dashnoard

const getAllSession = catchAsync(async (req, res) => {


    const result = await ExpertServices.getALLSessionService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all approved sessions.",
        data: result,
    });
});

const getAllSessionRequest = catchAsync(async (req, res) => {

    const result = await ExpertServices.getAllSessionRequestService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all session request.",
        data: result,
    });
});

const approveSession = catchAsync(async (req, res) => {


    const result = await ExpertServices.approveSessionRequestService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Approved a session.",
        data: result,
    });
});

const deleteSession = catchAsync(async (req, res) => {


    const result = await ExpertServices.deleteSessionService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Session deletet.",
        data: result,
    });
});

//dashboard
//expert
const getAllExpertRequest = catchAsync(async (req, res) => {


    const result = await ExpertServices.getALLExpertRequestService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all expert request.",
        data: result,
    });
});

const getAllApprovedExpert = catchAsync(async (req, res) => {


    const result = await ExpertServices.getALLExpertService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all expert.",
        data: result,
    });
});

const getSingleExpert = catchAsync(async (req, res) => {


    const result = await ExpertServices.getSingleExpertService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a expert details.",
        data: result,
    });
});

const approveExpert = catchAsync(async (req, res) => {


    const result = await ExpertServices.approveExpertService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert approved.",
        data: result,
    });
});

const deleteExpert = catchAsync(async (req, res) => {


    const result = await ExpertServices.deleteExpertService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert deleted.",
        data: result,
    });
});

const blockExpert = catchAsync(async (req, res) => {


    const result = await ExpertServices.blockExpertService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expert blocked.",
        data: result,
    });
});



const ExpertController = { 
    expertRegistration,
    expertLogin,
    expertCompleteProfile,
    expertupdateProfile,
    getExpertprofile,
    createNewSession,
    getMySession,
    getTodaySession,
    startAgoraLiveSession,
    joinAgoraLiveSession,
    endAgoraLiveSession,
    getAllSession,
    getAllSessionRequest,
    approveSession,
    deleteSession,
    getAllExpertRequest,
    getAllApprovedExpert,
    getSingleExpert,
    deleteExpert,
    approveExpert,
    blockExpert
 };

export default ExpertController;