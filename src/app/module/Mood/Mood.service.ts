import ApiError from "../../../error/ApiError";
import dayjs from "dayjs";
import { IMood, IMoodContent, IStreakMessage } from "./Mood.interface";
import {MoodModel,MoodContentModel, CheckInModel, StreakMsgModel} from "./Mood.model";
import UserModel from "../User/User.model";
import { IJwtPayload } from "../../../interface/jwt.interface";


const createMoodChipService = async (payload: IMood,file: Express.Multer.File | undefined) => {

  let moodImagePath = "";
  if(file){
    moodImagePath = file.path;
  }

    const mood = await MoodModel.create({
        title: payload.title,
        image: moodImagePath || "",
        key: payload.key
    });

    if(!mood){
        throw new ApiError(500,"Failed to create mood chip.");
    }

    return mood;
}

const getAllMoodChipService = async () => {
    const moods = await MoodModel.find({}).lean();
    return moods;

};

const getALLModdContentService = async (query: Record<string,unknown>) => {
  const {moodId,key} = query;
  
  // if(!moodId){
  //   throw new ApiError(400,"Mood id is required to get mood content.");
  // }

  const allMoodContent = await MoodContentModel.find({
    mood: moodId,
    // key: key
  }).lean();

  return allMoodContent;
}


//check in streak maintain service
const checkInStreakMaintainService = async (userDetails:IJwtPayload, payload:{mood: string}) => {
  const {profileId} = userDetails;

  const today = dayjs().startOf("day");
  
  const user = await UserModel.findById(profileId);

  if (!user) throw new ApiError(404, "User not found");

  const lastDate = user.lastCheckInDate
    ? dayjs(user.lastCheckInDate).startOf("day")
    : null;

  // ❌ Already checked today
  if (lastDate && lastDate.isSame(today)) {
    throw new ApiError(400, "You already checked in today");
  }

  let newStreak = 1;

  if (lastDate && lastDate.add(1, "day").isSame(today)) {
    // ✅ Continuous streak
    newStreak = user.streakCount + 1;
  } else {
    // ❌ Missed day → reset
    newStreak = 1;
  }

  // Save check-in
  // await CheckInModel.create({
  //   user: profileId,
  //   mood: payload.mood,
  //   date: today.toDate(),
  // });

  // Update user
  user.streakCount = newStreak;
  user.lastCheckInDate = today.toDate();
  await user.save();

  // 🎯 Check milestone
  const milestone = await StreakMsgModel.findOne({ day: newStreak });

  return {
    streak: newStreak,
    milestoneReached: milestone ?  milestone?.day : "No milestone reached.",
    message: milestone || "null"
  };
};

//dashboard

//create new mood content
const createMoodContentService = async (payload: IMoodContent) => {

    const mood = await MoodContentModel.create(payload);

    if(!mood){
        throw new ApiError(500,"Failed to create mood content.");
    }

    return mood;
}

//edit mood photo
const editMoodPhotoService = async (file: Express.Multer.File | undefined, query: Record<string,unknown>) => {

    const {moodId, key} = query;

    let moodImg;
    if(file){
      moodImg = `uploads/mood-image/${file.filename}`;
    }

    const mood = await MoodModel.findByIdAndUpdate(moodId,{
      image: moodImg
    });

    if(!mood){
        throw new ApiError(500,"Failed to update mood image.");
    }

    return mood;
}

//edit mood content
const editMoodContentService = async (id: string,payload: Partial<IMoodContent>) => {

  const {title, description} = payload;   

    const mood = await MoodContentModel.findByIdAndUpdate(id,{
      title: title, description: description
    });

    if(!mood){
        throw new ApiError(500,"Failed to update mood content.");
    }

    return mood;
}

//delete mood content
const deleteMoodContentService = async (id: string) => {

    const mood = await MoodContentModel.findByIdAndDelete(id);

    if(!mood){
        throw new ApiError(500,"Failed to delete mood content.");
    }

    return mood;
}

//streak 

const addStreakMessage = async (payload: IStreakMessage) => {

  const newStreakMsg = await StreakMsgModel.create(payload);

  if(!newStreakMsg){
    throw new ApiError(500,"Failed to create new streak msg.");
  }

  return newStreakMsg;

}

const editStreakMessage = async (query: Record<string,unknown>,payload: IStreakMessage) => {

  const {streakId} = query;

  const editedStreakMsg = await StreakMsgModel.findByIdAndUpdate(
    streakId,
    {
      day: payload.day,
      message: payload.message
    },{
      new: true
    }
  );

  if(!editedStreakMsg){
    throw new ApiError(500,"Failed to update streak msg.");
  }

  return editedStreakMsg;

}

const deleteStreakMessage = async (id: string) => {

  const deletedStreakMsg = await StreakMsgModel.findByIdAndDelete(id);

  if(!deletedStreakMsg){
    throw new ApiError(500,"Failed to delete streak msg.");
  }
}



const MoodServices = { 
  createMoodChipService,
    getAllMoodChipService ,
    getALLModdContentService,
    checkInStreakMaintainService,
    createMoodContentService,
    editMoodPhotoService,
    editMoodContentService,
    deleteMoodContentService,
    addStreakMessage,
    editStreakMessage,
    deleteStreakMessage
};

export default MoodServices;