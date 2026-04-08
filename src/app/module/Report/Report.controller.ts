import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import ReportServices from "./Report.service";

const reportContent = catchAsync(async (req, res) => {

    const {user} = req as AuthRequest;

    const result = await ReportServices.reportPostService(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Reported successfully.",
        data: result,
    });
});

const ReportController = { 
    reportContent
 };

export default ReportController;