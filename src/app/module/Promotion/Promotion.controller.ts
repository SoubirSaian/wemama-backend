import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import PromotionServices from "./Promotion.service";

//promotional image controller
const createLatestNews = catchAsync(async (req, res) => {

    const result = await PromotionServices.createNewPromotionService(req.file,req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "New news created successfully.",
        data: result,
    });
});

const getAllNews = catchAsync(async (req, res) => {

    const result = await PromotionServices.getAllPromotionService();
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all news successfully",
        data: result,
    });
});

const getLatestNews = catchAsync(async (req, res) => {

    const result = await PromotionServices.getLatestPromotionService();
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved latest news successfully.",
        data: result,
    });
});

const editNews = catchAsync(async (req, res) => {

    const result = await PromotionServices.updatePromotionService(req.params.id,req.file,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Edited this news successfully.",
        data: result,
    });
});

const deleteNews = catchAsync(async (req, res) => {

    const result = await PromotionServices.deleteNewPromotionService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: " deleted successfully",
        data: result,
    });
});

const PromotionController = { 
    createLatestNews,
    getAllNews,
    getLatestNews,
    editNews,
    deleteNews
 };
export default PromotionController;