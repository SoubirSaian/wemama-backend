import { model, Schema, models } from "mongoose";
import { ICommunity } from "./Community.interface";

const CommunitySchema = new Schema<ICommunity>({
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    image: { type: String, default: null },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalPost: {type: Number, default: 0},
    isApproved: {type: Boolean, default: false},
}, { timestamps: true });

const CommunityModel = models.Community || model<ICommunity>("Community", CommunitySchema);

export default CommunityModel;