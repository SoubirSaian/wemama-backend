import ApiError from "../../../error/ApiError";
import deleteOldFile from "../../../utilities/deleteFile";
import { INews, IVideo,  } from "./Promotion.interface";
import { NewsModel, VideoModel } from "./Promotion.model";

//promotional image service
const createNewPromotionService = async ( file: Express.Multer.File | undefined, payload: Partial<INews>) => {
    let imagePath = ""; 
    if(file){
        imagePath = file.filename;
    }

    const newNews = await NewsModel.create({
        ...payload,
        image: imagePath
    });
    if(!newNews){
        throw new ApiError(500,"Failed to create new news");
    }
    return newNews;
};

const getAllPromotionService = async ( ) => {
    const allNews = await NewsModel.find().sort({ createdAt: -1 });
    return allNews;
    
};

const getLatestPromotionService = async ( ) => {
    const latestNews = await NewsModel.findOne().sort({ createdAt: -1 });
    return latestNews;
};

const updatePromotionService = async ( id: string, file: Express.Multer.File | undefined, payload: Partial<INews>) => {
    
    const existingNews = await NewsModel.findById(id);
    if(!existingNews){
        throw new ApiError(404,"News not found to update");
    }

    if(file){
        if(existingNews.image) deleteOldFile(existingNews.image);
        existingNews.image = file.filename;
    }

    if(payload.title !== undefined) existingNews.title = payload.title;
    if(payload.description !== undefined) existingNews.description = payload.description;

    const updatedNews = await existingNews.save();
    return updatedNews;
};

const deleteNewPromotionService = async (id: string) => {
    
    const deletedNews = await NewsModel.findByIdAndDelete(id);

    if(!deletedNews){
        throw new ApiError(404,"News not found to delete");
    }

    if(deletedNews.image) deleteOldFile(deletedNews.image);

    return deletedNews;
};

//promo video service

//promotional image service
const createNewPromoVideoService = async ( file: Express.Multer.File | undefined, payload: Partial<IVideo>) => {
    let videoPath = ""; 
    if(file){
        videoPath = file.filename;
    }

    const newNews = await VideoModel.create({
        ...payload,
        video: videoPath
    });
    if(!newNews){
        throw new ApiError(500,"Failed to create new promo video.");
    }
    return newNews;
};

const updatePromoVideoService = async ( id: string, file: Express.Multer.File | undefined, payload: Partial<IVideo>) => {
    
    const existingNews = await VideoModel.findById(id);
    if(!existingNews){
        throw new ApiError(404,"Video not found to update.");
    }

    if(file){
        if(existingNews.video) deleteOldFile(existingNews.video);
        existingNews.video = file.filename;
    }

    if(payload.title !== undefined) existingNews.title = payload.title;
    if(payload.description !== undefined) existingNews.description = payload.description;

    const updatedNews = await existingNews.save();
    return updatedNews;
};



const PromotionServices = { 
    createNewPromotionService,
    getAllPromotionService,
    getLatestPromotionService,
    updatePromotionService,
    deleteNewPromotionService,
    createNewPromoVideoService,
    updatePromoVideoService
 };
export default PromotionServices;