import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { INotification } from "./Notification.interface";
import {AdminNotificationModel, NotificationModel} from "./Notification.model";

const getAllNotificationService = async (userDetails: JwtPayload) => {

    const {profileId} = userDetails;

    const allNotification = await NotificationModel.find({toId: profileId}).sort({createdAt: -1}).lean();

    return allNotification;
    
};


const deleteNotification = async (id: string) => {
    
    const deletedNotification = await NotificationModel.findByIdAndDelete(id);

    if(!deletedNotification){
        throw new ApiError(500,"Failed to delete notification");
    }
    return deletedNotification;
    
};

//dashboard

const deleteAdminNotification = async (id: string) => {
    
    const deletedNotification = await AdminNotificationModel.findByIdAndDelete(id);

    if(!deletedNotification){
        throw new ApiError(500,"Failed to delete notification");
    }
    return deletedNotification;
    
};

const getAllAdminNotificationService = async () => {

    const allNotification = await AdminNotificationModel.find({}).sort({createdAt: -1}).lean();

    return allNotification;
    
};


const NotificationServices = { getAllNotificationService, 
    getAllAdminNotificationService ,
    deleteAdminNotification,
    deleteNotification
};
export default NotificationServices;