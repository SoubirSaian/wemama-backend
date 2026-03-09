import ApiError from "../../../error/ApiError";
import { IMood, IMoodContent } from "./Mood.interface";
import {MoodModel,MoodContentModel} from "./Mood.model";

const getAllMoodChipService = async () => {
    const moods = await MoodModel.find({}).lean();
    return moods;

};

const getALLModdContentService = async (query: Record<string,unknown>) => {
  const {moodId,key} = query;
  
  if(!moodId){
    throw new ApiError(400,"Mood id is required to get mood content.");
  }

  const allMoodContent = await MoodContentModel.find({
    // mood: moodId,
    key: key
  }).lean();

  return allMoodContent;
}

//dashboard

//create new mood content
const createMoodContentService = async (payload: IMoodContent) => {

    const mood = await MoodContentModel.create(payload);

    if(!mood){
        throw new ApiError(500,"Failed to create mood content.");
    }

    return mood;
}

const MoodServices = { 
    getAllMoodChipService ,
    getALLModdContentService,
    createMoodContentService
};

export default MoodServices;