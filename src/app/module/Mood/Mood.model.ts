import { model, Schema, models } from "mongoose";
import { ICheckIn, IMood, IMoodContent, IStreakMessage } from "./Mood.interface";

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

//streak message schema
const StreakMessageSchema = new Schema<IStreakMessage>({
  day: { type: Number, required: true }, // 3, 7, 14
  message: { type: String, required: true },
},{timestamps: true});

//check in schema 

const CheckInSchema = new Schema<ICheckIn>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, required: true },
  date: { type: Date, required: true }, // normalized date (no time)
},{timestamps: true});

const MoodModel = models.Mood || model<IMood>("Mood", MoodSchema);

const MoodContentModel = models.MoodContent || model<IMoodContent>("MoodContent", MoodContentSchema);

const StreakMsgModel = models.StreakMessage || model<IStreakMessage>("StreakMessage", StreakMessageSchema);

const CheckInModel = models.CheckIn || model<ICheckIn>("CheckIn", CheckInSchema);

export { MoodModel, MoodContentModel, StreakMsgModel, CheckInModel };