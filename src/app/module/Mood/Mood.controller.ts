import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import MoodServices from "./Mood.service";

const getAllMood = catchAsync(async (req, res) => {

    const result = await MoodServices.getAllMoodChipService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All mood chips retrieved successfully.",
        data: result,
    });
});

const getALLMoodContent = catchAsync(async (req, res) => {

    const result = await MoodServices.getALLModdContentService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All mood content retrieved successfully.",
        data: result,
    });
});

//dashboard 

const addMoodContent = catchAsync(async (req, res) => {

    const result = await MoodServices.createMoodContentService(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Mood content created successfully.",
        data: result,
    });
});

const MoodController = { 
    getAllMood,
    getALLMoodContent, 
    addMoodContent 
};

export default MoodController;