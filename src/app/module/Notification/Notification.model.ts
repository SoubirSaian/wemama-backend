import { model, models, Schema } from "mongoose";
import { INotification,IAdminNotification } from "./Notification.interface";

const NotificationSchema = new Schema<INotification>({
    toId: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
    title: { type: String, required: true },
    // details: { type: String, required: true },
}, { timestamps: true });


const AdminNotificationSchema = new Schema<IAdminNotification>({
    title: { type: String, required: true },
    
}, { timestamps: true });

const NotificationModel = models.Notification || model<INotification>("Notification", NotificationSchema);

const AdminNotificationModel = models.AdminNotification || model<IAdminNotification>("AdminNotification", AdminNotificationSchema);


export { NotificationModel, AdminNotificationModel}
