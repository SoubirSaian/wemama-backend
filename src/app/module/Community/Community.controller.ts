import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import CommunityServices from "./Community.service";

const createCommunity = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await CommunityServices.createCommunityService(user, req.file, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Community created successfully.",
        data: result,
    });
});

const CommunityController = { 
    createCommunity
 };

export default CommunityController;