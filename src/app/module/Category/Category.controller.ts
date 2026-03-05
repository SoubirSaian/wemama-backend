
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import CategoryServices from "./Category.service";

const getAllCategory = catchAsync(async (req, res) => {

    const result = await CategoryServices.getAllCategoryService();
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Got all category.",
        data: result,
    });
});

const createNewCategory = catchAsync(async (req, res) => {

    const result = await CategoryServices.createNewCategoryService(req.file,req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "New category created successfully.",
        data: result,
    });
});

const editCategory = catchAsync(async (req, res) => {

    const result = await CategoryServices.updateCategoryService(req.params.id, req.file, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully.",
        data: result,
    });
});

const deleteCategory = catchAsync(async (req, res) => {

    const result = await CategoryServices.deleteCategoryService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category Deleted.",
        data: result,
    });
});

const CategoryController = { 
    getAllCategory,
    createNewCategory,
    editCategory,
    deleteCategory
 };

export default CategoryController;