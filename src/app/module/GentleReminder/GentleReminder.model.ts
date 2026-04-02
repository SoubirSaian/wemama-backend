import { model, Schema, models } from "mongoose";
import { IGentleReminder } from "./GentleReminder.interface";

const GentleReminderSchema = new Schema<IGentleReminder>({
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, required: true }, // 1 → 365
}, { timestamps: true });

const GentleReminderModel = models.GentleReminder || model<IGentleReminder>("GentleReminder", GentleReminderSchema);

export default GentleReminderModel;