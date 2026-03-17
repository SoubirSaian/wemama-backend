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

const makeNotificationSeen = async (id: string) => {

    const updatedNotification = await NotificationModel.findByIdAndUpdate(id,{isSeen: true},{new:true});

    if(!updatedNotification){
        throw new ApiError(500,"Failed to update notification status.");
    }
    
    return updatedNotification;
    
}

const makeAdminNotificationSeen = async (id: string) => {

    const updatedNotification = await AdminNotificationModel.findByIdAndUpdate(id,{isSeen: true},{new:true});

    if(!updatedNotification){
        throw new ApiError(500,"Failed to update notification status");
    }
    return updatedNotification;
    
}


const NotificationServices = { 
    getAllNotificationService, 
    getAllAdminNotificationService ,
    deleteAdminNotification,
    deleteNotification,
    makeNotificationSeen,
    makeAdminNotificationSeen
};
export default NotificationServices;