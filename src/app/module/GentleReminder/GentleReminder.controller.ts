import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import GentleReminderServices from "./GentleReminder.service";

const u = catchAsync(async (req, res) => {

    const result = await GentleReminderServices.updateUserProfile();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "P",
        data: result,
    });
});

const GentleReminderController = { u };

export default GentleReminderController;