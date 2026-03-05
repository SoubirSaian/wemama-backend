import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CategoryValidations from "./Category.validation";
import CategoryController from "./Category.controller";
import { uploadCategoryImage} from "../../../helper/multer";


const categoryRouter = express.Router();

categoryRouter.get("/get-all-category",

        CategoryController.getAllCategory
);

categoryRouter.post("/create-new-category",

        uploadCategoryImage.single("category-image"),
        validateRequest(CategoryValidations.createCategoryValidation),
        CategoryController.createNewCategory
);

categoryRouter.patch("/edit-category/:id",

        uploadCategoryImage.single("category-image"),
        CategoryController.editCategory
);

categoryRouter.delete("/delete-category/:id",

        CategoryController.deleteCategory
);



export default categoryRouter;