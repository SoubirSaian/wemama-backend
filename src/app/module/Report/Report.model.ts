import { model, Schema, models } from "mongoose";
import { IReport } from "./Report.interface";
import { ENUM_REPORT_STATUS } from "../../../utilities/enum";

const ReportSchema = new Schema<IReport>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    report: { type: Schema.Types.ObjectId, required: true, ref: "refModel" },
    refModel: { 
        type: String, 
        enum: ["User","Post"],
        required: [true,"Ref model is required"]
    },
    name: { type: String, required: true },
    type: { type: String, required: true},
    status: { 
        type: String ,
        enum: Object.values(ENUM_REPORT_STATUS),
        default: ENUM_REPORT_STATUS.PENDING
    },
    
}, { timestamps: true });

const ReportModel = models.Report || model<IReport>("Report", ReportSchema);

export default ReportModel;