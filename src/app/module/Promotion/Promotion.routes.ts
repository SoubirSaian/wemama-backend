import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import PromotionValidations from "./Promotion.validation";
import PromotionController from "./Promotion.controller";
import { uploadPromotionalImage, uploadPromotionalVideo } from "../../../helper/multer";


const promotionalRouter = express.Router();

//promotional image

promotionalRouter.post("/create-latest-news",
//     auth(),
    uploadPromotionalImage.single("promotion-image"),
    validateRequest(PromotionValidations.createLatestNews),
    PromotionController.createLatestNews
);

promotionalRouter.get("/get-all-news",
//     auth(),
//     validateRequest(PromotionValidations.createLatestNews),
    PromotionController.getAllNews
);

promotionalRouter.get("/get-latest-news",
//     auth(),
//     validateRequest(PromotionValidations.createLatestNews),
    PromotionController.getLatestNews
);

promotionalRouter.patch("/edit-news/:id",
//     auth(),
        uploadPromotionalImage.single("promotion-image"),
//     validateRequest(PromotionValidations.createLatestNews),
    PromotionController.editNews
);

promotionalRouter.delete("/delete-news/:id",
//     auth(),
//     validateRequest(PromotionValidations.createLatestNews),
    PromotionController.deleteNews
);


//promotional video

promotionalRouter.post("/create-video",
//     auth(),
    uploadPromotionalVideo.single("promotion-video"),
    validateRequest(PromotionValidations.createLatestNews),
    PromotionController.createLatestNews
);

// promotionalRouter.get("/get-all-news",
// //     auth(),
// //     validateRequest(PromotionValidations.createLatestNews),
//     PromotionController.getAllNews
// );

// promotionalRouter.get("/get-latest-news",
// //     auth(),
// //     validateRequest(PromotionValidations.createLatestNews),
//     PromotionController.getLatestNews
// );

promotionalRouter.patch("/edit-video/:id",
//     auth(),
        uploadPromotionalImage.single("promotion-image"),
//     validateRequest(PromotionValidations.createLatestNews),
    PromotionController.editNews
);

// promotionalRouter.delete("/delete-news/:id",
// //     auth(),
// //     validateRequest(PromotionValidations.createLatestNews),
//     PromotionController.deleteNews
// );



export default promotionalRouter;