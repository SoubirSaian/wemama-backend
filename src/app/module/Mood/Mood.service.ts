import ApiError from "../../../error/ApiError";
import { IMood, IMoodContent } from "./Mood.interface";
import {MoodModel,MoodContentModel} from "./Mood.model";

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



const MoodServices = { 
  createMoodChipService,
    getAllMoodChipService ,
    getALLModdContentService,
    createMoodContentService,
    editMoodPhotoService,
    editMoodContentService,
    deleteMoodContentService
};

export default MoodServices;