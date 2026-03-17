import { NotificationModel } from "../app/module/Notification/Notification.model";
import { emitResult } from "../socket/emitResult";
import { getIO } from "../socket/socket.connection";
import { ENUM_NOTIFICATION_TYPE } from "../utilities/enum";


//create new notification
class NotificationService {

    async createNotification(payload: {
        toId: string;
        toModel: string;
        title: string;
        description?: string;
        // message?: string;
        type: string;
        referenceId?: string;
        referenceModel?: string;
        metadata?: any;
    }) {

        const notification = await NotificationModel.create(payload);

        // Emit real-time event
        const io = getIO();

        // 🔥 Emit to specific user room
        io.to(payload.toId).emit("new_notification", emitResult({
            statusCode: 201,
            success: true,
            message: `You received a new notification`,
            data: notification,
        }));


        return notification;
    }
}

export default new NotificationService();
