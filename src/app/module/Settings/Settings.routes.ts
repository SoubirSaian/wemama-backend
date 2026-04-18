import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import SettingsValidations from "./Settings.validation";
import SettingsController from "./Settings.controller";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";


const settingsRouter = express.Router();

//contact us routes
settingsRouter.post(
    "/submit-contact-us",
    // auth(),
    validateRequest(SettingsValidations.helpAndSupportValidation),
    SettingsController.submitHelpAndSupport
);

settingsRouter.get(
    "/get-contact-us",
    // auth(),
    // validateRequest(SettingsValidations.helpAndSupportValidation),
    SettingsController.getHelpAndSupport
);

settingsRouter.get(
    "/get-single-contact-us/:id",
    // auth(),
    // validateRequest(SettingsValidations.helpAndSupportValidation),
    SettingsController.getSingleSupport
);

settingsRouter.delete(
    "/delete-contact-us/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    // validateRequest(SettingsValidations.helpAndSupportValidation),
    SettingsController.deleteHelpAndSupport
);


//privacy policy
settingsRouter.get(
    "/get-privacy-policy",
    SettingsController.getPrivacyPolicy
);

settingsRouter.patch(
    "/update-privacy-policy/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(SettingsValidations.settingsValidationSchema),
    SettingsController.editPrivacyPolicy
);

//terms and conditions
settingsRouter.get(
    "/get-terms-and-conditions",
    SettingsController.getTermsConditions
);

settingsRouter.patch(
    "/update-terms-and-conditions/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(SettingsValidations.settingsValidationSchema),
    SettingsController.editTermsConditions
);

//community guidelines
settingsRouter.get(
    "/get-community-guidelines",
    SettingsController.getCommunityGuidelines
);

settingsRouter.patch(
    "/update-community-guidelines/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(SettingsValidations.settingsValidationSchema),
    SettingsController.editCommunityGuidelines
);


//faq routes
settingsRouter.post(
    "/create-new-faq",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(SettingsValidations.faqValidationSchema),
    SettingsController.createFaq
);

settingsRouter.get(
    "/get-all-faq",
    SettingsController.getAllFaq
);

settingsRouter.patch(
    "/edit-faq/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(SettingsValidations.editFaqValidationSchema),
    SettingsController.editFaq
);

settingsRouter.delete(
    "/delete-faq/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    SettingsController.deleteFaq
);  


export default settingsRouter;