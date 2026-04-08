import { Types } from "mongoose";

export interface IReport {
  user: Types.ObjectId;
  report: Types.ObjectId;
  refModel: string;
  type: string;
  name: string;
  status: string
}