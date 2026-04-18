import { report } from "process";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { ENUM_REPORT_STATUS } from "../../../utilities/enum";
import { IReport } from "./Report.interface";
import ReportModel from "./Report.model";


const reportPostService = async (
    userDetails: IJwtPayload,
    file: Express.Multer.File | undefined,
    payload: Partial<IReport>
) => {

    const {profileId} = userDetails;

    const refModel = payload.type === "Content" ? "Post" : "User";

    let reportImageFile: string = '';

    if(file){
        reportImageFile = `uploads/report-image/${file?.filename}`;
    }

    const report = await ReportModel.create({
        user: profileId,
        report: payload.report,
        reportImage: reportImageFile,
        note: payload?.note ? payload?.note : '',
        refModel,
        name: payload.name,
        type: payload.type
    });

    if(!report){
        throw new ApiError(500,"Failed to report");
    }

    return report;
    
}


//dashboard

//get all report 
const getAllReport = async () => {

    const allReport = await ReportModel.find({})
        .populate({path: "user", select:"name"})
            .lean();

    return allReport;
}

const getReportDetail = async (reportId:string) => {

    const reportType:any = await ReportModel.findById(reportId).select("name type").lean();

    if(reportType?.type === "Content" ){

        const report = await ReportModel.findById(reportId)
            .populate({ path: "user", select: "-_id name" })
                .populate({
                    path: "report",
                    select: "creator content",
                    populate: {
                        path: "creator",
                        select: "-_id name profileImage"
                    }
                })
                .lean();
    
        return report;

    } else {

        const report = await ReportModel.findById(reportId)
            .populate({ path: "user", select: "-_id name" })
                .lean();
    
        return report;

    }

}

const resolveReportService = async (reportId:string) => {

    const report:any = await ReportModel.findByIdAndUpdate(reportId,{
        status: ENUM_REPORT_STATUS.RESOLVED
    },{new: true}).lean();

    if(report?.status != ENUM_REPORT_STATUS.RESOLVED){
        throw new ApiError(500,"Failed to change status.");
    }

    return null;
}

const deleteReportService = async (reportId:string) => {

    const report = await ReportModel.findByIdAndDelete(reportId);

    if(!report){
        throw new ApiError(500,"Failed to delete report.");
    }

    return report;
}

const ReportServices = { 
    reportPostService,
    getAllReport,
    getReportDetail,
    resolveReportService,
    deleteReportService
 };

export default ReportServices;