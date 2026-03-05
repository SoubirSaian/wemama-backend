import { Request,Response } from "express";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import SettingsServices from "./Settings.service";

const submitHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.submitHelpAndSupportService(req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const getHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.getHelpAndSupportService();
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "retrieved all report.",
        data: result,
    });
});

const deleteHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.deleteHelpAndSupportService(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted a report successfully.",
        data: result,
    });
});

//terms and consition

const getTermsConditions = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.getTermsConditions();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Condition retrieved successfully',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.getPrivacyPolicy();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy Policy retrieved successfully',
    data: result,
  });
});

const getCommunityGuidelines = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.getCommunityGuidelines();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Community Guidelines retrieved successfully',
    data: result,
  });
});

const editPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.editPrivacyPolicy(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy policy updated successfully',
    data: result,
  });
});


const editTermsConditions = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.editTermsConditions(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Condition updated successfully',
    data: result,
  });
});
const editCommunityGuidelines = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.editCommunityGuidelines(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Community Guidelines updated successfully',
    data: result,
  });
});

//faq

const createFaq = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.createFaqService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faq created successfully.',
    data: result,
  });
});

const getAllFaq = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.getFaqService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Got all faq successfully.',
    data: result,
  });
});

const editFaq = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.editFaqService(req.params.id,req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.deleteFaqService(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq deleted successfully',
    data: result,
  });
});

const SettingsController = { 
    submitHelpAndSupport,
    getHelpAndSupport,
    deleteHelpAndSupport,
    getTermsConditions,
    getPrivacyPolicy,
    getCommunityGuidelines,
    editPrivacyPolicy,
    editTermsConditions,
    editCommunityGuidelines,
    createFaq,
    getAllFaq,
    editFaq,
    deleteFaq
 };
export default SettingsController;