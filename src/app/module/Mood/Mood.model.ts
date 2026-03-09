import { model, Schema, models } from "mongoose";
import { IMood, IMoodContent } from "./Mood.interface";

const MoodSchema = new Schema<IMood>({
    
    title: { type: String, required: true },
    image: { type: String , required: true },
    key: { type: Number, default: 0 }
    
}, { timestamps: true });

const MoodContentSchema = new Schema<IMoodContent>({
    mood: { type: Schema.Types.ObjectId, required: true, ref: "Mood" },
    key: { type: Number, required: true, default: 0 },
    title: { type: String, required: true },
    description: { type: String, required: true },

}, { timestamps: true });

const MoodModel = models.Mood || model<IMood>("Mood", MoodSchema);
const MoodContentModel = models.MoodContent || model<IMoodContent>("MoodContent", MoodContentSchema);

export { MoodModel, MoodContentModel };