import { unknown } from "zod";
import ApiError from "../../../error/ApiError";
import { ICategory } from "./Category.interface";
import CategoryModel from "./Category.model";
import deleteOldFile from "../../../utilities/deleteFile";

const getAllCategoryService = async () => {
    const allCategory = await CategoryModel.find({}).sort({ createdAt: -1}).lean();

    return allCategory;
};


const createNewCategoryService = async (file: Express.Multer.File | undefined, payload: ICategory) => {
    
    if(!file){
        throw new ApiError(400, "Category image is required.");
    }

    const newCategory = await CategoryModel.create({
        name: payload.name,
        image: `uploads/category-image/${file.filename}`,
    });

    if(!newCategory){
        throw new ApiError(500, "Failed to create new category.");
    }

    return newCategory;

};

const updateCategoryService = async (id: string, file: Express.Multer.File | undefined, payload: ICategory) => {
    
    const category = await CategoryModel.findById(id);

    if(!category){
        throw new ApiError(404, "Category not found to update.");
    }

    if(category.name) category.name = payload.name;

    if(file){
        if(category.image) deleteOldFile(category.image);
        category.image = `uploads/category-image/${file.filename}`;
    }

    const updatedCategory = await category.save();

    return updatedCategory;
};

const deleteCategoryService = async (id: string) => {
    
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if(!deletedCategory){
        throw new ApiError(404, "Category not found to delete.");
    }

    if(deletedCategory.image){
        deleteOldFile(deletedCategory.image);
    }

    return deletedCategory;
};

const CategoryServices = { 
    getAllCategoryService,
    createNewCategoryService,
    updateCategoryService,
    deleteCategoryService
 };

export default CategoryServices;