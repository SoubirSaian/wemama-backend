import { model, models, Schema } from "mongoose";
import { IFaq, IHelpAndSupport, ISettings } from "./Settings.interface";

//help and support model
const HelpAndSupportSchema = new Schema<IHelpAndSupport>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String,required: true },
    
}, { timestamps: true });

//! Privacy and policy
const privacySchema = new Schema<ISettings>(
  {
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

//! Privacy and policy
const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: true,
    },
 
    answer: {
      type: String,
      required: true,
    }
  },{
    timestamps: true
  }
);


//! Terms Conditions
const termsAndConditionsSchema = new Schema<ISettings>(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//! Terms Conditions
const communityGuidelinesSchema = new Schema<ISettings>(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const HelpAndSupportModel = models.HelpAndSupport || model<IHelpAndSupport>("HelpAndSupport", HelpAndSupportSchema);

const PrivacyPolicyModel = models.PrivacyPolicy || model('PrivacyPolicy', privacySchema);

const TermsConditionsModel = models.TermsConditions || model(
  'TermsConditions',
  termsAndConditionsSchema
);

const FaqModel = models.Faq || model('Faq',faqSchema);

const CommunityGuidelinesModel = models.CommunityGuidelines || model(
  'CommunityGuidelines',
  communityGuidelinesSchema
);

const SettingsModel = {
     HelpAndSupportModel,
     PrivacyPolicyModel,
     TermsConditionsModel,
     FaqModel,
     CommunityGuidelinesModel
};

export default SettingsModel;