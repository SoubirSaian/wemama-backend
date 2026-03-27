import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import { searchUsers } from "./Chat.service";




export const searchChat = catchAsync(async (req, res) => {

    const { user } = req as AuthRequest;

    const result = await searchUsers(user,req.query);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Community created successfully.",
        data: result,
    });
});