import { get } from "http";
import ApiError from "../../../error/ApiError";
import { IFaq, IHelpAndSupport, ISettings } from "./Settings.interface";
import SettingsModel from "./Settings.model";

//help and support service
const submitHelpAndSupportService = async (payload: IHelpAndSupport) => {

    const result = await SettingsModel.HelpAndSupportModel.create(payload);

    if (!result) {
        throw new ApiError(500, "Failed to submit help and support request");
    }

    return result;
};

const getHelpAndSupportService = async (query: Record<string,unknown>) => {

    let {page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;


    const [supports, totalSupport] = await Promise.all([

        SettingsModel.HelpAndSupportModel.find({})
           .sort({createdAt: -1})
               .skip(skip).limit(limit)
                   .lean(),
    
        SettingsModel.HelpAndSupportModel.countDocuments({})
    ])

    const totalPage = Math.ceil(totalSupport / limit);

    return {
        meta:{page,limit: 10,total: totalSupport, totalPage},
        supports
    };
};

const getSingleSupportService = async (id: string) => {

    const result = await SettingsModel.HelpAndSupportModel.findById(id);

    if (!result) {
        throw new ApiError(500, "Failed to get this support.");
    }

    return result;
};

const deleteHelpAndSupportService = async (id: string) => {

    const result = await SettingsModel.HelpAndSupportModel.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(500, "Failed to delete this report.");
    }

    return result;
};


//! Privacy and policy

const getPrivacyPolicy = async () => {

  return await SettingsModel.PrivacyPolicyModel.findOne({});

};

const editPrivacyPolicy = async (id: string, payload: ISettings) => {

  
  const result = await SettingsModel.PrivacyPolicyModel.findByIdAndUpdate(id , {...payload}, {
    new: true,
    runValidators: true,
  });

  if(!result){
    throw new ApiError(500,"Failed to update privacy policy");
  }

  return result;
};

//terms and consitions

const getTermsConditions = async () => {

    return await SettingsModel.TermsConditionsModel.findOne({});

};

const editTermsConditions = async (id: string,payload: ISettings) => {

    
    const result = await SettingsModel.TermsConditionsModel.findByIdAndUpdate( id , payload, {
        new: true,
        runValidators: true,
    });

    if(!result){
        throw new ApiError(500,"failed to update Terms and conditions");
    }
    
    return result;
};


//community guidelines

const getCommunityGuidelines = async () => {

    return await SettingsModel.CommunityGuidelinesModel.findOne({});
};



const editCommunityGuidelines = async (id: string, payload: ISettings) => {

    const result = await SettingsModel.CommunityGuidelinesModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if(!result){
        throw new ApiError(500,"failed to update Community Guidelines");
    }
    
    return result;
};

//faq service

const createFaqService = async (payload: IFaq) => {

    const result = await SettingsModel.FaqModel.create(payload);

    if(!result){
        throw new ApiError(500,"Failed to create FAQ.");
    }

    return result;
}

const getFaqService = async () => {

    const allFaq = await SettingsModel.FaqModel.find({}).lean();

    return allFaq;
}

const editFaqService = async (id: string, payload: Partial<IFaq>) => {

    const result = await SettingsModel.FaqModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if(!result){
        throw new ApiError(500,"Failed to update FAQ.");
    }

    return result;
}

const deleteFaqService = async (id: string) => {

    const result = await SettingsModel.FaqModel.findByIdAndDelete(id);

    if(!result){
        throw new ApiError(500,"Failed to delete FAQ.");
    }

    return result;
}

const SettingsServices = { 
    submitHelpAndSupportService,
    getHelpAndSupportService,
    getSingleSupportService,
    deleteHelpAndSupportService,
    getPrivacyPolicy,
    editPrivacyPolicy,
    getTermsConditions,
    editTermsConditions,
    createFaqService,
    getFaqService,
    editFaqService,
    deleteFaqService,
    getCommunityGuidelines,
    editCommunityGuidelines
 };

export default SettingsServices;