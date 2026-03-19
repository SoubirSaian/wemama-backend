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

const createMoodChip = catchAsync(async (req, res) => {

    const result = await MoodServices.createMoodChipService(req.body,req.file);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Mood chip created successfully.",
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

const addMoodImage = catchAsync(async (req, res) => {

    const result = await MoodServices.editMoodPhotoService(req.file,req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Added moog image successfully.",
        data: result,
    });
});

const editMoodContent = catchAsync(async (req, res) => {

    const result = await MoodServices.editMoodContentService(req.params.id,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Mood content updated successfully.",
        data: result,
    });
});

const deleteMoodContent = catchAsync(async (req, res) => {

    const result = await MoodServices.deleteMoodContentService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Mood content deleted successfully.",
        data: result,
    });
});

const MoodController = { 
    createMoodChip,
    getAllMood,
    getALLMoodContent, 
    addMoodContent,
    addMoodImage,
    editMoodContent,
    deleteMoodContent 
};

export default MoodController;