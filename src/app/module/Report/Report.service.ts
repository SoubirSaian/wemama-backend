import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { IReport } from "./Report.interface";
import ReportModel from "./Report.model";


const reportPostService = async (userDetails: IJwtPayload,payload: Partial<IReport>) => {

    const {profileId} = userDetails;

    const refModel = payload.type === "Content" ? "Post" : "User";

    const report = await ReportModel.create({
        user: profileId,
        report: payload.report,
        refModel,
        name: payload.name,
        type: payload.type
    });

    if(!report){
        throw new ApiError(500,"Failed to report");
    }

    return report;
    
}

const ReportServices = { 
    reportPostService
 };

export default ReportServices;