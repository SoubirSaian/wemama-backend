import { model, Schema, models } from "mongoose";
import { ICommunity } from "./Community.interface";

const CommunitySchema = new Schema<ICommunity>({
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    image: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const CommunityModel = models.Community || model<ICommunity>("Community", CommunitySchema);

export default CommunityModel;