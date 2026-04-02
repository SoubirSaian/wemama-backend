import ApiError from "../../../error/ApiError";
import { IGentleReminder } from "./GentleReminder.interface";
import GentleReminderModel from "./GentleReminder.model";
import dayjs from "dayjs";


const getGentleReminderService = async () => {

    // const today = dayjs();
    // const dayOfYear = today.dayOfYear(); // 1 → 365

    // const dayOfYear = dayjs().dayOfYear();

    const totalMessages = await GentleReminderModel.countDocuments({isActive: true});

    if (totalMessages === 0) {
        throw new ApiError(404, "No reminders available.");
    }

    const startDate = dayjs("2026-01-01");
    const today = dayjs();

    const diffDays = today.diff(startDate, "day");


    const index = Math.floor(diffDays % totalMessages) + 1;

    const reminder = await GentleReminderModel.findOne({
        order: index,
        isActive: true
    });

    if (!reminder) {
        return {
        message: "Stay strong. You're doing great 💛"
        };
    }

    return reminder;
};

const addGentleReminder = async (payload:{message: string}) => {

    const count = await GentleReminderModel.countDocuments();

    const newReminder = await GentleReminderModel.create({
        message: payload.message,
        order: count + 1
    });

    if(!newReminder){
        throw new ApiError(500,"Failed to add new reminder.");
    }

    return newReminder;
    
}

const editGentleReminder = async (id:string,payload: {message: string}) => {

    const updatedReminder = await GentleReminderModel.findByIdAndUpdate(id,{
        ...payload
    },{new: true});

    if(!updatedReminder){
        throw new ApiError(500,"Failed to edit the reminder.");
    }

    return updatedReminder;
}

const deleteGentleReminder = async (id:string) => {

    const deletedReminder = await GentleReminderModel.findByIdAndDelete(id);

    if(!deletedReminder){
        throw new ApiError(500,"Failed to delete the reminder.");
    }

    return deletedReminder;

}

const markGentleRemunderActive = async (id:string) => {

    const reminder = await GentleReminderModel.findByIdAndDelete(id);

    reminder.isActive = !reminder.isActive
    await reminder.save();

    let msg = reminder.isActive ? "Reminder is active." : "Reminder id deactive.";

    return {reminder,msg};

}

const GentleReminderServices = { 
    getGentleReminderService,
    addGentleReminder,
    editGentleReminder,
    deleteGentleReminder,
    markGentleRemunderActive
 };

export default GentleReminderServices;