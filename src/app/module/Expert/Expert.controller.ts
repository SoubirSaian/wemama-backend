import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import ExpertServices from "./Expert.service";

const u = catchAsync(async (req, res) => {

    const result = await ExpertServices.updateUserProfile();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "P",
        data: result,
    });
});

const ExpertController = { u };

export default ExpertController;