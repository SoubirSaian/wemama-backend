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

//dashboard

const getReportDetail = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await ReportServices.getReportDetail( req.params.id );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved report detail.",
        data: result,
    });
});

const getAllReport = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await ReportServices.getAllReport();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all report.",
        data: result,
    });
});

const resolveReport = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await ReportServices.resolveReportService( req.params.id );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Report resolved.",
        data: result,
    });
});

const deleteReport = catchAsync(async (req, res) => {

    // const {user} = req as AuthRequest;

    const result = await ReportServices.deleteReportService( req.params.id );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Report deleted.",
        data: result,
    });
});

const ReportController = { 
    reportContent,
    getAllReport,
    getReportDetail,
    resolveReport,
    deleteReport
 };

export default ReportController;